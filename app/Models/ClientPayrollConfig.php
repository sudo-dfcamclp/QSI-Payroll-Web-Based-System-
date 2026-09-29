<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\ClientMaster;

class ClientPayrollConfig extends Model
{
    protected $table = 'client_payroll_config';

    protected $primaryKey = 'config_id';

    protected $fillable = [
        'client_id',
        'payroll_frequency',
        'working_days_per_cutoff',
        'working_days_per_year',
        'working_days_per_month',
        'hours_per_day',
        'include_13th_month_pay',
        'add_13th_month_to_gross_pay',
        'agency_fee_basis',
        'agency_rate',
        'client_charge_per_day',
        'tardiness_rate',
        'late_charge_per_minute',
        'regular_overtime_rate',
        'rest_day_rate',
        'rest_day_overtime_rate',
        'special_holiday_rate',
        'legal_holiday_rate',
        'night_differential_rate',
        'special_holiday_overtime_rate',
        'special_holiday_rest_day_rate',
        'special_holiday_rest_day_overtime_rate',
        'legal_holiday_overtime_rate',
        'legal_holiday_rest_day_rate',
        'legal_holiday_rest_day_overtime_rate',
        'ecola_allowance_payment',
        'ecola_taxable',
        'ecola_on_rest_days',
        'ecola_on_holidays',
        'withhold_tax',
        'use_fixed_rate_for_tax',
        'withhold_sss',
        'half_sss_monthly_basis',
        'sss_add_on',
        'withhold_philhealth',
        'philhealth_add_on',
        'withhold_pagibig',
        'exclude_sss_pagibig_from_tax',
        'admin_fee',
        'vat',
        'vat_reference',
        'billing_schedule',
        'billing_template',
        'meal_on_bill',
        'vale_on_bill',
        'severance_pay',
        'cutoff_period',
    ];

    protected $casts = [
        'client_id' => 'integer',
        'working_days_per_cutoff' => 'decimal:2',
        'working_days_per_year' => 'decimal:2',
        'working_days_per_month' => 'decimal:2',
        'hours_per_day' => 'decimal:2',
        'include_13th_month_pay' => 'boolean',
        'add_13th_month_to_gross_pay' => 'boolean',
        'agency_rate' => 'decimal:2',
        'client_charge_per_day' => 'decimal:2',
        'tardiness_rate' => 'decimal:2',
        'late_charge_per_minute' => 'decimal:2',
        'regular_overtime_rate' => 'decimal:2',
        'rest_day_rate' => 'decimal:2',
        'rest_day_overtime_rate' => 'decimal:2',
        'special_holiday_rate' => 'decimal:2',
        'legal_holiday_rate' => 'decimal:2',
        'night_differential_rate' => 'decimal:2',
        'special_holiday_overtime_rate' => 'decimal:2',
        'special_holiday_rest_day_rate' => 'decimal:2',
        'special_holiday_rest_day_overtime_rate' => 'decimal:2',
        'legal_holiday_overtime_rate' => 'decimal:2',
        'legal_holiday_rest_day_rate' => 'decimal:2',
        'legal_holiday_rest_day_overtime_rate' => 'decimal:2',
        'ecola_allowance_payment' => 'decimal:2',
        'ecola_taxable' => 'boolean',
        'ecola_on_rest_days' => 'boolean',
        'ecola_on_holidays' => 'boolean',
        'withhold_tax' => 'boolean',
        'use_fixed_rate_for_tax' => 'boolean',
        'withhold_sss' => 'boolean',
        'half_sss_monthly_basis' => 'boolean',
        'sss_add_on' => 'decimal:2',
        'withhold_philhealth' => 'boolean',
        'philhealth_add_on' => 'decimal:2',
        'withhold_pagibig' => 'boolean',
        'exclude_sss_pagibig_from_tax' => 'boolean',
        'admin_fee' => 'decimal:2',
        'vat' => 'decimal:2',
        'meal_on_bill' => 'boolean',
        'vale_on_bill' => 'boolean',
        'severance_pay' => 'decimal:2',
    ];

    public function client()
    {
        return $this->belongsTo(ClientMaster::class, 'client_id', 'client_id');
    }
}