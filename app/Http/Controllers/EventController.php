<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEventRequest;

class EventController extends Controller
{
    public function store(StoreEventRequest $request)
    {
        // For now, just return back the validated request data as JSON
        return response()->json($request->validated(), 201);
    }
}
