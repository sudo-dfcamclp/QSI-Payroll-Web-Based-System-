<?php

namespace App\Services\Payroll;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class OtherDeductionService
{
    /**
     * Retrieve active employee deductions applicable
     * to the selected payroll cutoff.
     */
    public function getForPayroll(
        int $empId,
        int $clientId,
        string $cutoffStart,
        string $cutoffEnd
    ): Collection {
        $deductions = DB::table('employee_deductions as ed')
            ->leftJoin(
                'deduction_types as dt',
                'dt.id',
                '=',
                'ed.deduction_type_id'
            )
            ->where('ed.emp_id', $empId)
            ->where('ed.client_id', $clientId)
            ->where('ed.status', 0)
            ->where('ed.balance', '>', 0)
            ->where('ed.payment', '>', 0)
            ->where(function ($query) use ($cutoffStart, $cutoffEnd) {
                $query
                    ->where(function ($q) use ($cutoffStart) {
                        $q->whereDate('ed.start_date', '<=', $cutoffStart)
                          ->whereDate('ed.end_date', '>=', $cutoffStart);
                    })
                    ->orWhere(function ($q) use ($cutoffEnd) {
                        $q->whereDate('ed.start_date', '<=', $cutoffEnd)
                          ->whereDate('ed.end_date', '>=', $cutoffEnd);
                    });
            })
            ->select([
                'ed.id',
                'ed.emp_id',
                'ed.client_id',
                'ed.deduction_type_id',
                'ed.payment',
                'ed.total_amount',
                'ed.balance',
                'ed.start_date',
                'ed.end_date',
                'ed.status',
                'dt.title as deduction_type_title',
            ])
            ->orderBy('ed.id')
            ->get();

        return $deductions
            ->map(function ($deduction) {
                $payment = max(0, (float) $deduction->payment);
                $balance = max(0, (float) $deduction->balance);

                // Actual payroll deduction cannot exceed remaining balance.
                $deduction->amount = round(
                    min($payment, $balance),
                    2
                );

                // Type expected by PayrollComputationService.
                $deduction->type = $deduction->deduction_type_title
                    ?? 'Other Deduction';

                return $deduction;
            })
            ->filter(fn ($deduction) => $deduction->amount > 0)
            ->values();
    }

    /**
     * Calculate total database Other Deductions.
     */
    public function calculateTotal(Collection $deductions): float
    {
        $total = 0;

        foreach ($deductions as $deduction) {
            $total += (float) ($deduction->amount ?? 0);
        }

        return round($total, 2);
    }

    public function applyBalancesAfterPayrollSaved(
        int $empId,
        int $clientId,
        array $deductions
    ): array {
        return DB::transaction(function () use (
            $empId,
            $clientId,
            $deductions
        ) {
            $updated = [];
            $processedIds = [];

            foreach ($deductions as $deduction) {
                // Support both arrays and objects.
                $deductionId = (int) (
                    is_array($deduction)
                        ? ($deduction['id'] ?? 0)
                        : ($deduction->id ?? 0)
                );

                $amount = round((float) (
                    is_array($deduction)
                        ? ($deduction['amount'] ?? 0)
                        : ($deduction->amount ?? 0)
                ), 2);

                if ($deductionId <= 0) {
                    throw ValidationException::withMessages([
                        'other_deductions' =>
                            'Invalid employee deduction ID.',
                    ]);
                }

                if (isset($processedIds[$deductionId])) {
                    throw ValidationException::withMessages([
                        'other_deductions' =>
                            'Duplicate employee deduction detected.',
                    ]);
                }

                $processedIds[$deductionId] = true;

                if (!is_finite($amount) || $amount < 0) {
                    throw ValidationException::withMessages([
                        'other_deductions' =>
                            'Invalid deduction amount.',
                    ]);
                }

                if ($amount == 0.00) {
                    continue;
                }

                $employeeDeduction = DB::table('employee_deductions')
                    ->where('id', $deductionId)
                    ->where('emp_id', $empId)
                    ->where('client_id', $clientId)
                    ->where('status', 0)
                    ->lockForUpdate()
                    ->first();

                if (!$employeeDeduction) {
                    throw new RuntimeException(
                        "Employee deduction ID {$deductionId} was not found or is no longer active."
                    );
                }

                $currentBalance = round(
                    (float) $employeeDeduction->balance,
                    2
                );

                if ($amount > $currentBalance) {
                    throw ValidationException::withMessages([
                        'other_deductions' =>
                            "Deduction amount exceeds the remaining balance for deduction ID {$deductionId}.",
                    ]);
                }

                $newBalance = round(
                    $currentBalance - $amount,
                    2
                );

                DB::table('employee_deductions')
                    ->where('id', $deductionId)
                    ->where('emp_id', $empId)
                    ->where('client_id', $clientId)
                    ->update([
                        'balance' => $newBalance,
                        'updated_at' => now(),
                    ]);

                $updated[] = [
                    'id' => $deductionId,
                    'deducted_amount' => $amount,
                    'previous_balance' => $currentBalance,
                    'remaining_balance' => $newBalance,
                ];
            }

            return $updated;
        });
    }
}
