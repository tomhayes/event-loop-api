<?php

use App\Models\Event;
use function Pest\Laravel\get;
use function Pest\Laravel\postJson;
use function Pest\Laravel\putJson;
use Illuminate\Testing\Fluent\AssertableJson;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

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
                 ->where('start_date', '2025-09-01T00:00:00.000000Z')
                 ->where('end_date', '2025-09-02T00:00:00.000000Z')
                 ->etc()
        );
});

test('an event is saved to the database when valid data is provided', function () {
    $payload = [
        'title' => 'Laravel London',
        'location' => 'London',
        'start_date' => '2025-09-01',
        'end_date' => '2025-09-02',
        'description' => 'A meetup for Laravel developers in the UK',
    ];

    postJson('/api/events', $payload);

    $this->assertDatabaseHas('events', [
        'title' => 'Laravel London',
        'location' => 'London',
        'start_date' => '2025-09-01 00:00:00',
        'end_date' => '2025-09-02 00:00:00',
        'description' => 'A meetup for Laravel developers in the UK',
    ]);
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

test('events can be retrieved from the database', function () {

    Event::factory()->count(3)->create();

    $response = get('/api/events');

    $response->assertStatus(200);
    $response->assertJsonCount(3);
});

test('a single event can be retireved via id', function () {
    $event = Event::factory()->create();

    $response = get("/api/events/{$event->id}");

    $response
        ->assertStatus(200)
        ->assertJson(fn (AssertableJson $json) =>
            $json->where('id', $event->id)
                 ->where('title', $event->title)
                 ->where('location', $event->location)
                 ->where('start_date', $event->start_date->toISOString())
                 ->where('end_date', $event->end_date->toISOString())
                 ->etc()
        );
});

test('a 404 is returned when trying to retrieve a non-existent event', function () {
    $nonExistentId = Event::max('id') + 1;

    $response = get("/api/events/{$nonExistentId}");

    $response->assertNotFound();
});

test('an event can be updated via the API', function () {
    $event = Event::factory()->create();

    $payload = [
        'title' => 'Updated Event Title',
        'location' => 'Updated Location',
        'start_date' => '2025-10-01',
        'end_date' => '2025-10-02',
        'description' => 'Updated description for the event.',
    ];

    $response = putJson("/api/events/{$event->id}", $payload);

    $response
        ->assertStatus(200)
        ->assertJson(fn (AssertableJson $json) =>
            $json->where('id', $event->id)
                 ->where('title', 'Updated Event Title')
                 ->where('location', 'Updated Location')
                 ->where('start_date', '2025-10-01T00:00:00.000000Z')
                 ->where('end_date', '2025-10-02T00:00:00.000000Z')
                 ->etc()
        );

    $this->assertDatabaseHas('events', [
        'id' => $event->id,
        'title' => 'Updated Event Title',
        'location' => 'Updated Location',
    ]);
});
