<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EventAttendee;
use App\Models\Event;

class EventAttendeeController extends Controller
{
    /**
     * Toggle attendance for an event
     */
    public function toggle(Request $request)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id'
        ]);

        $user = $request->user();
        $eventId = $request->event_id;

        $attendance = EventAttendee::where('user_id', $user->id)
            ->where('event_id', $eventId)
            ->first();

        if ($attendance) {
            // User is attending, remove attendance
            $attendance->delete();
            $attending = false;
        } else {
            // User is not attending, add attendance
            EventAttendee::create([
                'user_id' => $user->id,
                'event_id' => $eventId
            ]);
            $attending = true;
        }

        // Get updated attendance count
        $attendanceCount = EventAttendee::where('event_id', $eventId)->count();

        return response()->json([
            'attending' => $attending,
            'attendance_count' => $attendanceCount
        ]);
    }

    /**
     * Get attendance status and count for an event
     */
    public function status(Request $request, $eventId)
    {
        $user = $request->user();
        
        $attending = false;
        if ($user) {
            $attending = EventAttendee::where('user_id', $user->id)
                ->where('event_id', $eventId)
                ->exists();
        }

        $attendanceCount = EventAttendee::where('event_id', $eventId)->count();

        return response()->json([
            'attending' => $attending,
            'attendance_count' => $attendanceCount
        ]);
    }
}
