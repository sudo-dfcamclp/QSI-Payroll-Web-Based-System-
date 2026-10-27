<?php

namespace App\Http\Controllers;

use App\Models\ClientMaster;
use App\Models\EmployeeMaster;
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

        $client = ClientMaster::query()
            ->where('client_id', $validated['client_id'])
            ->first();

        if (!$client) {
            return response()->json([
                'success' => false,
                'message' => 'Client not found.',
            ], 404);
        }

        // Verify the selected period belongs to the selected client.
        $period = PayrollPeriod::query()
            ->where('period_id', $validated['period_id'])
            ->where(function ($query) use ($client) {
                $query->where('client_id', $client->client_id);

                if ($client->legacy_client_id !== null) {
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

        $employees = EmployeeMaster::query()
            ->where(function ($query) use ($client) {
                // Primary match for new and migrated records
                $query->where(
                    'employee_master.client_id',
                    $client->client_id
                );

                // Legacy fallback only when new client_id is absent
                if ($client->legacy_client_id !== null) {
                    $query->orWhere(function ($legacyQuery) use ($client) {
                        $legacyQuery
                            ->whereNull('employee_master.client_id')
                            ->where(
                                'employee_master.legacy_client_id',
                                (string) $client->legacy_client_id
                            );
                    });
                }
            })
            ->where('employee_master.status', 'active')
            // Employee contract must overlap the selected cutoff.
            ->where(function ($query) use ($period) {
                $query->whereNull('employee_master.start_contract')
                    ->orWhereDate(
                        'employee_master.start_contract',
                        '<=',
                        $period->end_date
                    );
            })
            ->where(function ($query) use ($period) {
                $query->whereNull('employee_master.end_contract')
                    ->orWhereDate(
                        'employee_master.end_contract',
                        '>=',
                        $period->start_date
                    );
            })
            ->select([
                'emp_id',
                'client_id',
                'legacy_client_id',
                'last_name',
                'first_name',
                'middle_name',
                'start_contract',
                'end_contract',
            ])
            ->with(['basicRates' => function ($query) use ($period) {
                $query
                    ->whereDate('effective_date', '<=', $period->end_date)
                    ->where(function ($rateQuery) use ($period) {
                        $rateQuery->whereNull('end_date')
                            ->orWhereDate(
                                'end_date',
                                '>=',
                                $period->start_date
                            );
                    })
                    ->orderByDesc('effective_date');
            }])
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get();

        return response()->json($employees);
    }
}
