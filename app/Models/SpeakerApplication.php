<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SpeakerApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'topic',
        'description',
        'proficiency_level',
        'expertise_tags',
        'bio',
        'linkedin_url',
        'github_url',
        'portfolio_url',
        'available_for_remote',
        'preferred_regions',
        'status',
    ];

    protected $casts = [
        'expertise_tags' => 'array',
        'preferred_regions' => 'array',
        'available_for_remote' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function approve(): void
    {
        $this->update(['status' => 'approved']);
    }

    public function reject(): void
    {
        $this->update(['status' => 'rejected']);
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }
}
