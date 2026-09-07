<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | LOGIN
    |--------------------------------------------------------------------------
    */

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => [
                'required',
                'string',
                'max:50',
            ],
            'password' => [
                'required',
                'string',
            ],
            'remember' => [
                'sometimes',
                'boolean',
            ],
        ], [
            'username.required' => 'Please enter your username.',
            'username.max' => 'Username cannot exceed 50 characters.',
            'password.required' => 'Please enter your password.',
        ]);

        /*
        |--------------------------------------------------------------------------
        | VALIDATION ERROR
        |--------------------------------------------------------------------------
        */

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Please complete all required fields.',
                'errors' => $validator->errors(),
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | GET USER
        |--------------------------------------------------------------------------
        |
        | Find the account using the username first.
        |
        */

        $user = User::where('username', $request->input('username'))
            ->first();

        /*
        |--------------------------------------------------------------------------
        | INVALID USERNAME
        |--------------------------------------------------------------------------
        */

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid username or password.',
            ], 401);
        }

        /*
        |--------------------------------------------------------------------------
        | ACCOUNT STATUS CHECK
        |--------------------------------------------------------------------------
        |
        | Pending accounts must stop here.
        | Auth::attempt() will NOT be executed.
        |
        */

        if ($user->status === 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Your account is still pending. Please contact your Admin.',
            ], 403);
        }

        /*
        |--------------------------------------------------------------------------
        | ACCOUNT STATUS
        |--------------------------------------------------------------------------
        |
        | Only active accounts are allowed to continue.
        |
        */

        if ($user->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Your account is not active. Please contact your Admin.',
            ], 403);
        }

        /*
        |--------------------------------------------------------------------------
        | AUTHENTICATE USER
        |--------------------------------------------------------------------------
        */

        $credentials = [
            'username' => $request->input('username'),
            'password' => $request->input('password'),
        ];

        $remember = $request->boolean('remember');

        if (!Auth::attempt($credentials, $remember)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid username or password.',
            ], 401);
        }

        /*
        |--------------------------------------------------------------------------
        | REGENERATE SESSION
        |--------------------------------------------------------------------------
        |
        | Regenerate the session immediately after successful authentication.
        |
        */

        $request->session()->regenerate();

        /*
        |--------------------------------------------------------------------------
        | GET AUTHENTICATED USER
        |--------------------------------------------------------------------------
        */

        $authenticatedUser = Auth::user();

        if (!$authenticatedUser instanceof User) {
            Auth::logout();

            return response()->json([
                'success' => false,
                'message' => 'Unable to retrieve the authenticated user.',
            ], 401);
        }

        /*
        |--------------------------------------------------------------------------
        | CHECK USER ROLE
        |--------------------------------------------------------------------------
        |
        | The account is active and credentials are correct.
        | Now check if the user has at least one role.
        |
        */

        if (!$authenticatedUser->roles()->exists()) {

            Auth::logout();

            return response()->json([
                'success' => false,
                'message' => 'Your account is activated but no role has been assigned. Please contact your Admin.',
            ], 403);
        }

        /*
        |--------------------------------------------------------------------------
        | LOGIN SUCCESS
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'success' => true,
            'message' => 'Login successful.',
            'redirect' => route('dashboard'),
        ], 200);
    }

    /*
    |--------------------------------------------------------------------------
    | REGISTER
    |--------------------------------------------------------------------------
    */

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => [
                'required',
                'string',
                'min:3',
                'max:50',
                'unique:users,username',
            ],
            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users,email',
            ],
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
            ],
        ], [
            'username.required' => 'Please enter a username.',
            'username.min' => 'Username must be at least 3 characters.',
            'username.max' => 'Username cannot exceed 50 characters.',
            'username.unique' => 'This username is already registered.',
            'email.required' => 'Please enter your email address.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email address is already registered.',
            'password.required' => 'Please enter a password.',
            'password.min' => 'Password must be at least 8 characters.',
            'password.confirmed' => 'Passwords do not match.',
        ]);

        /*
        |--------------------------------------------------------------------------
        | REGISTRATION VALIDATION ERROR
        |--------------------------------------------------------------------------
        */

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Please check your registration details.',
                'errors' => $validator->errors(),
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | CREATE USER
        |--------------------------------------------------------------------------
        |
        | IMPORTANT:
        | No role is assigned during registration.
        | Role assignment will be handled by the Super Admin.
        |
        */

        User::create([
            'username' => $request->input('username'),
            'email' => $request->input('email'),
            'password' => $request->input('password'),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Registration successful. You can now sign in.',
        ], 201);
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

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully.',
            'redirect' => route('login'),
        ], 200);
    }
}

