<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SpeakerApplication>
 */
class SpeakerApplicationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $techTopics = [
            'Introduction to React Hooks',
            'Building Scalable APIs with Node.js',
            'Machine Learning for Beginners',
            'DevOps Best Practices',
            'Modern CSS Techniques',
            'Database Optimization Strategies',
            'Microservices Architecture',
            'Frontend Testing Strategies',
            'Cloud Security Fundamentals',
            'Performance Optimization in JavaScript',
            'Building Progressive Web Apps',
            'Docker for Development',
            'GraphQL vs REST APIs',
            'Serverless Architecture Patterns',
            'Mobile App Development with Flutter',
            'AI Ethics in Software Development',
            'Kubernetes for Beginners',
            'Modern PHP Development',
            'Web Accessibility Best Practices',
            'Blockchain Development Basics'
        ];

        $expertiseTags = [
            'JavaScript', 'React', 'Vue', 'Angular', 'Node.js', 'Python', 'Django',
            'PHP', 'Laravel', 'Ruby', 'Rails', 'Java', 'Spring', 'C#', '.NET',
            'Go', 'Rust', 'Swift', 'Kotlin', 'Flutter', 'React Native',
            'DevOps', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
            'Machine Learning', 'AI', 'Data Science', 'Blockchain', 'Web3',
            'Frontend', 'Backend', 'Full Stack', 'UI/UX', 'Design', 'Testing',
            'Security', 'Performance', 'Databases', 'GraphQL', 'API', 'Microservices'
        ];

        $regions = [
            'North America', 'Europe', 'Asia Pacific', 'Latin America', 'Africa',
            'San Francisco Bay Area', 'New York', 'London', 'Berlin', 'Tokyo',
            'Singapore', 'Sydney', 'Toronto', 'Remote'
        ];

        $firstName = fake()->firstName();
        $lastName = fake()->lastName();
        $username = strtolower($firstName . $lastName);

        return [
            'user_id' => User::factory(),
            'topic' => fake()->randomElement($techTopics),
            'description' => fake()->paragraphs(2, true),
            'proficiency_level' => fake()->randomElement(['beginner', 'intermediate', 'advanced', 'expert']),
            'expertise_tags' => fake()->randomElements($expertiseTags, fake()->numberBetween(3, 8)),
            'bio' => fake()->paragraph(),
            'linkedin_url' => fake()->boolean(70) ? 'https://linkedin.com/in/' . $username : null,
            'github_url' => fake()->boolean(80) ? 'https://github.com/' . $username : null,
            'portfolio_url' => fake()->boolean(50) ? 'https://' . $username . '.dev' : null,
            'available_for_remote' => fake()->boolean(85),
            'preferred_regions' => fake()->randomElements($regions, fake()->numberBetween(1, 4)),
            'status' => fake()->randomElement(['pending', 'approved', 'rejected']),
        ];
    }

    /**
     * Create a pending application.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }

    /**
     * Create an approved application.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
        ]);
    }

    /**
     * Create a rejected application.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
        ]);
    }
}
