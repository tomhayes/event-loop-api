import { Event } from '../types/Event';

export const generateICSContent = (event: Event): string => {
    const formatDate = (date: string): string => {
        return new Date(date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const escapeICSText = (text: string): string => {
        return text.replace(/[\\,;]/g, '\\$&').replace(/\n/g, '\\n');
    };

    const startDate = formatDate(event.start_date);
    const endDate = formatDate(event.end_date);
    const now = formatDate(new Date().toISOString());

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//eventLoop//Event Calendar//EN',
        'BEGIN:VEVENT',
        `UID:event-${event.id}@eventloop.dev`,
        `DTSTAMP:${now}`,
        `DTSTART:${startDate}`,
        `DTEND:${endDate}`,
        `SUMMARY:${escapeICSText(event.title)}`,
        `DESCRIPTION:${escapeICSText(event.description || '')}`,
        `LOCATION:${escapeICSText(event.location)}`,
        'STATUS:CONFIRMED',
        'TRANSP:OPAQUE',
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    return icsContent;
};

export const downloadICSFile = (event: Event): void => {
    const icsContent = generateICSContent(event);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const generateGoogleCalendarURL = (event: Event): string => {
    const formatDate = (date: string): string => {
        return new Date(date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: event.title,
        dates: `${formatDate(event.start_date)}/${formatDate(event.end_date)}`,
        details: event.description || '',
        location: event.location,
        sprop: 'website:eventloop.dev'
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export const generateOutlookCalendarURL = (event: Event): string => {
    const formatDate = (date: string): string => {
        return new Date(date).toISOString();
    };

    const params = new URLSearchParams({
        subject: event.title,
        startdt: formatDate(event.start_date),
        enddt: formatDate(event.end_date),
        body: event.description || '',
        location: event.location
    });

    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
};