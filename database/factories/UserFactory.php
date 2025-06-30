<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $firstName = fake()->firstName();
        $lastName = fake()->lastName();
        $username = strtolower($firstName . '.' . $lastName . fake()->numberBetween(1, 999));
        
        return [
            'name' => $firstName . ' ' . $lastName,
            'username' => $username,
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'role' => 'attendee',
            'is_active' => true,
            'preferences' => [
                'email_notifications' => fake()->boolean(80),
                'weekly_digest' => fake()->boolean(60),
                'event_reminders' => fake()->boolean(90),
                'preferred_topics' => fake()->randomElements([
                    'JavaScript', 'React', 'Vue', 'Node.js', 'Python', 'Django', 
                    'PHP', 'Laravel', 'Ruby', 'Java', 'Go', 'Rust', 'DevOps', 
                    'Docker', 'Kubernetes', 'AWS', 'Machine Learning', 'AI'
                ], fake()->numberBetween(2, 6))
            ]
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Create an organizer user.
     */
    public function organizer(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'organizer',
        ]);
    }

    /**
     * Create an admin user.
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'admin',
        ]);
    }
}
