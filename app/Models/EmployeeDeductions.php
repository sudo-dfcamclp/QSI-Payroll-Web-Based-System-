<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EmployeeDeductions extends Model
{
    use HasFactory;

    protected $table = 'employee_deductions';

    protected $fillable = [
        'emp_id',
        'client_id',
        'deduction_type_id',
        'payment',
        'total_amount',
        'balance',
        'start_date',
        'end_date',
        'status',
        'entry_by',
    ];

    protected $casts = [
        'payment' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'balance' => 'decimal:2',
        'status' => 'integer',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    // Employee deduction belongs to an employee.
    public function employee(): BelongsTo
    {
        return $this->belongsTo(EmployeeMaster::class, 'emp_id', 'emp_id');
    }

    // Employee deduction belongs to a client.
    public function client(): BelongsTo
    {
        return $this->belongsTo(ClientMaster::class, 'client_id', 'client_id');
    }

    // Employee deduction belongs to a deduction type.
    public function deductionType(): BelongsTo
    {
        return $this->belongsTo(DeductionTypes::class, 'deduction_type_id', 'id');
    }

    // Employee deduction belongs to the user who created it.
    public function entryBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'entry_by', 'user_id');
    }

    // Employee deduction has many payment history records.
    public function payments(): HasMany
    {
        return $this->hasMany(EmployeeDeductionPayment::class, 'emp_id', 'emp_id')
            ->where('deduction_type_id', $this->deduction_type_id);
    }
}