<?php

namespace App\Http\Controllers;

use App\Models\ClientMaster;
use Illuminate\Http\Request;

class EmployeePayrollController extends Controller
{
    public function clients(Request $request)
    {
        try {
            $search = trim(
                (string) $request->input('search', '')
            );

            $perPage = 20;

            $query = ClientMaster::with('payrollConfig');

            if ($search !== '') {
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
                            )
                            ->orWhere(
                                'client_id',
                                'like',
                                '%' . $term . '%'
                            );
                        });
                    }
                });
            }

            $clients = $query
                ->orderBy('client_name', 'asc')
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