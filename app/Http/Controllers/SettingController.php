<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class SettingController extends Controller
{
    public function profile()
    {
        /** @var User $user */
        $user = Auth::user();

        return response()->json([
            'success' => true,
            'user' => [
                'user_id' => $user->user_id,
                'username' => $user->username,
                'email' => $user->email,
                'profile' => $user->profile,
                'updated_at' => $user->updated_at,
            ],
        ]);
    }

    public function updateProfile(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $validated = $request->validate([
            'username' => [
                'required',
                'string',
                'max:255',
                Rule::unique('users', 'username')
                    ->ignore($user->user_id, 'user_id'),
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')
                    ->ignore($user->user_id, 'user_id'),
            ],
        ]);

        $user->update([
            'username' => $validated['username'],
            'email' => $validated['email'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Profile information updated successfully.',
            'user' => [
                'user_id' => $user->user_id,
                'username' => $user->username,
                'email' => $user->email,
                'profile' => $user->profile,
                'updated_at' => $user->updated_at,
            ],
        ]);
    }

    public function changeProfile(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $validated = $request->validate([
            'profile' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],
        ]);

        if ($user->profile && Storage::disk('public')->exists($user->profile)) {
            Storage::disk('public')->delete($user->profile);
        }

        $profilePath = $validated['profile']->store(
            'profile_picture',
            'public'
        );

        $user->update([
            'profile' => $profilePath,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Profile picture updated successfully.',
            'profile' => $user->profile,
            'updated_at' => $user->updated_at,
        ]);
    }

    public function deleteProfile()
    {
        /** @var User $user */
        $user = Auth::user();

        if ($user->profile && Storage::disk('public')->exists($user->profile)) {
            Storage::disk('public')->delete($user->profile);
        }

        $user->update([
            'profile' => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Profile picture deleted successfully.',
            'profile' => null,
            'updated_at' => $user->updated_at,
        ]);
    }

    public function changePassword(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $validated = $request->validate([
            'current_password' => [
                'required',
                'string',
            ],
            'new_password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
            ],
        ]);

        if (!Hash::check(
            $validated['current_password'],
            $user->password
        )) {
            return response()->json([
                'success' => false,
                'message' => 'Current password is incorrect.',
            ], 422);
        }

        if (Hash::check(
            $validated['new_password'],
            $user->password
        )) {
            return response()->json([
                'success' => false,
                'message' => 'The new password must be different from your current password.',
            ], 422);
        }

        $user->update([
            'password' => $validated['new_password'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully.',
            'updated_at' => $user->updated_at,
        ]);
    }
}

