import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Event } from '../types/Event';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import EventCard from './EventCard';
import EventForm from './EventForm';

const EventList: React.FC = () => {
    const { user, isAuthenticated, isOrganizer, isAttendee, isAdmin } = useAuth();
    const componentRef = useRef<HTMLElement>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [previousEvents, setPreviousEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [eventsLoading, setEventsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [activeFilter, setActiveFilter] = useState('All');
    const [showAllEvents, setShowAllEvents] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 6,
        total: 0,
        from: 0,
        to: 0
    });

    const fetchEvents = async (page: number = 1, isInitialLoad = false) => {
        try {
            if (isInitialLoad) {
                setLoading(true);
            } else {
                setEventsLoading(true);
                // Store previous events to keep layout stable
                if (events.length > 0) {
                    setPreviousEvents(events);
                }
            }
            
            const response = await api.getEvents({ 
                per_page: 6, 
                page,
                upcoming_only: true 
            });
            
            if (!isInitialLoad) {
                // Add a delay to allow the fade-out to complete before updating content
                setTimeout(() => {
                    setEvents(response.data);
                    setPagination(response);
                    setCurrentPage(page);
                    setEventsLoading(false);
                }, 400); // Half of the transition duration
            } else {
                setEvents(response.data);
                setPagination(response);
                setCurrentPage(page);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch events');
            if (isInitialLoad) {
                setLoading(false);
            } else {
                setEventsLoading(false);
            }
        } finally {
            if (isInitialLoad) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchEvents(1, true); // true = isInitialLoad
    }, []);

    const handleCreateEvent = async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
        try {
            const newEvent = await api.createEvent(eventData);
            setEvents([...events, newEvent]);
            setShowForm(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create event');
        }
    };

    const handleUpdateEvent = async (id: number, eventData: Partial<Omit<Event, 'id' | 'created_at' | 'updated_at'>>) => {
        try {
            const updatedEvent = await api.updateEvent(id, eventData);
            setEvents(events.map(event => event.id === id ? updatedEvent : event));
            setEditingEvent(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update event');
        }
    };

    const handleDeleteEvent = async (id: number) => {
        try {
            await api.deleteEvent(id);
            fetchEvents(currentPage); // Refresh current page
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete event');
        }
    };

    const handlePageChange = (page: number) => {
        fetchEvents(page); // false = not initial load
        
        // Scroll to top of component smoothly
        if (componentRef.current) {
            componentRef.current.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    };

    const filterOptions = ['All', 'Conference', 'Meetup', 'Workshop', 'Hackathon'];

    // Filter events based on user preferences and active filter
    const getFilteredEvents = () => {
        let filteredEvents = events;

        // First apply type filter
        if (activeFilter !== 'All') {
            filteredEvents = filteredEvents.filter(event => 
                event.type?.toLowerCase() === activeFilter.toLowerCase()
            );
        }

        // If user is an attendee with preferences and not showing all events, filter by preferences
        if (isAttendee && user?.preferences?.tags && user.preferences.tags.length > 0 && !showAllEvents) {
            const userTags = user.preferences.tags.map(tag => tag.toLowerCase());
            filteredEvents = filteredEvents.filter(event => {
                const eventTags = event.tags?.map(tag => tag.toLowerCase()) || [];
                return eventTags.some(tag => userTags.includes(tag));
            });
        }

        return filteredEvents;
    };

    const filteredEvents = getFilteredEvents();
    const hasUserPreferences = isAttendee && user?.preferences?.tags && user.preferences.tags.length > 0;

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div 
                    className="w-8 h-8 border-2 border-solid rounded-full animate-spin"
                    style={{ 
                        borderColor: 'var(--accent-primary) transparent var(--accent-primary) transparent'
                    }}
                ></div>
            </div>
        );
    }

    if (error) {
        return (
            <div 
                className="border rounded-lg p-4"
                style={{ 
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderColor: '#ef4444'
                }}
            >
                <p style={{ color: '#ef4444' }}>{error}</p>
                <button 
                    onClick={fetchEvents}
                    className="mt-2 underline hover:no-underline"
                    style={{ color: '#dc2626' }}
                >
                    Try again
                </button>
            </div>
        );
    }

    return (
        <section ref={componentRef} className="events">
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h2>Upcoming events</h2>
                        <p style={{ 
                            color: 'var(--text-muted)', 
                            fontSize: '14px', 
                            marginTop: '8px',
                            marginBottom: '0'
                        }}>
                            Showing {pagination.from}-{pagination.to} of {pagination.total} events
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        {(isOrganizer || isAdmin) && (
                            <button
                                onClick={() => setShowForm(true)}
                                className="nav-cta"
                                style={{ fontSize: '14px' }}
                            >
                                Add Event
                            </button>
                        )}
                    </div>
                </div>

                {showForm && (
                    <EventForm
                        onSubmit={handleCreateEvent}
                        onCancel={() => setShowForm(false)}
                    />
                )}

                {editingEvent && (
                    <EventForm
                        event={editingEvent}
                        onSubmit={(data) => handleUpdateEvent(editingEvent.id, data)}
                        onCancel={() => setEditingEvent(null)}
                    />
                )}

                {events.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 0' }}>
                        <p style={{ color: 'var(--text-muted)' }}>
                            {(isOrganizer || isAdmin) ? 'No events found. Create your first event!' : 'No upcoming events available yet.'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div style={{ position: 'relative' }}>
                            {/* Loading overlay for pagination changes */}
                            {eventsLoading && (
                                <div 
                                    className="w-8 h-8 border-2 border-solid rounded-full animate-spin"
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        zIndex: 10,
                                        borderColor: 'var(--accent-primary) transparent var(--accent-primary) transparent'
                                    }}
                                ></div>
                            )}

                            {/* Single grid container - shows either current events or previous events while loading */}
                            <div className="events-grid" style={{ 
                                opacity: eventsLoading ? 0.3 : 1,
                                transition: 'opacity 0.8s ease',
                                pointerEvents: eventsLoading ? 'none' : 'auto'
                            }}>
                                {events.map(event => {
                                    const canEdit = isAdmin || (isOrganizer && (event as any).user_id === user?.id);
                                    const canDelete = isAdmin || (isOrganizer && (event as any).user_id === user?.id);
                                    
                                    return (
                                        <EventCard
                                            key={event.id}
                                            event={event}
                                            onEdit={canEdit ? setEditingEvent : undefined}
                                            onDelete={canDelete ? handleDeleteEvent : undefined}
                                        />
                                    );
                                })}
                            </div>
                        </div>

                        {/* Pagination Controls */}
                        {pagination.last_page > 1 && (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '8px',
                                marginTop: '32px',
                                paddingTop: '24px',
                                borderTop: '1px solid var(--border-color)'
                            }}>
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    style={{
                                        background: 'transparent',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '6px',
                                        padding: '8px 12px',
                                        fontSize: '14px',
                                        color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-secondary)',
                                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                        fontFamily: 'inherit'
                                    }}
                                >
                                    ← Previous
                                </button>

                                {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        style={{
                                            background: page === currentPage ? 'var(--accent-primary)' : 'transparent',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '6px',
                                            padding: '8px 12px',
                                            fontSize: '14px',
                                            color: page === currentPage ? 'var(--bg-primary)' : 'var(--text-secondary)',
                                            cursor: 'pointer',
                                            fontFamily: 'inherit',
                                            minWidth: '40px'
                                        }}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === pagination.last_page}
                                    style={{
                                        background: 'transparent',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '6px',
                                        padding: '8px 12px',
                                        fontSize: '14px',
                                        color: currentPage === pagination.last_page ? 'var(--text-muted)' : 'var(--text-secondary)',
                                        cursor: currentPage === pagination.last_page ? 'not-allowed' : 'pointer',
                                        fontFamily: 'inherit'
                                    }}
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default EventList;