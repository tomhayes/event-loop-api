import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Event } from '../types/Event';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { downloadICSFile, generateGoogleCalendarURL } from '../utils/calendar';
import EventCard from './EventCard';

const EventDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const [savingEvent, setSavingEvent] = useState(false);
    const [isAttending, setIsAttending] = useState(false);
    const [attendingEvent, setAttendingEvent] = useState(false);
    const [attendanceCount, setAttendanceCount] = useState(0);
    const [showCalendarDropdown, setShowCalendarDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);
    const [loadingRelated, setLoadingRelated] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!id) return;
            
            try {
                setLoading(true);
                const eventData = await api.getEvent(parseInt(id));
                setEvent(eventData);
                setIsSaved(eventData.is_saved || false);
                setIsAttending(eventData.is_attending || false);
                setAttendanceCount(eventData.attendees_count || 0);
                
                // Fetch related events
                fetchRelatedEvents(eventData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch event');
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const fetchRelatedEvents = async (currentEvent: Event) => {
        try {
            setLoadingRelated(true);
            const filters: any = {
                per_page: 4,
                page: 1
            };

            // Find events with similar tags or same organizer
            if (currentEvent.tags && currentEvent.tags.length > 0) {
                filters.tag = currentEvent.tags[0]; // Use first tag
            } else if (currentEvent.type) {
                filters.type = currentEvent.type;
            }

            const response = await api.getEvents(filters);
            // Filter out the current event and limit to 3
            const filtered = response.data
                .filter((e: Event) => e.id !== currentEvent.id)
                .slice(0, 3);
            
            setRelatedEvents(filtered);
        } catch (err) {
            console.error('Failed to fetch related events:', err);
        } finally {
            setLoadingRelated(false);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowCalendarDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatShortDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const getEventType = (title: string) => {
        const titleLower = title.toLowerCase();
        if (titleLower.includes('conference') || titleLower.includes('conf')) return 'Conference';
        if (titleLower.includes('meetup') || titleLower.includes('study group')) return 'Meetup';
        if (titleLower.includes('workshop') || titleLower.includes('fundamental')) return 'Workshop';
        if (titleLower.includes('hackathon')) return 'Hackathon';
        return 'Conference';
    };

    const handleSaveToggle = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (!event) return;

        setSavingEvent(true);
        try {
            const response = await fetch('/api/saved-events/toggle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                },
                body: JSON.stringify({ event_id: event.id }),
            });

            if (response.ok) {
                const data = await response.json();
                setIsSaved(data.saved);
            }
        } catch (error) {
            console.error('Error toggling save status:', error);
        } finally {
            setSavingEvent(false);
        }
    };

    const handleAttendanceToggle = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (!event) return;

        setAttendingEvent(true);
        try {
            const response = await fetch('/api/event-attendance/toggle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                },
                body: JSON.stringify({ event_id: event.id }),
            });

            if (response.ok) {
                const data = await response.json();
                setIsAttending(data.attending);
                setAttendanceCount(data.attendance_count);
            }
        } catch (error) {
            console.error('Error toggling attendance:', error);
        } finally {
            setAttendingEvent(false);
        }
    };

    const handleCalendarClick = (type: 'google' | 'ics') => {
        if (!event) return;
        
        if (type === 'google') {
            window.open(generateGoogleCalendarURL(event), '_blank');
        } else {
            downloadICSFile(event);
        }
    };

    if (loading) {
        return (
            <section className="events">
                <div className="container">
                    <div className="flex justify-center items-center py-12">
                        <div 
                            className="w-8 h-8 border-2 border-solid rounded-full animate-spin"
                            style={{ 
                                borderColor: 'var(--accent-primary) transparent var(--accent-primary) transparent'
                            }}
                        ></div>
                    </div>
                </div>
            </section>
        );
    }

    if (error || !event) {
        return (
            <section className="events">
                <div className="container">
                    <div 
                        className="border rounded-lg p-4"
                        style={{ 
                            background: 'rgba(239, 68, 68, 0.1)',
                            borderColor: '#ef4444'
                        }}
                    >
                        <p style={{ color: '#ef4444' }}>{error || 'Event not found'}</p>
                        <button 
                            onClick={() => navigate('/')}
                            className="mt-2 underline hover:no-underline"
                            style={{ color: '#dc2626' }}
                        >
                            Go back to events
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    const eventType = getEventType(event.title);

    return (
        <section className="events">
            <div className="container">
                {/* Breadcrumb Navigation */}
                <div style={{ 
                    marginBottom: '32px',
                    fontSize: '14px',
                    color: 'var(--text-muted)'
                }}>
                    <button 
                        onClick={() => navigate('/')}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--accent-secondary)',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            fontSize: '14px',
                            fontFamily: 'inherit'
                        }}
                    >
                        ← Back to Events
                    </button>
                </div>

                {/* Event Header */}
                <div style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    padding: '40px',
                    marginBottom: '32px',
                    border: '1px solid var(--border-color)'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '24px',
                        flexWrap: 'wrap',
                        gap: '16px'
                    }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div className="event-date" style={{
                                background: 'var(--accent-primary)',
                                color: 'var(--bg-primary)',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600'
                            }}>
                                {formatShortDate(event.start_date)}
                            </div>
                            <div className="event-type" style={{
                                background: 'rgba(137, 180, 250, 0.2)',
                                color: 'var(--accent-secondary)',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                fontSize: '14px',
                                border: '1px solid var(--accent-secondary)',
                                fontWeight: '500'
                            }}>
                                {eventType}
                            </div>
                        </div>
                        
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: 'var(--accent-secondary)',
                            fontSize: '14px'
                        }}>
                            <span>👥</span>
                            {attendanceCount} attending
                        </div>
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(28px, 4vw, 36px)',
                        fontWeight: '500',
                        marginBottom: '16px',
                        color: 'var(--text-primary)',
                        lineHeight: '1.2'
                    }}>
                        {event.title}
                    </h1>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'var(--text-secondary)',
                        fontSize: '16px',
                        marginBottom: '24px'
                    }}>
                        <span>📍</span>
                        {event.location}
                    </div>

                    {event.short_description && (
                        <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: '16px',
                            lineHeight: '1.6',
                            maxWidth: '800px',
                            marginBottom: '16px'
                        }}>
                            {event.short_description}
                        </p>
                    )}
                    
                    {event.long_description && (
                        <div style={{
                            color: 'var(--text-secondary)',
                            fontSize: '16px',
                            lineHeight: '1.6',
                            maxWidth: '800px'
                        }}>
                            <ReactMarkdown>{event.long_description}</ReactMarkdown>
                        </div>
                    )}
                    
                    {!event.short_description && !event.long_description && event.description && (
                        <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: '16px',
                            lineHeight: '1.6',
                            maxWidth: '800px'
                        }}>
                            {event.description}
                        </p>
                    )}
                </div>

                {/* Event Details Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '24px',
                    marginBottom: '32px'
                }}>
                    {/* Date & Time Card */}
                    <div style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid var(--border-color)'
                    }}>
                        <h3 style={{
                            fontSize: '18px',
                            fontWeight: '500',
                            marginBottom: '16px',
                            color: 'var(--text-primary)'
                        }}>
                            <span style={{ color: 'var(--accent-secondary)' }}>🗓 </span>
                            Date & Time
                        </h3>
                        <div style={{ marginBottom: '12px' }}>
                            <div style={{
                                fontSize: '14px',
                                color: 'var(--text-muted)',
                                marginBottom: '4px'
                            }}>
                                Start
                            </div>
                            <div style={{
                                fontSize: '16px',
                                color: 'var(--text-primary)'
                            }}>
                                {formatDate(event.start_date)}
                            </div>
                        </div>
                        <div>
                            <div style={{
                                fontSize: '14px',
                                color: 'var(--text-muted)',
                                marginBottom: '4px'
                            }}>
                                End
                            </div>
                            <div style={{
                                fontSize: '16px',
                                color: 'var(--text-primary)'
                            }}>
                                {formatDate(event.end_date)}
                            </div>
                        </div>
                    </div>

                    {/* Location Card */}
                    <div style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid var(--border-color)'
                    }}>
                        <h3 style={{
                            fontSize: '18px',
                            fontWeight: '500',
                            marginBottom: '16px',
                            color: 'var(--text-primary)'
                        }}>
                            <span style={{ color: 'var(--accent-secondary)' }}>📍 </span>
                            Location
                        </h3>
                        <p style={{
                            fontSize: '16px',
                            color: 'var(--text-secondary)',
                            lineHeight: '1.5'
                        }}>
                            {event.location}
                        </p>
                    </div>

                    {/* Event Info Card */}
                    <div style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid var(--border-color)'
                    }}>
                        <h3 style={{
                            fontSize: '18px',
                            fontWeight: '500',
                            marginBottom: '16px',
                            color: 'var(--text-primary)'
                        }}>
                            <span style={{ color: 'var(--accent-secondary)' }}>ℹ️ </span>
                            Event Info
                        </h3>
                        <div style={{ marginBottom: '12px' }}>
                            <div style={{
                                fontSize: '14px',
                                color: 'var(--text-muted)',
                                marginBottom: '4px'
                            }}>
                                Type
                            </div>
                            <div style={{
                                fontSize: '16px',
                                color: 'var(--text-primary)'
                            }}>
                                {eventType}
                            </div>
                        </div>
                        <div>
                            <div style={{
                                fontSize: '14px',
                                color: 'var(--text-muted)',
                                marginBottom: '4px'
                            }}>
                                Attendees
                            </div>
                            <div style={{
                                fontSize: '16px',
                                color: 'var(--accent-secondary)'
                            }}>
                                {attendanceCount} registered
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{
                    display: 'flex',
                    gap: '16px',
                    justifyContent: 'center',
                    paddingTop: '24px',
                    borderTop: '1px solid var(--border-color)',
                    flexWrap: 'wrap'
                }}>
                    {isAuthenticated && (
                        <>
                            <button
                                onClick={handleAttendanceToggle}
                                disabled={attendingEvent}
                                style={{
                                    background: isAttending ? 'var(--accent-secondary)' : 'transparent',
                                    border: `1px solid ${isAttending ? 'var(--accent-secondary)' : 'var(--border-color)'}`,
                                    borderRadius: '8px',
                                    padding: '12px 24px',
                                    fontSize: '16px',
                                    color: isAttending ? 'var(--bg-primary)' : 'var(--text-secondary)',
                                    cursor: attendingEvent ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s ease',
                                    fontFamily: 'inherit',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                                onMouseOver={(e) => {
                                    if (!isAttending && !attendingEvent) {
                                        e.currentTarget.style.borderColor = 'var(--accent-secondary)';
                                        e.currentTarget.style.color = 'var(--accent-secondary)';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (!isAttending && !attendingEvent) {
                                        e.currentTarget.style.borderColor = 'var(--border-color)';
                                        e.currentTarget.style.color = 'var(--text-secondary)';
                                    }
                                }}
                            >
                                {attendingEvent ? '⏳' : isAttending ? '✅' : '👥'}
                                {attendingEvent ? 'Updating...' : isAttending ? 'Attending' : 'Attend Event'}
                            </button>
                            
                            <button
                                onClick={handleSaveToggle}
                                disabled={savingEvent}
                                style={{
                                    background: isSaved ? 'var(--accent-primary)' : 'transparent',
                                    border: `1px solid ${isSaved ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                                    borderRadius: '8px',
                                    padding: '12px 24px',
                                    fontSize: '16px',
                                    color: isSaved ? 'var(--bg-primary)' : 'var(--text-secondary)',
                                    cursor: savingEvent ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s ease',
                                    fontFamily: 'inherit',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                                onMouseOver={(e) => {
                                    if (!isSaved && !savingEvent) {
                                        e.currentTarget.style.borderColor = 'var(--accent-primary)';
                                        e.currentTarget.style.color = 'var(--accent-primary)';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (!isSaved && !savingEvent) {
                                        e.currentTarget.style.borderColor = 'var(--border-color)';
                                        e.currentTarget.style.color = 'var(--text-secondary)';
                                    }
                                }}
                            >
                                {savingEvent ? '⏳' : isSaved ? '💾' : '🔖'}
                                {savingEvent ? 'Saving...' : isSaved ? 'Saved' : 'Save Event'}
                            </button>
                        </>
                    )}
                    
                    {/* Calendar dropdown - only show if user is attending */}
                    {isAuthenticated && isAttending && (
                        <div ref={dropdownRef} style={{ position: 'relative' }}>
                            <button
                                onClick={() => setShowCalendarDropdown(!showCalendarDropdown)}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    padding: '12px 24px',
                                    fontSize: '16px',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    fontFamily: 'inherit',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                                    e.currentTarget.style.color = 'var(--accent-primary)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--border-color)';
                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                }}
                            >
                                📅 Add to Calendar {showCalendarDropdown ? '▲' : '▼'}
                            </button>
                            
                            {/* Dropdown menu */}
                            {showCalendarDropdown && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    marginTop: '8px',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    zIndex: 10,
                                    minWidth: '200px'
                                }}>
                                    <button
                                        onClick={() => {
                                            handleCalendarClick('google');
                                            setShowCalendarDropdown(false);
                                        }}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            background: 'transparent',
                                            border: 'none',
                                            borderBottom: '1px solid var(--border-color)',
                                            color: 'var(--text-primary)',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s ease',
                                            fontFamily: 'inherit',
                                            fontSize: '14px',
                                            textAlign: 'left',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.background = 'var(--bg-tertiary)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.background = 'transparent';
                                        }}
                                    >
                                        📅 Google Calendar
                                    </button>
                                    
                                    <button
                                        onClick={() => {
                                            handleCalendarClick('ics');
                                            setShowCalendarDropdown(false);
                                        }}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'var(--text-primary)',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s ease',
                                            fontFamily: 'inherit',
                                            fontSize: '14px',
                                            textAlign: 'left',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.background = 'var(--bg-tertiary)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.background = 'transparent';
                                        }}
                                    >
                                        📄 Download ICS
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Related Events Section */}
                {relatedEvents.length > 0 && (
                    <div style={{
                        marginTop: '64px',
                        paddingTop: '40px',
                        borderTop: '1px solid var(--border-color)'
                    }}>
                        <h2 style={{
                            fontSize: '24px',
                            fontWeight: '500',
                            marginBottom: '24px',
                            color: 'var(--text-primary)',
                            textAlign: 'center'
                        }}>
                            Related Events
                        </h2>
                        
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '24px',
                            maxWidth: '1200px',
                            margin: '0 auto'
                        }}>
                            {relatedEvents.map((relatedEvent) => (
                                <EventCard 
                                    key={relatedEvent.id}
                                    event={relatedEvent}
                                />
                            ))}
                        </div>
                        
                        <div style={{
                            textAlign: 'center',
                            marginTop: '32px'
                        }}>
                            <button
                                onClick={() => {
                                    if (event?.tags && event.tags.length > 0) {
                                        navigate(`/events?tag=${event.tags[0]}`);
                                    } else if (event?.type) {
                                        navigate(`/events?type=${event.type}`);
                                    } else {
                                        navigate('/events');
                                    }
                                }}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid var(--accent-secondary)',
                                    borderRadius: '8px',
                                    color: 'var(--accent-secondary)',
                                    padding: '12px 24px',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    fontFamily: 'inherit'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = 'var(--accent-secondary)';
                                    e.currentTarget.style.color = 'var(--bg-primary)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = 'var(--accent-secondary)';
                                }}
                            >
                                Explore More Events
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default EventDetail;