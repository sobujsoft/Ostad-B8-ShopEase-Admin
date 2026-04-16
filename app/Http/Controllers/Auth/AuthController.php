<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function loginPage(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function registerPage(): Response
    {
        return Inertia::render('Auth/Register');
    }
}
