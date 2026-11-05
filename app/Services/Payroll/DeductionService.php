<?php

namespace App\Services\Payroll;

use App\Models\PayrollPagibigConfig;
use App\Models\PayrollPhilhealthConfig;
use App\Models\PayrollSSSConfig;
use App\Models\CutoffConfig;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Throwable;

class DeductionService
{
    private const PAGIBIG_THRESHOLD = 5000;
    private const PAGIBIG_FIXED_MONTHLY = 50.00;
    private const PAGIBIG_FIXED_WEEKLY = 25.00;

    private const PH_FLOOR_BASIS = 10000.5;
    private const PH_CEILING_BASIS = 99999.7;
    private const PH_FLOOR_SHARE = 250.0;
    private const PH_CEILING_SHARE = 2500.0;
    private const PH_RATE = 0.05;

    /** @var string[] */
    private array $warnings = [];

    // Ginawa nating optional lahat ng arguments para hindi mag-error kahit kulang ang tawag
    public function compute(
        $rate = null, 
        $config = null, 
        array $ctx = [], 
        float $grossPay = 0.0, 
        float $basicPay = 0.0, 
        $period = null, 
        array $overrides = [], 
        array $inputs = []
    ): array
    {
        // Safety guard: kung kulang ang arguments, mag-return ng default zero values
        if (!$rate || !$config || !$period) {
            return [
                'sss_ee' => 0.00, 'sss_er' => 0.00, 'sss_er_base' => 0.00, 'ecc_er' => 0.00,
                'philhealth_ee' => 0.00, 'philhealth_er' => 0.00,
                'pagibig_ee' => 0.00, 'pagibig_er' => 0.00,
                'debug' => ['warnings' => ['DeductionService: missing required arguments.']]
            ];
        }

        $this->warnings = [];

        $result = [
            'sss_ee' => 0.00,
            'sss_er' => 0.00,
            'sss_er_base' => 0.00,
            'ecc_er' => 0.00,
            'philhealth_ee' => 0.00,
            'philhealth_er' => 0.00,
            'pagibig_ee' => 0.00,
            'pagibig_er' => 0.00,
            'debug' => ['warnings' => []]
        ];

        $sssEnabled = $this->isContributionEnabled($config->withhold_sss ?? null) && ($inputs['deduct_sss'] ?? true);
        $pagibigEnabled = $this->isContributionEnabled($config->withhold_pagibig ?? null) && ($inputs['deduct_pagibig'] ?? true);
        $philhealthEnabled = $this->isContributionEnabled($config->withhold_philhealth ?? null) && ($inputs['deduct_philhealth'] ?? true);

        $periodDate = $period->end_date ? Carbon::parse($period->end_date)->format('Y-m-d') : now()->toDateString();

        if ((float) ($rate->monthly_rate ?? 0) <= 0 && ($pagibigEnabled || $philhealthEnabled)) {
            $this->warnings[] = 'MONTHLY_RATE_MISSING: monthly_rate is 0.';
        }

        // SSS
        if ($sssEnabled && empty($overrides['sss'])) {
            $sssBasis = !empty($config->sss_basis_basic_pay) ? $basicPay : $grossPay;
            $sssBasis = max(0, $this->money($sssBasis));

            $sssBracket = PayrollSSSConfig::query()
                ->where('is_active', true)
                ->where('min_wage', '<=', $sssBasis)
                ->where(function ($query) use ($sssBasis) {
                    $query->whereNull('max_wage')->orWhere('max_wage', '>=', $sssBasis);
                })
                ->where(function ($query) use ($periodDate) {
                    $query->whereNull('effective_date')->orWhereDate('effective_date', '<=', $periodDate);
                })
                ->where(function ($query) use ($periodDate) {
                    $query->whereNull('end_date')->orWhereDate('end_date', '>=', $periodDate);
                })
                ->orderByDesc('min_wage')
                ->first();

            if ($sssBracket) {
                $sssAddOn = (float) ($config->sss_add_on ?? 0);
                $eeShare = (float) ($sssBracket->ee_share ?? 0);
                $erShare = (float) ($sssBracket->er_share ?? 0);
                $ecShare = (float) ($sssBracket->ec_share ?? 0);

                $result['sss_ee'] = $this->money($eeShare + $sssAddOn);
                $result['sss_er_base'] = $this->money($erShare);
                $result['ecc_er'] = $this->money($ecShare);
                $result['sss_er'] = $this->money($erShare + $ecShare);
            } else {
                $this->warnings[] = "SSS_NO_BRACKET: no active payroll_sss_config for {$sssBasis} on {$periodDate}.";
            }
        }

        // Pag-IBIG
        if ($pagibigEnabled && empty($overrides['pagibig'])) {
            $pagibigBasis = max(0, (float) ($rate->monthly_rate ?? 0));

            if (empty($config->pagibig_exclude_ecola)) {
                $ecolaRate = (float) ($ctx['ecola_rate'] ?? 0);
                $daysPerMonth = (float) ($ctx['days_per_month'] ?? 26);
                $monthlyEcola = ($ctx['basis'] ?? 'daily') === 'monthly' ? $ecolaRate * 2 : $ecolaRate * $daysPerMonth;
                $pagibigBasis += $monthlyEcola;
            }

            $cutoffs = max(1, (int) ($ctx['cutoffs'] ?? 1));

            $bracket = PayrollPagibigConfig::query()
                ->where('is_active', true)
                ->where('min_wage', '<=', $pagibigBasis)
                ->where(function ($query) use ($pagibigBasis) {
                    $query->whereNull('max_wage')->orWhere('max_wage', '>=', $pagibigBasis);
                })
                ->where(function ($query) use ($periodDate) {
                    $query->whereNull('effective_date')->orWhereDate('effective_date', '<=', $periodDate);
                })
                ->where(function ($query) use ($periodDate) {
                    $query->whereNull('end_date')->orWhereDate('end_date', '>=', $periodDate);
                })
                ->orderByDesc('min_wage')
                ->first();

            if ($bracket) {
                $max = (float) ($bracket->pagibig_max ?? 0);
                $over = $pagibigBasis > self::PAGIBIG_THRESHOLD;

                $ee = $this->money(($over ? $max : (float) ($bracket->pagibig_ee ?? 0)) / $cutoffs);
                $er = $this->money(($over ? $max : (float) ($bracket->pagibig_er ?? 0)) / $cutoffs);

                if (number_format($er, 2, '.', '') === '0.02') {
                    $ee = 0.00;
                    $er = 0.00;
                }

                if (($ctx['basis'] ?? 'daily') === 'monthly' && (!empty($config->pagibig_half_sss_pay) || !($rate->sss_ded_is_monthly ?? false))) {
                    $fixed = (float) ($config->pagibig_fixed_monthly ?? self::PAGIBIG_FIXED_MONTHLY);
                    $ee = $fixed;
                    $er = $fixed;
                }

                if (($ctx['basis'] ?? 'daily') === 'weekly') {
                    $fixed = (float) ($config->pagibig_fixed_weekly ?? self::PAGIBIG_FIXED_WEEKLY);
                    $ee = $fixed;
                    $er = $fixed;
                }

                $result['pagibig_ee'] = $this->money($ee);
                $result['pagibig_er'] = $this->money($er);
            } else {
                $this->warnings[] = "PAGIBIG_NO_BRACKET: no active payroll_pagibig_config for {$pagibigBasis} on {$periodDate}.";
            }
        }

        // PhilHealth
        $weeklyClient = ($ctx['cutoffs'] ?? 1) === 4;
        if ($philhealthEnabled && empty($overrides['philhealth']) && ($weeklyClient || $this->isFirstCutoff($period))) {
            $monthlyBasis = max(0, (float) ($rate->monthly_rate ?? 0));

            if ($monthlyBasis > 0) {
                [$employeeShare, $employerShare] = $this->lookupPhilhealth($monthlyBasis, $periodDate);

                if ($weeklyClient) {
                    $employeeShare /= 4;
                    $employerShare /= 4;
                }

                $employeeShare = round($employeeShare, 2);
                $employerShare = round($employerShare, 2);

                if ($employeeShare > 0) {
                    $employeeShare += (float) ($config->philhealth_add_on ?? 0);
                }

                $result['philhealth_ee'] = $this->money($employeeShare);
                $result['philhealth_er'] = $this->money($employerShare);
            }
        }

        // Manual overrides
        $manualOverrides = [
            'sss' => ['ee' => 'sss_ee', 'er' => 'sss_er'],
            'pagibig' => ['ee' => 'pagibig_ee', 'er' => 'pagibig_er'],
            'philhealth' => ['ee' => 'philhealth_ee', 'er' => 'philhealth_er'],
        ];

        foreach ($manualOverrides as $name => $fields) {
            if (empty($overrides[$name])) continue;

            $result[$fields['ee']] = $this->money($inputs[$fields['ee']] ?? 0);
            $result[$fields['er']] = $this->money($inputs[$fields['er']] ?? 0);
        }

        $result['debug']['warnings'] = array_values(array_unique($this->warnings));

        return $result;
    }

    private function lookupPhilhealth(float $monthlyBasis, string $periodDate): array
    {
        if (config('payroll.philhealth_use_table', false)) {
            $bracket = PayrollPhilhealthConfig::query()
                ->where('is_active', true)
                ->where('min_wage', '<=', $monthlyBasis)
                ->where(function ($query) use ($monthlyBasis) {
                    $query->whereNull('max_wage')->orWhere('max_wage', '>=', $monthlyBasis);
                })
                ->orderByDesc('min_wage')
                ->first();

            if ($bracket) {
                return [(float) ($bracket->ph_ee ?? 0), (float) ($bracket->ph_er ?? 0)];
            }
        }

        if ($monthlyBasis <= self::PH_FLOOR_BASIS) return [self::PH_FLOOR_SHARE, self::PH_FLOOR_SHARE];
        if ($monthlyBasis >= self::PH_CEILING_BASIS) return [self::PH_CEILING_SHARE, self::PH_CEILING_SHARE];

        $share = ($monthlyBasis * self::PH_RATE) / 2;
        return [$share, $share];
    }

    private function isContributionEnabled($value): bool
    {
        if ($value === null) return true;
        return (bool) $value;
    }

    private function isFirstCutoff($period): bool
    {
        return $this->matchesCutoffPair($period, 'f');
    }

    private function matchesCutoffPair($period, string $prefix): bool
    {
        if (!$period->start_date || !$period->end_date) return false;

        $start = Carbon::parse($period->start_date)->startOfDay();
        $end = Carbon::parse($period->end_date)->startOfDay();

        try {
            $rows = CutoffConfig::query()->get();
        } catch (Throwable $e) {
            Log::warning('CutoffConfig lookup failed', ['prefix' => $prefix, 'error' => $e->getMessage()]);
            $this->warnings[] = "CUTOFF_CONFIG_UNREADABLE ({$prefix}): " . $e->getMessage();
            return false;
        }

        foreach ($rows as $row) {
            $from = $row->{$prefix . '_from'} ?? null;
            $to = $row->{$prefix . '_to'} ?? null;

            if ($from === null || $to === null || $from === '' || $to === '') continue;

            if (is_numeric($from) && is_numeric($to)) {
                if ((int) $from === (int) $start->day && (int) $to === (int) $end->day) return true;
                continue;
            }

            try {
                $rangeStart = Carbon::parse($from)->startOfDay();
                $rangeEnd = Carbon::parse($to)->startOfDay();
            } catch (Throwable $e) {
                continue;
            }

            if ($rangeStart <= $start && $rangeEnd >= $end) return true;
        }

        return false;
    }

    private function money($value, int $precision = 2): float
    {
        return round((float) $value, $precision);
    }
}