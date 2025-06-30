<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\SavedEvent;
use App\Models\Event;
use App\Mail\EventReminderMail;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class SendEventReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'events:send-reminders {--days=1 : Number of days before event to send reminder}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send email reminders for saved events that are starting soon';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $days = $this->option('days');
        $reminderDate = Carbon::now()->addDays($days)->startOfDay();
        $endOfDay = $reminderDate->copy()->endOfDay();

        $this->info("Sending reminders for events starting on " . $reminderDate->toDateString());

        // Find events that start within the reminder window
        $upcomingEvents = Event::whereBetween('start_date', [$reminderDate, $endOfDay])
            ->with('user')
            ->get();

        if ($upcomingEvents->isEmpty()) {
            $this->info('No events found for the specified date range.');
            return;
        }

        $this->info("Found {$upcomingEvents->count()} events starting on this date.");

        $totalReminders = 0;

        foreach ($upcomingEvents as $event) {
            // Find all users who have saved this event with email reminders enabled
            $savedEvents = SavedEvent::where('event_id', $event->id)
                ->where('email_reminder', true)
                ->whereDoesntHave('remindersSent', function ($query) use ($event, $days) {
                    $query->where('event_id', $event->id)
                          ->where('days_before', $days)
                          ->whereDate('sent_at', Carbon::today());
                })
                ->with('user')
                ->get();

            foreach ($savedEvents as $savedEvent) {
                try {
                    // Send the reminder email
                    Mail::to($savedEvent->user->email)
                        ->send(new EventReminderMail($event, $savedEvent->user, $days));

                    // Track that we sent this reminder
                    $savedEvent->remindersSent()->create([
                        'saved_event_id' => $savedEvent->id,
                        'event_id' => $event->id,
                        'days_before' => $days,
                        'sent_at' => Carbon::now(),
                    ]);

                    $totalReminders++;
                    
                    $this->line("Sent reminder to {$savedEvent->user->email} for event: {$event->title}");
                    
                } catch (\Exception $e) {
                    $this->error("Failed to send reminder to {$savedEvent->user->email}: " . $e->getMessage());
                }
            }
        }

        $this->info("Successfully sent {$totalReminders} event reminders.");
    }
}
