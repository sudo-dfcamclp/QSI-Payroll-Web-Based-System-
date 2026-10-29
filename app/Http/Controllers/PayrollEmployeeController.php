<?php

namespace App\Http\Controllers;

use App\Models\ClientMaster;
use App\Models\EmployeeMaster;
use App\Models\EmployeePayroll;
use App\Models\PayrollPeriod;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PayrollEmployeeController extends Controller
{
    public function getEmployeesWithBasicRates(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'client_id' => ['required', 'integer', 'min:1'],
            'period_id' => ['required', 'integer', 'min:1'],
        ]);

        // 1. Find client.
        $client = ClientMaster::query()
            ->where('client_id', $validated['client_id'])
            ->first();

        if (!$client) {
            return response()->json([
                'success' => false,
                'message' => 'Client not found.',
            ], 404);
        }

        // 2. Validate selected cutoff belongs to the client.
        $period = PayrollPeriod::query()
            ->where('period_id', $validated['period_id'])
            ->where(function ($query) use ($client) {
                $query->where('client_id', $client->client_id);

                if (trim((string) ($client->legacy_client_id ?? '')) !== '') {
                    $query->orWhere(function ($legacyQuery) use ($client) {
                        $legacyQuery
                            ->whereNull('client_id')
                            ->where(
                                'legacy_client_id',
                                $client->legacy_client_id
                            );
                    });
                }
            })
            ->first();

        if (!$period) {
            return response()->json([
                'success' => false,
                'message' => 'Cutoff not found for the selected client.',
            ], 404);
        }

        /*
         * 3. Get payroll transactions for the selected cutoff and client.
         *
         * Legacy matching uses EmployeeNum only.
         * Do not require legacy_client_id to be present for a match.
         */
        $payrollRows = EmployeePayroll::query()
            ->where('period_id', $period->period_id)
            ->where(function ($query) use ($client) {
                $query->where('client_id', $client->client_id);

                if (trim((string) ($client->legacy_client_id ?? '')) !== '') {
                    $query->orWhere(function ($legacyQuery) use ($client) {
                        $legacyQuery
                            ->whereNull('client_id')
                            ->where(
                                'legacy_client_id',
                                $client->legacy_client_id
                            );
                    });
                }
            })
            ->get([
                'client_id',
                'emp_id',
                'employee_num',
            ]);

        /*
         * 4. Build lookup sets.
         *
         * Legacy key: employee_num
         * New-system key: client_id + emp_id
         */
        $payrollEmployeeNums = [];
        $payrollEmployeeIds = [];

        foreach ($payrollRows as $payroll) {
            $employeeNum = trim(
                (string) ($payroll->employee_num ?? '')
            );

            if ($employeeNum !== '') {
                $payrollEmployeeNums[$employeeNum] = true;
            }

            if (
                $payroll->client_id !== null &&
                $payroll->emp_id !== null
            ) {
                $key = $payroll->client_id . '|' . $payroll->emp_id;
                $payrollEmployeeIds[$key] = true;
            }
        }

        /*
         * 5. Retrieve eligible employees.
         *
         * - Belongs to selected client.
         * - employment_status is not NULL.
         * - Exclude T, W, X, Y, Z.
         * - Has an active basic rate (employee_status = 1).
         */
        $employees = EmployeeMaster::query()
            ->where(function ($query) use ($client) {
                $query->where(
                    'employee_master.client_id',
                    $client->client_id
                );

                if (trim((string) ($client->legacy_client_id ?? '')) !== '') {
                    $query->orWhere(function ($legacyQuery) use ($client) {
                        $legacyQuery
                            ->whereNull('employee_master.client_id')
                            ->where(
                                'employee_master.legacy_client_id',
                                $client->legacy_client_id
                            );
                    });
                }
            })
            ->whereNotNull('employee_master.employment_status')
            ->whereRaw(
                "UPPER(TRIM(employee_master.employment_status))
                    NOT IN ('T', 'W', 'X', 'Y', 'Z')"
            )
            ->whereHas('basicRates', function ($query) {
                $query->where(
                    'employee_basic_rate.employee_status',
                    1
                );
            })
            ->select([
                'employee_master.emp_id',
                'employee_master.client_id',
                'employee_master.legacy_client_id',
                'employee_master.employee_num',
                'employee_master.last_name',
                'employee_master.first_name',
                'employee_master.middle_name',
                'employee_master.start_contract',
                'employee_master.end_contract',
                'employee_master.employment_status',
            ])
            ->with([
                'basicRates' => function ($query) {
                    $query
                        ->where(
                            'employee_basic_rate.employee_status',
                            1
                        )
                        ->orderByDesc(
                            'employee_basic_rate.effective_date'
                        );
                },
            ])
            ->orderBy('employee_master.last_name')
            ->orderBy('employee_master.first_name')
            ->get();

        /*
         * 6. Classify Pending / Done.
         *
         * Done:
         *   A payroll transaction exists for this employee
         *   in the selected cutoff.
         *
         * Pending:
         *   No matching payroll transaction exists for this cutoff.
         */
        $pending = [];
        $done = [];

        foreach ($employees as $employee) {
            $employeeNum = trim(
                (string) ($employee->employee_num ?? '')
            );

            $isDone = false;

            // First: legacy EmployeeNum match.
            if (
                $employeeNum !== '' &&
                isset($payrollEmployeeNums[$employeeNum])
            ) {
                $isDone = true;
            }

            // Fallback: new-system employee identifiers.
            if (
                !$isDone &&
                $employee->client_id !== null &&
                $employee->emp_id !== null
            ) {
                $key = $employee->client_id . '|' . $employee->emp_id;

                $isDone = isset($payrollEmployeeIds[$key]);
            }

            $employee->payroll_status = $isDone ? 'done' : 'pending';

            if ($isDone) {
                $done[] = $employee;
            } else {
                $pending[] = $employee;
            }
        }

        // 7. Return response.
        return response()->json([
            'success' => true,
            'pending' => $pending,
            'done' => $done,
            'pending_count' => count($pending),
            'done_count' => count($done),
            'total_count' => count($employees),
        ]);
    }
}
