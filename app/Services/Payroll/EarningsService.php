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

        // Absent at Tardy Deductions
        $absentDeduction = $this->money($inputs['days_absent'] * $ctx['daily_base']);
        $tardyDeduction = $this->money($inputs['tardy_hrs'] * $ctx['hourly_base']);

        // Sick Leave at Vacation Leave (Mananatili sa backend kahit tinanggal sa UI)
        $sickLeavePay = $inputs['sl_days'] > 0
            ? $this->money($inputs['sl_days'] * $ctx['daily_base'])
            : $this->money($inputs['sl_pay']);

        $vacationLeavePay = $inputs['vl_days'] > 0
            ? $this->money($inputs['vl_days'] * $ctx['daily_base'])
            : $this->money($inputs['vl_pay']);

        // ECOLA (Mananatili sa backend)
        $ecolaPay = $this->computeEcola(
            $inputs,
            $config,
            $ctx,
            $absentDeduction,
            $tardyDeduction
        );

        // 13th Month Pay Computation
        $thirteenthMonthPay = $this->computeThirteenthMonth(
            $inputs,
            $rate,
            $config,
            $ctx,
            $basicPay,
            $tardyDeduction,
            $ecolaPay
        );

        // INAYOS NA: Hinahanap na ang database column mo (add_13th_month_to_gross_pay)
        $thirteenthInGross = $this->cfgFlag(
            $config,
            ['add_13th_month_to_gross_pay', 'display_13th_month_pay', 'display_13th_month', 'display13monthpay'],
            false
        );

        $earningsBeforeAbsentTardy = $this->money(
            $basicPay
            + $premium['total']
            + $allowances
            + $adjustments
            + $ecolaPay
            + $sickLeavePay
            + $vacationLeavePay
            + ($thirteenthInGross ? $thirteenthMonthPay : 0)
        );

        $grossPay = $earningsBeforeAbsentTardy;

        return [
            'basic_pay' => $basicPay,
            'premium' => $premium,
            'fixed_allowance' => $fixedAllowance,
            'allowances' => $allowances,
            'adjustments' => $adjustments,
            'absent_deduction' => $absentDeduction,
            'tardy_deduction' => $tardyDeduction,
            'sick_leave_pay' => $sickLeavePay,
            'vacation_leave_pay' => $vacationLeavePay,
            'ecola_pay' => $ecolaPay,
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

    private function computePremiumEarnings(array $inputs, array $ctx, $config): array
    {
        $rate = fn (string $key, ?float $default) => $this->clientRate($config, $key, $default);

        $regularOt = $this->premiumPay($inputs['ot_hrs'], $rate('regular_overtime_rate', 1.0), 1.0, $ctx, true);
        $nightDiff = $this->premiumPay($inputs['night_diff_ot'], $rate('night_differential_rate', 1.0), 1.0, $ctx, true);
        $restDay = $this->premiumPay($inputs['rest_day_ot_hrs'], $rate('rest_day_rate', 1.0), 1.0, $ctx, false);

        $sundayRate = $this->clientRate($config, 'sunday_rate', null);
        if ($sundayRate == 0.0) {
            $sundayRate = $this->clientRate($config, 'rest_day_overtime_rate', 1.69);
        }
        $sundayOt = $this->premiumPay($inputs['sunday_ot'], $sundayRate, 1.69, $ctx, true);

        $special = $this->premiumPay($inputs['sp_hol_hrs'], $rate('special_holiday_rate', 1.0), 1.0, $ctx, false);
        $legal = $this->premiumPay($inputs['leg_hol_hrs'], $rate('legal_holiday_rate', 1.0), 1.0, $ctx, false);
        $specialOt = $this->premiumPay($inputs['sp_hol_ot_hrs'], $rate('special_holiday_overtime_rate', 1.0), 1.0, $ctx, true);
        $legalOt = $this->premiumPay($inputs['leg_hol_ot_hrs'], $rate('legal_holiday_overtime_rate', 1.0), 1.0, $ctx, false);

        $excessOt = $this->premiumPay($inputs['excess_ot_hrs'], $rate('special_holiday_rest_day_rate', 0.0), null, $ctx, false);
        $excessSunSpecial = $this->premiumPay($inputs['excess_sun_sp_ot_hrs'], $rate('special_holiday_rest_day_overtime_rate', 0.0), null, $ctx, false);
        $excessSunLegal = $this->premiumPay($inputs['excess_sun_leg_ot_hrs'], $rate('legal_holiday_rest_day_overtime_rate', 1.0), 1.0, $ctx, false);
        $excessLegalHol = $this->premiumPay($inputs['excess_leg_hol_ot_hrs'], $rate('legal_holiday_rest_day_rate', 1.0), 1.0, $ctx, false);
        $otNoPremium = $this->premiumPay($inputs['ot_no_prem_hrs'], $rate('ot_without_premium_rate', 1.0), 1.0, $ctx, false);

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

    private function premiumPay(float $hours, float $multiplier, ?float $default, array $ctx, bool $ecolaAware): float
    {
        if ($hours <= 0) return 0.00;
        if ($default !== null && $multiplier == 0.0) $multiplier = $default;

        $base = ($ecolaAware && !empty($ctx['ecola_in_ot_rate']))
            ? $this->otRateWithEcola($hours, $ctx)
            : $hours * $ctx['hourly_base'];

        return $this->money($multiplier * $base);
    }

    private function otRateWithEcola(float $hours, array $ctx): float
    {
        $ecola = (float) $ctx['ecola_rate'];
        $wdy = max(1.0, $ctx['work_days_per_year']);
        $whd = max(1.0, $ctx['work_hrs_per_day']);

        if ($ctx['basis'] === 'monthly') {
            $ecolaPerHour = $ecola * 12 / $wdy / $whd;
            $basePerHour = $ctx['monthly_rate'] * 12 / $wdy / $whd;
            return ($basePerHour + $ecolaPerHour) * $hours;
        }

        $ecolaPerHour = $ecola / $whd;
        return ($ctx['daily_rate'] / $whd + $ecolaPerHour) * $hours;
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

    private function computeEcola(array $inputs, $config, array $ctx, float $absentDeduction, float $tardyDeduction): float
    {
        $ecolaRate = (float) $ctx['ecola_rate'];
        if ($ecolaRate <= 0) {
            return $ctx['basis'] === 'monthly' ? $this->money($inputs['ecola_pay']) : 0.00;
        }

        $wdy = max(1.0, $ctx['work_days_per_year']);
        $whd = $ctx['work_hrs_per_day'];

        if ($ctx['basis'] === 'monthly') {
            $ecola = $ecolaRate;
            $perHoliday = $ecolaRate * 2 * (12 / $wdy);
        } else {
            $ecola = $ecolaRate * $inputs['days_present'];
            $perHoliday = $ecolaRate;
        }

        if (!empty($config->ecola_w_late_deduction) && ($tardyDeduction > 0 || $absentDeduction > 0)) {
            if ($ctx['basis'] === 'monthly') {
                $hoursDeducted = $inputs['tardy_hrs'] + ($inputs['days_absent'] * $whd);
                $ecola -= ($ecolaRate * 2 * 12 / $wdy / 8) * $hoursDeducted;
            } else {
                $ecola -= $ecolaRate * ($inputs['tardy_hrs'] / 8);
            }
        }

        $hasSpecial = $inputs['sp_hol_hrs'] > 0;
        $hasLegal = $inputs['leg_hol_hrs'] > 0;

        if (!empty($config->ecola_double_on_spl) && $hasSpecial && $inputs['ecola_hol_checked']) $ecola += $perHoliday;
        if (!empty($config->ecola_double_on_legal) && $hasLegal && $inputs['ecola_legal_checked']) $ecola += $perHoliday;
        if (!empty($config->ecola_pay_on_rest_day) && $inputs['rest_day_ot_hrs'] > 0) $ecola += $perHoliday;
        if (!empty($config->ecola_pay_on_holiday) && ($hasSpecial || $hasLegal) && ($inputs['ecola_hol_checked'] || $inputs['ecola_legal_checked'])) $ecola += $perHoliday;

        return $this->money(max(0, $ecola));
    }

    private function computeThirteenthMonth(array $inputs, $rate, $config, array $ctx, float $basicPay, float $tardyDeduction, float $ecolaPay): float
    {
        if ($inputs['thirteenth_month_pay'] > 0) return $this->money($inputs['thirteenth_month_pay']);

        // INAYOS NA: Hinahanap na ang database column mo (include_13th_month_pay)
        if (!$this->cfgFlag($config, ['include_13th_month_pay', 'with_13th_month', 'with_13th_month_pay', 'with13monthpay'], false)) return 0.00;

        $hourly13 = (float) $rate->hourly_13th_month_rate;
        $days = $inputs['days_present'];
        $daily = (float) $rate->daily_rate;

        if ($ctx['basis'] === 'monthly') {
            if ($hourly13 != 0.0) return $this->money($hourly13 - $tardyDeduction);

            $base = $basicPay - $tardyDeduction;
            if (empty($config->thirteenth_exclude_ecola)) $base += $ecolaPay;

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