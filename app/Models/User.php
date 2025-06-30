<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'role',
        'preferences',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'preferences' => 'array',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Check if user is an organizer
     */
    public function isOrganizer(): bool
    {
        return $this->role === 'organizer';
    }

    /**
     * Check if user is an attendee
     */
    public function isAttendee(): bool
    {
        return $this->role === 'attendee';
    }

    /**
     * Check if user is an admin
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Get user's preferred tags
     */
    public function getPreferredTags(): array
    {
        return $this->preferences['tags'] ?? [];
    }

    /**
     * Set user's preferred tags
     */
    public function setPreferredTags(array $tags): void
    {
        $preferences = $this->preferences ?? [];
        $preferences['tags'] = $tags;
        $this->preferences = $preferences;
    }

    /**
     * Events created by this user
     */
    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }

    /**
     * Events saved by this user
     */
    public function savedEvents(): HasMany
    {
        return $this->hasMany(SavedEvent::class);
    }

    /**
     * Speaker applications by this user
     */
    public function speakerApplications(): HasMany
    {
        return $this->hasMany(SpeakerApplication::class);
    }

    /**
     * Events attended by this user
     */
    public function attendedEvents(): HasMany
    {
        return $this->hasMany(EventAttendee::class);
    }

    /**
     * Check if user has saved a specific event
     */
    public function hasSavedEvent(int $eventId): bool
    {
        return $this->savedEvents()->where('event_id', $eventId)->exists();
    }

    /**
     * Check if user is attending a specific event
     */
    public function hasAttendedEvent(int $eventId): bool
    {
        return $this->attendedEvents()->where('event_id', $eventId)->exists();
    }
}
