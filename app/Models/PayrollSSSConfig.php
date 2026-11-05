<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PayrollSSSConfig extends Model
{
    protected $table = 'sss_config';

    protected $fillable = [
        'min_wage',
        'max_wage',
        'credit',
        'ec_share',
        'er_share',
        'ee_share',
        'med_er',
        'er_total',
        'med_ee',
        'ee_total',
        'grand_total',
        'bracket',
        'effective_date',
        'end_date',
        'is_active',
    ];

    protected $casts = [
        'min_wage' => 'decimal:2',
        'max_wage' => 'decimal:2',
        'credit' => 'decimal:2',
        'ec_share' => 'decimal:2',
        'er_share' => 'decimal:2',
        'ee_share' => 'decimal:2',
        'med_er' => 'decimal:2',
        'er_total' => 'decimal:2',
        'med_ee' => 'decimal:2',
        'ee_total' => 'decimal:2',
        'grand_total' => 'decimal:2',
        'effective_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
    ];
}
