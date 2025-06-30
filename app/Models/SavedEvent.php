<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SavedEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'event_id',
        'email_reminder',
    ];

    protected $casts = [
        'email_reminder' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * Get the reminders sent for this saved event
     */
    public function remindersSent(): HasMany
    {
        return $this->hasMany(EventReminder::class);
    }
}
