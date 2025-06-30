<?php

namespace App\Http\Controllers;

use App\Models\SavedEvent;
use Illuminate\Http\Request;

class SavedEventController extends Controller
{
    public function index(Request $request)
    {
        $savedEvents = $request->user()
            ->savedEvents()
            ->with(['event', 'event.user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($savedEvents);
    }

    public function store(Request $request)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'email_reminder' => 'boolean',
        ]);

        $savedEvent = SavedEvent::firstOrCreate(
            [
                'user_id' => $request->user()->id,
                'event_id' => $request->event_id,
            ],
            [
                'email_reminder' => $request->input('email_reminder', true),
            ]
        );

        return response()->json($savedEvent->load(['event', 'event.user']), 201);
    }

    public function destroy(Request $request, $eventId)
    {
        $savedEvent = SavedEvent::where([
            'user_id' => $request->user()->id,
            'event_id' => $eventId,
        ])->first();

        if (!$savedEvent) {
            return response()->json(['message' => 'Event not found in saved events'], 404);
        }

        $savedEvent->delete();

        return response()->json(['message' => 'Event removed from saved events']);
    }

    public function toggle(Request $request)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
        ]);

        $savedEvent = SavedEvent::where([
            'user_id' => $request->user()->id,
            'event_id' => $request->event_id,
        ])->first();

        if ($savedEvent) {
            $savedEvent->delete();
            return response()->json([
                'saved' => false,
                'message' => 'Event removed from saved events'
            ]);
        } else {
            $savedEvent = SavedEvent::create([
                'user_id' => $request->user()->id,
                'event_id' => $request->event_id,
                'email_reminder' => true,
            ]);

            return response()->json([
                'saved' => true,
                'message' => 'Event saved successfully',
                'saved_event' => $savedEvent->load(['event', 'event.user'])
            ], 201);
        }
    }
}
