<?php

namespace App\Http\Controllers;

use App\Models\SpeakerApplication;
use Illuminate\Http\Request;

class SpeakerApplicationController extends Controller
{
    public function index(Request $request)
    {
        $query = SpeakerApplication::with('user');

        // For organizers/admins: show all approved speakers
        if ($request->user()->isOrganizer() || $request->user()->isAdmin()) {
            $query->where('status', 'approved');
        } else {
            // For attendees: show only their own applications
            $query->where('user_id', $request->user()->id);
        }

        // Optional filtering
        if ($request->has('expertise_tag')) {
            $query->whereJsonContains('expertise_tags', $request->expertise_tag);
        }

        if ($request->has('proficiency_level')) {
            $query->where('proficiency_level', $request->proficiency_level);
        }

        if ($request->has('available_for_remote')) {
            $query->where('available_for_remote', $request->boolean('available_for_remote'));
        }

        $applications = $query->orderBy('created_at', 'desc')->get();

        return response()->json($applications);
    }

    public function store(Request $request)
    {
        // Only attendees can apply to become speakers
        if (!$request->user()->isAttendee()) {
            return response()->json([
                'message' => 'Only attendees can apply to become speakers'
            ], 403);
        }

        $request->validate([
            'topic' => 'required|string|max:255',
            'description' => 'required|string',
            'proficiency_level' => 'required|in:beginner,intermediate,advanced,expert',
            'expertise_tags' => 'array',
            'expertise_tags.*' => 'string|max:50',
            'bio' => 'nullable|string',
            'linkedin_url' => 'nullable|url',
            'github_url' => 'nullable|url',
            'portfolio_url' => 'nullable|url',
            'available_for_remote' => 'boolean',
            'preferred_regions' => 'array',
            'preferred_regions.*' => 'string|max:100',
        ]);

        $application = SpeakerApplication::create([
            'user_id' => $request->user()->id,
            'topic' => $request->topic,
            'description' => $request->description,
            'proficiency_level' => $request->proficiency_level,
            'expertise_tags' => $request->input('expertise_tags', []),
            'bio' => $request->bio,
            'linkedin_url' => $request->linkedin_url,
            'github_url' => $request->github_url,
            'portfolio_url' => $request->portfolio_url,
            'available_for_remote' => $request->input('available_for_remote', true),
            'preferred_regions' => $request->input('preferred_regions', []),
        ]);

        return response()->json($application->load('user'), 201);
    }

    public function show(SpeakerApplication $speakerApplication)
    {
        return response()->json($speakerApplication->load('user'));
    }

    public function update(Request $request, SpeakerApplication $speakerApplication)
    {
        // Users can only update their own applications
        if ($speakerApplication->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Only allow updates if still pending
        if (!$speakerApplication->isPending()) {
            return response()->json([
                'message' => 'Cannot update application that has been reviewed'
            ], 400);
        }

        $request->validate([
            'topic' => 'required|string|max:255',
            'description' => 'required|string',
            'proficiency_level' => 'required|in:beginner,intermediate,advanced,expert',
            'expertise_tags' => 'array',
            'expertise_tags.*' => 'string|max:50',
            'bio' => 'nullable|string',
            'linkedin_url' => 'nullable|url',
            'github_url' => 'nullable|url',
            'portfolio_url' => 'nullable|url',
            'available_for_remote' => 'boolean',
            'preferred_regions' => 'array',
            'preferred_regions.*' => 'string|max:100',
        ]);

        $speakerApplication->update($request->validated());

        return response()->json($speakerApplication->load('user'));
    }

    public function approve(Request $request, SpeakerApplication $speakerApplication)
    {
        // Only admins can approve applications
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $speakerApplication->approve();

        return response()->json([
            'message' => 'Speaker application approved',
            'application' => $speakerApplication->load('user')
        ]);
    }

    public function reject(Request $request, SpeakerApplication $speakerApplication)
    {
        // Only admins can reject applications
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $speakerApplication->reject();

        return response()->json([
            'message' => 'Speaker application rejected',
            'application' => $speakerApplication->load('user')
        ]);
    }
}
