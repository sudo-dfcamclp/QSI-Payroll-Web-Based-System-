<?php

namespace App\Http\Controllers;

use App\Models\ClientMaster;
use App\Models\EmployeeMaster;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EmployeeMasterController extends Controller
{
    public function search(Request $request)
    {
        $search = trim($request->input('q', ''));

        if ($search === '') {
            return response()->json([
                'data' => []
            ]);
        }

        $employees = EmployeeMaster::with('client')
            ->where(function ($query) use ($search) {
                $query->where('emp_id', 'like', "%{$search}%")
                    ->orWhere('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('middle_name', 'like', "%{$search}%")
                    ->orWhere('nickname', 'like', "%{$search}%")
                    ->orWhere('badge_no', 'like', "%{$search}%")
                    ->orWhere('contact_no', 'like', "%{$search}%");
            })
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->orderBy('emp_id')
            ->get();

        return response()->json([
            'data' => $employees->map(function ($employee) {
                return [
                    'emp_id' => $employee->emp_id,
                    'first_name' => $employee->first_name,
                    'middle_name' => $employee->middle_name,
                    'last_name' => $employee->last_name,
                    'suffix_name' => $employee->suffix_name,
                    'client_id' => $employee->client_id,
                    'client_name' => $employee->client?->client_name,
                    'badge_no' => $employee->badge_no,
                ];
            })->values()
        ]);
    }

    public function clients(Request $request)
    {
        $search = trim($request->input('q', ''));

        $clients = ClientMaster::query()
            ->select(['client_id', 'client_name'])
            ->when($search !== '', function ($query) use ($search) {
                $query->where('client_name', 'like', "%{$search}%");
            })
            ->orderBy('client_name')
            ->limit(20)
            ->get();

        return response()->json([
            'data' => $clients
        ]);
    }

    public function show($emp_id)
    {
        $employee = EmployeeMaster::with('client')->findOrFail($emp_id);

        return response()->json([
            'data' => $this->formatEmployee($employee)
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateEmployee($request);

        if ($request->hasFile('profile_photo')) {
            $validated['profile_photo'] = $request->file('profile_photo')
                ->store('employee-profiles', 'public');
        }

        $employee = EmployeeMaster::create($validated);
        $employee->load('client');

        return response()->json([
            'message' => 'Employee created successfully.',
            'data' => $this->formatEmployee($employee)
        ], 201);
    }

    public function update(Request $request, $emp_id)
    {
        $employee = EmployeeMaster::findOrFail($emp_id);
        $validated = $this->validateEmployee($request);

        if ($request->hasFile('profile_photo')) {
            if ($employee->profile_photo) {
                Storage::disk('public')->delete($employee->profile_photo);
            }

            $validated['profile_photo'] = $request->file('profile_photo')
                ->store('employee-profiles', 'public');
        }

        $employee->update($validated);
        $employee->refresh();
        $employee->load('client');

        return response()->json([
            'message' => 'Employee updated successfully.',
            'data' => $this->formatEmployee($employee)
        ]);
    }

    private function formatEmployee(EmployeeMaster $employee): array
    {
        $data = $employee->toArray();

        $data['profile_photo_url'] = $employee->profile_photo
            ? asset('storage/' . ltrim($employee->profile_photo, '/'))
            : null;

        return $data;
    }

    private function validateEmployee(Request $request)
    {
        return $request->validate([
            'client_id' => ['nullable', 'integer', 'exists:client_master,client_id'],
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
            'phone' => ['nullable', 'string', 'max:50'],
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
            'branch' => ['nullable', 'string', 'max:150'],
            'department' => ['nullable', 'string', 'max:150'],
            'date_hired' => ['nullable', 'date'],
            'date_resigned' => ['nullable', 'date'],
            'start_contract' => ['nullable', 'date'],
            'end_contract' => ['nullable', 'date'],
            'rate_basis' => ['nullable', 'string', 'max:50'],
            'month_no' => ['nullable', 'integer'],
            'hourly_rate' => ['nullable', 'numeric'],
            'daily_rate' => ['nullable', 'numeric'],
            'monthly_rate' => ['nullable', 'numeric'],
            'date_reg' => ['nullable', 'date'],
            'date_prob' => ['nullable', 'date'],
            'insurance_no' => ['nullable', 'string', 'max:100'],
            'agency_fee' => ['nullable', 'numeric'],
            'agency' => ['nullable', 'string', 'max:255'],
            'account_no' => ['nullable', 'string', 'max:100'],
            'expanded_tax' => ['nullable', 'numeric'],
            'allowance' => ['nullable', 'numeric'],
            'with_ecol' => ['nullable', 'boolean'],
            'profile_photo' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120'
            ],
        ]);
    }
}