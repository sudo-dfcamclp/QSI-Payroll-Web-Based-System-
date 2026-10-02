<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeMaster extends Model
{
    protected $table = 'employee_master';

    protected $primaryKey = 'emp_id';

    public $incrementing = true;

    protected $keyType = 'int';

    protected $fillable = [
        'client_id',
        'contact_no',
        'badge_no',
        'nickname',
        'last_name',
        'first_name',
        'middle_name',
        'suffix_name',
        'birth_date',
        'birth_place',
        'citizenship',
        'gender',
        'civil_status',
        'weight',
        'height',
        'religion',
        'house_no',
        'street',
        'barangay',
        'district',
        'city',
        'town',
        'contact',
        'phone',
        'primary_education',
        'secondary_education',
        'college',
        'degree',
        'major',
        'post_grad',
        'course',
        'sss_no',
        'philhealth_no',
        'pagibig_no',
        'tin_no',
        'employment_status',
        'remarks',
        'position',
        'branch',
        'department',
        'date_hired',
        'date_resigned',
        'start_contract',
        'end_contract',
        'month_no',
        'date_reg',
        'date_prob',
        'insurance_no',
        'agency_fee',
        'agency',
        'account_no',
        'expanded_tax',
        'allowance',
        'with_ecol',
        'profile_photo',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'date_hired' => 'date',
        'date_resigned' => 'date',
        'start_contract' => 'date',
        'end_contract' => 'date',
        'date_reg' => 'date',
        'date_prob' => 'date',
        'weight' => 'decimal:2',
        'height' => 'decimal:2',
        'agency_fee' => 'decimal:2',
        'expanded_tax' => 'decimal:2',
        'allowance' => 'decimal:2',
        'with_ecol' => 'boolean',
    ];

    public function client()
    {
        return $this->belongsTo(ClientMaster::class, 'client_id', 'client_id');
    }

    public function basicRates()
    {
        return $this->hasMany(EmployeeBasicRate::class, 'emp_id', 'emp_id');
    }
}