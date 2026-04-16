<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class SectionController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Sections/Index');
    }
}
