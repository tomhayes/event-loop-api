<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEventRequest;
use App\Models\Event;

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

    public function show(Event $event)
    {
        return response()->json($event);
    }
}
