<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeDeductionPayment extends Model
{
    use HasFactory;

    protected $table = 'employee_deduction_payments';

    protected $fillable = [
        'emp_id',
        'deduction_type_id',
        'amount',
        'start_date',
        'end_date',
        'entry_by',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    // Payment belongs to an employee.
    public function employee(): BelongsTo
    {
        return $this->belongsTo(EmployeeMaster::class, 'emp_id', 'emp_id');
    }

    // Payment belongs to a deduction type.
    public function deductionType(): BelongsTo
    {
        return $this->belongsTo(DeductionTypes::class, 'deduction_type_id', 'id');
    }

    // Payment belongs to the user who encoded it.
    public function entryBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'entry_by', 'user_id');
    }
}