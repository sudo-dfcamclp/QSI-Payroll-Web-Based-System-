<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClientMaster extends Model
{
    protected $table = 'client_master';

    protected $primaryKey = 'client_id';

    protected $fillable = [
        'client_name',
        'client_address',
        'client_contact',
        'client_contact2',
        'client_owner',
        'contact_person',
        'contact_position',
        'client_assistant',
        'assistant_position',
        'permit_no',
        'bank_name',
        'account_no',
    ];

    public function payrollConfig()
    {
        return $this->hasOne(ClientPayrollConfig::class, 'client_id', 'client_id');
    }

    public function employees()
    {
        return $this->hasMany(EmployeeMaster::class, 'client_id', 'client_id');
    }
}