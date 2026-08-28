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
        | LOGIN ATTEMPT
        |--------------------------------------------------------------------------
        */

        $credentials = [
            'username' => $request->input('username'),
            'password' => $request->input('password'),
        ];

        $remember = $request->boolean('remember');

        /*
        |--------------------------------------------------------------------------
        | AUTHENTICATE USER
        |--------------------------------------------------------------------------
        */

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
        */

        $request->session()->regenerate();

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
        /*
        |--------------------------------------------------------------------------
        | VALIDATE REGISTRATION
        |--------------------------------------------------------------------------
        */

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
        | VALIDATION FAILED
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
        | User.php should contain:
        |
        | protected $fillable = [
        |     'username',
        |     'email',
        |     'password',
        | ];
        |
        | And:
        |
        | protected function casts(): array
        | {
        |     return [
        |         'password' => 'hashed',
        |     ];
        | }
        |
        */

        User::create([
            'username' => $request->input('username'),
            'email' => $request->input('email'),
            'password' => $request->input('password'),
        ]);

        /*
        |--------------------------------------------------------------------------
        | REGISTRATION SUCCESS
        |--------------------------------------------------------------------------
        */

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
        /*
        |--------------------------------------------------------------------------
        | LOGOUT USER
        |--------------------------------------------------------------------------
        */

        Auth::logout();

        /*
        |--------------------------------------------------------------------------
        | INVALIDATE SESSION
        |--------------------------------------------------------------------------
        */

        $request->session()->invalidate();

        /*
        |--------------------------------------------------------------------------
        | GENERATE NEW CSRF TOKEN
        |--------------------------------------------------------------------------
        */

        $request->session()->regenerateToken();

        /*
        |--------------------------------------------------------------------------
        | LOGOUT SUCCESS
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully.',
            'redirect' => route('login'),
        ], 200);
    }
}

