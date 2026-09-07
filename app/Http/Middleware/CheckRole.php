<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     */
    public function handle(
        Request $request,
        Closure $next,
        ...$roles
    ): Response {

        /*
        |--------------------------------------------------------------------------
        | CHECK AUTHENTICATION
        |--------------------------------------------------------------------------
        */

        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        /*
        |--------------------------------------------------------------------------
        | GET AUTHENTICATED USER
        |--------------------------------------------------------------------------
        */

        $user = Auth::user();

        if (!$user instanceof User) {
            return response()->json([
                'success' => false,
                'message' => 'Unable to retrieve the authenticated user.',
            ], 401);
        }

        /*
        |--------------------------------------------------------------------------
        | GET USER ROLES
        |--------------------------------------------------------------------------
        |
        | Get all role names assigned to the user from user_roles.
        |
        */

        $userRoles = $user->roles()
            ->pluck('role_name');

        /*
        |--------------------------------------------------------------------------
        | NO ROLE ASSIGNED
        |--------------------------------------------------------------------------
        */

        if ($userRoles->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Your account is activated but no role has been assigned. Please contact your Admin.',
            ], 403);
        }

        /*
        |--------------------------------------------------------------------------
        | SUPER ADMIN
        |--------------------------------------------------------------------------
        |
        | Special rule:
        | A user with the super_admin role can access all protected routes.
        |
        */

        if ($userRoles->contains('super_admin')) {
            return $next($request);
        }

        /*
        |--------------------------------------------------------------------------
        | CHECK REQUIRED ROLE
        |--------------------------------------------------------------------------
        |
        | The route can specify one or more allowed roles.
        |
        | Example:
        | role:payroll
        | role:payroll,hr
        |
        */

        if (!empty($roles)) {

            $hasRequiredRole = $userRoles
                ->intersect($roles)
                ->isNotEmpty();

            if (!$hasRequiredRole) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to access this module.',
                ], 403);
            }
        }

        /*
        |--------------------------------------------------------------------------
        | ALLOW REQUEST
        |--------------------------------------------------------------------------
        */

        return $next($request);
    }
}
