<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserManagementController;
use App\Http\Controllers\RoleManagementController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\ClientMasterController;
use App\Http\Controllers\EmployeeMasterController;

// Login page
Route::get('/login', function () {
    return view('includes.login');
})->name('login');

// Login API
Route::post('/api/login', [LoginController::class, 'login'])
    ->name('api.login');

// Register API
Route::post('/api/register', [LoginController::class, 'register'])
    ->name('api.register');

Route::middleware('auth')->group(function () {

    // Dashboard page
    Route::get('/dashboard', function () {
        return view('includes.dashboard');
    })->name('dashboard');

    // Auth permissions
    Route::get('/api/auth/permissions', [AuthController::class, 'permissions'])
        ->name('api.auth.permissions');

    // =========================================================
    // EMPLOYEE MASTER
    // =========================================================

    // Employee information page
    Route::get('/employee/employee-info', function () {
        return view('employee.employee-info');
    })->name('employee.info');

    // Employee search
    Route::get('/api/employee-master/search', [EmployeeMasterController::class, 'search'])
        ->name('api.employee-master.search');

    // Employee clients
    Route::get('/api/employee-master/clients', [EmployeeMasterController::class, 'clients'])
        ->name('api.employee-master.clients');

    // Employee details
    Route::get('/api/employee-master/{emp_id}', [EmployeeMasterController::class, 'show'])
        ->name('api.employee-master.show');

    // Create employee
    Route::post('/api/employee-master', [EmployeeMasterController::class, 'store'])
        ->name('api.employee-master.store');

    // Update employee
    Route::put('/api/employee-master/{emp_id}', [EmployeeMasterController::class, 'update'])
        ->name('api.employee-master.update');

    // Archive / Recover employee
    Route::delete('/api/employee-master/{emp_id}', [EmployeeMasterController::class, 'archive'])
        ->name('api.employee-master.archive');

    // =========================================================
    // CONTRACT MONITORING
    // =========================================================

    // Contract monitoring page
    Route::get('/employee/contract-monitoring', function () {
        return view('employee.contract-monitoring');
    })->name('contract.monitoring');

    // =========================================================
    // CLIENT MASTER
    // =========================================================

    // Client master page
    Route::get('/employee/client-master', function () {
        return view('employee.client-master');
    })->name('client.master');

    // Client search
    Route::get('/api/client-master/search', [ClientMasterController::class, 'search'])
        ->name('api.client-master.search');

    // Client details
    // Uses client_id as the model binding key.
    Route::get(
        '/api/client-master/{client:client_id}',
        [ClientMasterController::class, 'show']
    )->name('api.client-master.show');

    // Create client
    Route::post('/api/client-master', [ClientMasterController::class, 'store'])
        ->name('api.client-master.store');

    // Update client
    // Uses client_id as the model binding key.
    Route::put(
        '/api/client-master/{client:client_id}',
        [ClientMasterController::class, 'update']
    )->name('api.client-master.update');

    // Archive / Recover client
    // Uses client_id as the model binding key.
    Route::delete(
        '/api/client-master/{client:client_id}',
        [ClientMasterController::class, 'destroy']
    )->name('api.client-master.destroy');

    // =========================================================
    // EMPLOYEE DEDUCTION
    // =========================================================

    // Employee deduction page
    Route::get('/employee/employee-deduction', function () {
        return view('employee.employee-deduction');
    })->name('employee.deduction');

    // =========================================================
    // EMPLOYEE PAYROLL
    // =========================================================

    // Employee payroll page
    Route::get('/employee/employee-payroll', function () {
        return view('employee.employee-payroll');
    })->name('employee.payroll');

    // =========================================================
    // SETTINGS
    // =========================================================

    // Settings page
    Route::get('/includes/setting', function () {
        return view('includes.setting');
    })->name('setting');

    // Get profile
    Route::get('/api/settings/profile', [SettingController::class, 'profile'])
        ->name('api.settings.profile');

    // Update profile
    Route::put('/api/settings/profile', [SettingController::class, 'updateProfile'])
        ->name('api.settings.profile.update');

    // Upload profile picture
    Route::post('/api/settings/profile/picture', [SettingController::class, 'changeProfile'])
        ->name('api.settings.profile.picture.upload');

    // Delete profile picture
    Route::delete('/api/settings/profile/picture', [SettingController::class, 'deleteProfile'])
        ->name('api.settings.profile.picture.delete');

    // Change password
    Route::put('/api/settings/password', [SettingController::class, 'changePassword'])
        ->name('api.settings.password.update');

    // =========================================================
    // USER MANAGEMENT
    // =========================================================

    Route::middleware('can:manage-users')->group(function () {

        // User management page
        Route::get('/admin/user-management', [UserManagementController::class, 'index'])
            ->name('UserManagement');

        // Get users
        Route::get('/api/admin/users', [UserManagementController::class, 'users'])
            ->name('api.admin.users');

        // Get deleted users
        Route::get('/api/admin/users/deleted', [UserManagementController::class, 'deletedUsers'])
            ->name('api.admin.users.deleted');

        // Permanently delete user
        Route::delete(
            '/api/admin/users/force-delete/{userId}',
            [UserManagementController::class, 'forceDeleteUser']
        )->name('api.admin.users.force-delete');

        // Update user status
        Route::patch(
            '/api/admin/users/{user}/status',
            [UserManagementController::class, 'toggleStatus']
        )->name('api.admin.users.status');

        // Reset user password
        Route::patch(
            '/api/admin/users/{user}/password',
            [UserManagementController::class, 'resetPassword']
        )->name('api.admin.users.password');

        // Delete user
        Route::delete(
            '/api/admin/users/{user}',
            [UserManagementController::class, 'deleteUser']
        )->name('api.admin.users.delete');
    });

    // =========================================================
    // ROLE MANAGEMENT
    // =========================================================

    Route::middleware('can:manage-roles')->group(function () {

        // Role management page
        Route::get('/admin/role-management', [RoleManagementController::class, 'index'])
            ->name('RoleManagement');

        // Get role users
        Route::get(
            '/api/admin/role-management/users',
            [RoleManagementController::class, 'users']
        )->name('api.admin.role-management.users');

        // Get roles
        Route::get(
            '/api/admin/role-management/roles',
            [RoleManagementController::class, 'roles']
        )->name('api.admin.role-management.roles');

        // Get user roles
        Route::get(
            '/api/admin/role-management/users/{user}/roles',
            [RoleManagementController::class, 'userRoles']
        )->name('api.admin.role-management.user-roles');

        // Update user role
        Route::patch(
            '/api/admin/role-management/users/{user}/roles',
            [RoleManagementController::class, 'updateRole']
        )->name('api.admin.role-management.update-role');
    });

    // =========================================================
    // LOGOUT
    // =========================================================

    Route::post('/api/logout', [AuthController::class, 'logout'])
        ->name('api.logout');
});

