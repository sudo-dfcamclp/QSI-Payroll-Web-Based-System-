<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserManagementController extends Controller
{
    // User management page
    public function index()
    {
        return view('admin.UserManagement');
    }

    // Get paginated users
    public function users(Request $request): JsonResponse
    {
        $search = trim((string) $request->input('search', ''));
        $status = trim((string) $request->input('status', 'all'));

        $users = User::query()
            ->whereNotIn('user_id', function ($query) {
                $query->select('user_id')
                    ->from('user_roles')
                    ->where('role_id', 1);
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

    // Activate or disable user
    public function toggleStatus(User $user): JsonResponse
    {
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
}