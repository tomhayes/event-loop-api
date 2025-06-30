<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function store(StoreEventRequest $request)
    {
        $validated = $request->validated();
        $validated['user_id'] = $request->user()->id;
        $event = Event::create($validated);
        return response()->json($event->load('user'), 201);
    }

    public function index(Request $request)
    {
        $query = Event::with('user');

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filter by format
        if ($request->has('format')) {
            $query->where('format', $request->format);
        }

        // Filter by region
        if ($request->has('region')) {
            $query->where('region', 'LIKE', '%' . $request->region . '%');
        }

        // Filter by tags (support multiple tags with OR logic)
        if ($request->has('tags')) {
            $tags = is_array($request->tags) ? $request->tags : explode(',', $request->tags);
            $query->where(function ($q) use ($tags) {
                foreach ($tags as $tag) {
                    $q->orWhereJsonContains('tags', trim($tag));
                }
            });
        } elseif ($request->has('tag')) {
            // Backward compatibility for single tag filter
            $query->whereJsonContains('tags', $request->tag);
        }

        // Search filter
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'LIKE', '%' . $request->search . '%')
                  ->orWhere('description', 'LIKE', '%' . $request->search . '%')
                  ->orWhere('short_description', 'LIKE', '%' . $request->search . '%')
                  ->orWhere('long_description', 'LIKE', '%' . $request->search . '%')
                  ->orWhere('location', 'LIKE', '%' . $request->search . '%');
            });
        }

        // Filter by date range
        if ($request->has('start_date')) {
            $query->where('start_date', '>=', $request->start_date);
        }

        if ($request->has('end_date')) {
            $query->where('end_date', '<=', $request->end_date);
        }

        // Filter upcoming events only
        if ($request->has('upcoming_only') && $request->boolean('upcoming_only')) {
            $query->where('start_date', '>=', now());
        }

        // Apply sorting
        $sortBy = $request->get('sort_by', 'soonest');
        $selectedTags = [];
        
        if ($request->has('tags')) {
            $selectedTags = is_array($request->tags) ? $request->tags : explode(',', $request->tags);
        }
        
        switch ($sortBy) {
            case 'relevance':
                // Only apply relevance sorting if user has selected tags
                if (!empty($selectedTags)) {
                    // Add relevance score calculation
                    $query->selectRaw('events.*, (
                        CASE 
                            WHEN events.tags IS NOT NULL THEN
                                (SELECT COUNT(*) FROM JSON_TABLE(events.tags, "$[*]" COLUMNS(tag VARCHAR(255) PATH "$")) jt 
                                 WHERE jt.tag IN ("' . implode('","', array_map('addslashes', $selectedTags)) . '"))
                            ELSE 0
                        END
                    ) as relevance_score')
                    ->orderByDesc('relevance_score')
                    ->orderBy('start_date');
                } else {
                    // Fallback to soonest if no tags selected
                    $query->orderBy('start_date');
                }
                break;
            case 'newest':
                $query->orderByDesc('created_at');
                break;
            case 'oldest':
                $query->orderBy('created_at');
                break;
            case 'soonest':
            default:
                $query->orderBy('start_date');
                break;
        }

        // Get pagination parameters
        $perPage = $request->get('per_page', 15);
        $page = $request->get('page', 1);

        // Get paginated events with counts
        $events = $query->withCount('attendees')->paginate($perPage, ['*'], 'page', $page);
        
        // Include saved and attendance status for authenticated users
        if ($request->user()) {
            $events->getCollection()->each(function ($event) use ($request) {
                $event->is_saved = $request->user()->hasSavedEvent($event->id);
                $event->is_attending = $request->user()->hasAttendedEvent($event->id);
            });
        } else {
            // For unauthenticated users, set defaults
            $events->getCollection()->each(function ($event) {
                $event->is_saved = false;
                $event->is_attending = false;
            });
        }

        return response()->json($events);
    }

    public function popularTags()
    {
        // Get all events with tags
        $events = Event::whereNotNull('tags')->get();
        
        // Flatten all tags and count occurrences
        $tagCounts = [];
        foreach ($events as $event) {
            if ($event->tags && is_array($event->tags)) {
                foreach ($event->tags as $tag) {
                    $tagCounts[$tag] = ($tagCounts[$tag] ?? 0) + 1;
                }
            }
        }
        
        // Sort by count descending and take top 6
        arsort($tagCounts);
        $popularTags = array_slice($tagCounts, 0, 6, true);
        
        // Format for frontend
        $formattedTags = [];
        foreach ($popularTags as $tag => $count) {
            $formattedTags[] = [
                'name' => $tag,
                'count' => $count,
                'display' => "{$tag} ({$count})"
            ];
        }
        
        return response()->json($formattedTags);
    }

    public function allTags(Request $request)
    {
        // Start with base query
        $query = Event::whereNotNull('tags');
        
        // Apply the same filters as the main events endpoint
        
        // Filter by type
        if ($request->has('type') && $request->type !== 'All') {
            $query->where('type', $request->type);
        }

        // Filter by format
        if ($request->has('format') && $request->format !== 'All') {
            $query->where('format', $request->format);
        }

        // Filter by region
        if ($request->has('region')) {
            $query->where('region', 'LIKE', '%' . $request->region . '%');
        }

        // Search filter
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'LIKE', '%' . $request->search . '%')
                  ->orWhere('description', 'LIKE', '%' . $request->search . '%')
                  ->orWhere('short_description', 'LIKE', '%' . $request->search . '%')
                  ->orWhere('long_description', 'LIKE', '%' . $request->search . '%')
                  ->orWhere('location', 'LIKE', '%' . $request->search . '%');
            });
        }

        // Filter by date range
        if ($request->has('start_date')) {
            $query->where('start_date', '>=', $request->start_date);
        }

        if ($request->has('end_date')) {
            $query->where('end_date', '<=', $request->end_date);
        }

        // Filter upcoming events only
        if ($request->has('upcoming_only') && $request->boolean('upcoming_only')) {
            $query->where('start_date', '>=', now());
        }
        
        // Get filtered events
        $events = $query->get();
        
        // Count occurrences of each tag
        $tagCounts = [];
        foreach ($events as $event) {
            if ($event->tags && is_array($event->tags)) {
                foreach ($event->tags as $tag) {
                    $tagCounts[$tag] = ($tagCounts[$tag] ?? 0) + 1;
                }
            }
        }
        
        // Filter out tags with 0 events
        $filteredTags = array_filter($tagCounts, function($count) {
            return $count > 0;
        });
        
        // Format for frontend with counts
        $formattedTags = [];
        foreach ($filteredTags as $tag => $count) {
            $formattedTags[] = [
                'name' => $tag,
                'count' => $count,
                'display' => "{$tag} ({$count})"
            ];
        }
        
        // Sort alphabetically by tag name
        usort($formattedTags, function($a, $b) {
            return strcmp($a['name'], $b['name']);
        });
        
        return response()->json($formattedTags);
    }

    public function show(Request $request, Event $event)
    {
        // Load relationships and count attendees
        $event->load('user');
        $event->loadCount('attendees');
        
        // Include user-specific status if authenticated
        if ($request->user()) {
            $event->is_saved = $request->user()->hasSavedEvent($event->id);
            $event->is_attending = $request->user()->hasAttendedEvent($event->id);
        } else {
            $event->is_saved = false;
            $event->is_attending = false;
        }
        
        return response()->json($event);
    }

    public function update(UpdateEventRequest $request, Event $event)
    {
        $user = $request->user();
        
        if (!$event->canBeEditedBy($user)) {
            return response()->json([
                'message' => 'Access denied. You can only edit events you created.'
            ], 403);
        }

        $validated = $request->validated();
        $event->update($validated);
        return response()->json($event->load('user'));
    }

    public function destroy(Event $event)
    {
        $user = request()->user();
        
        if (!$event->canBeDeletedBy($user)) {
            return response()->json([
                'message' => 'Access denied. You can only delete events you created.'
            ], 403);
        }

        $event->delete();
        return response()->json(['message' => 'Event deleted successfully']);
    }
}
