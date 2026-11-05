<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PayrollPagibigConfig extends Model
{
    protected $table = 'pagibig_config';

    protected $fillable = [
        'min_wage',
        'max_wage',
        'pagibig_ee',
        'pagibig_er',
        'pagibig_total',
        'pagibig_max',
        'effective_date',
        'end_date',
        'is_active',
    ];

    protected $casts = [
        'min_wage' => 'decimal:2',
        'max_wage' => 'decimal:2',
        'pagibig_ee' => 'decimal:2',
        'pagibig_er' => 'decimal:2',
        'pagibig_total' => 'decimal:2',
        'pagibig_max' => 'decimal:2',
        'effective_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
    ];
}
