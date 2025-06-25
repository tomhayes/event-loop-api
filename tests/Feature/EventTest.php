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
