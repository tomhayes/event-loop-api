<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class EventController extends Controller
{
    public function store(Request $request)
    {
        // For now, just return back the request data as JSON
        return response()->json($request->all(), 201);
    }
}
