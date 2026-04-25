<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class HeroBannerController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('HeroBanners/Index');
    }

    public function create(): Response
    {
        return Inertia::render('HeroBanners/Create');
    }

    public function edit(string $id): Response
    {
        return Inertia::render('HeroBanners/Edit', ['bannerId' => $id]);
    }
}
