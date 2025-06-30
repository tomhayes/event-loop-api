import * as React from 'react';

const EventGuidelines: React.FC = () => {
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
                        Event Guidelines
                    </h1>
                    <p style={{
                        fontSize: '18px',
                        color: 'var(--text-secondary)',
                        maxWidth: '800px',
                        lineHeight: '1.6'
                    }}>
                        Guidelines for submitting and organizing quality developer events on eventLoop.
                    </p>
                </div>

                <div style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    padding: '32px',
                    border: '1px solid var(--border-color)',
                    marginBottom: '32px'
                }}>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: '500',
                        marginBottom: '16px',
                        color: 'var(--text-primary)'
                    }}>
                        What Makes a Great Event
                    </h2>
                    <ul style={{
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6',
                        paddingLeft: '20px'
                    }}>
                        <li>Clear, descriptive title and comprehensive description</li>
                        <li>Relevant to developers, programmers, or tech professionals</li>
                        <li>Accurate date, time, and location information</li>
                        <li>Professional presentation and organization</li>
                        <li>Value-driven content for attendees</li>
                    </ul>
                </div>

                <div style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    padding: '32px',
                    border: '1px solid var(--border-color)',
                    marginBottom: '32px'
                }}>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: '500',
                        marginBottom: '16px',
                        color: 'var(--text-primary)'
                    }}>
                        Event Types We Accept
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px'
                    }}>
                        {['Conferences', 'Meetups', 'Workshops', 'Hackathons', 'Webinars', 'Study Groups'].map((type) => (
                            <div key={type} style={{
                                background: 'var(--bg-tertiary)',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)',
                                textAlign: 'center',
                                color: 'var(--accent-secondary)'
                            }}>
                                {type}
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    padding: '32px',
                    border: '1px solid var(--border-color)'
                }}>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: '500',
                        marginBottom: '16px',
                        color: 'var(--text-primary)'
                    }}>
                        Submission Requirements
                    </h2>
                    <p style={{
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6',
                        marginBottom: '16px'
                    }}>
                        To ensure quality and relevance, all events must meet these requirements:
                    </p>
                    <ul style={{
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6',
                        paddingLeft: '20px'
                    }}>
                        <li>Technology or developer-focused content</li>
                        <li>Complete event information (no TBD fields)</li>
                        <li>Valid registration or contact information</li>
                        <li>Professional language and presentation</li>
                        <li>Compliance with our community standards</li>
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default EventGuidelines;