<?php

namespace App\Http\Controllers;

use App\Models\ClientMaster;
use App\Models\EmployeeBasicRate;
use App\Models\EmployeeMaster;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class EmployeeMasterController extends Controller
{
    public function search(Request $request)
    {
        $search = trim($request->input('q', ''));
        $sort = $request->input('sort', 'name');
        $direction = strtolower($request->input('direction', 'asc'));
        $status = strtolower($request->input('status', 'active'));

        $allowedSorts = ['name', 'latest', 'oldest', 'letter'];

        if (!in_array($sort, $allowedSorts, true)) {
            $sort = 'name';
        }

        if (!in_array($direction, ['asc', 'desc'], true)) {
            $direction = 'asc';
        }

        if (!in_array($status, ['active', 'archive'], true)) {
            $status = 'active';
        }

        $employees = EmployeeMaster::with('client')
            ->where('status', $status)
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('emp_id', 'like', "%{$search}%")
                        ->orWhere('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('middle_name', 'like', "%{$search}%")
                        ->orWhere('nickname', 'like', "%{$search}%")
                        ->orWhere('badge_no', 'like', "%{$search}%")
                        ->orWhere('contact_no', 'like', "%{$search}%");
                });
            });

        if ($sort === 'latest') {
            $employees->orderByDesc('date_hired')->orderByDesc('emp_id');
        } elseif ($sort === 'oldest') {
            $employees->orderBy('date_hired', 'asc')->orderBy('emp_id', 'asc');
        } elseif ($sort === 'letter') {
            $employees->orderBy('last_name', $direction)
                ->orderBy('first_name', $direction)
                ->orderBy('middle_name', $direction)
                ->orderBy('suffix_name', $direction)
                ->orderBy('emp_id', 'asc');
        } else {
            $employees->orderBy('last_name', 'asc')
                ->orderBy('first_name', 'asc')
                ->orderBy('middle_name', 'asc')
                ->orderBy('suffix_name', 'asc')
                ->orderBy('emp_id', 'asc');
        }

        $employees = $employees->paginate(20);

        $employees->getCollection()->transform(function ($employee) {
            return [
                'emp_id' => $employee->emp_id,
                'first_name' => $employee->first_name,
                'middle_name' => $employee->middle_name,
                'last_name' => $employee->last_name,
                'suffix_name' => $employee->suffix_name,
                'client_id' => $employee->client_id,
                'client_name' => $employee->client?->client_name,
                'badge_no' => $employee->badge_no,
                'employment_status' => $employee->employment_status,
                'status' => $employee->status,
                'date_hired' => $employee->date_hired,
                'date_resigned' => $employee->date_resigned,
            ];
        });

        return response()->json([
            'data' => $employees->items(),
            'pagination' => [
                'current_page' => $employees->currentPage(),
                'last_page' => $employees->lastPage(),
                'per_page' => $employees->perPage(),
                'total' => $employees->total(),
                'from' => $employees->firstItem(),
                'to' => $employees->lastItem(),
            ],
        ]);
    }

    public function archive($emp_id)
    {
        $employee = EmployeeMaster::findOrFail($emp_id);

        $newStatus = $employee->status === 'archive'
            ? 'active'
            : 'archive';

        $employee->update([
            'status' => $newStatus,
        ]);

        return response()->json([
            'success' => true,
            'status' => $newStatus,
            'message' => $newStatus === 'archive'
                ? 'Employee archived successfully.'
                : 'Employee recovered successfully.',
        ]);
    }

    public function clients(Request $request)
    {
        $search = trim($request->input('q', ''));

        $clients = ClientMaster::query()
            ->select(['client_id', 'client_name'])
            ->where('status', 'active')
            ->when($search !== '', function ($query) use ($search) {
                $query->where('client_name', 'like', "%{$search}%");
            })
            ->orderBy('client_name')
            ->limit(20)
            ->get();

        $clients->transform(function ($client) {
            $config = DB::table('client_payroll_config')
                ->where('client_id', $client->client_id)
                ->first();

            return [
                'client_id' => $client->client_id,
                'client_name' => $client->client_name,
                'payroll_config' => $config ? [
                    'hours_per_day' => $config->hours_per_day,
                    'working_days_per_month' => $config->working_days_per_month,
                    'working_days_per_year' => $config->working_days_per_year,
                ] : null,
            ];
        });

        return response()->json([
            'data' => $clients,
        ]);
    }

    public function show($emp_id)
    {
        $employee = EmployeeMaster::with(['client', 'basicRates'])->findOrFail($emp_id);

        return response()->json([
            'data' => $this->formatEmployee($employee),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateEmployee($request);

        $validated['status'] = $validated['status'] ?? 'active';

        $rate = $this->validateRate($request);
        $rate = $this->computeRates($rate, $validated['client_id'] ?? null);

        if ($request->hasFile('profile_photo')) {
            $validated['profile_photo'] = $request->file('profile_photo')->store('employee-profiles', 'public');
        }

        $employee = DB::transaction(function () use ($validated, $rate) {
            $employee = EmployeeMaster::create($validated);

            $rate['emp_id'] = $employee->emp_id;

            EmployeeBasicRate::create($rate);

            return $employee;
        });

        $employee->load(['client', 'basicRates']);

        return response()->json([
            'message' => 'Employee created successfully.',
            'data' => $this->formatEmployee($employee),
        ], 201);
    }

    public function update(Request $request, $emp_id)
    {
        $employee = EmployeeMaster::findOrFail($emp_id);

        $validated = $this->validateEmployee($request);

        $rate = $this->validateRate($request);
        $rate = $this->computeRates($rate, $validated['client_id'] ?? null);

        if ($request->hasFile('profile_photo')) {
            if ($employee->profile_photo) {
                Storage::disk('public')->delete($employee->profile_photo);
            }

            $validated['profile_photo'] = $request->file('profile_photo')->store('employee-profiles', 'public');
        }

        DB::transaction(function () use ($employee, $validated, $rate) {
            $employee->update($validated);

            $employeeRate = $employee->basicRates()->latest('rate_id')->first();

            if ($employeeRate) {
                $employeeRate->update($rate);
            } else {
                $rate['emp_id'] = $employee->emp_id;
                EmployeeBasicRate::create($rate);
            }
        });

        $employee->refresh();
        $employee->load(['client', 'basicRates']);

        return response()->json([
            'message' => 'Employee updated successfully.',
            'data' => $this->formatEmployee($employee),
        ]);
    }

    private function formatEmployee(EmployeeMaster $employee): array
    {
        $data = $employee->toArray();

        $rate = $employee->basicRates()->latest('rate_id')->first();

        $data['rate_basis'] = $rate?->rate_basis;
        $data['hourly_rate'] = $rate?->hourly_rate;
        $data['daily_rate'] = $rate?->daily_rate;
        $data['monthly_rate'] = $rate?->monthly_rate;
        $data['effective_date'] = $rate?->effective_date?->format('Y-m-d');
        $data['end_date'] = $rate?->end_date?->format('Y-m-d');

        $config = null;

        if ($employee->client_id) {
            $config = DB::table('client_payroll_config')
                ->where('client_id', $employee->client_id)
                ->first();
        }

        $data['payroll_config'] = $config ? [
            'hours_per_day' => $config->hours_per_day,
            'working_days_per_month' => $config->working_days_per_month,
            'working_days_per_year' => $config->working_days_per_year,
        ] : null;

        $data['profile_photo_url'] = $employee->profile_photo
            ? asset('storage/' . ltrim($employee->profile_photo, '/'))
            : null;

        $data['client_name'] = $employee->client?->client_name;
        $data['status'] = $employee->status ?? 'active';

        return $data;
    }

    private function computeRates(array $rate, $clientId): array
    {
        $basis = $rate['rate_basis'] ?? '';

        if ($basis === '') {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'rate_basis' => 'Please select a rate basis.',
            ]);
        }

        if (!$clientId) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'client_id' => 'Assign a client with payroll config before entering a rate.',
            ]);
        }

        $config = DB::table('client_payroll_config')
            ->where('client_id', $clientId)
            ->first();

        if (!$config) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'client_id' => 'Assign a client with payroll config before entering a rate.',
            ]);
        }

        $hoursPerDay = (float) $config->hours_per_day;
        $workingDaysPerMonth = (float) $config->working_days_per_month;
        $workingDaysPerYear = (float) $config->working_days_per_year;

        if ($hoursPerDay <= 0 || $workingDaysPerMonth <= 0 || $workingDaysPerYear <= 0) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'client_id' => 'The selected client payroll configuration has invalid working hours or working days.',
            ]);
        }

        $hourlyRate = $rate['hourly_rate'] !== '' ? (float) $rate['hourly_rate'] : null;
        $dailyRate = $rate['daily_rate'] !== '' ? (float) $rate['daily_rate'] : null;
        $monthlyRate = $rate['monthly_rate'] !== '' ? (float) $rate['monthly_rate'] : null;

        switch (strtolower($basis)) {
            case 'hourly':
                if ($hourlyRate === null || $hourlyRate <= 0) {
                    throw \Illuminate\Validation\ValidationException::withMessages([
                        'hourly_rate' => 'Please enter a valid hourly rate.',
                    ]);
                }

                $dailyRate = $hourlyRate * $hoursPerDay;
                $monthlyRate = $hourlyRate * $hoursPerDay * $workingDaysPerMonth;
                break;

            case 'daily':
                if ($dailyRate === null || $dailyRate <= 0) {
                    throw \Illuminate\Validation\ValidationException::withMessages([
                        'daily_rate' => 'Please enter a valid daily rate.',
                    ]);
                }

                $hourlyRate = $dailyRate / $hoursPerDay;
                $monthlyRate = $dailyRate * $workingDaysPerMonth;
                break;

            case 'monthly':
                if ($monthlyRate === null || $monthlyRate <= 0) {
                    throw \Illuminate\Validation\ValidationException::withMessages([
                        'monthly_rate' => 'Please enter a valid monthly rate.',
                    ]);
                }

                $dailyRate = ($monthlyRate * 12) / $workingDaysPerYear;
                $hourlyRate = $dailyRate / $hoursPerDay;
                break;

            default:
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'rate_basis' => 'Invalid rate basis.',
                ]);
        }

        $rate['hourly_rate'] = round($hourlyRate, 2);
        $rate['daily_rate'] = round($dailyRate, 2);
        $rate['monthly_rate'] = round($monthlyRate, 2);

        return $rate;
    }

    private function validateEmployee(Request $request)
    {
        return $request->validate([
            'client_id' => ['nullable', 'integer', 'exists:client_master,client_id'],
            'status' => ['nullable', 'string', 'in:active,archive'],
            'contact_no' => ['nullable', 'string', 'max:50'],
            'badge_no' => ['nullable', 'string', 'max:50'],
            'nickname' => ['nullable', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'first_name' => ['required', 'string', 'max:100'],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'suffix_name' => ['nullable', 'string', 'max:50'],
            'birth_date' => ['nullable', 'date'],
            'birth_place' => ['nullable', 'string', 'max:255'],
            'citizenship' => ['nullable', 'string', 'max:100'],
            'gender' => ['nullable', 'string', 'max:50'],
            'civil_status' => ['nullable', 'string', 'max:50'],
            'weight' => ['nullable', 'numeric'],
            'height' => ['nullable', 'numeric'],
            'religion' => ['nullable', 'string', 'max:100'],
            'house_no' => ['nullable', 'string', 'max:50'],
            'street' => ['nullable', 'string', 'max:150'],
            'barangay' => ['nullable', 'string', 'max:150'],
            'district' => ['nullable', 'string', 'max:150'],
            'city' => ['nullable', 'string', 'max:150'],
            'town' => ['nullable', 'string', 'max:150'],
            'contact' => ['nullable', 'string', 'max:100'],
            'phone' => ['nullable', 'string', 'max:100'],
            'primary_education' => ['nullable', 'string', 'max:255'],
            'secondary_education' => ['nullable', 'string', 'max:255'],
            'college' => ['nullable', 'string', 'max:255'],
            'degree' => ['nullable', 'string', 'max:255'],
            'major' => ['nullable', 'string', 'max:255'],
            'post_grad' => ['nullable', 'string', 'max:255'],
            'course' => ['nullable', 'string', 'max:255'],
            'sss_no' => ['nullable', 'string', 'max:50'],
            'philhealth_no' => ['nullable', 'string', 'max:50'],
            'pagibig_no' => ['nullable', 'string', 'max:50'],
            'tin_no' => ['nullable', 'string', 'max:50'],
            'employment_status' => ['nullable', 'string', 'max:50'],
            'remarks' => ['nullable', 'string'],
            'position' => ['nullable', 'string', 'max:150'],
            'company' => ['nullable', 'string', 'max:255'],
            'branch' => ['nullable', 'string', 'max:150'],
            'department' => ['nullable', 'string', 'max:150'],
            'date_hired' => ['nullable', 'date'],
            'date_resigned' => ['nullable', 'date'],
            'start_contract' => ['nullable', 'date'],
            'end_contract' => ['nullable', 'date'],
            'month_no' => ['nullable', 'integer'],
            'date_reg' => ['nullable', 'date'],
            'date_prob' => ['nullable', 'date'],
            'insurance_no' => ['nullable', 'string', 'max:100'],
            'agency_fee' => ['nullable', 'numeric'],
            'agency' => ['nullable', 'string', 'max:255'],
            'account_no' => ['nullable', 'string', 'max:100'],
            'expanded_tax' => ['nullable', 'numeric'],
            'allowance' => ['nullable', 'numeric'],
            'with_ecol' => ['nullable', 'boolean'],
            'profile_photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);
    }

    private function validateRate(Request $request)
    {
        return $request->validate([
            'rate_basis' => ['required', 'string', 'in:Daily,Monthly,Hourly'],
            'hourly_rate' => ['nullable', 'numeric', 'min:0'],
            'daily_rate' => ['nullable', 'numeric', 'min:0'],
            'monthly_rate' => ['nullable', 'numeric', 'min:0'],
        ]);
    }
}

