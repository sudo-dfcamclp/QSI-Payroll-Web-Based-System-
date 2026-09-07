<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserManagementController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | USER MANAGEMENT PAGE
    |--------------------------------------------------------------------------
    */

    public function index()
    {
        return view('admin.UserManagement');
    }


    /*
    |--------------------------------------------------------------------------
    | GET USERS
    |--------------------------------------------------------------------------
    */

    public function users(): JsonResponse
    {
        $users = User::query()
            ->whereNotIn('user_id', function ($query) {
                $query->select('user_id')
                    ->from('user_roles')
                    ->where('role_id', 1);
            })
            ->select([
                'user_id',
                'username',
                'email',
                'status',
                'created_at',
                'updated_at',
            ])
            ->orderBy('user_id', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'users' => $users,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | ACTIVATE / DISABLE USER
    |--------------------------------------------------------------------------
    */

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


    /*
    |--------------------------------------------------------------------------
    | RESET USER PASSWORD
    |--------------------------------------------------------------------------
    */

    public function resetPassword(
        Request $request,
        User $user
    ): JsonResponse {

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