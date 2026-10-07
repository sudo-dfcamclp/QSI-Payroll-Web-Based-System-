<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeePayroll extends Model
{
    protected $table = 'employee_payroll';

    protected $primaryKey = 'payroll_id';

    protected $fillable = [
        /*
        |--------------------------------------------------------------------------
        | Relationships / Identity
        |--------------------------------------------------------------------------
        */
        'period_id',
        'client_id',
        'emp_id',

        'legacy_client_id',
        'employee_num',
        'control_no',

        /*
        |--------------------------------------------------------------------------
        | Attendance / Basic Pay
        |--------------------------------------------------------------------------
        */
        'days_present',
        'basic_pay',

        /*
        |--------------------------------------------------------------------------
        | Overtime / Premiums
        |--------------------------------------------------------------------------
        */
        'ot_hrs',
        'ot_pay',

        'excess_ot_hrs',
        'excess_ot_pay',

        'night_diff_ot',
        'night_diff_pay',

        'rest_day_ot_hrs',
        'rest_day_ot_pay',

        'sunday_ot',
        'sunday_ot_pay',

        'sp_hol_days',
        'sp_hol_pay',

        'sp_hol_ot_hrs',
        'sp_hol_ot_pay',

        'excess_sp_hol_ot_hrs',
        'excess_sp_hol_ot_pay',

        'leg_hol_days',
        'leg_hol_pay',

        'leg_hol_ot_hrs',
        'leg_hol_ot_pay',

        'excess_leg_hol_ot_hrs',
        'excess_leg_hol_ot_pay',

        'excess_sun_leg_ot_hrs',
        'excess_sun_leg_ot_pay',

        'ot_no_prem_hrs',
        'ot_no_prem_pay',

        /*
        |--------------------------------------------------------------------------
        | Leave
        |--------------------------------------------------------------------------
        */
        'vl_days',
        'vl_pay',

        'sl_days',
        'sl_pay',

        /*
        |--------------------------------------------------------------------------
        | Other Earnings
        |--------------------------------------------------------------------------
        */
        'salary_adj',

        'incentive_pay',
        'incentive_remarks',

        'ecola_pay',

        'm13_rate',
        'm13_pay',

        'allowance',

        'load_allow',
        'meal_allow',
        'transpo_allow',

        /*
        |--------------------------------------------------------------------------
        | Gross Pay
        |--------------------------------------------------------------------------
        */
        'gross_pay',

        /*
        |--------------------------------------------------------------------------
        | Attendance Deductions
        |--------------------------------------------------------------------------
        */
        'days_absent',
        'absent_ded',

        'tardy_hrs',
        'tardy_ded',

        /*
        |--------------------------------------------------------------------------
        | Other Deductions
        |--------------------------------------------------------------------------
        */
        'cash_bond',
        'card_trans_fee',
        'client_vale',
        'placement_fee',
        'misc_fee',
        'agency_charge',
        'over_under_pay',

        'vale_iou',
        'uniform',
        'medical',
        'variances',
        'salary_loan',

        /*
        |--------------------------------------------------------------------------
        | Government Contributions
        |--------------------------------------------------------------------------
        */
        'sss_ee',
        'sss_er',
        'ecc_er',

        'philhealth_ee',
        'philhealth_er',

        'pagibig_ee',
        'pagibig_er',

        'wtax',

        /*
        |--------------------------------------------------------------------------
        | Loans
        |--------------------------------------------------------------------------
        */
        'sss_loan',
        'pagibig_loan',
        'other_loan',

        /*
        |--------------------------------------------------------------------------
        | Final Payroll
        |--------------------------------------------------------------------------
        */
        'total_ded',
        'net_pay',

        /*
        |--------------------------------------------------------------------------
        | Government Deduction Flags
        |--------------------------------------------------------------------------
        */
        'deduct_sss',
        'deduct_pagibig',
        'deduct_philhealth',
        'deduct_meal',
        'deduct_vale',
        'deduct_tax',

        /*
        |--------------------------------------------------------------------------
        | Legacy Payroll Fields
        |--------------------------------------------------------------------------
        */
        'excess_sun_sp_hrs',
        'excess_sun_sp_pay',

        'pay_flag_1',
        'pay_flag_2',

        'pay_text_1',
        'pay_text_2',

        /*
        |--------------------------------------------------------------------------
        | Employee Payroll Status
        |--------------------------------------------------------------------------
        */
        'payroll_status',

        /*
        |--------------------------------------------------------------------------
        | Audit
        |--------------------------------------------------------------------------
        */
        'entry_by',
        'entry_date',
    ];

    protected $casts = [

        /*
        |--------------------------------------------------------------------------
        | Attendance / Hours
        |--------------------------------------------------------------------------
        */
        'days_present' => 'decimal:2',

        'ot_hrs' => 'decimal:2',
        'excess_ot_hrs' => 'decimal:2',
        'night_diff_ot' => 'decimal:2',
        'rest_day_ot_hrs' => 'decimal:2',
        'sunday_ot' => 'decimal:2',

        'sp_hol_days' => 'decimal:2',
        'sp_hol_ot_hrs' => 'decimal:2',
        'excess_sp_hol_ot_hrs' => 'decimal:2',

        'leg_hol_days' => 'decimal:2',
        'leg_hol_ot_hrs' => 'decimal:2',
        'excess_leg_hol_ot_hrs' => 'decimal:2',

        'excess_sun_leg_ot_hrs' => 'decimal:2',
        'ot_no_prem_hrs' => 'decimal:2',

        'vl_days' => 'decimal:2',
        'sl_days' => 'decimal:2',

        'days_absent' => 'decimal:2',
        'tardy_hrs' => 'decimal:2',

        'excess_sun_sp_hrs' => 'decimal:2',

        /*
        |--------------------------------------------------------------------------
        | Earnings
        |--------------------------------------------------------------------------
        */
        'basic_pay' => 'decimal:2',

        'ot_pay' => 'decimal:2',
        'excess_ot_pay' => 'decimal:2',

        'night_diff_pay' => 'decimal:2',
        'rest_day_ot_pay' => 'decimal:2',
        'sunday_ot_pay' => 'decimal:2',

        'sp_hol_pay' => 'decimal:2',
        'sp_hol_ot_pay' => 'decimal:2',
        'excess_sp_hol_ot_pay' => 'decimal:2',

        'leg_hol_pay' => 'decimal:2',
        'leg_hol_ot_pay' => 'decimal:2',
        'excess_leg_hol_ot_pay' => 'decimal:2',

        'excess_sun_leg_ot_pay' => 'decimal:2',
        'ot_no_prem_pay' => 'decimal:2',

        'vl_pay' => 'decimal:2',
        'sl_pay' => 'decimal:2',

        'salary_adj' => 'decimal:2',
        'incentive_pay' => 'decimal:2',

        'ecola_pay' => 'decimal:2',

        'm13_rate' => 'decimal:2',
        'm13_pay' => 'decimal:2',

        'allowance' => 'decimal:2',
        'load_allow' => 'decimal:2',
        'meal_allow' => 'decimal:2',
        'transpo_allow' => 'decimal:2',

        'gross_pay' => 'decimal:2',

        /*
        |--------------------------------------------------------------------------
        | Deductions
        |--------------------------------------------------------------------------
        */
        'absent_ded' => 'decimal:2',
        'tardy_ded' => 'decimal:2',

        'cash_bond' => 'decimal:2',
        'card_trans_fee' => 'decimal:2',
        'client_vale' => 'decimal:2',
        'placement_fee' => 'decimal:2',
        'misc_fee' => 'decimal:2',
        'agency_charge' => 'decimal:2',
        'over_under_pay' => 'decimal:2',

        'vale_iou' => 'decimal:2',
        'uniform' => 'decimal:2',
        'medical' => 'decimal:2',
        'variances' => 'decimal:2',
        'salary_loan' => 'decimal:2',

        /*
        |--------------------------------------------------------------------------
        | Government Contributions
        |--------------------------------------------------------------------------
        */
        'sss_ee' => 'decimal:2',
        'sss_er' => 'decimal:2',
        'ecc_er' => 'decimal:2',

        'philhealth_ee' => 'decimal:2',
        'philhealth_er' => 'decimal:2',

        'pagibig_ee' => 'decimal:2',
        'pagibig_er' => 'decimal:2',

        'wtax' => 'decimal:2',

        /*
        |--------------------------------------------------------------------------
        | Loans
        |--------------------------------------------------------------------------
        */
        'sss_loan' => 'decimal:2',
        'pagibig_loan' => 'decimal:2',
        'other_loan' => 'decimal:2',

        /*
        |--------------------------------------------------------------------------
        | Final Payroll
        |--------------------------------------------------------------------------
        */
        'total_ded' => 'decimal:2',
        'net_pay' => 'decimal:2',

        /*
        |--------------------------------------------------------------------------
        | Boolean Flags
        |--------------------------------------------------------------------------
        */
        'deduct_sss' => 'boolean',
        'deduct_pagibig' => 'boolean',
        'deduct_philhealth' => 'boolean',
        'deduct_meal' => 'boolean',
        'deduct_vale' => 'boolean',
        'deduct_tax' => 'boolean',

        'pay_flag_1' => 'boolean',
        'pay_flag_2' => 'boolean',

        /*
        |--------------------------------------------------------------------------
        | Audit
        |--------------------------------------------------------------------------
        */
        'entry_date' => 'datetime',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    /**
     * Employee payroll belongs to one payroll period.
     */
    public function period(): BelongsTo
    {
        return $this->belongsTo(
            PayrollPeriod::class,
            'period_id',
            'period_id'
        );
    }

    /**
     * Employee payroll belongs to one client.
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
     * Employee payroll belongs to one employee.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(
            EmployeeMaster::class,
            'emp_id',
            'emp_id'
        );
    }
}