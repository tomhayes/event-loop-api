<?php

use function Pest\Laravel\postJson;
use Illuminate\Testing\Fluent\AssertableJson;

test('an event can be created', function () {
    $payload = [
        'title' => 'Laravel London',
        'location' => 'London',
        'start_date' => '2025-09-01',
        'end_date' => '2025-09-02',
        'description' => 'A meetup for Laravel developers in the UK',
    ];

    $response = postJson('/api/events', $payload);

    $response
        ->assertCreated()
        ->assertJson(fn (AssertableJson $json) =>
            $json->where('title', 'Laravel London')
                 ->where('location', 'London')
                 ->where('start_date', '2025-09-01')
                 ->where('end_date', '2025-09-02')
                 ->etc()
        );
});

test('event creation fails without a title', function () {
    $payload = [
        // 'title' => missing on purpose
        'location' => 'London',
        'start_date' => '2025-09-01',
        'end_date' => '2025-09-02',
    ];

    $response = postJson('/api/events', $payload);

    $response
        ->assertStatus(422)
        ->assertJsonValidationErrors(['title']);
});

test('event creation fails if end_date is before start_date', function () {
    $payload = [
        'title' => 'Laravel London',
        'location' => 'London',
        'start_date' => '2025-09-02',
        'end_date' => '2025-09-01', // invalid
    ];

    $response = postJson('/api/events', $payload);

    $response
        ->assertStatus(422)
        ->assertJsonValidationErrors(['end_date']);
});

test('event creation fails if location is missing', function () {
    $payload = [
        'title' => 'Laravel London',
        // 'location' => missing on purpose
        'start_date' => '2025-09-01',
        'end_date' => '2025-09-02',
    ];

    $response = postJson('/api/events', $payload);

    $response
        ->assertStatus(422)
        ->assertJsonValidationErrors(['location']);
});
