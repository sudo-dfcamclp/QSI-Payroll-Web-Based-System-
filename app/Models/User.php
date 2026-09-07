<?php

namespace App\Models;

use App\Models\Role;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'users';

    protected $primaryKey = 'user_id';

    public $incrementing = true;

    protected $keyType = 'int';

    protected $fillable = [
        'username',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | ROLES
    |--------------------------------------------------------------------------
    */

    public function roles()
    {
        return $this->belongsToMany(
            Role::class,
            'user_roles',
            'user_id',
            'role_id'
        )->withPivot('created_at');
    }

    /*
    |--------------------------------------------------------------------------
    | CHECK SINGLE ROLE
    |--------------------------------------------------------------------------
    */

    public function hasRoleId(int $roleId): bool
    {
        return $this->roles
            ->contains('role_id', $roleId);
    }

    /*
    |--------------------------------------------------------------------------
    | CHECK MULTIPLE ROLES
    |--------------------------------------------------------------------------
    */

    public function hasAnyRoleId(array $roleIds): bool
    {
        return $this->roles
            ->whereIn('role_id', $roleIds)
            ->isNotEmpty();
    }
}