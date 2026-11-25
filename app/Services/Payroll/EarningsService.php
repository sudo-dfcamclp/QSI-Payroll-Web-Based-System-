<?php

namespace App\Services\Payroll;

class EarningsService
{
    /** @var array<string, array{configured: float, used: float, defaulted: bool}> */
    private array $rateLog = [];

    /** @var string[] */
    private array $warnings = [];

    public function compute(array $inputs, $rate, $config, array $ctx): array
    {
        $this->rateLog = [];
        $this->warnings = [];

        $basicPay = $this->computeBasicPay($inputs, $rate, $ctx);
        $premium = $this->computePremiumEarnings($inputs, $ctx, $config);

        $fixedAllowance = $this->resolveFixedAllowance($inputs, $rate, $ctx);
        $allowances = $this->money(
            $fixedAllowance
            + $inputs['load_allow']
            + $inputs['meal_allow']
            + $inputs['transpo_allow']
        );

        $adjustments = $this->money($inputs['salary_adj'] + $inputs['incentive_pay']);

        // Attendance deductions
        $absentDeduction = $this->money($inputs['days_absent'] * $ctx['daily_base']);
        $tardyDeduction = $this->money($inputs['tardy_hrs'] * $ctx['hourly_base']);

        // 13th month computation
        $thirteenthMonthPay = $this->computeThirteenthMonth(
            $inputs, $rate, $config, $ctx, $basicPay, $tardyDeduction
        );

        $thirteenthInGross = $this->cfgFlag(
            $config,
            ['add_13th_month_to_gross_pay', 'display_13th_month_pay', 'display_13th_month', 'display13monthpay'],
            false
        );

        // Earnings BEFORE attendance deductions
        $earningsBeforeAbsentTardy = $this->money(
            $basicPay
            + $premium['total']
            + $allowances
            + $adjustments
            + ($thirteenthInGross ? $thirteenthMonthPay : 0)
        );

        // STANDARD: GrossPay = earnings − absent − tardy (net of attendance)
        $grossPay = $this->money(
            $earningsBeforeAbsentTardy - $absentDeduction - $tardyDeduction
        );

        return [
            'basic_pay' => $basicPay,
            'premium' => $premium,
            'fixed_allowance' => $fixedAllowance,
            'allowances' => $allowances,
            'adjustments' => $adjustments,
            'absent_deduction' => $absentDeduction,
            'tardy_deduction' => $tardyDeduction,
            'thirteenth_month_pay' => $thirteenthMonthPay,
            'thirteenth_in_gross' => $thirteenthInGross,
            'earnings_before_absent_tardy' => $earningsBeforeAbsentTardy,
            'gross_pay' => $grossPay,
            'debug' => [
                'rates_used' => $this->rateLog,
                'warnings' => array_values(array_unique($this->warnings)),
            ]
        ];
    }

    private function computeBasicPay(array $inputs, $rate, array $ctx): float
    {
        switch ($ctx['basis']) {
            case 'hourly':
                $hours = $inputs['hours_worked'] > 0
                    ? $inputs['hours_worked']
                    : $inputs['days_present'];
                return $this->money($hours * (float) $rate->hourly_rate);

            case 'monthly':
                return $this->money((float) $rate->monthly_rate / max(1, $ctx['cutoffs']));

            default:
                return $this->money($inputs['days_present'] * (float) $rate->daily_rate);
        }
    }

    /**
     * Premium earnings — config is source of truth.
     * Fallback = 0 for ALL rates (no hidden default, including rest_day_overtime_rate).
     */
    private function computePremiumEarnings(array $inputs, array $ctx, $config): array
    {
        $rate = fn (string $key, ?float $default) => $this->clientRate($config, $key, $default);

        // Fallback = 0: no config = no pay
        $regularOt = $this->premiumPay($inputs['ot_hrs'], $rate('regular_overtime_rate', 0.0), 0.0, $ctx);
        $nightDiff = $this->premiumPay($inputs['night_diff_ot'], $rate('night_differential_rate', 0.0), 0.0, $ctx);
        $restDay = $this->premiumPay($inputs['rest_day_ot_hrs'], $rate('rest_day_rate', 0.0), 0.0, $ctx);

        // RD/OT (legacy "SundayOT") — fallback 0, no hidden 1.69 default
        $sundayOt = $this->premiumPay(
            $inputs['sunday_ot'],
            $rate('rest_day_overtime_rate', 0.0),
            0.0,
            $ctx
        );

        // Fallback = 0
        $special = $this->premiumPay($inputs['sp_hol_hrs'], $rate('special_holiday_rate', 0.0), 0.0, $ctx);
        $legal = $this->premiumPay($inputs['leg_hol_hrs'], $rate('legal_holiday_rate', 0.0), 0.0, $ctx);
        $specialOt = $this->premiumPay($inputs['sp_hol_ot_hrs'], $rate('special_holiday_overtime_rate', 0.0), 0.0, $ctx);
        $legalOt = $this->premiumPay($inputs['leg_hol_ot_hrs'], $rate('legal_holiday_overtime_rate', 0.0), 0.0, $ctx);

        $excessOt = $this->premiumPay($inputs['excess_ot_hrs'], $rate('special_holiday_rest_day_rate', 0.0), 0.0, $ctx);
        $excessSunSpecial = $this->premiumPay($inputs['excess_sun_sp_ot_hrs'], $rate('special_holiday_rest_day_overtime_rate', 0.0), 0.0, $ctx);
        $excessSunLegal = $this->premiumPay($inputs['excess_sun_leg_ot_hrs'], $rate('legal_holiday_rest_day_overtime_rate', 0.0), 0.0, $ctx);
        $excessLegalHol = $this->premiumPay($inputs['excess_leg_hol_ot_hrs'], $rate('legal_holiday_rest_day_rate', 0.0), 0.0, $ctx);
        $otNoPremium = $this->premiumPay($inputs['ot_no_prem_hrs'], $rate('ot_without_premium_rate', 0.0), 0.0, $ctx);

        return [
            'regular_ot' => $regularOt,
            'night_diff' => $nightDiff,
            'rest_day' => $restDay,
            'sunday_ot' => $sundayOt,
            'special' => $special,
            'legal' => $legal,
            'special_ot' => $specialOt,
            'legal_ot' => $legalOt,
            'excess_ot' => $excessOt,
            'excess_sun_legal' => $excessSunLegal,
            'excess_legal_hol' => $excessLegalHol,
            'excess_sun_special' => $excessSunSpecial,
            'ot_no_premium' => $otNoPremium,
            'total' => $this->money(
                $regularOt + $nightDiff + $restDay + $sundayOt
                + $special + $legal + $specialOt + $legalOt
                + $excessOt + $excessSunLegal + $excessLegalHol
                + $excessSunSpecial
            ),
        ];
    }

    private function premiumPay(float $hours, float $multiplier, ?float $default, array $ctx): float
    {
        if ($hours <= 0) return 0.00;
        if ($default !== null && $multiplier == 0.0) $multiplier = $default;

        $base = $hours * $ctx['hourly_base'];

        return $this->money($multiplier * $base);
    }

    private function clientRate($config, string $key, ?float $default): float
    {
        $configured = (float) ($config->{$key} ?? 0);
        $used = $configured;
        $defaulted = false;

        if ($configured == 0.0 && $default !== null) {
            $used = $default;
            $defaulted = true;
        }

        if ($configured == 0.0 && $default === 0.0) {
            $this->warnings[] = "RATE_MISSING: {$key} is 0/null in client_payroll_config — pay will be 0.";
        }

        $this->rateLog[$key] = [
            'configured' => $configured,
            'used' => $used,
            'defaulted' => $defaulted,
        ];

        return $used;
    }

    private function resolveFixedAllowance(array $inputs, $rate, array $ctx): float
    {
        if ($inputs['allowance'] > 0) return $this->money($inputs['allowance']);

        $monthlyAllowance = (float) $rate->allowance;
        if ($monthlyAllowance <= 0 || $ctx['basis'] === 'daily') return 0.00;

        return $this->money(
            $ctx['basis'] === 'weekly' ? $monthlyAllowance / 4 : $monthlyAllowance / 2
        );
    }

    private function computeThirteenthMonth(array $inputs, $rate, $config, array $ctx, float $basicPay, float $tardyDeduction): float
    {
        if ($inputs['thirteenth_month_pay'] > 0) return $this->money($inputs['thirteenth_month_pay']);

        if (!$this->cfgFlag($config, ['include_13th_month_pay', 'with_13th_month', 'with_13th_month_pay', 'with13monthpay'], false)) return 0.00;

        $hourly13 = (float) $rate->hourly_13th_month_rate;
        $days = $inputs['days_present'];
        $daily = (float) $rate->daily_rate;

        if ($ctx['basis'] === 'monthly') {
            if ($hourly13 != 0.0) return $this->money($hourly13 - $tardyDeduction);

            $base = $basicPay - $tardyDeduction;

            return $this->money($base / 12);
        }

        if ($hourly13 != 0.0) return $this->money(($hourly13 - $tardyDeduction) * $days);
        if ($ctx['basis'] === 'hourly') return $this->money((($daily * $days) - $tardyDeduction) / 12 / 8);

        return $this->money((($daily * $days) - $tardyDeduction) / 12);
    }

    private function cfgFlag($config, array $keys, bool $default): bool
    {
        foreach ($keys as $key) {
            $value = $config->{$key} ?? null;
            if ($value !== null) return (bool) $value;
        }
        return $default;
    }

    private function money($value, int $precision = 2): float
    {
        return round((float) $value, $precision);
    }
}