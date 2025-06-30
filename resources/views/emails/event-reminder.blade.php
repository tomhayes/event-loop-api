@component('mail::message')
# Event Reminder

Hello {{ $user->name }},

This is a friendly reminder that **{{ $event->title }}** is {{ $daysUntil === 1 ? 'tomorrow' : "in {$daysUntil} days" }}!

## Event Details

**Event:** {{ $event->title }}  
**Date:** {{ $event->start_date->format('l, F j, Y') }}  
**Time:** {{ $event->start_date->format('g:i A') }} - {{ $event->end_date->format('g:i A') }}  
**Location:** {{ $event->location }}

@if($event->short_description)
{{ $event->short_description }}
@elseif($event->description)
{{ $event->description }}
@endif

@component('mail::button', ['url' => config('app.frontend_url') . '/event/' . $event->id])
View Event Details
@endcomponent

Don't forget to add this event to your calendar so you don't miss it!

@if($event->format === 'online')
This is an **online event**. Make sure you have a stable internet connection.
@elseif($event->format === 'hybrid')
This is a **hybrid event** with both online and in-person options.
@else
This is an **in-person event**. Please plan your travel accordingly.
@endif

@component('mail::subcopy')
You're receiving this email because you saved this event and enabled email reminders.
If you no longer want to receive reminders for this event, you can manage your saved events in your [dashboard]({{ config('app.frontend_url') }}/saved-events).
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent