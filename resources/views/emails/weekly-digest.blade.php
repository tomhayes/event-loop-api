@component('mail::message')
# Your Weekly Event Digest

Hello {{ $user->name }},

Here's what's happening in the event world this week ({{ $weekStart }} to {{ $weekEnd }})!

@if($recommendedEvents->count() > 0)
## 🎯 Recommended For You

Based on your interests and saved events, here are some events you might love:

@foreach($recommendedEvents as $event)
**{{ $event->title }}**  
📅 {{ $event->start_date->format('M j, Y g:i A') }}  
📍 {{ $event->location }}  
👥 {{ $event->attendees_count }} attending

@if($event->short_description)
{{ $event->short_description }}
@elseif($event->description)
{{ Str::limit($event->description, 150) }}
@endif

@component('mail::button', ['url' => config('app.frontend_url') . '/event/' . $event->id])
View Event
@endcomponent

---
@endforeach
@endif

@if($newEvents->count() > 0)
## 🆕 New Events This Week

@foreach($newEvents as $event)
**{{ $event->title }}**  
📅 {{ $event->start_date->format('M j, Y') }}  
📍 {{ $event->location }}  
👤 By {{ $event->user->name }}

@if($event->short_description)
{{ $event->short_description }}
@endif

@endforeach

@component('mail::button', ['url' => config('app.frontend_url') . '/events'])
Browse New Events
@endcomponent
@endif

@if($popularEvents->count() > 0)
## 🔥 Popular Events

These events are generating the most buzz:

@foreach($popularEvents as $event)
**{{ $event->title }}**  
📅 {{ $event->start_date->format('M j, Y') }}  
📍 {{ $event->location }}  
👥 {{ $event->attendees_count }} attending

@endforeach

@component('mail::button', ['url' => config('app.frontend_url') . '/events?sort=popular'])
See All Popular Events
@endcomponent
@endif

@if($upcomingEvents->count() > 0)
## 📅 Coming Up Soon

Don't miss these upcoming events:

@foreach($upcomingEvents->take(5) as $event)
• **{{ $event->title }}** - {{ $event->start_date->format('M j') }} at {{ $event->location }}
@endforeach

@if($upcomingEvents->count() > 5)
...and {{ $upcomingEvents->count() - 5 }} more!
@endif

@component('mail::button', ['url' => config('app.frontend_url') . '/events?upcoming_only=true'])
View All Upcoming Events
@endcomponent
@endif

---

## 💾 Quick Actions

@component('mail::button', ['url' => config('app.frontend_url') . '/saved-events'])
View My Saved Events
@endcomponent

@component('mail::button', ['url' => config('app.frontend_url') . '/events'])
Browse All Events
@endcomponent

@component('mail::subcopy')
You're receiving this digest because you're a member of {{ config('app.name') }}.
You can manage your email preferences in your [account settings]({{ config('app.frontend_url') }}/preferences).
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent