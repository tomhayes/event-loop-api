<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Event;
use App\Mail\WeeklyDigestMail;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class SendWeeklyDigest extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'events:send-weekly-digest {--test-email= : Send test digest to specific email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send weekly digest of new and popular events to users';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $testEmail = $this->option('test-email');
        
        if ($testEmail) {
            $this->sendTestDigest($testEmail);
            return;
        }

        $this->info('Generating weekly event digest...');

        // Get events from the past week (new events)
        $newEvents = Event::where('created_at', '>=', Carbon::now()->subWeek())
            ->with('user')
            ->withCount('attendees')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Get popular events (most attendees) from upcoming events
        $popularEvents = Event::where('start_date', '>=', Carbon::now())
            ->with('user')
            ->withCount('attendees')
            ->orderBy('attendees_count', 'desc')
            ->limit(5)
            ->get();

        // Get upcoming events in the next 2 weeks
        $upcomingEvents = Event::whereBetween('start_date', [
            Carbon::now(),
            Carbon::now()->addWeeks(2)
        ])
        ->with('user')
        ->withCount('attendees')
        ->orderBy('start_date')
        ->limit(10)
        ->get();

        if ($newEvents->isEmpty() && $popularEvents->isEmpty() && $upcomingEvents->isEmpty()) {
            $this->info('No events to include in digest. Skipping email sending.');
            return;
        }

        // Get users who want to receive digests (we'll assume all active users for now)
        $users = User::where('is_active', true)
            ->whereNotNull('email_verified_at')
            ->get();

        $this->info("Sending digest to {$users->count()} users...");

        $sentCount = 0;

        foreach ($users as $user) {
            try {
                // Get personalized recommendations based on user's saved event tags
                $userTags = $this->getUserPreferredTags($user);
                $recommendedEvents = $this->getRecommendedEvents($user, $userTags);

                Mail::to($user->email)
                    ->send(new WeeklyDigestMail(
                        $user,
                        $newEvents,
                        $popularEvents,
                        $upcomingEvents,
                        $recommendedEvents
                    ));

                $sentCount++;
                $this->line("Sent digest to {$user->email}");

            } catch (\Exception $e) {
                $this->error("Failed to send digest to {$user->email}: " . $e->getMessage());
            }
        }

        $this->info("Successfully sent weekly digest to {$sentCount} users.");
    }

    private function sendTestDigest(string $email)
    {
        $this->info("Sending test digest to {$email}...");

        // Get sample data for test
        $newEvents = Event::with('user')->withCount('attendees')->limit(3)->get();
        $popularEvents = Event::with('user')->withCount('attendees')->limit(3)->get();
        $upcomingEvents = Event::with('user')->withCount('attendees')->limit(5)->get();

        $testUser = new User([
            'name' => 'Test User',
            'email' => $email
        ]);

        try {
            Mail::to($email)
                ->send(new WeeklyDigestMail(
                    $testUser,
                    $newEvents,
                    $popularEvents,
                    $upcomingEvents,
                    collect()
                ));

            $this->info("Test digest sent successfully to {$email}");
        } catch (\Exception $e) {
            $this->error("Failed to send test digest: " . $e->getMessage());
        }
    }

    private function getUserPreferredTags(User $user): array
    {
        // Get tags from user's saved events
        $savedTags = $user->savedEvents()
            ->with('event')
            ->get()
            ->pluck('event.tags')
            ->flatten()
            ->filter()
            ->countBy()
            ->sortDesc()
            ->keys()
            ->take(5)
            ->toArray();

        // Merge with user preferences if they exist
        $preferredTags = $user->getPreferredTags();
        
        return array_unique(array_merge($savedTags, $preferredTags));
    }

    private function getRecommendedEvents(User $user, array $userTags)
    {
        if (empty($userTags)) {
            return collect();
        }

        return Event::where('start_date', '>=', Carbon::now())
            ->where(function ($query) use ($userTags) {
                foreach ($userTags as $tag) {
                    $query->orWhereJsonContains('tags', $tag);
                }
            })
            ->with('user')
            ->withCount('attendees')
            ->orderBy('start_date')
            ->limit(3)
            ->get();
    }
}
