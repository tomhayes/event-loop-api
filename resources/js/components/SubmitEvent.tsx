import * as React from 'react';
import { useState } from 'react';

const SubmitEvent: React.FC = () => {
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        start_date: '',
        end_date: '',
        description: '',
        event_type: '',
        website: '',
        contact_email: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Event submitted:', formData);
    };

    return (
        <section className="events">
            <div className="container">
                <div style={{ marginBottom: '48px' }}>
                    <h1 style={{
                        fontSize: 'clamp(32px, 5vw, 48px)',
                        fontWeight: '500',
                        marginBottom: '16px',
                        color: 'var(--text-primary)',
                        lineHeight: '1.2'
                    }}>
                        <span style={{ color: 'var(--accent-secondary)' }}>// </span>
                        Submit Event
                    </h1>
                    <p style={{
                        fontSize: '18px',
                        color: 'var(--text-secondary)',
                        maxWidth: '800px',
                        lineHeight: '1.6'
                    }}>
                        Share your developer event with the community. Help other developers discover and attend great events.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '32px',
                    marginBottom: '32px'
                }}>
                    <div style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid var(--border-color)'
                    }}>
                        <h3 style={{
                            fontSize: '18px',
                            fontWeight: '500',
                            marginBottom: '12px',
                            color: 'var(--text-primary)'
                        }}>
                            <span style={{ color: 'var(--accent-secondary)' }}>✅ </span>
                            Review Process
                        </h3>
                        <p style={{
                            color: 'var(--text-secondary)',
                            lineHeight: '1.6',
                            fontSize: '14px'
                        }}>
                            All events are reviewed by our team to ensure quality and relevance. 
                            You'll receive an email confirmation once your event is approved.
                        </p>
                    </div>

                    <div style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid var(--border-color)'
                    }}>
                        <h3 style={{
                            fontSize: '18px',
                            fontWeight: '500',
                            marginBottom: '12px',
                            color: 'var(--text-primary)'
                        }}>
                            <span style={{ color: 'var(--accent-secondary)' }}>📋 </span>
                            Guidelines
                        </h3>
                        <p style={{
                            color: 'var(--text-secondary)',
                            lineHeight: '1.6',
                            fontSize: '14px'
                        }}>
                            Please read our event guidelines before submitting to ensure your event 
                            meets our quality standards and community expectations.
                        </p>
                    </div>

                    <div style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid var(--border-color)'
                    }}>
                        <h3 style={{
                            fontSize: '18px',
                            fontWeight: '500',
                            marginBottom: '12px',
                            color: 'var(--text-primary)'
                        }}>
                            <span style={{ color: 'var(--accent-secondary)' }}>🚀 </span>
                            Promotion
                        </h3>
                        <p style={{
                            color: 'var(--text-secondary)',
                            lineHeight: '1.6',
                            fontSize: '14px'
                        }}>
                            Approved events are featured on our platform and may be included in 
                            our newsletter and social media promotions.
                        </p>
                    </div>
                </div>

                <div className="form-container">
                    <h3 className="form-title">Event Details</h3>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="title" className="form-label">
                                Event Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="React Developer Conference 2025"
                            />
                        </div>

                        <div className="form-group">
                            <div className="form-grid">
                                <div>
                                    <label htmlFor="event_type" className="form-label">
                                        Event Type *
                                    </label>
                                    <select
                                        id="event_type"
                                        name="event_type"
                                        value={formData.event_type}
                                        onChange={handleChange}
                                        required
                                        className="form-input"
                                    >
                                        <option value="">Select event type</option>
                                        <option value="conference">Conference</option>
                                        <option value="meetup">Meetup</option>
                                        <option value="workshop">Workshop</option>
                                        <option value="hackathon">Hackathon</option>
                                        <option value="webinar">Webinar</option>
                                        <option value="study-group">Study Group</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="location" className="form-label">
                                        Location *
                                    </label>
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        required
                                        className="form-input"
                                        placeholder="San Francisco, CA or Online"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="form-grid">
                                <div>
                                    <label htmlFor="start_date" className="form-label">
                                        Start Date & Time *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="start_date"
                                        name="start_date"
                                        value={formData.start_date}
                                        onChange={handleChange}
                                        required
                                        className="form-input"
                                        min={new Date().toISOString().slice(0, 16)}
                                        max="2099-12-31T23:59"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="end_date" className="form-label">
                                        End Date & Time *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="end_date"
                                        name="end_date"
                                        value={formData.end_date}
                                        onChange={handleChange}
                                        required
                                        className="form-input"
                                        min={new Date().toISOString().slice(0, 16)}
                                        max="2099-12-31T23:59"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="description" className="form-label">
                                Event Description *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                className="form-textarea"
                                placeholder="Describe your event, what attendees will learn, speakers, agenda, etc."
                                style={{ minHeight: '120px' }}
                            />
                        </div>

                        <div className="form-group">
                            <div className="form-grid">
                                <div>
                                    <label htmlFor="website" className="form-label">
                                        Event Website
                                    </label>
                                    <input
                                        type="url"
                                        id="website"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="https://your-event-website.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="contact_email" className="form-label">
                                        Contact Email *
                                    </label>
                                    <input
                                        type="email"
                                        id="contact_email"
                                        name="contact_email"
                                        value={formData.contact_email}
                                        onChange={handleChange}
                                        required
                                        className="form-input"
                                        placeholder="organizer@example.com"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-submit">
                                Submit Event for Review
                            </button>
                        </div>
                    </form>
                </div>

                <div style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid var(--border-color)',
                    marginTop: '32px',
                    textAlign: 'center'
                }}>
                    <p style={{
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6',
                        margin: 0
                    }}>
                        By submitting an event, you agree to our{' '}
                        <a href="#" style={{ color: 'var(--accent-secondary)', textDecoration: 'none' }}>
                            Event Guidelines
                        </a>{' '}
                        and{' '}
                        <a href="#" style={{ color: 'var(--accent-secondary)', textDecoration: 'none' }}>
                            Terms of Service
                        </a>.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default SubmitEvent;