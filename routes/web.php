
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserManagementController;
use App\Http\Controllers\RoleManagementController;
use App\Http\Controllers\SettingController;

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

    // Get authenticated user permissions
    Route::get('/api/auth/permissions', [AuthController::class, 'permissions'])
        ->name('api.auth.permissions');

    // Employee information page
    Route::get('/employee/employee-info', function () {
        return view('employee.employee-info');
    })->name('employee.info');

    // Employee deduction page
    Route::get('/employee/employee-deduction', function () {
        return view('employee.employee-deduction');
    })->name('employee.deduction');

        // Employee payroll page
    Route::get('/employee/employee-payroll', function () {
        return view('employee.employee-payroll');
    })->name('employee.payroll');

    // Settings page
    Route::get('/includes/setting', function () {
        return view('includes.setting');
    })->name('setting');

    // Get user profile
    Route::get('/api/settings/profile', [SettingController::class, 'profile'])
        ->name('api.settings.profile');

    // Update username and email
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

    // User management routes with MIDDLE WARE
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
        Route::delete('/api/admin/users/force-delete/{userId}', [UserManagementController::class, 'forceDeleteUser'])
            ->name('api.admin.users.force-delete');

        // Activate or disable user
        Route::patch('/api/admin/users/{user}/status', [UserManagementController::class, 'toggleStatus'])
            ->name('api.admin.users.status');

        // Reset user password
        Route::patch('/api/admin/users/{user}/password', [UserManagementController::class, 'resetPassword'])
            ->name('api.admin.users.password');

        // Delete user
        Route::delete('/api/admin/users/{user}', [UserManagementController::class, 'deleteUser'])
            ->name('api.admin.users.delete');
    });

    // Role management routes WITH MIDDLE WARE
    Route::middleware('can:manage-roles')->group(function () {

        // Role management page
        Route::get('/admin/role-management', [RoleManagementController::class, 'index'])
            ->name('RoleManagement');

        // Get users with roles
        Route::get('/api/admin/role-management/users', [RoleManagementController::class, 'users'])
            ->name('api.admin.role-management.users');

        // Get available roles
        Route::get('/api/admin/role-management/roles', [RoleManagementController::class, 'roles'])
            ->name('api.admin.role-management.roles');

        // Get assigned user roles
        Route::get('/api/admin/role-management/users/{user}/roles', [RoleManagementController::class, 'userRoles'])
            ->name('api.admin.role-management.user-roles');

        // Assign or remove user role
        Route::patch('/api/admin/role-management/users/{user}/roles', [RoleManagementController::class, 'updateRole'])
            ->name('api.admin.role-management.update-role');
    });

    // Logout API
    Route::post('/api/logout', [AuthController::class, 'logout'])
        ->name('api.logout');
});