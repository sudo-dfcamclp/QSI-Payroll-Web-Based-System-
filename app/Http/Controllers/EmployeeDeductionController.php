<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ClientMaster;
use App\Models\DeductionTypes;
use App\Models\EmployeeDeductions;
use App\Models\EmployeeDeductionPayment;
use App\Models\EmployeeMaster;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Throwable;

class EmployeeDeductionController extends Controller
{
    private const EXCLUDED_EMPLOYMENT_STATUSES = ['T', 'W', 'X', 'Y', 'Z'];
    private const ACTIVE_EMPLOYEE_STATUS = 1;
    private const PER_PAGE = 15; // <-- FIXED: 15 items per page

    // =========================================================
    // 0. Client list — WITH PAGINATION (15 per page)
    // =========================================================
    public function clients(Request $request)
    {
        try {
            $page   = max(1, (int) $request->input('page', 1));
            $search = trim((string) $request->input('search', ''));

            $query = ClientMaster::query()
                ->select(['client_id', 'client_name'])
                ->where('status', 'active')
                ->when($search !== '', function ($q) use ($search) {
                    $q->where('client_name', 'like', '%' . $search . '%');
                })
                ->orderBy('client_name');

            $total   = (clone $query)->count();
            $clients = $query
                ->skip(($page - 1) * self::PER_PAGE)
                ->take(self::PER_PAGE)
                ->get();

            $lastPage = $total > 0 ? (int) ceil($total / self::PER_PAGE) : 1;
            $from     = $total > 0 ? (($page - 1) * self::PER_PAGE) + 1 : 0;
            $to       = $total > 0 ? min($page * self::PER_PAGE, $total) : 0;

            return response()->json([
                'success' => true,
                'data'    => $clients,
                'meta'    => [
                    'current_page' => $page,
                    'last_page'    => $lastPage,
                    'per_page'     => self::PER_PAGE,
                    'total'        => $total,
                    'from'         => $from,
                    'to'           => $to,
                ],
            ]);
        } catch (Throwable $e) {
            report($e);
            return response()->json([
                'success' => false,
                'message' => 'Unable to load clients. Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    // =========================================================
    // 1. Deduction types
    // =========================================================
    public function types()
    {
        try {
            $types = DeductionTypes::where('status', true)
                ->orderBy('title')
                ->get();

            return response()->json([
                'success' => true,
                'data'    => $types,
            ]);
        } catch (Throwable $e) {
            report($e);
            return response()->json(['success' => false, 'message' => 'Unable to load deduction types.'], 500);
        }
    }

    // =========================================================
    // 1.5 Employees by client — WITH PAGINATION (15 per page)
    // =========================================================
    public function employeesByClient(Request $request, $client_id)
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'page'   => ['nullable', 'integer', 'min:1'],
        ]);

        try {
            $page   = max(1, (int) ($validated['page'] ?? 1));
            $search = trim((string) ($validated['search'] ?? ''));

            $query = EmployeeMaster::query()
                ->select([
                    'employee_master.emp_id',
                    'employee_master.employee_num',
                    'employee_master.first_name',
                    'employee_master.middle_name',
                    'employee_master.last_name',
                    'employee_master.employment_status',
                    'employee_master.status',
                    'employee_master.client_id',
                ])
                ->where('employee_master.client_id', $client_id)
                ->whereNotIn('employee_master.employment_status', self::EXCLUDED_EMPLOYMENT_STATUSES)
                ->whereExists(function ($sub) {
                    $sub->select(DB::raw(1))
                        ->from('employee_basic_rate')
                        ->whereColumn('employee_basic_rate.emp_id', 'employee_master.emp_id')
                        ->where('employee_basic_rate.employee_status', self::ACTIVE_EMPLOYEE_STATUS)
                        ->whereRaw('employee_basic_rate.rate_id = (
                            SELECT MAX(rate_id)
                            FROM employee_basic_rate AS ebr2
                            WHERE ebr2.emp_id = employee_basic_rate.emp_id
                        )');
                });

            if ($search !== '') {
                $query->where(function ($q) use ($search) {
                    $q->where('employee_master.first_name', 'like', "%{$search}%")
                      ->orWhere('employee_master.last_name', 'like', "%{$search}%")
                      ->orWhere('employee_master.middle_name', 'like', "%{$search}%")
                      ->orWhere('employee_master.employee_num', 'like', "%{$search}%");
                });
            }

            $query->orderBy('employee_master.last_name', 'asc')
                  ->orderBy('employee_master.first_name', 'asc');

            $total = (clone $query)->count();
            $rows  = $query
                ->skip(($page - 1) * self::PER_PAGE)
                ->take(self::PER_PAGE)
                ->get();

            $employees = $rows->map(function ($emp) {
                return [
                    'emp_id'            => $emp->emp_id,
                    'full_name'         => trim("{$emp->last_name}, {$emp->first_name} {$emp->middle_name}"),
                    // Tinanggal ang 'employment_status' dito para hindi na mapasa sa JS
                ];
            });

            $lastPage = $total > 0 ? (int) ceil($total / self::PER_PAGE) : 1;
            $from     = $total > 0 ? (($page - 1) * self::PER_PAGE) + 1 : 0;
            $to       = $total > 0 ? min($page * self::PER_PAGE, $total) : 0;

            return response()->json([
                'success' => true,
                'data'    => $employees,
                'meta'    => [
                    'current_page' => $page,
                    'last_page'    => $lastPage,
                    'per_page'     => self::PER_PAGE,
                    'total'        => $total,
                    'from'         => $from,
                    'to'           => $to,
                ],
            ]);
        } catch (Throwable $e) {
            report($e);
            return response()->json([
                'success' => false,
                'message' => 'Unable to load employees. Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    // =========================================================
    // 1.6 Employee details (top box)
    // =========================================================
    public function showEmployee($emp_id)
    {
        try {
            $employee = EmployeeMaster::with([
                'client',
                'basicRates' => fn($q) => $q->latest('rate_id')->limit(1),
            ])->findOrFail($emp_id);

            $rate = $employee->basicRates->first();

            return response()->json([
                'success' => true,
                'data' => [
                    'emp_id'            => $employee->emp_id,
                    'employee_num'      => $employee->employee_num,
                    'full_name'         => trim("{$employee->last_name}, {$employee->first_name} {$employee->middle_name}"),
                    'start_contract'    => $employee->start_contract?->format('Y-m-d'),
                    'end_contract'      => $employee->end_contract?->format('Y-m-d'),
                    'employment_status' => $employee->employment_status,
                    'month_no'          => $employee->month_no,
                    'rate_basis'        => $rate?->rate_basis,
                    'monthly_rate'      => $rate?->monthly_rate,
                    'daily_rate'        => $rate?->daily_rate,
                    'hourly_rate'       => $rate?->hourly_rate,
                    'client_name'       => $employee->client?->client_name,
                ],
            ]);
        } catch (Throwable $e) {
            report($e);
            return response()->json(['success' => false, 'message' => 'Employee not found.'], 404);
        }
    }

    // =========================================================
    // 2. Deductions by employee
    // =========================================================
    public function index(Request $request)
    {
        $validated = $request->validate([
            'emp_id' => ['required', 'integer'],
        ]);

        try {
            $deductions = EmployeeDeductions::with('deductionType')
                ->where('emp_id', $validated['emp_id'])
                ->orderByDesc('created_at')
                ->get();

            return response()->json([
                'success' => true,
                'data'    => $deductions,
                'count'   => $deductions->count(),
            ]);
        } catch (Throwable $e) {
            report($e);
            return response()->json(['success' => false, 'message' => 'Unable to load employee deductions.'], 500);
        }
    }

    // =========================================================
    // 3. Create deduction
    // =========================================================
    public function store(Request $request)
    {
        $validated = $request->validate([
            'emp_id'            => ['required', 'integer'],
            'client_id'         => ['required', 'integer'],
            'deduction_type_id' => ['required', 'integer'],
            'payment'           => ['required', 'numeric', 'min:0'],
            'total_amount'      => ['required', 'numeric', 'min:0'],
            'start_date'        => ['required', 'date'],
            'end_date'          => ['nullable', 'date', 'after_or_equal:start_date'],
        ]);

        try {
            DB::beginTransaction();

            $deduction = EmployeeDeductions::create([
                'emp_id'            => $validated['emp_id'],
                'client_id'         => $validated['client_id'],
                'deduction_type_id' => $validated['deduction_type_id'],
                'payment'           => $validated['payment'],
                'total_amount'      => $validated['total_amount'],
                'start_date'        => $validated['start_date'],
                'end_date'          => $validated['end_date'] ?? null,
                'status'            => 0,
                'entry_by'          => auth()->id() ?? 1,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Deduction added successfully.',
                'data'    => $deduction,
            ]);
        } catch (ValidationException $e) {
            DB::rollBack();
            throw $e;
        } catch (Throwable $e) {
            DB::rollBack();
            report($e);
            return response()->json([
                'success' => false,
                'message' => 'Unable to add deduction. Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    // =========================================================
    // 4. Update deduction
    // =========================================================
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'payment'      => ['nullable', 'numeric', 'min:0'],
            'total_amount' => ['nullable', 'numeric', 'min:0'],
            'start_date'   => ['nullable', 'date'],
            'end_date'     => ['nullable', 'date'],
            'status'       => ['nullable', 'boolean'],
        ]);

        try {
            DB::beginTransaction();

            $deduction = EmployeeDeductions::findOrFail($id);
            $deduction->fill(array_filter($validated, fn($v) => $v !== null));
            $deduction->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Deduction updated successfully.',
                'data'    => $deduction,
            ]);
        } catch (ValidationException $e) {
            DB::rollBack();
            throw $e;
        } catch (Throwable $e) {
            DB::rollBack();
            report($e);
            return response()->json([
                'success' => false,
                'message' => 'Unable to update deduction. Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    // =========================================================
    // 5. Delete deduction
    // =========================================================
    public function destroy($id)
    {
        try {
            DB::beginTransaction();

            $deduction = EmployeeDeductions::findOrFail($id);
            $deduction->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Deduction deleted successfully.',
            ]);
        } catch (Throwable $e) {
            DB::rollBack();
            report($e);
            return response()->json([
                'success' => false,
                'message' => 'Unable to delete deduction. Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    // =========================================================
    // 6. Payment history
    // =========================================================
    public function payments(Request $request)
    {
        $validated = $request->validate([
            'employee_deduction_id' => ['required', 'integer'],
        ]);

        try {
            $payments = EmployeeDeductionPayment::with('deductionType')
                ->where('employee_deduction_id', $validated['employee_deduction_id'])
                ->orderByDesc('start_date')
                ->get();

            return response()->json([
                'success' => true,
                'data'    => $payments,
                'count'   => $payments->count(),
            ]);
        } catch (Throwable $e) {
            report($e);
            return response()->json(['success' => false, 'message' => 'Unable to load payments.'], 500);
        }
    }
}