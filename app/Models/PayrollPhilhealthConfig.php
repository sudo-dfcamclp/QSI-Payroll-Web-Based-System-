<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PayrollPhilhealthConfig extends Model
{
    protected $table = 'philhealth_config';

    protected $fillable = [
        'min_salary',
        'max_salary',
        'premium_rate',
        'employee_share_rate',
        'employer_share_rate',
        'min_contribution',
        'max_contribution',
        'effective_date',
        'end_date',
        'is_active',
    ];

    protected $casts = [
        'min_salary' => 'decimal:2',
        'max_salary' => 'decimal:2',
        'premium_rate' => 'decimal:4',
        'employee_share_rate' => 'decimal:4',
        'employer_share_rate' => 'decimal:4',
        'min_contribution' => 'decimal:2',
        'max_contribution' => 'decimal:2',
        'effective_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
    ];
}
