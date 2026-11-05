<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CutoffConfig extends Model
{
    protected $table = 'cutoff_config';

    protected $fillable = [
        'cutoff_id',
        'f_from',
        'f_to',
        'l_from',
        'l_to',
    ];

    protected $casts = [
        'cutoff_id' => 'integer',
        'f_from' => 'date',
        'f_to' => 'date',
        'l_from' => 'date',
        'l_to' => 'date',
    ];
}
