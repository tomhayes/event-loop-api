<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Event;
use App\Models\User;

class EventReminderMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $event;
    public $user;
    public $daysUntil;

    /**
     * Create a new message instance.
     */
    public function __construct(Event $event, User $user, int $daysUntil)
    {
        $this->event = $event;
        $this->user = $user;
        $this->daysUntil = $daysUntil;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = $this->daysUntil === 1 
            ? "Reminder: {$this->event->title} is tomorrow!"
            : "Reminder: {$this->event->title} is in {$this->daysUntil} days";

        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.event-reminder',
            with: [
                'event' => $this->event,
                'user' => $this->user,
                'daysUntil' => $this->daysUntil,
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
