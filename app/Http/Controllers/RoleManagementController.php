<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RoleManagementController extends Controller
{
    // Role management page
    public function index()
    {
        return view('admin.RoleManagement');
    }

    // Get paginated users
    public function users(Request $request): JsonResponse
    {
        $search = trim((string) $request->input('search', ''));
        $roleId = $request->input('role_id');

        $users = User::query()
            ->whereNotIn('user_id', function ($query) {
                $query
                    ->select('user_id')
                    ->from('user_roles')
                    ->where('role_id', Role::SUPER_ADMIN);
            })
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query
                        ->where('username', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when(
                $roleId !== null &&
                $roleId !== '' &&
                (int) $roleId !== 0,
                function ($query) use ($roleId) {
                    $query->whereHas('roles', function ($query) use ($roleId) {
                        $query->where('role.role_id', (int) $roleId);
                    });
                }
            )
            ->with([
                'roles' => function ($query) {
                    $query->select([
                        'role.role_id',
                        'role.role_name',
                    ]);
                },
            ])
            ->select([
                'user_id',
                'username',
                'email',
            ])
            ->orderBy('user_id', 'desc')
            ->paginate(15)
            ->withQueryString();

        $users->getCollection()->transform(function (User $user) {
            $roles = $user->roles;

            $isSuperAdmin = $roles->contains(
                fn ($role) =>
                    (int) $role->role_id === Role::SUPER_ADMIN
            );

            return [
                'user_id' => $user->user_id,
                'username' => $user->username,
                'email' => $user->email,
                'roles' => $roles->map(function ($role) {
                    return [
                        'role_id' => (int) $role->role_id,
                        'role_name' => $role->role_name,
                    ];
                })->values(),
                'access' => $isSuperAdmin
                    ? 'Full Access'
                    : 'Limited Access',
            ];
        });

        return response()->json([
            'success' => true,
            'users' => $users->items(),
            'pagination' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
                'from' => $users->firstItem(),
                'to' => $users->lastItem(),
            ],
        ]);
    }

    // Get available roles
    public function roles(): JsonResponse
    {
        $roles = Role::query()
            ->where('role_id', '!=', Role::SUPER_ADMIN)
            ->select([
                'role_id',
                'role_name',
            ])
            ->orderBy('role_id')
            ->get();

        return response()->json([
            'success' => true,
            'roles' => $roles,
        ]);
    }

    // Get user's assigned roles
    public function userRoles(User $user): JsonResponse
    {
        $roleIds = DB::table('user_roles')
            ->where('user_id', $user->user_id)
            ->where('role_id', '!=', Role::SUPER_ADMIN)
            ->pluck('role_id')
            ->map(fn ($roleId) => (int) $roleId)
            ->values();

        return response()->json([
            'success' => true,
            'role_ids' => $roleIds,
        ]);
    }

    // Update user role
    public function updateRole(
        Request $request,
        User $user
    ): JsonResponse {
        $validated = $request->validate([
            'role_id' => [
                'required',
                'integer',
                'exists:role,role_id',
            ],
            'assigned' => [
                'required',
                'boolean',
            ],
        ]);

        $roleId = (int) $validated['role_id'];
        $assigned = (bool) $validated['assigned'];

        if ($roleId === Role::SUPER_ADMIN) {
            return response()->json([
                'success' => false,
                'message' => 'The Super Admin role cannot be modified here.',
            ], 403);
        }

        $isSuperAdmin = DB::table('user_roles')
            ->where('user_id', $user->user_id)
            ->where('role_id', Role::SUPER_ADMIN)
            ->exists();

        if ($isSuperAdmin) {
            return response()->json([
                'success' => false,
                'message' => 'Super Admin users cannot be modified here.',
            ], 403);
        }

        DB::transaction(function () use (
            $user,
            $roleId,
            $assigned
        ) {
            if ($assigned) {
                $exists = DB::table('user_roles')
                    ->where('user_id', $user->user_id)
                    ->where('role_id', $roleId)
                    ->exists();

                if (!$exists) {
                    DB::table('user_roles')->insert([
                        'user_id' => $user->user_id,
                        'role_id' => $roleId,
                        'created_at' => now(),
                    ]);
                }

                return;
            }

            DB::table('user_roles')
                ->where('user_id', $user->user_id)
                ->where('role_id', $roleId)
                ->delete();
        });

        return response()->json([
            'success' => true,
            'message' => $assigned
                ? 'Role assigned successfully.'
                : 'Role removed successfully.',
        ]);
    }
}