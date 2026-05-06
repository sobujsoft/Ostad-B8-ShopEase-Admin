<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Orders/Index');
    }

    public function show(string $id): Response
    {
        return Inertia::render('Orders/Show', ['orderId' => $id]);
    }
}
