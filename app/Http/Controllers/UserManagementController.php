<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserManagementController extends Controller
{
    // User management page
    public function index()
    {
        return view('admin.UserManagement');
    }

    // Get paginated active users
    public function users(Request $request): JsonResponse
    {
        $search = trim((string) $request->input('search', ''));
        $status = trim((string) $request->input('status', 'all'));

        $users = User::query()
            ->whereNotIn('user_id', function ($query) {
                $query->select('user_id')
                    ->from('user_roles')
                    ->where('role_id', Role::SUPER_ADMIN);
            })
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('username', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when(
                in_array($status, ['active', 'pending', 'disabled'], true),
                function ($query) use ($status) {
                    $query->where('status', $status);
                }
            )
            ->select([
                'user_id',
                'username',
                'email',
                'status',
                'created_at',
                'updated_at',
            ])
            ->orderBy('user_id', 'desc')
            ->paginate(15)
            ->withQueryString();

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

    // Get paginated deleted users
    public function deletedUsers(Request $request): JsonResponse
    {
        $search = trim((string) $request->input('search', ''));

        $users = User::onlyTrashed()
            ->whereNotIn('user_id', function ($query) {
                $query->select('user_id')
                    ->from('user_roles')
                    ->where('role_id', Role::SUPER_ADMIN);
            })
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('username', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->select([
                'user_id',
                'username',
                'email',
                'status',
                'delete_at',
            ])
            ->orderBy('delete_at', 'desc')
            ->paginate(15)
            ->withQueryString();

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

    // Activate or disable user
    public function toggleStatus(User $user): JsonResponse
    {
        if ($user->hasRoleId(Role::SUPER_ADMIN)) {
            return response()->json([
                'success' => false,
                'message' => 'Super Admin users cannot be modified.',
            ], 403);
        }

        if ((int) request()->user()->user_id === (int) $user->user_id) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot change your own account status.',
            ], 403);
        }

        $user->status = $user->status === 'active'
            ? 'disabled'
            : 'active';

        $user->save();

        return response()->json([
            'success' => true,
            'message' => $user->status === 'active'
                ? 'User activated successfully.'
                : 'User disabled successfully.',
            'user' => [
                'user_id' => $user->user_id,
                'username' => $user->username,
                'email' => $user->email,
                'status' => $user->status,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ],
        ]);
    }

    // Reset user password
    public function resetPassword(Request $request, User $user): JsonResponse
    {
        if ($user->hasRoleId(Role::SUPER_ADMIN)) {
            return response()->json([
                'success' => false,
                'message' => 'Super Admin passwords cannot be reset here.',
            ], 403);
        }

        if ((int) request()->user()->user_id === (int) $user->user_id) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot reset your own password here.',
            ], 403);
        }

        $validated = $request->validate([
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
            ],
        ]);

        $user->password = Hash::make(
            $validated['password']
        );

        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'User password reset successfully.',
        ]);
    }

    // Soft delete user
    public function deleteUser(User $user): JsonResponse
    {
        if ($user->hasRoleId(Role::SUPER_ADMIN)) {
            return response()->json([
                'success' => false,
                'message' => 'Super Admin users cannot be deleted.',
            ], 403);
        }

        if ((int) request()->user()->user_id === (int) $user->user_id) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot delete your own account.',
            ], 403);
        }

        if ($user->trashed()) {
            return response()->json([
                'success' => false,
                'message' => 'User is already deleted.',
            ], 400);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User account deleted successfully.',
        ]);
    }

    // Permanently delete user
    public function forceDeleteUser(int $userId): JsonResponse
    {
        $user = User::withTrashed()->find($userId);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found.',
            ], 404);
        }

        if ($user->hasRoleId(Role::SUPER_ADMIN)) {
            return response()->json([
                'success' => false,
                'message' => 'Super Admin users cannot be permanently deleted.',
            ], 403);
        }

        if ((int) request()->user()->user_id === (int) $user->user_id) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot permanently delete your own account.',
            ], 403);
        }

        if (!$user->trashed()) {
            return response()->json([
                'success' => false,
                'message' => 'User must be soft deleted before permanent deletion.',
            ], 403);
        }

        DB::transaction(function () use ($user) {
            DB::table('user_roles')
                ->where('user_id', $user->user_id)
                ->delete();

            $user->forceDelete();
        });

        return response()->json([
            'success' => true,
            'message' => 'User account permanently deleted.',
        ]);
    }
}