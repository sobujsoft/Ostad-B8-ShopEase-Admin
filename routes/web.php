<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
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

Route::get('/categories',              [CategoryController::class, 'index'])->name('categories.index');
Route::get('/categories/create',       [CategoryController::class, 'create'])->name('categories.create');
Route::get('/categories/{id}/edit',    [CategoryController::class, 'edit'])->name('categories.edit');

Route::get('/products',             [ProductController::class, 'index'])->name('products.index');
Route::get('/products/create',      [ProductController::class, 'create'])->name('products.create');
Route::get('/products/{id}/edit',   [ProductController::class, 'edit'])->name('products.edit');
