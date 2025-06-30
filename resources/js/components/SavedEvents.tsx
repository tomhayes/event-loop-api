import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Event } from '../types/Event';
import EventCard from './EventCard';
import { useAuth } from '../contexts/AuthContext';

interface SavedEvent {
    id: number;
    user_id: number;
    event_id: number;
    email_reminder: boolean;
    created_at: string;
    updated_at: string;
    event: Event;
}

const SavedEvents: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [savedEvents, setSavedEvents] = useState<SavedEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        fetchSavedEvents();
    }, [isAuthenticated, navigate]);

    const fetchSavedEvents = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/saved-events', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setSavedEvents(data);
            } else {
                setError('Failed to fetch saved events');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch saved events');
        } finally {
            setLoading(false);
        }
    };

    const handleUnsaveEvent = async (eventId: number) => {
        try {
            const response = await fetch('/api/saved-events/toggle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ event_id: eventId }),
            });

            if (response.ok) {
                // Remove the event from the local state
                setSavedEvents(prev => prev.filter(saved => saved.event_id !== eventId));
            }
        } catch (err) {
            console.error('Error unsaving event:', err);
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
                        />
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
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
                        <p style={{ color: '#ef4444' }}>{error}</p>
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

    return (
        <section className="events">
            <div className="container">
                {/* Header */}
                <div style={{ marginBottom: '40px' }}>
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

                    <h1 className="hero-title" style={{
                        fontSize: 'clamp(36px, 5vw, 48px)',
                        fontWeight: '600',
                        marginBottom: '16px',
                        textAlign: 'center'
                    }}>
                        My Saved Events
                    </h1>
                    
                    <p style={{
                        textAlign: 'center',
                        color: 'var(--text-secondary)',
                        fontSize: '18px',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Events you've saved for later. Never miss out on the opportunities that matter to you.
                    </p>
                </div>

                {/* Events count */}
                {savedEvents.length > 0 && (
                    <div style={{
                        marginBottom: '32px',
                        padding: '16px 0',
                        borderBottom: '1px solid var(--border-color)'
                    }}>
                        <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: '16px',
                            fontWeight: '500'
                        }}>
                            {savedEvents.length} saved event{savedEvents.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                )}

                {/* Events grid or empty state */}
                {savedEvents.length > 0 ? (
                    <div className="events-grid">
                        {savedEvents.map((savedEvent) => (
                            <div key={savedEvent.id} style={{ position: 'relative' }}>
                                <EventCard 
                                    event={savedEvent.event}
                                />
                                
                                {/* Unsave button overlay */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleUnsaveEvent(savedEvent.event_id);
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: '12px',
                                        right: '12px',
                                        background: 'rgba(239, 68, 68, 0.9)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        padding: '6px 12px',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        fontWeight: '500',
                                        transition: 'all 0.2s ease',
                                        zIndex: 2
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.background = '#dc2626';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.9)';
                                    }}
                                    title="Remove from saved events"
                                >
                                    Remove
                                </button>
                                
                                {/* Saved date indicator */}
                                <div style={{
                                    position: 'absolute',
                                    top: '12px',
                                    left: '12px',
                                    background: 'rgba(34, 197, 94, 0.9)',
                                    color: 'white',
                                    borderRadius: '6px',
                                    padding: '4px 8px',
                                    fontSize: '11px',
                                    fontWeight: '500',
                                    zIndex: 2
                                }}>
                                    💾 Saved {new Date(savedEvent.created_at).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '80px 20px',
                        background: 'var(--bg-secondary)',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)'
                    }}>
                        <div style={{
                            fontSize: '48px',
                            marginBottom: '24px'
                        }}>
                            🔖
                        </div>
                        <h3 style={{
                            fontSize: '24px',
                            fontWeight: '500',
                            marginBottom: '16px',
                            color: 'var(--text-primary)'
                        }}>
                            No saved events yet
                        </h3>
                        <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: '16px',
                            marginBottom: '32px',
                            maxWidth: '400px',
                            margin: '0 auto 32px'
                        }}>
                            Start saving events that interest you to keep track of upcoming opportunities.
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            style={{
                                background: 'var(--accent-primary)',
                                color: 'var(--bg-primary)',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '12px 24px',
                                fontSize: '16px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            Browse Events
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default SavedEvents;