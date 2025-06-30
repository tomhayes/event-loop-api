import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Event } from '../types/Event';
import { useAuth } from '../contexts/AuthContext';

interface EventCardProps {
    event: Event;
    onEdit?: (event: Event) => void;
    onDelete?: (id: number) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onDelete }) => {
    const navigate = useNavigate();
    const { user, isAdmin } = useAuth();
    
    // Check if current user can edit/delete this event
    const canEditEvent = user && (isAdmin || (event as any).user?.id === user.id);
    const canDeleteEvent = user && (isAdmin || (event as any).user?.id === user.id);
    
    const handleCardClick = () => {
        navigate(`/event/${event.id}`);
    };

    const handleButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };


    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const formatFullDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const eventType = event.type || 'Meetup';

    return (
        <div 
            className="event-card"
            onClick={handleCardClick}
            style={{ cursor: 'pointer' }}
        >
            <div className="event-header">
                <div className="event-date">
                    {formatDate(event.start_date)}
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <div className="event-type">
                        {eventType}
                    </div>
                    {event.format && (
                        <div className="event-format-tag" style={{
                            fontSize: '10px',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: event.format === 'online' ? 'rgba(34, 197, 94, 0.1)' :
                                       event.format === 'hybrid' ? 'rgba(234, 179, 8, 0.1)' :
                                       'rgba(59, 130, 246, 0.1)',
                            color: event.format === 'online' ? '#22c55e' :
                                   event.format === 'hybrid' ? '#eab308' :
                                   '#3b82f6',
                            fontWeight: '500',
                            textTransform: 'capitalize'
                        }}>
                            {event.format === 'in-person' ? 'In-Person' : event.format}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="event-body">
                <h3 className="event-title">
                    {event.title}
                </h3>
                
                {(event.short_description || event.description) && (
                    <p className="event-description">
                        {event.short_description || event.description}
                    </p>
                )}
                
                <div className="event-meta">
                    <div className="event-location">
                        <span>📍</span>
                        {event.location}
                        {event.region && event.region !== event.location && (
                            <span style={{ color: 'var(--text-muted)', fontSize: '12px', marginLeft: '4px' }}>
                                • {event.region}
                            </span>
                        )}
                    </div>
                    <div className="event-attendees">
                        {event.attendees_count || 0} attending
                    </div>
                </div>


                {event.tags && event.tags.length > 0 && (
                    <div style={{ 
                        marginTop: '12px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px'
                    }}>
                        {event.tags.slice(0, 3).map((tag, index) => (
                            <span
                                key={index}
                                style={{
                                    fontSize: '11px',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    background: 'rgba(203, 166, 247, 0.1)',
                                    color: 'var(--accent-primary)',
                                    border: '1px solid rgba(203, 166, 247, 0.2)'
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                        {event.tags.length > 3 && (
                            <span style={{
                                fontSize: '11px',
                                color: 'var(--text-muted)'
                            }}>
                                +{event.tags.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start', 
                    fontSize: '12px', 
                    paddingTop: '12px', 
                    borderTop: '1px solid var(--border-color)',
                    marginTop: '16px'
                }}>
                    <div style={{ color: 'var(--text-muted)', flex: 1 }}>
                        <div><strong className="event-label">Start:</strong> {formatFullDate(event.start_date)}</div>
                        <div><strong className="event-label">End:</strong> {formatFullDate(event.end_date)}</div>
                        {(event as any).user && (
                            <div style={{ marginTop: '4px' }}>
                                <strong className="event-label">Organizer:</strong> {(event as any).user.name} (@{(event as any).user.username})
                            </div>
                        )}
                    </div>
                    
                    {(canEditEvent || canDeleteEvent) && (onEdit || onDelete) && (
                        <div style={{ display: 'flex', gap: '8px', flexShrink: 0, marginLeft: '12px' }}>
                            {canEditEvent && onEdit && (
                                <button
                                    onClick={(e) => {
                                        handleButtonClick(e);
                                        onEdit(event);
                                    }}
                                    style={{ 
                                        padding: '4px 12px',
                                        borderRadius: '4px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        color: 'var(--accent-secondary)',
                                        background: 'rgba(137, 180, 250, 0.1)',
                                        fontSize: '12px'
                                    }}
                                >
                                    Edit
                                </button>
                            )}
                            {canDeleteEvent && onDelete && (
                                <button
                                    onClick={(e) => {
                                        handleButtonClick(e);
                                        onDelete(event.id);
                                    }}
                                    style={{ 
                                        padding: '4px 12px',
                                        borderRadius: '4px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        color: '#ef4444',
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        fontSize: '12px'
                                    }}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventCard;