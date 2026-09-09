<?php

namespace App\Models;

use App\Models\Role;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $table = 'users';
    protected $primaryKey = 'user_id';
    public $incrementing = true;
    protected $keyType = 'int';
    const DELETED_AT = 'delete_at';

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
            'delete_at' => 'datetime',
        ];
    }

    // Get user's roles
    public function roles()
    {
        return $this->belongsToMany(
            Role::class,
            'user_roles',
            'user_id',
            'role_id'
        )->withPivot('created_at');
    }

    // Check if user has a role
    public function hasRoleId(int $roleId): bool
    {
        return $this->roles
            ->contains('role_id', $roleId);
    }

    // Check if user has any role
    public function hasAnyRoleId(array $roleIds): bool
    {
        return $this->roles
            ->whereIn('role_id', $roleIds)
            ->isNotEmpty();
    }
}

