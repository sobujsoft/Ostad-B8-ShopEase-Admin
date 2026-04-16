<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Categories/Index');
    }

    public function create(): Response
    {
        return Inertia::render('Categories/Create');
    }

    public function edit(string $id): Response
    {
        return Inertia::render('Categories/Edit', ['categoryId' => $id]);
    }
}
