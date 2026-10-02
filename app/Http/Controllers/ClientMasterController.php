<?php

namespace App\Http\Controllers;

use App\Models\ClientMaster;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClientMasterController extends Controller
{
    public function search(Request $request)
    {
        $search = trim($request->input('search', ''));
        $perPage = 20;

        $clients = ClientMaster::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('client_name', 'like', "%{$search}%")
                        ->orWhere('client_contact', 'like', "%{$search}%")
                        ->orWhere('client_contact2', 'like', "%{$search}%");
                });
            })
            ->orderBy('client_name')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $clients->items(),
            'pagination' => [
                'current_page' => $clients->currentPage(),
                'last_page' => $clients->lastPage(),
                'per_page' => $clients->perPage(),
                'total' => $clients->total(),
                'from' => $clients->firstItem(),
                'to' => $clients->lastItem()
            ]
        ]);
    }

    public function show(ClientMaster $client)
    {
        $client->load('payrollConfig');

        if ($client->payrollConfig) {
            $client->payrollConfig->payroll_frequency = $this->normalizePayrollFrequency(
                $client->payrollConfig->payroll_frequency
            );
        }

        return response()->json([
            'success' => true,
            'data' => $client
        ]);
    }

    public function store(Request $request)
    {
        return $this->saveClient($request);
    }

    public function update(Request $request, ClientMaster $client)
    {
        return $this->saveClient($request, $client);
    }

    private function saveClient(Request $request, ?ClientMaster $client = null)
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:255',
            'client_address' => 'nullable|string|max:255',
            'client_contact' => 'nullable|string|max:100',
            'client_contact2' => 'nullable|string|max:100',
            'client_owner' => 'nullable|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'contact_position' => 'nullable|string|max:255',
            'client_assistant' => 'nullable|string|max:255',
            'assistant_position' => 'nullable|string|max:255',
            'permit_no' => 'nullable|string|max:100',
            'bank_name' => 'nullable|string|max:255',
            'account_no' => 'nullable|string|max:100',

            'payroll_config' => 'nullable|array',
            'payroll_config.payroll_frequency' => 'required|string|max:50',
            'payroll_config.working_days_per_cutoff' => 'nullable|numeric',
            'payroll_config.working_days_per_year' => 'nullable|numeric',
            'payroll_config.working_days_per_month' => 'nullable|numeric',
            'payroll_config.hours_per_day' => 'nullable|numeric',
            'payroll_config.include_13th_month_pay' => 'nullable|boolean',
            'payroll_config.add_13th_month_to_gross_pay' => 'nullable|boolean',

            'payroll_config.agency_fee_basis' => 'nullable|string|max:50',
            'payroll_config.agency_rate' => 'nullable|numeric',
            'payroll_config.client_charge_per_day' => 'nullable|numeric',
            'payroll_config.tardiness_rate' => 'nullable|numeric',
            'payroll_config.late_charge_per_minute' => 'nullable|numeric',

            'payroll_config.regular_overtime_rate' => 'nullable|numeric',
            'payroll_config.rest_day_rate' => 'nullable|numeric',
            'payroll_config.rest_day_overtime_rate' => 'nullable|numeric',
            'payroll_config.special_holiday_rate' => 'nullable|numeric',
            'payroll_config.legal_holiday_rate' => 'nullable|numeric',
            'payroll_config.night_differential_rate' => 'nullable|numeric',
            'payroll_config.special_holiday_overtime_rate' => 'nullable|numeric',
            'payroll_config.special_holiday_rest_day_rate' => 'nullable|numeric',
            'payroll_config.special_holiday_rest_day_overtime_rate' => 'nullable|numeric',
            'payroll_config.legal_holiday_overtime_rate' => 'nullable|numeric',
            'payroll_config.legal_holiday_rest_day_rate' => 'nullable|numeric',
            'payroll_config.legal_holiday_rest_day_overtime_rate' => 'nullable|numeric',

            'payroll_config.ecola_allowance_payment' => 'nullable|numeric',
            'payroll_config.ecola_taxable' => 'nullable|boolean',
            'payroll_config.ecola_on_rest_days' => 'nullable|boolean',
            'payroll_config.ecola_on_holidays' => 'nullable|boolean',

            'payroll_config.withhold_tax' => 'nullable|boolean',
            'payroll_config.use_fixed_rate_for_tax' => 'nullable|boolean',
            'payroll_config.withhold_sss' => 'nullable|boolean',
            'payroll_config.half_sss_monthly_basis' => 'nullable|boolean',
            'payroll_config.sss_add_on' => 'nullable|numeric',
            'payroll_config.withhold_philhealth' => 'nullable|boolean',
            'payroll_config.philhealth_add_on' => 'nullable|numeric',
            'payroll_config.withhold_pagibig' => 'nullable|boolean',
            'payroll_config.exclude_sss_pagibig_from_tax' => 'nullable|boolean',

            'payroll_config.admin_fee' => 'nullable|numeric',
            'payroll_config.vat' => 'nullable|numeric',
            'payroll_config.vat_reference' => 'nullable|string|max:100',
            'payroll_config.billing_schedule' => 'nullable|string|max:50',
            'payroll_config.billing_template' => 'nullable|string|max:100',
            'payroll_config.meal_on_bill' => 'nullable|boolean',
            'payroll_config.vale_on_bill' => 'nullable|boolean',
            'payroll_config.severance_pay' => 'nullable|numeric',
            'payroll_config.cutoff_period' => 'nullable|string|max:100',
            'payroll_config.pickup_dtr' => 'nullable|string|max:255',
            'payroll_config.salary_release' => 'nullable|string|max:255'
        ]);

        return DB::transaction(function () use ($validated, $client) {
            $clientData = collect($validated)
                ->only([
                    'client_name',
                    'client_address',
                    'client_contact',
                    'client_contact2',
                    'client_owner',
                    'contact_person',
                    'contact_position',
                    'client_assistant',
                    'assistant_position',
                    'permit_no',
                    'bank_name',
                    'account_no'
                ])
                ->toArray();

            $configData = $validated['payroll_config'] ?? [];

            $configData['payroll_frequency'] = $this->normalizePayrollFrequency(
                $configData['payroll_frequency'] ?? 'semi_monthly'
            );

            if ($client) {
                $client->update($clientData);
            } else {
                $client = ClientMaster::create($clientData);
            }

            $client->payrollConfig()->updateOrCreate(
                ['client_id' => $client->client_id],
                $configData
            );

            $client->load('payrollConfig');

            if ($client->payrollConfig) {
                $client->payrollConfig->payroll_frequency = $this->normalizePayrollFrequency(
                    $client->payrollConfig->payroll_frequency
                );
            }

            return response()->json([
                'success' => true,
                'message' => $client->wasRecentlyCreated
                    ? 'Client created successfully.'
                    : 'Client updated successfully.',
                'data' => $client
            ]);
        });
    }

    private function normalizePayrollFrequency(?string $frequency): string
    {
        $value = strtolower(trim((string) $frequency));

        return match ($value) {
            'semi-monthly',
            'semi monthly',
            'semi_monthly' => 'semi_monthly',
            'weekly' => 'weekly',
            'monthly' => 'monthly',
            default => 'semi_monthly'
        };
    }
}

