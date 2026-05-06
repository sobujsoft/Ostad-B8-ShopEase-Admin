<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Customers/Index');
    }

    public function show(string $id): Response
    {
        return Inertia::render('Customers/Show', ['customerId' => $id]);
    }
}
