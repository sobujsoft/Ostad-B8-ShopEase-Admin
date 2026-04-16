<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Products/Index');
    }

    public function create(): Response
    {
        return Inertia::render('Products/Create');
    }

    public function edit(string $id): Response
    {
        return Inertia::render('Products/Edit', ['productId' => $id]);
    }
}
