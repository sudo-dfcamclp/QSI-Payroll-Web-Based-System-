<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // Return current user permissions
    public function permissions()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        // Get all role IDs assigned to the current user
        $roleIds = $user->roles
            ->pluck('role_id')
            ->map(fn ($roleId) => (int) $roleId)
            ->values()
            ->toArray();

        /*
        |--------------------------------------------------------------------------
        | ALLOWED TABS
        |--------------------------------------------------------------------------
        | Permissions are ADDITIVE.
        |
        | If a user has multiple roles, the permissions of ALL roles
        | will be combined.
        |
        | Example:
        | HR + Payroll
        |
        | HR:
        |   employee-info
        |
        | Payroll:
        |   employee-payroll
        |   first-last-cutoff
        |
        | Final:
        |   employee-info
        |   employee-payroll
        |   first-last-cutoff
        |--------------------------------------------------------------------------
        */

        $allowedTabs = [];

        // Super Admin
        if (in_array(1, $roleIds, true)) {
            $allowedTabs = array_merge($allowedTabs, [
                'employee-info',
                'employee-deduction',
                'employee-payroll',
                'first-last-cutoff',
                'user-management',
                'role-management',
                'system-settings',
            ]);
        }

        // Payroll
        if (in_array(2, $roleIds, true)) {
            $allowedTabs = array_merge($allowedTabs, [
                'employee-payroll',
                'first-last-cutoff',
            ]);
        }

        // Admin
        if (in_array(3, $roleIds, true)) {
            $allowedTabs = array_merge($allowedTabs, [
                'employee-info',
                'employee-deduction',
            ]);
        }

        // HR
        if (in_array(4, $roleIds, true)) {
            $allowedTabs = array_merge($allowedTabs, [
                'employee-info',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | REMOVE DUPLICATE TABS
        |--------------------------------------------------------------------------
        | If two roles provide the same permission, only one entry
        | will be returned.
        |--------------------------------------------------------------------------
        */

        $allowedTabs = array_values(array_unique($allowedTabs));

        return response()->json([
            'success' => true,

            'user' => [
                'user_id' => $user->user_id,
            ],

            'roles' => $roleIds,

            'allowed_tabs' => $allowedTabs,
        ]);
    }

    // Logout authenticated user
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}

