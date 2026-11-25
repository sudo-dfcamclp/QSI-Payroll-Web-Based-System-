<?php

namespace App\Services\Payroll;

use App\Models\PayrollPagibigConfig;
use App\Models\PayrollPhilhealthConfig;
use App\Models\PayrollSSSConfig;
use Illuminate\Support\Carbon;

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

    private array $warnings = [];

    public function compute($rate, $config, array $ctx, float $grossPay, float $basicPay, $period, array $overrides = [], array $inputs = []): array
    {
        $this->warnings = [];
        $result = ['sss_ee' => 0.00, 'sss_er' => 0.00, 'sss_er_base' => 0.00, 'ecc_er' => 0.00, 'philhealth_ee' => 0.00, 'philhealth_er' => 0.00, 'pagibig_ee' => 0.00, 'pagibig_er' => 0.00, 'debug' => ['warnings' => []]];

        $sssEnabled = $this->isContributionEnabled($config->withhold_sss ?? null) && ($inputs['deduct_sss'] ?? true);
        $pagibigEnabled = $this->isContributionEnabled($config->withhold_pagibig ?? null) && ($inputs['deduct_pagibig'] ?? true);
        $philhealthEnabled = $this->isContributionEnabled($config->withhold_philhealth ?? null) && ($inputs['deduct_philhealth'] ?? true);

        $periodDate = $period->end_date ? Carbon::parse($period->end_date)->format('Y-m-d') : now()->toDateString();

        // SSS
        if ($sssEnabled && empty($overrides['sss'])) {
            $sssBasis = !empty($config->sss_basis_basic_pay) ? $basicPay : $grossPay;
            $sssBracket = PayrollSSSConfig::query()->where('is_active', true)->where('min_wage', '<=', $sssBasis)
                ->where(fn($q) => $q->whereNull('max_wage')->orWhere('max_wage', '>=', $sssBasis))
                ->where(fn($q) => $q->whereNull('effective_date')->orWhereDate('effective_date', '<=', $periodDate))
                ->where(fn($q) => $q->whereNull('end_date')->orWhereDate('end_date', '>=', $periodDate))
                ->orderByDesc('min_wage')->first();

            if ($sssBracket) {
                $sssAddOn = (float) ($config->sss_add_on ?? 0);
                $result['sss_ee'] = $this->money((float)$sssBracket->ee_share + $sssAddOn);
                $result['sss_er_base'] = $this->money((float)$sssBracket->er_share);
                $result['ecc_er'] = $this->money((float)$sssBracket->ec_share);
                $result['sss_er'] = $this->money((float)$sssBracket->er_share + (float)$sssBracket->ec_share);
            }
        }

        // Pag-IBIG
        if ($pagibigEnabled && empty($overrides['pagibig'])) {
            $pagibigBasis = max(0, (float) $rate->monthly_rate);

            if (empty($config->pagibig_exclude_ecola)) {
                $ecolaRate = (float) ($ctx['ecola_rate'] ?? 0); // <-- SAFE ACCESS
                $daysPerMonth = (float) ($ctx['days_per_month'] ?? 26);
                $pagibigBasis += (($ctx['basis'] ?? 'daily') === 'monthly')
                    ? ($ecolaRate * 2)
                    : ($ecolaRate * $daysPerMonth);
            }

            $cutoffs = max(1, (int) ($ctx['cutoffs'] ?? 1));
            $bracket = PayrollPagibigConfig::query()->where('is_active', true)->where('min_wage', '<=', $pagibigBasis)
                ->where(fn($q) => $q->whereNull('max_wage')->orWhere('max_wage', '>=', $pagibigBasis))
                ->where(fn($q) => $q->whereNull('effective_date')->orWhereDate('effective_date', '<=', $periodDate))
                ->where(fn($q) => $q->whereNull('end_date')->orWhereDate('end_date', '>=', $periodDate))
                ->orderByDesc('min_wage')->first();

            if ($bracket) {
                $max = (float) ($bracket->pagibig_max ?? 0);
                $over = $pagibigBasis > self::PAGIBIG_THRESHOLD;
                $ee = $this->money(($over ? $max : (float)$bracket->pagibig_ee) / $cutoffs);
                $er = $this->money(($over ? $max : (float)$bracket->pagibig_er) / $cutoffs);
                if (number_format($er, 2, '.', '') === '0.02') { $ee = 0.00; $er = 0.00; }
                if (($ctx['basis'] ?? 'daily') === 'monthly' && (!empty($config->pagibig_half_sss_pay) || !($rate->sss_ded_is_monthly ?? false))) {
                    $ee = $er = (float) ($config->pagibig_fixed_monthly ?? self::PAGIBIG_FIXED_MONTHLY);
                }
                if (($ctx['basis'] ?? 'daily') === 'weekly') {
                    $ee = $er = (float) ($config->pagibig_fixed_weekly ?? self::PAGIBIG_FIXED_WEEKLY);
                }
                $result['pagibig_ee'] = $this->money($ee);
                $result['pagibig_er'] = $this->money($er);
            }
        }

        // PHILHEALTH (Legacy Accurate: EVERY CUTOFF)
        if ($philhealthEnabled && empty($overrides['philhealth'])) {
            $monthlyBasis = max(0, (float) $rate->monthly_rate);
            if ($monthlyBasis > 0) {
                [$employeeShare, $employerShare] = $this->lookupPhilhealth($monthlyBasis, $periodDate);
                $cutoffs = max(1, (int) ($ctx['cutoffs'] ?? 1));
                $employeeShare = round($employeeShare / $cutoffs, 2);
                $employerShare = round($employerShare / $cutoffs, 2);
                if ($employeeShare > 0) $employeeShare += (float) ($config->philhealth_add_on ?? 0);

                $result['philhealth_ee'] = $this->money($employeeShare);
                $result['philhealth_er'] = $this->money($employerShare);
            }
        }

        // Manual overrides
        $manualOverrides = [
            'sss' => ['ee' => 'sss_ee', 'er' => 'sss_er', 'flag' => $config->withhold_sss ?? null],
            'pagibig' => ['ee' => 'pagibig_ee', 'er' => 'pagibig_er', 'flag' => $config->withhold_pagibig ?? null],
            'philhealth' => ['ee' => 'philhealth_ee', 'er' => 'philhealth_er', 'flag' => $config->withhold_philhealth ?? null],
        ];

        foreach ($manualOverrides as $name => $fields) {
            if (empty($overrides[$name]) || !$this->isContributionEnabled($fields['flag'])) continue;
            $result[$fields['ee']] = $this->money($inputs[$fields['ee']] ?? 0);
            $result[$fields['er']] = $this->money($inputs[$fields['er']] ?? 0);
        }

        $result['debug']['warnings'] = array_values(array_unique($this->warnings));
        return $result;
    }

    private function lookupPhilhealth(float $monthlyBasis, string $periodDate): array
    {
        if (config('payroll.philhealth_use_table', false)) {
            $bracket = PayrollPhilhealthConfig::query()->where('is_active', true)->where('min_wage', '<=', $monthlyBasis)
                ->where(fn($q) => $q->whereNull('max_wage')->orWhere('max_wage', '>=', $monthlyBasis))->orderByDesc('min_wage')->first();
            if ($bracket) return [(float) $bracket->ph_ee, (float) $bracket->ph_er];
        }
        if ($monthlyBasis <= self::PH_FLOOR_BASIS) return [self::PH_FLOOR_SHARE, self::PH_FLOOR_SHARE];
        if ($monthlyBasis >= self::PH_CEILING_BASIS) return [self::PH_CEILING_SHARE, self::PH_CEILING_SHARE];
        $share = ($monthlyBasis * self::PH_RATE) / 2;
        return [$share, $share];
    }

    private function isContributionEnabled($value): bool { return $value === null ? true : (bool) $value; }
    private function money($value): float { return round((float) $value, 2); }
}