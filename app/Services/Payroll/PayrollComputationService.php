<?php

namespace App\Services\Payroll;

use App\Models\ClientMaster;
use App\Models\EmployeeMaster;
use App\Models\PayrollPeriod;
use Illuminate\Validation\ValidationException;

class PayrollComputationService
{
    public function compute(array $data): array
    {
        $employee = EmployeeMaster::with('basicRates')
            ->where('emp_id', $data['emp_id'])
            ->where('client_id', $data['client_id'])
            ->firstOrFail();

        $period = PayrollPeriod::where('period_id', $data['period_id'])
            ->where('client_id', $data['client_id'])
            ->firstOrFail();

        $client = ClientMaster::with('payrollConfig')
            ->where('client_id', $data['client_id'])
            ->firstOrFail();

        $config = $client->payrollConfig;

        if (!$config) {
            throw ValidationException::withMessages([
                'client_id' => 'Payroll configuration not found for this client.',
            ]);
        }

        $rate = $this->getCurrentRate($employee);
        $inputs = $this->normalizeInputs($data['inputs'] ?? []);

        $basicPay = $this->computeBasicPay($inputs, $rate, $config);
        $overtimePay = $this->computeOvertimePay($inputs, $rate, $config);
        $holidayEarnings = $this->computeHolidayEarnings($inputs, $rate, $config);

        $allowances = $this->computeAllowances($inputs);
        $loadAllowance = $this->money($inputs['load_allow']);
        $mealAllowance = $this->money($inputs['meal_allow']);
        $transpoAllowance = $this->money($inputs['transpo_allow']);

        $adjustments = $this->money(
            $inputs['salary_adj'] + $inputs['incentive_pay']
        );

        $ecolaPay = $this->computeEcola($inputs, $employee);

        // These are amounts supplied by the UI.
        // Leave-day conversion requires the actual company leave-pay rules.
        $sickLeavePay = $inputs['sl_pay'];
        $vacationLeavePay = $inputs['vl_pay'];

        $thirteenthMonthPay = $this->money(
            $inputs['thirteenth_month_pay']
        );

        $absentDeduction = $this->computeAbsentDeduction(
            $inputs,
            $rate,
            $config
        );

        $tardyDeduction = $this->computeTardyDeduction(
            $inputs,
            $rate
        );

        $grossPay = $this->money(
            $basicPay
            + $overtimePay
            + $holidayEarnings['total']
            + $allowances
            + $adjustments
            + $ecolaPay
            + $sickLeavePay
            + $vacationLeavePay
            + $thirteenthMonthPay
        );

        $contributions = $this->computeContributions(
            $employee,
            $rate,
            $config,
            $grossPay,
            $period
        );

        $withholdingTax = $this->computeWithholdingTax(
            $employee,
            $config,
            $grossPay,
            $contributions
        );

        $otherDeductions = $this->computeOtherDeductions(
            $inputs['other_deductions']
        );

        // Absence and tardiness are deducted exactly once here.
        $totalDeductions = $this->money(
            $absentDeduction
            + $tardyDeduction
            + $contributions['sss_ee']
            + $contributions['philhealth_ee']
            + $contributions['pagibig_ee']
            + $withholdingTax
            + $otherDeductions
        );

        $netPay = $this->money($grossPay - $totalDeductions);

        return [
            'employee' => [
                'emp_id' => $employee->emp_id,
                'name' => trim(
                    ($employee->first_name ?? '') . ' ' .
                    ($employee->last_name ?? '')
                ),
            ],

            'period' => [
                'period_id' => $period->period_id,
                'start_date' => $period->start_date,
                'end_date' => $period->end_date,
            ],

            'rate' => [
                'rate_basis' => $rate->rate_basis,
                'monthly_rate' => $rate->monthly_rate,
                'daily_rate' => $rate->daily_rate,
                'hourly_rate' => $rate->hourly_rate,
            ],

            'inputs' => $inputs,

            'earnings' => [
                'basic_pay' => $this->money($basicPay),
                'regular_ot_pay' => $this->money($overtimePay),
                'night_diff_pay' => 0.00,
                'regular_holiday_pay' => $this->money(
                    $holidayEarnings['legal']
                ),
                'regular_holiday_ot_pay' => $this->money(
                    $holidayEarnings['legal_ot']
                ),
                'special_holiday_pay' => $this->money(
                    $holidayEarnings['special']
                ),
                'special_holiday_ot_pay' => $this->money(
                    $holidayEarnings['special_ot']
                ),
                'sick_leave_pay' => $this->money($sickLeavePay),
                'vacation_leave_pay' => $this->money($vacationLeavePay),
                'allowances' => $this->money($allowances),
                'load_allow' => $loadAllowance,
                'meal_allow' => $mealAllowance,
                'transpo_allow' => $transpoAllowance,
                'salary_adjustment' => $this->money(
                    $inputs['salary_adj']
                ),
                'incentive_pay' => $this->money(
                    $inputs['incentive_pay']
                ),
                'ecola_pay' => $this->money($ecolaPay),
                'thirteenth_month_pay' => $this->money(
                    $thirteenthMonthPay
                ),
            ],

            'deductions' => [
                'absent_ded' => $this->money($absentDeduction),
                'tardy_ded' => $this->money($tardyDeduction),
                'sss_ee' => $contributions['sss_ee'],
                'philhealth_ee' => $contributions['philhealth_ee'],
                'pagibig_ee' => $contributions['pagibig_ee'],
                'wtax' => $this->money($withholdingTax),
                'other_deductions' => $this->money($otherDeductions),
                'total_ded' => $totalDeductions,
            ],

            'contributions' => $contributions,

            'summary' => [
                'gross_pay' => $grossPay,
                'total_deductions' => $totalDeductions,
                'net_pay' => $netPay,
            ],
        ];
    }

    /**
     * Legacy behavior:
     * Use the employee's current rate, not a rate overlapping the cutoff.
     *
     * NOTE: This selects the latest basicRates row because the Laravel
     * EmployeeMaster current-rate columns have not yet been provided.
     */
    private function getCurrentRate($employee)
    {
        $rate = $employee->basicRates
            ->sortByDesc('effective_date')
            ->first();

        if ($rate) {
            return (object) [
                'rate_basis' => $rate->rate_basis ?: 'Daily',
                'monthly_rate' => (float) ($rate->monthly_rate ?? 0),
                'daily_rate' => (float) ($rate->daily_rate ?? 0),
                'hourly_rate' => (float) ($rate->hourly_rate ?? 0),
            ];
        }

        // Legacy behavior treats missing/NULL rates as zero.
        return (object) [
            'rate_basis' => 'Daily',
            'monthly_rate' => 0,
            'daily_rate' => 0,
            'hourly_rate' => 0,
        ];
    }

    private function normalizeInputs(array $inputs): array
    {
        $fields = [
            'days_present',
            'days_absent',
            'hours_worked',
            'ot_hrs',
            'excess_ot_hrs',
            'night_diff_ot',
            'rest_day_ot_hrs',
            'sunday_ot',
            'sp_hol_days',
            'sp_hol_ot_hrs',
            'excess_sp_hol_ot_hrs',
            'leg_hol_days',
            'leg_hol_ot_hrs',
            'excess_leg_hol_ot_hrs',
            'excess_sun_leg_ot_hrs',
            'ot_no_prem_hrs',
            'vl_days',
            'sl_days',
            'vl_pay',
            'sl_pay',
            'tardy_hrs',
            'salary_adj',
            'incentive_pay',
            'ecola_pay',
            'thirteenth_month_pay',
            'allowance',
            'load_allow',
            'meal_allow',
            'transpo_allow',
        ];

        $normalized = [];

        foreach ($fields as $field) {
            $normalized[$field] = (float) ($inputs[$field] ?? 0);
        }

        $normalized['other_deductions'] = is_array(
            $inputs['other_deductions'] ?? null
        ) ? $inputs['other_deductions'] : [];

        return $normalized;
    }

    private function computeBasicPay(
        array $inputs,
        $rate,
        $config
    ): float {
        $basis = strtolower($rate->rate_basis ?? 'daily');

        $days = $inputs['days_present'];
        $hours = $inputs['hours_worked'];

        $monthlyRate = (float) $rate->monthly_rate;
        $dailyRate = (float) $rate->daily_rate;
        $hourlyRate = (float) $rate->hourly_rate;

        $cutoffs = max(1, (int) ($config->cutoff_period ?? 2));

        return match ($basis) {
            'hourly' => $this->money($hours * $hourlyRate),
            'monthly' => $this->money($days * ($monthlyRate / $cutoffs)),
            default => $this->money($days * $dailyRate),
        };
    }

    private function computeOvertimePay(
        array $inputs,
        $rate,
        $config
    ): float {
        $hourlyRate = (float) $rate->hourly_rate;

        $regularRate = (float) (
            $config->regular_overtime_rate ?: 1.25
        );

        return $this->money(
            $inputs['ot_hrs'] * $hourlyRate * $regularRate
        );
    }

    private function computeHolidayEarnings(
        array $inputs,
        $rate,
        $config
    ): array {
        $hourlyRate = (float) $rate->hourly_rate;
        $dailyRate = (float) $rate->daily_rate;

        $specialRate = (float) (
            $config->special_holiday_rate ?: 1.30
        );

        $legalRate = (float) (
            $config->legal_holiday_rate ?: 2.00
        );

        $specialOtRate = (float) (
            $config->special_holiday_overtime_rate ?: 1.69
        );

        $legalOtRate = (float) (
            $config->legal_holiday_overtime_rate ?: 2.60
        );

        $special = $this->money(
            $inputs['sp_hol_days'] * $dailyRate * $specialRate
        );

        $legal = $this->money(
            $inputs['leg_hol_days'] * $dailyRate * $legalRate
        );

        $specialOt = $this->money(
            $inputs['sp_hol_ot_hrs'] * $hourlyRate * $specialOtRate
        );

        $legalOt = $this->money(
            $inputs['leg_hol_ot_hrs'] * $hourlyRate * $legalOtRate
        );

        return [
            'special' => $special,
            'legal' => $legal,
            'special_ot' => $specialOt,
            'legal_ot' => $legalOt,
            'total' => $this->money(
                $special + $legal + $specialOt + $legalOt
            ),
        ];
    }

    private function computeAllowances(array $inputs): float
    {
        return $this->money(
            $inputs['allowance']
            + $inputs['load_allow']
            + $inputs['meal_allow']
            + $inputs['transpo_allow']
        );
    }

    private function computeEcola(array $inputs, $employee): float
    {
        if (!$employee->with_ecol) {
            return 0.00;
        }

        return $this->money($inputs['ecola_pay']);
    }

    private function computeAbsentDeduction(
        array $inputs,
        $rate,
        $config
    ): float {
        $basis = strtolower($rate->rate_basis ?? 'daily');

        if ($basis === 'hourly') {
            return $this->money(
                $inputs['days_absent']
                * $rate->hourly_rate
                * (float) ($config->hours_per_day ?? 8)
            );
        }

        return $this->money(
            $inputs['days_absent'] * $rate->daily_rate
        );
    }

    private function computeTardyDeduction(
        array $inputs,
        $rate
    ): float {
        return $this->money(
            $inputs['tardy_hrs'] * $rate->hourly_rate
        );
    }

    private function computeContributions(
        $employee,
        $rate,
        $config,
        float $grossPay,
        $period
    ): array {
        /*
         * Placeholder only.
         * Connect actual statutory contribution tables before production.
         */
        return [
            'sss_ee' => 0.00,
            'sss_er' => 0.00,
            'ecc_er' => 0.00,
            'philhealth_ee' => 0.00,
            'philhealth_er' => 0.00,
            'pagibig_ee' => 0.00,
            'pagibig_er' => 0.00,
        ];
    }

    private function computeWithholdingTax(
        $employee,
        $config,
        float $grossPay,
        array $contributions
    ): float {
        /*
         * Placeholder only.
         * Connect the actual withholding tax tables and payroll rules.
         */
        return 0.00;
    }

    private function computeOtherDeductions(array $deductions): float
    {
        $total = 0;

        foreach ($deductions as $deduction) {
            $total += (float) ($deduction['amount'] ?? 0);
        }

        return $this->money($total);
    }

    private function money($value): float
    {
        return round((float) $value, 2);
    }
}