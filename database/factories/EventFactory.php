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
        $start = $this->faker->dateTimeBetween('now', '+1 month');
        $end = $this->faker->dateTimeBetween($start, '+2 months');

        return [
            'title' => $this->faker->sentence(3),
            'location' => $this->faker->city,
            'start_date' => $start,
            'end_date' => $end,
            'description' => $this->faker->paragraph,
        ];
    }
}
