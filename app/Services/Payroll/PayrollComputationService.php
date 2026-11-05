<?php

namespace App\Services\Payroll;

use App\Models\ClientMaster;
use App\Models\EmployeeMaster;
use App\Models\PayrollPeriod;
use Illuminate\Validation\ValidationException;

class PayrollComputationService
{
    private const DEFAULT_MONTHLY_DIVISOR_DAYS = 313;
    private const DEFAULT_HOURS_DIVISOR = 8;

    protected EarningsService $earnings;
    protected DeductionService $deductions;
    protected TaxService $tax;

    public function __construct(
        EarningsService $earnings,
        DeductionService $deductions,
        TaxService $tax
    ) {
        $this->earnings = $earnings;
        $this->deductions = $deductions;
        $this->tax = $tax;
    }

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
        $ctx = $this->buildContext($rate, $config);

        // ---- 1. Earnings ----------------------------------------------------------
        $e = $this->earnings->compute($inputs, $rate, $config, $ctx);

        // ---- 2. Deductions (SSS, PH, Pagibig) -------------------------------------
        // Tama ang 8 arguments na pinapasa natin dito, tugma sa DeductionService::compute()
        $deductions = $this->deductions->compute(
            $rate, $config, $ctx, $e['gross_pay'], $e['basic_pay'], $period,
            $data['contribution_overrides'] ?? [], $inputs
        );

        // ---- 3. Tax ---------------------------------------------------------------
        $taxableIncome = $e['gross_pay'];
        if (empty($config->ecola_taxable)) {
            $taxableIncome -= $e['ecola_pay'];
        }
        if (!empty($config->tax_exclude_contributions)) {
            $taxableIncome -= ($deductions['sss_ee'] + $deductions['pagibig_ee'] + $deductions['philhealth_ee']);
        }

        // Tama ang 8 arguments na pinapasa natin dito, tugma sa TaxService::compute()
        $tax = $this->tax->compute(
            $employee, $rate, $config, $period, $taxableIncome,
            $e['premium']['regular_ot'] + $e['premium']['sunday_ot'],
            $data, $data['min_wage_rate'] ?? config('payroll.min_wage_rate', 0)
        );

        // ---- 4. Summary -----------------------------------------------------------
        $otherDeductions = $this->computeOtherDeductions($inputs['other_deductions']);
        $overUnderPay = $this->money($inputs['over_under_pay']);

        $totalDeductions = $this->money(
            $e['absent_deduction'] +  // <--- Idinagdag
            $e['tardy_deduction'] +   // <--- Idinagdag
            $otherDeductions
            + $overUnderPay
            + $deductions['sss_ee']
            + $deductions['philhealth_ee']
            + $deductions['pagibig_ee']
            + $tax['amount']
        );

        $netPay = $this->money($e['gross_pay'] - $totalDeductions);

        return [
            'employee' => [
                'emp_id' => $employee->emp_id,
                'name' => trim(($employee->first_name ?? '') . ' ' . ($employee->last_name ?? '')),
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
                'hourly_base' => $this->money($ctx['hourly_base'], 6),
                'daily_base' => $this->money($ctx['daily_base'], 6),
            ],
            'inputs' => $inputs,
            'earnings' => [
                'basic_pay' => $e['basic_pay'],
                'regular_ot_pay' => $e['premium']['regular_ot'],
                'night_diff_pay' => $e['premium']['night_diff'],
                'rest_day_ot_pay' => $e['premium']['rest_day'],
                'sunday_ot_pay' => $e['premium']['sunday_ot'],
                'regular_holiday_pay' => $e['premium']['legal'],
                'regular_holiday_ot_pay' => $e['premium']['legal_ot'],
                'special_holiday_pay' => $e['premium']['special'],
                'special_holiday_ot_pay' => $e['premium']['special_ot'],
                'excess_ot_pay' => $e['premium']['excess_ot'],
                'excess_sun_legal_ot_pay' => $e['premium']['excess_sun_legal'],
                'excess_legal_hol_ot_pay' => $e['premium']['excess_legal_hol'],
                'excess_sun_special_ot_pay' => $e['premium']['excess_sun_special'],
                'ot_without_premium_pay' => $e['premium']['ot_no_premium'],
                'sick_leave_pay' => $e['sick_leave_pay'],
                'vacation_leave_pay' => $e['vacation_leave_pay'],
                'allowance' => $this->money($e['fixed_allowance']),
                'allowances' => $e['allowances'],
                'load_allow' => $this->money($inputs['load_allow']),
                'meal_allow' => $this->money($inputs['meal_allow']),
                'transpo_allow' => $this->money($inputs['transpo_allow']),
                'salary_adjustment' => $this->money($inputs['salary_adj']),
                'incentive_pay' => $this->money($inputs['incentive_pay']),
                'ecola_pay' => $e['ecola_pay'],
                'thirteenth_month_pay' => $e['thirteenth_month_pay'],
            ],
            'deductions' => [
                'absent_ded' => $e['absent_deduction'],
                'tardy_ded' => $e['tardy_deduction'],
                'sss_ee' => $deductions['sss_ee'],
                'philhealth_ee' => $deductions['philhealth_ee'],
                'pagibig_ee' => $deductions['pagibig_ee'],
                'wtax' => $tax['amount'],
                'other_deductions' => $otherDeductions,
                'over_under_pay' => $overUnderPay,
                'total_ded' => $totalDeductions,
            ],
            'contributions' => $deductions,
            'summary' => [
                'earnings_before_absent_tardy' => $e['earnings_before_absent_tardy'],
                'gross_pay' => $e['gross_pay'],
                'thirteenth_in_gross' => $e['thirteenth_in_gross'],
                'taxable_income' => $this->money($taxableIncome),
                'total_deductions' => $totalDeductions,
                'net_pay' => $netPay,
            ],
            'debug' => [
                'earnings_rates' => $e['debug']['rates_used'] ?? [],
                'warnings' => array_values(array_unique(array_merge(
                    $e['debug']['warnings'] ?? [],
                    $deductions['debug']['warnings'] ?? [],
                    $tax['debug']['warnings'] ?? []
                ))),
                'cutoffs' => $ctx['cutoffs'],
                'rate_basis' => $ctx['basis'],
            ]
        ];
    }

    private function normalizeInputs(array $inputs): array
    {
        $fields = [
            'days_present', 'days_absent', 'hours_worked', 'ot_hrs', 'excess_ot_hrs',
            'night_diff_ot', 'rest_day_ot_hrs', 'sunday_ot', 'sp_hol_hrs', 'sp_hol_ot_hrs',
            'excess_sp_hol_ot_hrs', 'leg_hol_hrs', 'leg_hol_ot_hrs', 'excess_leg_hol_ot_hrs',
            'excess_sun_leg_ot_hrs', 'excess_sun_sp_ot_hrs', 'ot_no_prem_hrs', 'vl_days',
            'sl_days', 'vl_pay', 'sl_pay', 'tardy_hrs', 'salary_adj', 'incentive_pay',
            'ecola_pay', 'thirteenth_month_pay', 'allowance', 'load_allow', 'meal_allow',
            'transpo_allow', 'over_under_pay', 'sss_ee', 'sss_er', 'pagibig_ee',
            'pagibig_er', 'philhealth_ee', 'philhealth_er',
        ];

        $normalized = [];
        foreach ($fields as $field) {
            $normalized[$field] = $this->num($inputs[$field] ?? 0);
        }

        $normalized['sp_hol_hrs'] = $this->num($inputs['sp_hol_hrs'] ?? $inputs['sp_hol_days'] ?? 0);
        $normalized['leg_hol_hrs'] = $this->num($inputs['leg_hol_hrs'] ?? $inputs['leg_hol_days'] ?? 0);

        $normalized['excess_sun_sp_ot_hrs'] = $this->num(
            $inputs['excess_sun_sp_ot_hrs'] ?? $inputs['excess_sp_hol_ot_hrs'] ?? $normalized['excess_sun_sp_ot_hrs']
        );

        $normalized['ecola_hol_checked'] = $this->toBool($inputs['ecola_hol_checked'] ?? false);
        $normalized['ecola_legal_checked'] = $this->toBool($inputs['ecola_legal_checked'] ?? false);

        foreach (['deduct_sss', 'deduct_pagibig', 'deduct_philhealth'] as $switch) {
            $normalized[$switch] = array_key_exists($switch, $inputs) ? $this->toBool($inputs[$switch]) : true;
        }

        $normalized['other_deductions'] = is_array($inputs['other_deductions'] ?? null) ? $inputs['other_deductions'] : [];

        return $normalized;
    }

    private function getCurrentRate($employee)
    {
        $rate = $employee->basicRates->sortByDesc('effective_date')->first();

        $pick = function (string $key, $default = null) use ($rate, $employee) {
            return $rate->{$key} ?? $employee->{$key} ?? $default;
        };

        if (!$rate) {
            return (object) [
                'rate_basis' => 'Daily', 'monthly_rate' => 0.0, 'daily_rate' => 0.0, 'hourly_rate' => 0.0,
                'ecola_amount' => 0.0, 'exp_tax' => 0.0, 'tax_code' => 'Z', 'allowance' => 0.0,
                'ot_no_tax' => false, 'ecola_in_ot_rate' => false, 'sss_ded_is_monthly' => false,
                'hourly_13th_month_rate' => 0.0,
            ];
        }

        return (object) [
            'rate_basis' => $rate->rate_basis ?: 'Daily',
            'monthly_rate' => (float) ($rate->monthly_rate ?? 0),
            'daily_rate' => (float) ($rate->daily_rate ?? 0),
            'hourly_rate' => (float) ($rate->hourly_rate ?? 0),
            'ecola_amount' => (float) $pick('ecola_amount', 0),
            'exp_tax' => (float) $pick('exp_tax', 0),
            'tax_code' => $pick('tax_code') ?: 'Z',
            'allowance' => (float) $pick('allowance', 0),
            'ot_no_tax' => (bool) $pick('ot_no_tax', false),
            'ecola_in_ot_rate' => (bool) $pick('ecola_in_ot_rate', false),
            'sss_ded_is_monthly' => (bool) $pick('sss_ded_is_monthly', false),
            'hourly_13th_month_rate' => (float) $pick('hourly_13th_month_rate', 0),
        ];
    }

    private function buildContext($rate, $config): array
    {
        $basis = strtolower($rate->rate_basis ?? 'daily');

        $divisorDays = (float) (($config->monthly_divisor_days ?? null) ?: self::DEFAULT_MONTHLY_DIVISOR_DAYS);
        $hoursDivisor = (float) (($config->legacy_hours_divisor ?? null) ?: self::DEFAULT_HOURS_DIVISOR);

        $monthly = (float) $rate->monthly_rate;

        if ($basis === 'monthly') {
            $hourlyBase = $monthly * 12 / $divisorDays / $hoursDivisor;
            $dailyBase = $monthly * 12 / $divisorDays;
        } elseif ($basis === 'hourly') {
            $hourlyBase = (float) $rate->hourly_rate;
            $dailyBase = (float) $rate->hourly_rate;
        } else {
            $hourlyBase = (float) $rate->hourly_rate;
            $dailyBase = (float) $rate->daily_rate;
        }

        return [
            'basis' => $basis,
            'cutoffs' => $this->resolveCutoffs($config),
            'monthly_rate' => $monthly,
            'daily_rate' => (float) $rate->daily_rate,
            'ecola_rate' => (float) $rate->ecola_amount,
            'ecola_in_ot_rate' => (bool) $rate->ecola_in_ot_rate,
            'hourly_base' => $hourlyBase,
            'daily_base' => $dailyBase,
            'work_days_per_year' => (float) (($config->work_days_per_year ?? null) ?: 303),
            'work_hrs_per_day' => (float) (($config->hours_per_day ?? null) ?: 8),
            'days_per_month' => (float) (($config->no_of_days_per_month ?? null) ?: 26),
        ];
    }

    private function resolveCutoffs($config): int
    {
        $configured = (int) ($config->cutoff_period ?? 0);
        if (in_array($configured, [1, 2, 4], true)) return $configured;

        $frequency = strtolower(trim((string) ($config->payroll_frequency ?? '')));
        if (str_contains($frequency, 'week')) return 4;
        if (str_contains($frequency, 'semi')) return 2;
        return 1;
    }

    private function computeOtherDeductions(array $deductions): float
    {
        $total = 0;
        foreach ($deductions as $deduction) {
            $total += $this->num($deduction['amount'] ?? 0);
        }
        return $this->money($total);
    }

    private function toBool($value): bool
    {
        if (is_bool($value)) return $value;
        if (is_string($value)) return in_array(strtolower(trim($value)), ['1', 'true', 'yes', 'y', 'on', '-1'], true);
        return (bool) $value;
    }

    private function num($value): float
    {
        if ($value === null || $value === '') return 0.0;
        if (is_string($value)) $value = str_replace([',', ' ', '₱'], '', $value);
        return is_numeric($value) ? (float) $value : 0.0;
    }

    private function money($value, int $precision = 2): float
    {
        return round((float) $value, $precision);
    }
}