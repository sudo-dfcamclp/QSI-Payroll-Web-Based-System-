<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\AuthController;

Route::get('/login', function () {
    return view('includes.login');
})->name('login');

Route::post('/api/login', [LoginController::class, 'login'])
    ->name('api.login');

Route::post('/api/register', [LoginController::class, 'register'])
    ->name('api.register');

Route::middleware('auth')->group(function () {

    // DASHBOARD
    Route::get('/dashboard', function () {
        return view('includes.dashboard');
    })->name('dashboard');

     // EMPLOYEE INFO
    Route::get('/employee/employee-info', function () {
        return view('employee.employee-info');
    })->name('employee.info');

    Route::post('/api/logout', [AuthController::class, 'logout'])
        ->name('api.logout');
});