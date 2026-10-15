<?php

namespace App\Http\Controllers;

use App\Models\ClientMaster;
use Illuminate\Http\Request;

class EmployeePayrollController extends Controller
{
    public function clients(Request $request)
    {
        try {
            $search = trim((string) $request->input('search', ''));
            $sort = (string) $request->input('sort', 'name');
            $direction = strtolower((string) $request->input('direction', 'asc'));
            $perPage = min(max((int) $request->input('per_page', 20), 1), 100);

            $allowedSorts = ['name', 'latest', 'oldest', 'letter'];

            if (!in_array($sort, $allowedSorts, true)) {
                $sort = 'name';
            }

            if (!in_array($direction, ['asc', 'desc'], true)) {
                $direction = 'asc';
            }

            $query = ClientMaster::with('payrollConfig');

            if ($search !== '') {
                // FIX: Correctly split the search string into words.
                $searchTerms = preg_split(
                    '/\s+/',
                    $search,
                    -1,
                    PREG_SPLIT_NO_EMPTY
                );

                $query->where(function ($q) use ($searchTerms) {
                    foreach ($searchTerms as $term) {
                        $q->where(function ($q) use ($term) {
                            $q->where(
                                'client_name',
                                'like',
                                '%' . $term . '%'
                            )->orWhere(
                                'client_id',
                                'like',
                                '%' . $term . '%'
                            );
                        });
                    }
                });
            }

            switch ($sort) {
                case 'latest':
                    $query->orderBy('created_at', 'desc');
                    break;

                case 'oldest':
                    $query->orderBy('created_at', 'asc');
                    break;

                case 'letter':
                    // A to Z or Z to A, based on the supplied direction.
                    $query->orderBy('client_name', $direction);
                    break;

                case 'name':
                default:
                    $query->orderBy('client_name', $direction);
                    break;
            }

            $clients = $query
                ->paginate($perPage)
                ->appends($request->query());

            return response()->json([
                'success' => true,
                'data' => $clients->items(),
                'pagination' => [
                    'current_page' => $clients->currentPage(),
                    'last_page' => $clients->lastPage(),
                    'per_page' => $clients->perPage(),
                    'total' => $clients->total(),
                    'from' => $clients->firstItem(),
                    'to' => $clients->lastItem(),
                ],
            ]);
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'success' => false,
                'message' => 'Unable to load payroll clients.',
            ], 500);
        }
    }
}