<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'location',
        'region',
        'start_date',
        'end_date',
        'description',
        'short_description',
        'long_description',
        'header_image',
        'organizer_logo',
        'type',
        'format',
        'tags',
        'user_id',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'tags' => 'array',
    ];

    /**
     * Get the user who created this event
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the saved events for this event
     */
    public function savedEvents(): HasMany
    {
        return $this->hasMany(SavedEvent::class);
    }

    /**
     * Get the attendees for this event
     */
    public function attendees(): HasMany
    {
        return $this->hasMany(EventAttendee::class);
    }

    /**
     * Check if a user can edit this event
     */
    public function canBeEditedBy(User $user): bool
    {
        return $user->isAdmin() || $this->user_id === $user->id;
    }

    /**
     * Check if a user can delete this event
     */
    public function canBeDeletedBy(User $user): bool
    {
        return $user->isAdmin() || $this->user_id === $user->id;
    }
}
