<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\Payroll\PayrollComputationService;
use Illuminate\Http\Request;
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

            // Attendance
            'inputs.days_present' => ['nullable', 'numeric', 'min:0'],
            'inputs.days_absent' => ['nullable', 'numeric', 'min:0'],
            'inputs.hours_worked' => ['nullable', 'numeric', 'min:0'],
            'inputs.tardy_hrs' => ['nullable', 'numeric', 'min:0'],

            // Overtime
            'inputs.ot_hrs' => ['nullable', 'numeric', 'min:0'],
            'inputs.excess_ot_hrs' => ['nullable', 'numeric', 'min:0'],
            'inputs.night_diff_ot' => ['nullable', 'numeric', 'min:0'],
            'inputs.rest_day_ot_hrs' => ['nullable', 'numeric', 'min:0'],
            'inputs.sunday_ot' => ['nullable', 'numeric', 'min:0'],
            'inputs.ot_no_prem_hrs' => ['nullable', 'numeric', 'min:0'],

            // Holidays
            'inputs.sp_hol_days' => ['nullable', 'numeric', 'min:0'],
            'inputs.sp_hol_ot_hrs' => ['nullable', 'numeric', 'min:0'],
            'inputs.excess_sp_hol_ot_hrs' => ['nullable', 'numeric', 'min:0'],
            'inputs.leg_hol_days' => ['nullable', 'numeric', 'min:0'],
            'inputs.leg_hol_ot_hrs' => ['nullable', 'numeric', 'min:0'],
            'inputs.excess_leg_hol_ot_hrs' => ['nullable', 'numeric', 'min:0'],
            'inputs.excess_sun_leg_ot_hrs' => ['nullable', 'numeric', 'min:0'],

            // Leave
            'inputs.vl_days' => ['nullable', 'numeric', 'min:0'],
            'inputs.sl_days' => ['nullable', 'numeric', 'min:0'],
            'inputs.vl_pay' => ['nullable', 'numeric', 'min:0'],
            'inputs.sl_pay' => ['nullable', 'numeric', 'min:0'],

            // Earnings
            'inputs.salary_adj' => ['nullable', 'numeric'],
            'inputs.incentive_pay' => ['nullable', 'numeric'],
            'inputs.ecola_pay' => ['nullable', 'numeric', 'min:0'],
            'inputs.thirteenth_month_pay' => ['nullable', 'numeric', 'min:0'],
            'inputs.allowance' => ['nullable', 'numeric', 'min:0'],

            // L - Load Allowance
            'inputs.load_allow' => ['nullable', 'numeric', 'min:0'],

            // M - Meal Allowance
            'inputs.meal_allow' => ['nullable', 'numeric', 'min:0'],

            // T - Transportation Allowance
            'inputs.transpo_allow' => ['nullable', 'numeric', 'min:0'],

            // Other deductions
            'inputs.other_deductions' => ['nullable', 'array'],
            'inputs.other_deductions.*.type' => [
                'nullable',
                'string',
                'max:255',
            ],
            'inputs.other_deductions.*.amount' => [
                'required',
                'numeric',
                'min:0',
            ],
        ]);

        try {
            $result = $this->payrollComputationService->compute($validated);

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
                'message' => 'Unable to compute payroll.',
            ], 500);
        }
    }
}