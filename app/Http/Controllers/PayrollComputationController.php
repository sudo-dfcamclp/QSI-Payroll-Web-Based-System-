<?php

namespace App\Http\Controllers;

use App\Models\EmployeePayroll;
use App\Models\PayrollPeriod;
use App\Services\Payroll\PayrollComputationService;
use App\Services\Payroll\OtherDeductionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Throwable;

class PayrollComputationController extends Controller
{
    // Initialize payroll computation service.
    public function __construct(
        private PayrollComputationService $payrollComputationService,
        private OtherDeductionService $otherDeductionService
    ) {}

    // Validate inputs and return payroll preview.
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
            'inputs.salary_adj' => ['nullable', 'numeric'],
            'inputs.incentive_pay' => ['nullable', 'numeric'],
            'inputs.thirteenth_month_pay' => ['nullable', 'numeric', 'min:0'],
            'inputs.allowance' => ['nullable', 'numeric', 'min:0'],
            'inputs.load_allow' => ['nullable', 'numeric', 'min:0'],
            'inputs.meal_allow' => ['nullable', 'numeric', 'min:0'],
            'inputs.transpo_allow' => ['nullable', 'numeric', 'min:0'],
            'inputs.sss_ee' => ['nullable', 'numeric', 'min:0'],
            'inputs.sss_er' => ['nullable', 'numeric', 'min:0'],
            'inputs.pagibig_ee' => ['nullable', 'numeric', 'min:0'],
            'inputs.pagibig_er' => ['nullable', 'numeric', 'min:0'],
            'inputs.philhealth_ee' => ['nullable', 'numeric', 'min:0'],
            'inputs.philhealth_er' => ['nullable', 'numeric', 'min:0'],

            'inputs.other_deductions' => ['nullable', 'array'],
            'inputs.other_deductions.*.id' => ['nullable', 'integer', 'min:1'],
            'inputs.other_deductions.*.type' => ['nullable', 'string', 'max:255'],
            'inputs.other_deductions.*.amount' => ['required', 'numeric', 'min:0'],

            'inputs.deduct_sss' => ['nullable', 'boolean'],
            'inputs.deduct_pagibig' => ['nullable', 'boolean'],
            'inputs.deduct_philhealth' => ['nullable', 'boolean'],
        ]);

        try {
            $result = $this->payrollComputationService->compute($validated);

            $deductSss = array_key_exists('deduct_sss', $validated['inputs'] ?? [])
                ? $validated['inputs']['deduct_sss'] : true;

            $deductPagibig = array_key_exists('deduct_pagibig', $validated['inputs'] ?? [])
                ? $validated['inputs']['deduct_pagibig'] : true;

            $deductPhilhealth = array_key_exists('deduct_philhealth', $validated['inputs'] ?? [])
                ? $validated['inputs']['deduct_philhealth'] : true;

            DB::table('employee_payroll_settings')->updateOrInsert(
                [
                    'emp_id' => $validated['emp_id'],
                    'period_id' => $validated['period_id'],
                    'client_id' => $validated['client_id'],
                ],
                [
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

    // Retrieve saved payroll earnings, absent, and tardiness.
    public function getSavedPayroll(Request $request)
    {
        $validated = $request->validate([
            'client_id' => ['required', 'integer'],
            'period_id' => ['required', 'integer'],
            'emp_id' => ['required', 'integer'],
        ]);

        try {
            $payroll = EmployeePayroll::query()
                ->where('client_id', $validated['client_id'])
                ->where('period_id', $validated['period_id'])
                ->where('emp_id', $validated['emp_id'])
                ->orderByDesc('payroll_id')
                ->first();

            if (!$payroll) {
                return response()->json([
                    'success' => false,
                    'message' => 'No saved payroll record found for this employee.',
                ], 404);
            }

            $period = PayrollPeriod::query()
                ->where('client_id', $validated['client_id'])
                ->where('period_id', $validated['period_id'])
                ->firstOrFail();

            $otherDeductions = $this->otherDeductionService->getForPayroll(
                (int) $validated['emp_id'],
                (int) $validated['client_id'],
                $period->start_date->toDateString(),
                $period->end_date->toDateString()
            );

            return response()->json([
                'success' => true,
                'message' => 'Saved payroll retrieved successfully.',
                'other_deductions' => $otherDeductions,

                'data' => [
                    // Raw saved values needed to restore payroll form inputs.
                    'payroll' => $payroll->only([
                        'days_present',
                        'basic_pay',

                        'ot_hrs',
                        'ot_pay',
                        'excess_ot_hrs',
                        'excess_ot_pay',

                        'night_diff_ot',
                        'night_diff_pay',

                        'rest_day_ot_hrs',
                        'rest_day_ot_pay',
                        'sunday_ot',
                        'sunday_ot_pay',

                        'sp_hol_days',
                        'sp_hol_pay',
                        'sp_hol_ot_hrs',
                        'sp_hol_ot_pay',
                        'excess_sp_hol_ot_hrs',
                        'excess_sp_hol_ot_pay',
                        'excess_sun_sp_hrs',
                        'excess_sun_sp_pay',

                        'leg_hol_days',
                        'leg_hol_pay',
                        'leg_hol_ot_hrs',
                        'leg_hol_ot_pay',
                        'excess_leg_hol_ot_hrs',
                        'excess_leg_hol_ot_pay',
                        'excess_sun_leg_ot_hrs',
                        'excess_sun_leg_ot_pay',

                        'ot_no_prem_hrs',
                        'ot_no_prem_pay',

                        'vl_days',
                        'vl_pay',
                        'sl_days',
                        'sl_pay',

                        'salary_adj',
                        'incentive_pay',
                        'incentive_remarks',
                        'ecola_pay',
                        'm13_rate',
                        'm13_pay',

                        'allowance',
                        'load_allow',
                        'meal_allow',
                        'transpo_allow',

                        'gross_pay',

                        'days_absent',
                        'absent_ded',
                        'tardy_hrs',
                        'tardy_ded',
                    ]),

                    // Earnings aliases used by the payroll preview.
                    'earnings' => [
                        'basic_pay' => $payroll->basic_pay,

                        'regular_ot_pay' => $payroll->ot_pay,
                        'night_diff_pay' => $payroll->night_diff_pay,

                        'rest_day_ot_pay' => $payroll->rest_day_ot_pay,
                        'sunday_ot_pay' => $payroll->sunday_ot_pay,

                        'special_holiday_pay' => $payroll->sp_hol_pay,
                        'special_holiday_ot_pay' => $payroll->sp_hol_ot_pay,

                        'excess_ot_pay' => $payroll->excess_ot_pay,
                        'excess_sun_special_ot_pay' => $payroll->excess_sun_sp_pay,

                        'regular_holiday_pay' => $payroll->leg_hol_pay,
                        'regular_holiday_ot_pay' => $payroll->leg_hol_ot_pay,

                        'excess_legal_hol_ot_pay' => $payroll->excess_leg_hol_ot_pay,
                        'excess_sun_legal_ot_pay' => $payroll->excess_sun_leg_ot_pay,

                        'sick_leave_pay' => $payroll->sl_pay,
                        'vacation_leave_pay' => $payroll->vl_pay,

                        'allowance' => $payroll->allowance,
                        'load_allow' => $payroll->load_allow,
                        'meal_allow' => $payroll->meal_allow,
                        'transpo_allow' => $payroll->transpo_allow,

                        'salary_adjustment' => $payroll->salary_adj,
                        'incentive_pay' => $payroll->incentive_pay,
                        'ecola_pay' => $payroll->ecola_pay,
                        'thirteenth_month_pay' => $payroll->m13_pay,
                    ],

                    // Only absent and tardiness deductions for this test.
                    'deductions' => [
                        'absent_ded' => $payroll->absent_ded,
                        'tardy_ded' => $payroll->tardy_ded,
                    ],

                    // Actual absent and tardiness quantities.
                    'attendance' => [
                        'days_present' => $payroll->days_present,
                        'days_absent' => $payroll->days_absent,
                        'tardy_hrs' => $payroll->tardy_hrs,
                    ],
                ],
            ]);
        } catch (Throwable $e) {
            report($e);

            return response()->json([
                'success' => false,
                'message' => 'Unable to retrieve saved payroll. Error: ' . $e->getMessage(),
            ], 500);
        }
    }
}
