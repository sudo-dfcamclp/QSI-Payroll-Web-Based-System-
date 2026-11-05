<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PayrollTaxConfig extends Model
{
    protected $table = 'tax_config';

    protected $fillable = [
        'tax_code',
        'sal_rate1',
        'sal_rate2',
        'per_over',
        'base_tax',
        'effective_date',
        'end_date',
        'is_active',
    ];

    protected $casts = [
        'sal_rate1' => 'decimal:2',
        'sal_rate2' => 'decimal:2',
        'per_over' => 'decimal:4',
        'base_tax' => 'decimal:2',
        'effective_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
    ];
}
