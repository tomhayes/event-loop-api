<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\SavedEventController;
use App\Http\Controllers\EventAttendeeController;
use App\Http\Controllers\SpeakerApplicationController;
use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;

// Public auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public event routes (anyone can view)
Route::get('/events', [EventController::class, 'index']);
Route::get('/events/popular-tags', [EventController::class, 'popularTags']);
Route::get('/events/all-tags', [EventController::class, 'allTags']);
Route::get('/events/{event}', [EventController::class, 'show']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    // Auth user routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::put('/user/password', [AuthController::class, 'updatePassword']);
    Route::put('/user/preferences', [AuthController::class, 'updatePreferences']);
    
    // Saved events routes
    Route::get('/saved-events', [SavedEventController::class, 'index']);
    Route::post('/saved-events', [SavedEventController::class, 'store']);
    Route::post('/saved-events/toggle', [SavedEventController::class, 'toggle']);
    Route::delete('/saved-events/{eventId}', [SavedEventController::class, 'destroy']);
    
    // Event attendance routes
    Route::post('/event-attendance/toggle', [EventAttendeeController::class, 'toggle']);
    Route::get('/events/{event}/attendance', [EventAttendeeController::class, 'status']);
    
    // Speaker application routes
    Route::get('/speaker-applications', [SpeakerApplicationController::class, 'index']);
    Route::post('/speaker-applications', [SpeakerApplicationController::class, 'store']);
    Route::get('/speaker-applications/{speakerApplication}', [SpeakerApplicationController::class, 'show']);
    Route::put('/speaker-applications/{speakerApplication}', [SpeakerApplicationController::class, 'update']);
});

// Admin-only routes (require authentication + admin role)
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    // Speaker application management
    Route::post('/speaker-applications/{speakerApplication}/approve', [SpeakerApplicationController::class, 'approve']);
    Route::post('/speaker-applications/{speakerApplication}/reject', [SpeakerApplicationController::class, 'reject']);
    
    // Admin dashboard routes
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
    Route::get('/admin/analytics', [AdminController::class, 'analytics']);
    
    // User management
    Route::get('/admin/users', [AdminController::class, 'users']);
    Route::put('/admin/users/{user}/status', [AdminController::class, 'updateUserStatus']);
    Route::put('/admin/users/{user}/role', [AdminController::class, 'updateUserRole']);
    
    // Event management
    Route::get('/admin/events', [AdminController::class, 'events']);
    Route::delete('/admin/events/{event}', [AdminController::class, 'deleteEvent']);
    
    // Speaker application management
    Route::get('/admin/speaker-applications', [AdminController::class, 'speakerApplications']);
});

// Organizer-only routes (require authentication + organizer role)
Route::middleware(['auth:sanctum', 'organizer'])->group(function () {
    Route::post('/events', [EventController::class, 'store']);
    Route::put('/events/{event}', [EventController::class, 'update']);
    Route::delete('/events/{event}', [EventController::class, 'destroy']);
});
