<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\Payroll\PayrollComputationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Throwable;

class PayrollComputationController extends Controller
{
    public function __construct(
        private PayrollComputationService $payrollComputationService
    ) {}

    public function preview(Request $request)
    {
        $validated = $request->validate([
            'client_id' => ['required', 'integer'],
            'period_id' => ['required', 'integer'],
            'emp_id' => ['required', 'integer'],
            'inputs' => ['nullable', 'array'],
            'inputs.days_present' => ['nullable', 'numeric', 'min:0'],
            'inputs.days_absent' => ['nullable', 'numeric', 'min:0'],
            'inputs.hours_worked' => ['nullable', 'numeric', 'min:0'],
            'inputs.tardy_hrs' => ['nullable', 'numeric', 'min:0'],
            'inputs.ot_hrs' => ['nullable', 'numeric', 'min:0'],
            'inputs.excess_ot_hrs' => ['nullable', 'numeric', 'min:0'],
            'inputs.night_diff_ot' => ['nullable', 'numeric', 'min:0'],
            'inputs.rest_day_ot_hrs' => ['nullable', 'numeric', 'min:0'],
            'inputs.sunday_ot' => ['nullable', 'numeric', 'min:0'],
            'inputs.ot_no_prem_hrs' => ['nullable', 'numeric', 'min:0'],
            'inputs.sp_hol_hrs' => ['nullable', 'numeric', 'min:0'],
            'inputs.sp_hol_ot_hrs' => ['nullable', 'numeric', 'min:0'],
            'inputs.excess_sp_hol_ot_hrs' => ['nullable', 'numeric', 'min:0'],
            'inputs.excess_sun_sp_ot_hrs' => ['nullable', 'numeric', 'min:0'],
            'inputs.leg_hol_hrs' => ['nullable', 'numeric', 'min:0'],
            'inputs.leg_hol_ot_hrs' => ['nullable', 'numeric', 'min:0'],
            'inputs.excess_leg_hol_ot_hrs' => ['nullable', 'numeric', 'min:0'],
            'inputs.excess_sun_leg_ot_hrs' => ['nullable', 'numeric', 'min:0'],
            'inputs.vl_days' => ['nullable', 'numeric', 'min:0'],
            'inputs.sl_days' => ['nullable', 'numeric', 'min:0'],
            'inputs.vl_pay' => ['nullable', 'numeric', 'min:0'],
            'inputs.sl_pay' => ['nullable', 'numeric', 'min:0'],
            'inputs.salary_adj' => ['nullable', 'numeric'],
            'inputs.incentive_pay' => ['nullable', 'numeric'],
            'inputs.ecola_pay' => ['nullable', 'numeric', 'min:0'],
            'inputs.thirteenth_month_pay' => ['nullable', 'numeric', 'min:0'],
            'inputs.allowance' => ['nullable', 'numeric', 'min:0'],
            'inputs.load_allow' => ['nullable', 'numeric', 'min:0'],
            'inputs.meal_allow' => ['nullable', 'numeric', 'min:0'],
            'inputs.transpo_allow' => ['nullable', 'numeric', 'min:0'],
            'inputs.other_deductions' => ['nullable', 'array'],
            'inputs.other_deductions.*.type' => ['nullable', 'string', 'max:255'],
            'inputs.other_deductions.*.amount' => ['required', 'numeric', 'min:0'],
            // Include switches in validation
            'inputs.deduct_sss' => ['nullable', 'boolean'],
            'inputs.deduct_pagibig' => ['nullable', 'boolean'],
            'inputs.deduct_philhealth' => ['nullable', 'boolean'],
        ]);

        try {
            $result = $this->payrollComputationService->compute($validated);
            
            // KUNIN ANG SWITCHES DIREKTA SA INPUTS (kung ano ang pinindot ng user), HINDI SA RESULT
            $deductSss = array_key_exists('deduct_sss', $validated['inputs'] ?? []) ? $validated['inputs']['deduct_sss'] : true;
            $deductPagibig = array_key_exists('deduct_pagibig', $validated['inputs'] ?? []) ? $validated['inputs']['deduct_pagibig'] : true;
            $deductPhilhealth = array_key_exists('deduct_philhealth', $validated['inputs'] ?? []) ? $validated['inputs']['deduct_philhealth'] : true;

            // I-save ang switches sa employee_payroll_settings
            DB::table('employee_payroll_settings')->updateOrInsert(
                [
                    'emp_id' => $validated['emp_id'],
                    'period_id' => $validated['period_id'],
                ],
                [
                    'client_id' => $validated['client_id'],
                    'deduct_sss' => (bool) $deductSss,
                    'deduct_pagibig' => (bool) $deductPagibig,
                    'deduct_philhealth' => (bool) $deductPhilhealth,
                    'deduct_tax' => true,
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Payroll computation completed.',
                'data' => $result,
            ]);

        } catch (ValidationException $e) {
            throw $e;
        } catch (Throwable $e) {
            report($e);
            return response()->json([
                'success' => false,
                'message' => 'Unable to compute payroll. Error: ' . $e->getMessage(),
            ], 500);
        }
    }
}