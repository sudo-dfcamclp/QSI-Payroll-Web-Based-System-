<?php

namespace App\Http\Controllers;

use App\Models\ClientMaster;
use App\Models\PayrollPeriod;
use Illuminate\Http\Request;

class PayrollCutoffController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'client_id' => ['required', 'integer'],
            'search' => ['nullable', 'string', 'max:100'],
        ]);

        try {
            $client = ClientMaster::query()
                ->where('client_id', $validated['client_id'])
                ->first();

            if (!$client) {
                return response()->json([
                    'success' => false,
                    'message' => 'Client not found.',
                ], 404);
            }

            $query = PayrollPeriod::query()
                ->where(function ($periodQuery) use ($client) {
                    $periodQuery->where(
                        'client_id',
                        $client->client_id
                    );

                    if ($client->legacy_client_id !== null) {
                        $periodQuery->orWhere(function ($legacyQuery) use ($client) {
                            $legacyQuery
                                ->whereNull('client_id')
                                ->where(
                                    'legacy_client_id',
                                    $client->legacy_client_id
                                );
                        });
                    }
                });

            $search = trim((string) ($validated['search'] ?? ''));

            if ($search !== '') {
                $terms = preg_split(
                    '/\s+/',
                    $search,
                    -1,
                    PREG_SPLIT_NO_EMPTY
                );

                $query->where(function ($searchQuery) use ($terms) {
                    foreach ($terms as $term) {
                        $searchQuery->where(function ($termQuery) use ($term) {
                            $termQuery
                                ->where('start_date', 'like', "%{$term}%")
                                ->orWhere('end_date', 'like', "%{$term}%")
                                ->orWhere('cutoff_no', 'like', "%{$term}%")
                                ->orWhere('status', 'like', "%{$term}%")
                                ->orWhereRaw(
                                    "DATE_FORMAT(start_date, '%M %Y') LIKE ?",
                                    ["%{$term}%"]
                                )
                                ->orWhereRaw(
                                    "DATE_FORMAT(end_date, '%M %Y') LIKE ?",
                                    ["%{$term}%"]
                                );
                        });
                    }
                });
            }

            $periods = $query
                ->orderByDesc('start_date')
                ->orderBy('cutoff_no')
                ->get([
                    'period_id',
                    'client_id',
                    'legacy_client_id',
                    'month_no',
                    'start_date',
                    'end_date',
                    'cutoff_no',
                    'status',
                ]);

            return response()->json([
                'success' => true,
                'data' => $periods,
                'meta' => [
                    'total' => $periods->count(),
                ],
            ]);
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'success' => false,
                'message' => 'Unable to load payroll cutoffs.',
            ], 500);
        }
    }
}
