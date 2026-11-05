<?php

namespace App\Services\Payroll;

use App\Models\CutoffConfig;
use App\Models\PayrollTaxConfig;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class TaxService
{
    /** @var string[] */
    private array $warnings = [];

    public function compute($employee, $rate, $config, $period, float $taxableIncome, float $otPayExcludedWhenOtNoTax, array $data, $minWageRate): array
    {
        $this->warnings = [];

        $result = [
            'amount' => 0.00,
            'debug' => ['warnings' => []]
        ];

        if (empty($config->withhold_tax)) {
            return $result;
        }

        $expTax = (float) $rate->exp_tax;
        $minWageEarner = (float) $rate->daily_rate < (float) $minWageRate;
        $eligible = ($this->isLastCutoff($period) && !$minWageEarner) || $expTax > 0;

        if (!$eligible) {
            return $result;
        }

        $taxable = $taxableIncome;

        if ($rate->ot_no_tax) {
            $taxable -= $otPayExcludedWhenOtNoTax;
        }

        $tax = 0.0;

        if (!empty($config->tax_percent_flag)) {
            $tax = $taxable * ((float) ($config->tax_percentage ?? 0) / 100);
        } elseif ($taxable > 1) {
            $previousGross = $this->resolvePreviousGross($employee, $period, $data);
            $amount = $taxable + $previousGross;

            $bracket = $this->findTaxBracket(config('payroll.tax_table_code', 'Monthly'), $amount)
                ?? $this->findTaxBracket((string) $rate->tax_code, $amount);

            if ($bracket) {
                $tax = ($amount - (float) $bracket->sal_rate2) * (float) $bracket->per_over + (float) $bracket->base_tax;
            } else {
                $this->warnings[] = 'TAX_NO_BRACKET: no tax_table row for amount ' . $amount . '.';
            }
        }

        if ($expTax > 0) {
            $tax = (float) $rate->monthly_rate * $expTax / 2;
        }

        $result['amount'] = $this->money(max(0, $tax));
        $result['debug']['warnings'] = array_values(array_unique($this->warnings));

        return $result;
    }

    private function findTaxBracket(string $taxCode, float $amount)
    {
        return PayrollTaxConfig::query()
            ->where('tax_code', $taxCode)
            ->where('sal_rate2', '<=', $amount)
            ->orderByDesc('sal_rate2')
            ->first();
    }

    private function resolvePreviousGross($employee, $period, array $data): float
    {
        if (array_key_exists('previous_gross', $data) && $data['previous_gross'] !== null) {
            return (float) $data['previous_gross'];
        }

        if (!$period->start_date || !$period->end_date) {
            return 0.0;
        }

        $start = Carbon::parse($period->start_date)->startOfDay();
        $end = Carbon::parse($period->end_date)->startOfDay();

        $lastEnd = $start->diffInDays($end) <= 7
            ? $start->copy()->subDays(21)
            : $start->copy()->subDay();

        try {
            $value = DB::table('employee_payroll as ep')
                ->join('payroll_period as pp', 'pp.period_id', '=', 'ep.period_id')
                ->where('ep.emp_id', $employee->emp_id)
                ->where('ep.period_id', '!=', $period->period_id)
                ->whereDate('pp.end_date', '>=', $lastEnd->toDateString())
                ->whereDate('pp.end_date', '<', $start->toDateString())
                ->selectRaw(
                    'COALESCE(SUM(ep.gross_pay), 0)'
                    . ' - (COALESCE(SUM(ep.sss_ee), 0) + COALESCE(SUM(ep.philhealth_ee), 0) + COALESCE(SUM(ep.pagibig_ee), 0))'
                    . ' AS previous_gross'
                )
                ->value('previous_gross');

            return (float) ($value ?? 0);
        } catch (Throwable $e) {
            Log::warning('Unable to resolve previous gross', ['error' => $e->getMessage()]);
            $this->warnings[] = 'PREVIOUS_GROSS_UNAVAILABLE: ' . $e->getMessage();
            return 0.0;
        }
    }

    private function isLastCutoff($period): bool
    {
        return $this->matchesCutoffPair($period, 'l');
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