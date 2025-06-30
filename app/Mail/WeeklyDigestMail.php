<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use Illuminate\Support\Collection;
use Carbon\Carbon;

class WeeklyDigestMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $user;
    public $newEvents;
    public $popularEvents;
    public $upcomingEvents;
    public $recommendedEvents;

    /**
     * Create a new message instance.
     */
    public function __construct(
        User $user,
        Collection $newEvents,
        Collection $popularEvents,
        Collection $upcomingEvents,
        Collection $recommendedEvents
    ) {
        $this->user = $user;
        $this->newEvents = $newEvents;
        $this->popularEvents = $popularEvents;
        $this->upcomingEvents = $upcomingEvents;
        $this->recommendedEvents = $recommendedEvents;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $weekStart = Carbon::now()->startOfWeek()->format('M j');
        $weekEnd = Carbon::now()->endOfWeek()->format('M j, Y');
        
        return new Envelope(
            subject: "Weekly Event Digest - {$weekStart} to {$weekEnd}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.weekly-digest',
            with: [
                'user' => $this->user,
                'newEvents' => $this->newEvents,
                'popularEvents' => $this->popularEvents,
                'upcomingEvents' => $this->upcomingEvents,
                'recommendedEvents' => $this->recommendedEvents,
                'weekStart' => Carbon::now()->startOfWeek()->format('M j'),
                'weekEnd' => Carbon::now()->endOfWeek()->format('M j, Y'),
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
