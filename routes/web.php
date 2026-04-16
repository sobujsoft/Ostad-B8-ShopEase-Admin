<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

// Redirect base URL to login
Route::get('/', fn () => redirect()->route('login'));

// Guest routes (auth pages)
Route::middleware('guest')->group(function () {
    Route::get('/login',    [AuthController::class, 'loginPage'])->name('login');
    Route::get('/register', [AuthController::class, 'registerPage'])->name('register');
});

// Protected routes
Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
