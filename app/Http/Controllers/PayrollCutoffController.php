<?php

namespace App\Http\Controllers;

use App\Models\ClientMaster;
use App\Models\PayrollPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PayrollCutoffController extends Controller
{
    /**
     * Load payroll cutoff list.
     */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'client_id' => ['required', 'integer'],
            'search' => ['nullable', 'string', 'max:100'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:20'],
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

                            if (strtolower($term) === 'open') {
                                $termQuery->orWhere('status', 0);
                            } elseif (strtolower($term) === 'closed') {
                                $termQuery->orWhere('status', 1);
                            }
                        });
                    }
                });
            }

            $perPage = min(
                (int) ($validated['per_page'] ?? 20),
                20
            );

            $periods = $query
                ->orderByDesc('start_date')
                ->orderBy('cutoff_no')
                ->paginate($perPage, [
                    'period_id',
                    'client_id',
                    'legacy_client_id',
                    'month_no',
                    'start_date',
                    'end_date',
                    'cutoff_no',
                    'status',
                ])
                ->appends(
                    $request->only([
                        'client_id',
                        'search',
                        'per_page',
                    ])
                );

            return response()->json([
                'success' => true,
                'data' => $periods->items(),
                'pagination' => [
                    'current_page' => $periods->currentPage(),
                    'last_page' => $periods->lastPage(),
                    'per_page' => $periods->perPage(),
                    'total' => $periods->total(),
                    'from' => $periods->firstItem(),
                    'to' => $periods->lastItem(),
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


    /**
     * Create new payroll cutoff.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => [
                'required',
                'integer',
                'exists:client_master,client_id',
            ],
            'start_date' => [
                'required',
                'date',
            ],
            'end_date' => [
                'required',
                'date',
                'after_or_equal:start_date',
            ],
        ]);

        try {
            $period = DB::transaction(function () use ($validated) {

                /*
                 * Lock the client row so simultaneous cutoff
                 * creation requests for the same client are serialized.
                 */
                $client = ClientMaster::query()
                    ->with('payrollConfig')
                    ->where('client_id', $validated['client_id'])
                    ->lockForUpdate()
                    ->first();

                if (!$client) {
                    throw ValidationException::withMessages([
                        'client_id' => 'Client not found.',
                    ]);
                }

                /*
                 * Get payroll frequency from ClientPayrollConfig.
                 */
                $frequency = strtolower(
                    trim((string) $client->payrollConfig?->payroll_frequency)
                );

                if ($frequency === '') {
                    throw ValidationException::withMessages([
                        'payroll_frequency' =>
                            'Payroll frequency is not configured for this client.',
                    ]);
                }

                /*
                 * Get the previous cutoff for this client.
                 * Includes legacy records linked through legacy_client_id.
                 */
                $lastPeriod = PayrollPeriod::query()
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
                    })
                    ->orderByDesc('period_id')
                    ->lockForUpdate()
                    ->first();

                $lastCutoffNo = (int) (
                    $lastPeriod?->cutoff_no ?? 0
                );

                /*
                 * Determine cutoff number based on payroll frequency.
                 */
                switch ($frequency) {

                    case 'weekly':
                        $cutoffNo = ($lastCutoffNo % 4) + 1;
                        break;

                    case 'semi_monthly':
                        $cutoffNo = ($lastCutoffNo % 2) + 1;
                        break;

                    case 'monthly':
                        $cutoffNo = 1;
                        break;

                    default:
                        throw ValidationException::withMessages([
                            'payroll_frequency' =>
                                'Unsupported payroll frequency: ' . $frequency,
                        ]);
                }

                /*
                 * Month number is based on the start date.
                 */
                $monthNo = (int) date(
                    'n',
                    strtotime($validated['start_date'])
                );

                /*
                 * Save new cutoff.
                 */
                return PayrollPeriod::create([
                    'client_id' => $client->client_id,
                    'legacy_client_id' => $client->legacy_client_id,
                    'month_no' => $monthNo,
                    'start_date' => $validated['start_date'],
                    'end_date' => $validated['end_date'],
                    'cutoff_no' => $cutoffNo,
                    'status' => 0,
                ]);
            });

            return response()->json([
                'success' => true,
                'message' => 'Payroll cutoff created successfully.',
                'data' => $period,
            ], 201);

        } catch (ValidationException $e) {
            throw $e;

        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'success' => false,
                'message' => 'Unable to create payroll cutoff.',
            ], 500);
        }
    }
}
