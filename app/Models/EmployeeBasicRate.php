<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeBasicRate extends Model
{
    protected $table = 'employee_basic_rate';

    protected $primaryKey = 'rate_id';

    public $incrementing = true;

    protected $keyType = 'int';

    public $timestamps = false;

    protected $fillable = [
        'emp_id',
        'rate_basis',
        'monthly_rate',
        'daily_rate',
        'hourly_rate',
        'effective_date',
        'end_date',
    ];

    protected $casts = [
        'monthly_rate' => 'decimal:2',
        'daily_rate' => 'decimal:2',
        'hourly_rate' => 'decimal:2',
        'effective_date' => 'date',
        'end_date' => 'date',
    ];

    public function employee()
    {
        return $this->belongsTo(EmployeeMaster::class, 'emp_id', 'emp_id');
    }
}