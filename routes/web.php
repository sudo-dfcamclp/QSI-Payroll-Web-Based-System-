<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserManagementController;
use App\Http\Controllers\RoleManagementController;


/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// LOGIN PAGE
Route::get('/login', function () {
    return view('includes.login');
})->name('login');

// LOGIN API
Route::post('/api/login', [LoginController::class, 'login'])
    ->name('api.login');

// REGISTER API
Route::post('/api/register', [LoginController::class, 'register'])
    ->name('api.register');


/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | DASHBOARD
    |--------------------------------------------------------------------------
    */

    Route::get('/dashboard', function () {
        return view('includes.dashboard');
    })->name('dashboard');


    /*
    |--------------------------------------------------------------------------
    | AUTHENTICATED USER PERMISSIONS
    |--------------------------------------------------------------------------
    |
    | Used by the Tab Manager to determine which tabs can be
    | restored or opened for the currently authenticated user.
    |
    */

    Route::get('/api/auth/permissions', [AuthController::class, 'permissions'])
        ->name('api.auth.permissions');


    /*
    |--------------------------------------------------------------------------
    | EMPLOYEE INFO
    |--------------------------------------------------------------------------
    */

    Route::get('/employee/employee-info', function () {
        return view('employee.employee-info');
    })->name('employee.info');


    /*
    |--------------------------------------------------------------------------
    | EMPLOYEE DEDUCTION
    |--------------------------------------------------------------------------
    */

    Route::get('/employee/employee-deduction', function () {
        return view('employee.employee-deduction');
    })->name('employee.deduction');


    /*
    |--------------------------------------------------------------------------
    | USER MANAGEMENT
    |--------------------------------------------------------------------------
    |
    | Only users with the "manage-users" ability may access
    | the User Management page and its API endpoints.
    |
    */

    Route::middleware('can:manage-users')->group(function () {

        // USER MANAGEMENT PAGE
        Route::get(
            '/admin/user-management',
            [UserManagementController::class, 'index']
        )->name('UserManagement');


        // GET USERS
        Route::get(
            '/api/admin/users',
            [UserManagementController::class, 'users']
        )->name('api.admin.users');


        // ACTIVATE / DISABLE USER
        Route::patch(
            '/api/admin/users/{user}/status',
            [UserManagementController::class, 'toggleStatus']
        )->name('api.admin.users.status');


        // RESET USER PASSWORD
        Route::patch(
            '/api/admin/users/{user}/password',
            [UserManagementController::class, 'resetPassword']
        )->name('api.admin.users.password');

    });


    /*
|--------------------------------------------------------------------------
| ROLE MANAGEMENT
|--------------------------------------------------------------------------
*/

Route::middleware('can:manage-roles')->group(function () {

    // ROLE MANAGEMENT PAGE
    Route::get(
        '/admin/role-management',
        [RoleManagementController::class, 'index']
    )->name('RoleManagement');


    // GET USERS WITH ROLES
    Route::get(
        '/api/admin/role-management/users',
        [RoleManagementController::class, 'users']
    )->name('api.admin.role-management.users');


    // GET AVAILABLE ROLES
    Route::get(
        '/api/admin/role-management/roles',
        [RoleManagementController::class, 'roles']
    )->name('api.admin.role-management.roles');


    // GET USER ASSIGNED ROLES
    Route::get(
        '/api/admin/role-management/users/{user}/roles',
        [RoleManagementController::class, 'userRoles']
    )->name('api.admin.role-management.user-roles');


    // ASSIGN / REMOVE USER ROLE
    Route::patch(
        '/api/admin/role-management/users/{user}/roles',
        [RoleManagementController::class, 'updateRole']
    )->name('api.admin.role-management.update-role');

});


    /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */

    Route::post('/api/logout', [AuthController::class, 'logout'])
        ->name('api.logout');

});