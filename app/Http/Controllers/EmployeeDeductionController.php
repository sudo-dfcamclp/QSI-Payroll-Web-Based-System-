<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\DeductionTypes;
use App\Models\EmployeeDeductions;
use App\Models\EmployeeDeductionPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Throwable;

class EmployeeDeductionController extends Controller
{
    // 1. I-load ang listahan ng deduction types
    public function types()
    {
        try {
            $types = DeductionTypes::where('status', true)
                ->orderBy('title')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $types,
            ]);
        } catch (Throwable $e) {
            report($e);
            return response()->json(['success' => false, 'message' => 'Unable to load deduction types.'], 500);
        }
    }

    // 2. I-load ang lahat ng deductions ng isang employee
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
                'data' => $deductions,
            ]);
        } catch (Throwable $e) {
            report($e);
            return response()->json(['success' => false, 'message' => 'Unable to load employee deductions.'], 500);
        }
    }

    // 3. Mag-add ng bagong deduction
    public function store(Request $request)
    {
        $validated = $request->validate([
            'emp_id' => ['required', 'integer'],
            'client_id' => ['required', 'integer'],
            'deduction_type_id' => ['required', 'integer'],
            'payment' => ['required', 'numeric', 'min:0'],
            'total_amount' => ['required', 'numeric', 'min:0'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
        ]);

        try {
            DB::beginTransaction();

            $deduction = EmployeeDeductions::create([
                'emp_id' => $validated['emp_id'],
                'client_id' => $validated['client_id'],
                'deduction_type_id' => $validated['deduction_type_id'],
                'payment' => $validated['payment'],
                'total_amount' => $validated['total_amount'],
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'] ?? null,
                'entry_by' => auth()->id() ?? 1,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Deduction added successfully.',
                'data' => $deduction,
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

    // 4. I-update ang existing deduction (e.g., i-stop o palitan ang amount)
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'payment' => ['nullable', 'numeric', 'min:0'],
            'total_amount' => ['nullable', 'numeric', 'min:0'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        try {
            DB::beginTransaction();

            $deduction = EmployeeDeductions::findOrFail($id);

            // Kung may ipinasang bagong values, i-update.
            $deduction->fill(array_filter($validated, function ($value) {
                return $value !== null;
            }));
            $deduction->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Deduction updated successfully.',
                'data' => $deduction,
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

    // 5. Mag-delete ng deduction
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

    // 6. I-load ang payment history ng isang deduction
    public function payments(Request $request)
    {
        $validated = $request->validate([
            'emp_id' => ['required', 'integer'],
            'deduction_type_id' => ['required', 'integer'],
        ]);

        try {
            $payments = EmployeeDeductionPayment::with('deductionType')
                ->where('emp_id', $validated['emp_id'])
                ->where('deduction_type_id', $validated['deduction_type_id'])
                ->orderByDesc('start_date')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $payments,
            ]);
        } catch (Throwable $e) {
            report($e);
            return response()->json(['success' => false, 'message' => 'Unable to load payments.'], 500);
        }
    }
}