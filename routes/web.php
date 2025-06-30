<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Catch-all route for React Router - must be last
Route::get('/{path}', function () {
    return view('welcome');
})->where('path', '.*');
