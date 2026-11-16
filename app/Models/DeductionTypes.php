<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DeductionTypes extends Model
{
    use HasFactory;

    protected $table = 'deduction_types';

    protected $fillable = [
        'title',
        'description',
        'status',
        'entry_by',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];

    // Deduction type belongs to the user who created it.
    public function entryBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'entry_by', 'user_id');
    }

    // Deduction type has many employee deductions.
    public function employeeDeductions(): HasMany
    {
        return $this->hasMany(EmployeeDeductions::class, 'deduction_type_id', 'id');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(EmployeeDeductionPayment::class, 'deduction_type_id', 'id');
    }
}