<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PayrollPeriod extends Model
{
    protected $table = 'payroll_period';

    protected $primaryKey = 'period_id';

    protected $fillable = [
        'client_id',
        'legacy_client_id',
        'month_no',
        'start_date',
        'end_date',
        'cutoff_no',
        'status',
    ];

    protected $casts = [
        'month_no' => 'integer',
        'start_date' => 'date',
        'end_date' => 'date',
        'cutoff_no' => 'integer',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    /**
     * Payroll period belongs to one client.
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(
            ClientMaster::class,
            'client_id',
            'client_id'
        );
    }

    /**
     * Payroll period contains many employee payroll records.
     */
    public function employeePayrolls(): HasMany
    {
        return $this->hasMany(
            EmployeePayroll::class,
            'period_id',
            'period_id'
        );
    }
}