<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\AuthController;


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
    | LOGOUT
    |--------------------------------------------------------------------------
    */

    Route::post('/api/logout', [AuthController::class, 'logout'])
        ->name('api.logout');
});