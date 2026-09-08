<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | CURRENT USER PERMISSIONS
    |--------------------------------------------------------------------------
    | Returns the currently authenticated user's identity and
    | allowed tabs for the Tab Manager.
    |--------------------------------------------------------------------------
    */

    public function permissions()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }


        /*
        |--------------------------------------------------------------------------
        | GET USER ROLES
        |--------------------------------------------------------------------------
        */

        $roleIds = $user->roles
            ->pluck('role_id')
            ->values()
            ->toArray();


        /*
        |--------------------------------------------------------------------------
        | ALLOWED TABS
        |--------------------------------------------------------------------------
        | Role ID 1 = super_admin
        |
        | For now:
        | - super_admin gets all registered tabs
        | - other roles get employee tabs only
        |
        | We will make this more scalable when we build the
        | proper role/permission management system.
        |--------------------------------------------------------------------------
        */

        if (in_array(1, $roleIds, true)) {

            $allowedTabs = [
                'employee-info',
                'employee-deduction',
                'user-management',
                'role-management',
                'system-settings',
            ];

        } else {

            $allowedTabs = [
                'employee-info',
                'employee-deduction',
            ];

        }


        /*
        |--------------------------------------------------------------------------
        | RESPONSE
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'success' => true,

            'user' => [
                'user_id' => $user->user_id,
            ],

            'allowed_tabs' => $allowedTabs,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}