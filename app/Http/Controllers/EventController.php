<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Http\Requests\StoreEventRequest;

class EventController extends Controller
{
    public function store(StoreEventRequest $request)
    {
        $validated = $request->validated();
        $event = Event::create($validated);
        return response()->json($event, 201);
    }

    public function index()
    {
        return response()->json(Event::all());
    }
}
