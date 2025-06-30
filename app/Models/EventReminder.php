<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventReminder extends Model
{
    use HasFactory;

    protected $fillable = [
        'saved_event_id',
        'event_id',
        'days_before',
        'sent_at',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
    ];

    /**
     * Get the saved event that this reminder belongs to
     */
    public function savedEvent(): BelongsTo
    {
        return $this->belongsTo(SavedEvent::class);
    }

    /**
     * Get the event that this reminder is for
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }
}
