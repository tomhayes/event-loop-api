<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $eventTemplates = [
            'conference' => [
                'titles' => [
                    'DevConf {tech} {year}',
                    '{tech} World Conference',
                    'International {tech} Summit',
                    '{tech} Connect {year}',
                    'Future of {tech} Conference',
                    '{tech} Developers Conference',
                    'Tech Summit: {tech} Edition'
                ],
                'duration_hours' => [24, 48, 72], // 1-3 days
                'types' => ['Conference']
            ],
            'meetup' => [
                'titles' => [
                    '{city} {tech} Meetup',
                    '{tech} Developers Meetup',
                    '{city} Tech Talks: {tech}',
                    'Monthly {tech} Meetup',
                    '{tech} Community Meetup',
                    'Learn {tech} Together',
                    '{city} {tech} User Group'
                ],
                'duration_hours' => [2, 3, 4], // 2-4 hours
                'types' => ['Meetup']
            ],
            'workshop' => [
                'titles' => [
                    'Hands-on {tech} Workshop',
                    'Build with {tech}',
                    '{tech} Bootcamp',
                    'Master {tech} in One Day',
                    '{tech} Deep Dive Workshop',
                    'Learn {tech} from Scratch',
                    'Advanced {tech} Techniques'
                ],
                'duration_hours' => [6, 8, 12], // Half day to full day
                'types' => ['Workshop']
            ]
        ];

        $techStacks = [
            'JavaScript', 'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 
            'Django', 'Flask', 'PHP', 'Laravel', 'Ruby on Rails', 'Java', 
            'Spring Boot', 'C#', '.NET', 'Go', 'Rust', 'Swift', 'Kotlin',
            'Flutter', 'React Native', 'Docker', 'Kubernetes', 'AWS', 
            'Azure', 'GCP', 'DevOps', 'Machine Learning', 'AI', 'Blockchain',
            'GraphQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch'
        ];

        $regions = [
            'North America', 'Europe', 'Asia Pacific', 'Latin America',
            'San Francisco Bay Area', 'New York', 'London', 'Berlin', 
            'Tokyo', 'Singapore', 'Sydney', 'Toronto', 'Amsterdam',
            'Stockholm', 'Barcelona', 'Austin', 'Seattle', 'Boston'
        ];

        $cities = [
            'San Francisco', 'New York', 'London', 'Berlin', 'Tokyo',
            'Singapore', 'Sydney', 'Toronto', 'Amsterdam', 'Stockholm',
            'Barcelona', 'Austin', 'Seattle', 'Boston', 'Paris',
            'Madrid', 'Rome', 'Copenhagen', 'Oslo', 'Dublin'
        ];

        $formats = ['online', 'in-person', 'hybrid'];
        $eventType = fake()->randomElement(array_keys($eventTemplates));
        $template = $eventTemplates[$eventType];
        
        $tech = fake()->randomElement($techStacks);
        $city = fake()->randomElement($cities);
        $region = fake()->randomElement($regions);
        $format = fake()->randomElement($formats);
        
        $titleTemplate = fake()->randomElement($template['titles']);
        $title = str_replace(['{tech}', '{city}', '{year}'], [$tech, $city, date('Y')], $titleTemplate);
        
        $durationHours = fake()->randomElement($template['duration_hours']);
        // Don't set a default start time here - let seeder control it
        $start = fake()->dateTimeBetween('-1 month', '+3 months');
        $end = (clone $start)->modify('+' . $durationHours . ' hours');

        $relatedTechs = fake()->randomElements($techStacks, fake()->numberBetween(2, 5));
        $relatedTechs[] = $tech; // Ensure main tech is included
        $tags = array_unique($relatedTechs);

        $descriptions = [
            "Join us for an exciting exploration of {tech} and its latest developments. This event brings together developers, engineers, and tech enthusiasts to share knowledge, network, and learn from industry experts.",
            "Discover the power of {tech} in this comprehensive event designed for developers of all skill levels. From beginner-friendly introductions to advanced techniques, there's something for everyone.",
            "Connect with the {tech} community and dive deep into the latest trends, best practices, and innovative solutions. This event features talks, workshops, and networking opportunities.",
            "Whether you're new to {tech} or a seasoned professional, this event offers valuable insights and practical knowledge to enhance your development skills.",
            "Explore the future of {tech} with industry leaders and passionate developers. Learn about cutting-edge techniques, tools, and methodologies that are shaping the industry."
        ];

        $description = str_replace('{tech}', $tech, fake()->randomElement($descriptions));

        return [
            'title' => $title,
            'location' => $format === 'online' ? 'Online Event' : $city,
            'region' => $format === 'online' ? 'Remote' : $region,
            'format' => $format,
            'start_date' => $start,
            'end_date' => $end,
            'description' => $description,
            'type' => fake()->randomElement($template['types']),
            'tags' => $tags,
        ];
    }
}
