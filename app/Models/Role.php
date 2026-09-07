<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Role extends Model
{
    use HasFactory;

    protected $table = 'role';

    protected $primaryKey = 'role_id';

    public $incrementing = true;

    protected $keyType = 'int';

    public $timestamps = false;

    protected $fillable = [
        'role_name',
    ];

    protected function casts(): array
    {
        return [
            'role_id' => 'integer',
            'created_at' => 'datetime',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | ROLE IDs
    |--------------------------------------------------------------------------
    */

    public const SUPER_ADMIN = 1;
    public const PAYROLL = 2;
    public const ADMIN = 3;
    public const HR = 4;

    /*
    |--------------------------------------------------------------------------
    | USERS
    |--------------------------------------------------------------------------
    */

    public function users()
    {
        return $this->belongsToMany(
            User::class,
            'user_roles',
            'role_id',
            'user_id'
        )->withPivot('created_at');
    }
}