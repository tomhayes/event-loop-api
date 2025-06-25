<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventController;

Route::post('/events', [EventController::class, 'store']);
