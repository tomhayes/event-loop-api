<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Event;
use App\Models\SavedEvent;
use App\Models\SpeakerApplication;

class EventLoopSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🚀 Starting EventLoop database seeding...');

        // Create admin user
        $admin = User::factory()->admin()->create([
            'name' => 'Admin User',
            'username' => 'admin',
            'email' => 'admin@eventloop.dev',
        ]);
        $this->command->info('✅ Created admin user: admin@eventloop.dev');

        // Create organizers
        $organizers = User::factory()->organizer()->count(8)->create();
        $this->command->info('✅ Created 8 organizer users');

        // Create attendees
        $attendees = User::factory()->count(50)->create();
        $this->command->info('✅ Created 50 attendee users');

        // Create events with realistic distribution
        $allOrganizers = collect([$admin])->merge($organizers);
        
        // Past events (10)
        $pastEvents = collect();
        for ($i = 0; $i < 10; $i++) {
            $start = fake()->dateTimeBetween('-3 months', '-1 week');
            $end = (clone $start)->modify('+' . fake()->numberBetween(2, 72) . ' hours');
            
            $pastEvents->push(Event::factory()->create([
                'user_id' => fake()->randomElement($allOrganizers)->id,
                'start_date' => $start,
                'end_date' => $end,
            ]));
        }
        $this->command->info('✅ Created 10 past events');

        // Upcoming events (25)
        $upcomingEvents = collect();
        for ($i = 0; $i < 25; $i++) {
            $start = fake()->dateTimeBetween('now', '+2 months');
            $end = (clone $start)->modify('+' . fake()->numberBetween(2, 72) . ' hours');
            
            $upcomingEvents->push(Event::factory()->create([
                'user_id' => fake()->randomElement($allOrganizers)->id,
                'start_date' => $start,
                'end_date' => $end,
            ]));
        }
        $this->command->info('✅ Created 25 upcoming events');

        // Current/ongoing events (3)
        $currentEvents = collect();
        for ($i = 0; $i < 3; $i++) {
            $start = fake()->dateTimeBetween('-2 days', 'now');
            $end = fake()->dateTimeBetween('now', '+2 days');
            
            $currentEvents->push(Event::factory()->create([
                'user_id' => fake()->randomElement($allOrganizers)->id,
                'start_date' => $start,
                'end_date' => $end,
            ]));
        }
        $this->command->info('✅ Created 3 current/ongoing events');

        $allEvents = collect()
            ->merge($pastEvents)
            ->merge($upcomingEvents)
            ->merge($currentEvents);

        // Create saved events (attendees saving various events)
        $savedEventPairs = [];
        for ($i = 0; $i < 120; $i++) {
            $attendee = fake()->randomElement($attendees);
            $event = fake()->randomElement($allEvents);
            
            $key = $attendee->id . '-' . $event->id;
            if (!isset($savedEventPairs[$key])) {
                SavedEvent::factory()->create([
                    'user_id' => $attendee->id,
                    'event_id' => $event->id,
                ]);
                $savedEventPairs[$key] = true;
            }
        }
        $this->command->info('✅ Created saved events relationships');

        // Create speaker applications
        $selectedAttendees = fake()->randomElements($attendees, 25);
        
        // Pending applications (15)
        SpeakerApplication::factory()->pending()->count(15)->create([
            'user_id' => fake()->randomElement($selectedAttendees)->id,
        ]);
        
        // Approved applications (8)
        SpeakerApplication::factory()->approved()->count(8)->create([
            'user_id' => fake()->randomElement($selectedAttendees)->id,
        ]);
        
        // Rejected applications (2)
        SpeakerApplication::factory()->rejected()->count(2)->create([
            'user_id' => fake()->randomElement($selectedAttendees)->id,
        ]);
        
        $this->command->info('✅ Created 25 speaker applications (15 pending, 8 approved, 2 rejected)');

        $this->command->info('');
        $this->command->info('🎉 EventLoop seeding completed successfully!');
        $this->command->info('');
        $this->command->info('📊 Summary:');
        $this->command->info('   👤 Users: 59 total (1 admin, 8 organizers, 50 attendees)');
        $this->command->info('   📅 Events: 38 total (10 past, 25 upcoming, 3 current)');
        $this->command->info('   💾 Saved Events: ~120 relationships');
        $this->command->info('   🎤 Speaker Applications: 25 total');
        $this->command->info('');
        $this->command->info('🔑 Login credentials:');
        $this->command->info('   Admin: admin@eventloop.dev / password');
        $this->command->info('   All users: password');
    }
}
