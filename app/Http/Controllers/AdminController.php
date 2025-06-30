<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Event;
use App\Models\SpeakerApplication;
use App\Models\SavedEvent;
use Carbon\Carbon;

class AdminController extends Controller
{
    /**
     * Get dashboard overview statistics
     */
    public function dashboard()
    {
        $stats = [
            'users' => [
                'total' => User::count(),
                'attendees' => User::where('role', 'attendee')->count(),
                'organizers' => User::where('role', 'organizer')->count(),
                'admins' => User::where('role', 'admin')->count(),
                'recent' => User::where('created_at', '>=', Carbon::now()->subDays(7))->count(),
            ],
            'events' => [
                'total' => Event::count(),
                'upcoming' => Event::where('start_date', '>', Carbon::now())->count(),
                'past' => Event::where('end_date', '<', Carbon::now())->count(),
                'current' => Event::where('start_date', '<=', Carbon::now())
                    ->where('end_date', '>=', Carbon::now())->count(),
                'by_type' => Event::selectRaw('type, COUNT(*) as count')
                    ->groupBy('type')
                    ->pluck('count', 'type'),
                'by_format' => Event::selectRaw('format, COUNT(*) as count')
                    ->groupBy('format')
                    ->pluck('count', 'format'),
            ],
            'speaker_applications' => [
                'total' => SpeakerApplication::count(),
                'pending' => SpeakerApplication::where('status', 'pending')->count(),
                'approved' => SpeakerApplication::where('status', 'approved')->count(),
                'rejected' => SpeakerApplication::where('status', 'rejected')->count(),
                'recent' => SpeakerApplication::where('created_at', '>=', Carbon::now()->subDays(7))->count(),
            ],
            'engagement' => [
                'saved_events' => SavedEvent::count(),
                'active_users' => User::whereHas('savedEvents')->count(),
                'popular_events' => Event::withCount('savedEvents')
                    ->orderBy('saved_events_count', 'desc')
                    ->take(5)
                    ->get(['id', 'title', 'saved_events_count']),
            ]
        ];

        return response()->json($stats);
    }

    /**
     * Get users with pagination and filters
     */
    public function users(Request $request)
    {
        $query = User::query();

        // Filter by role
        if ($request->has('role') && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        // Search by name or email
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'LIKE', '%' . $request->search . '%')
                  ->orWhere('email', 'LIKE', '%' . $request->search . '%')
                  ->orWhere('username', 'LIKE', '%' . $request->search . '%');
            });
        }

        // Filter by active status
        if ($request->has('active') && $request->active !== '') {
            $query->where('is_active', $request->boolean('active'));
        }

        $users = $query->withCount(['events', 'savedEvents', 'speakerApplications'])
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($users);
    }

    /**
     * Get events with pagination and filters for admin
     */
    public function events(Request $request)
    {
        $query = Event::with('user')->withCount('savedEvents');

        // Filter by type
        if ($request->has('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        // Filter by format
        if ($request->has('format') && $request->format !== 'all') {
            $query->where('format', $request->format);
        }

        // Filter by date range
        if ($request->has('date_filter')) {
            switch ($request->date_filter) {
                case 'upcoming':
                    $query->where('start_date', '>', Carbon::now());
                    break;
                case 'past':
                    $query->where('end_date', '<', Carbon::now());
                    break;
                case 'current':
                    $query->where('start_date', '<=', Carbon::now())
                          ->where('end_date', '>=', Carbon::now());
                    break;
            }
        }

        // Search by title or location
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'LIKE', '%' . $request->search . '%')
                  ->orWhere('location', 'LIKE', '%' . $request->search . '%')
                  ->orWhere('description', 'LIKE', '%' . $request->search . '%');
            });
        }

        $events = $query->orderBy('start_date', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($events);
    }

    /**
     * Get speaker applications with pagination and filters
     */
    public function speakerApplications(Request $request)
    {
        $query = SpeakerApplication::with('user');

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by proficiency level
        if ($request->has('proficiency') && $request->proficiency !== 'all') {
            $query->where('proficiency_level', $request->proficiency);
        }

        // Search by topic or user name
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('topic', 'LIKE', '%' . $request->search . '%')
                  ->orWhere('description', 'LIKE', '%' . $request->search . '%')
                  ->orWhereHas('user', function ($userQuery) use ($request) {
                      $userQuery->where('name', 'LIKE', '%' . $request->search . '%');
                  });
            });
        }

        $applications = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($applications);
    }

    /**
     * Update user status (activate/deactivate)
     */
    public function updateUserStatus(Request $request, User $user)
    {
        $request->validate([
            'is_active' => 'required|boolean',
        ]);

        $user->update(['is_active' => $request->is_active]);

        return response()->json([
            'message' => 'User status updated successfully',
            'user' => $user
        ]);
    }

    /**
     * Update user role
     */
    public function updateUserRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|in:attendee,organizer,admin',
        ]);

        $user->update(['role' => $request->role]);

        return response()->json([
            'message' => 'User role updated successfully',
            'user' => $user
        ]);
    }

    /**
     * Delete event (admin override)
     */
    public function deleteEvent(Event $event)
    {
        $event->delete();

        return response()->json([
            'message' => 'Event deleted successfully'
        ]);
    }

    /**
     * Get system analytics
     */
    public function analytics()
    {
        // User registration trends (last 30 days)
        $userTrends = User::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Event creation trends (last 30 days)
        $eventTrends = Event::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Popular tech tags
        $popularTags = Event::whereNotNull('tags')
            ->get()
            ->flatMap(function ($event) {
                return $event->tags ?? [];
            })
            ->countBy()
            ->sortDesc()
            ->take(10);

        // Top organizers by event count
        $topOrganizers = User::withCount('events')
            ->having('events_count', '>', 0)
            ->orderBy('events_count', 'desc')
            ->take(10)
            ->get(['id', 'name', 'username', 'events_count']);

        return response()->json([
            'user_trends' => $userTrends,
            'event_trends' => $eventTrends,
            'popular_tags' => $popularTags,
            'top_organizers' => $topOrganizers,
        ]);
    }
}
