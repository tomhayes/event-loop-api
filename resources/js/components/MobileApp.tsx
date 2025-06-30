import * as React from 'react';

const MobileApp: React.FC = () => {
    return (
        <section className="events">
            <div className="container">
                <div style={{ marginBottom: '48px', textAlign: 'center' }}>
                    <h1 style={{
                        fontSize: 'clamp(32px, 5vw, 48px)',
                        fontWeight: '500',
                        marginBottom: '16px',
                        color: 'var(--text-primary)',
                        lineHeight: '1.2'
                    }}>
                        <span style={{ color: 'var(--accent-secondary)' }}>// </span>
                        Mobile App
                    </h1>
                    <p style={{
                        fontSize: '18px',
                        color: 'var(--text-secondary)',
                        maxWidth: '800px',
                        lineHeight: '1.6',
                        margin: '0 auto'
                    }}>
                        Take eventLoop with you wherever you go. Our mobile app is coming soon!
                    </p>
                </div>

                <div style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    padding: '48px',
                    border: '1px solid var(--border-color)',
                    textAlign: 'center',
                    marginBottom: '48px'
                }}>
                    <div style={{
                        fontSize: '64px',
                        marginBottom: '24px'
                    }}>
                        📱
                    </div>
                    <h2 style={{
                        fontSize: '28px',
                        fontWeight: '500',
                        marginBottom: '16px',
                        color: 'var(--text-primary)'
                    }}>
                        Coming Soon to iOS & Android
                    </h2>
                    <p style={{
                        fontSize: '16px',
                        color: 'var(--text-secondary)',
                        maxWidth: '600px',
                        margin: '0 auto 32px',
                        lineHeight: '1.6'
                    }}>
                        We're working hard to bring you the best mobile experience for discovering and managing developer events. 
                        Our native apps will offer all the features you love from the web platform, optimized for mobile.
                    </p>
                    
                    <button className="nav-cta">
                        Notify Me When Available
                    </button>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '32px',
                    marginBottom: '48px'
                }}>
                    <div style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: '12px',
                        padding: '32px',
                        border: '1px solid var(--border-color)',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: '32px',
                            marginBottom: '16px'
                        }}>
                            🔔
                        </div>
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: '500',
                            marginBottom: '12px',
                            color: 'var(--text-primary)'
                        }}>
                            Push Notifications
                        </h3>
                        <p style={{
                            color: 'var(--text-secondary)',
                            lineHeight: '1.6'
                        }}>
                            Never miss an event! Get notified about new events, registration deadlines, and event updates.
                        </p>
                    </div>

                    <div style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: '12px',
                        padding: '32px',
                        border: '1px solid var(--border-color)',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: '32px',
                            marginBottom: '16px'
                        }}>
                            📍
                        </div>
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: '500',
                            marginBottom: '12px',
                            color: 'var(--text-primary)'
                        }}>
                            Location-Based Discovery
                        </h3>
                        <p style={{
                            color: 'var(--text-secondary)',
                            lineHeight: '1.6'
                        }}>
                            Find events near you automatically using your device's location for a personalized experience.
                        </p>
                    </div>

                    <div style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: '12px',
                        padding: '32px',
                        border: '1px solid var(--border-color)',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: '32px',
                            marginBottom: '16px'
                        }}>
                            📅
                        </div>
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: '500',
                            marginBottom: '12px',
                            color: 'var(--text-primary)'
                        }}>
                            Calendar Integration
                        </h3>
                        <p style={{
                            color: 'var(--text-secondary)',
                            lineHeight: '1.6'
                        }}>
                            Add events directly to your device calendar with one tap. Never double-book yourself again.
                        </p>
                    </div>

                    <div style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: '12px',
                        padding: '32px',
                        border: '1px solid var(--border-color)',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: '32px',
                            marginBottom: '16px'
                        }}>
                            ⚡
                        </div>
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: '500',
                            marginBottom: '12px',
                            color: 'var(--text-primary)'
                        }}>
                            Offline Access
                        </h3>
                        <p style={{
                            color: 'var(--text-secondary)',
                            lineHeight: '1.6'
                        }}>
                            Access your saved events and event details even when you're offline or have poor connectivity.
                        </p>
                    </div>

                    <div style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: '12px',
                        padding: '32px',
                        border: '1px solid var(--border-color)',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: '32px',
                            marginBottom: '16px'
                        }}>
                        🎫
                        </div>
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: '500',
                            marginBottom: '12px',
                            color: 'var(--text-primary)'
                        }}>
                            Digital Tickets
                        </h3>
                        <p style={{
                            color: 'var(--text-secondary)',
                            lineHeight: '1.6'
                        }}>
                            Store your event tickets digitally and access them quickly at event check-ins.
                        </p>
                    </div>

                    <div style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: '12px',
                        padding: '32px',
                        border: '1px solid var(--border-color)',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: '32px',
                            marginBottom: '16px'
                        }}>
                            💬
                        </div>
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: '500',
                            marginBottom: '12px',
                            color: 'var(--text-primary)'
                        }}>
                            Event Networking
                        </h3>
                        <p style={{
                            color: 'var(--text-secondary)',
                            lineHeight: '1.6'
                        }}>
                            Connect with other attendees, share contact information, and build your professional network.
                        </p>
                    </div>
                </div>

                <div style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    padding: '32px',
                    border: '1px solid var(--border-color)',
                    textAlign: 'center'
                }}>
                    <h3 style={{
                        fontSize: '20px',
                        fontWeight: '500',
                        marginBottom: '16px',
                        color: 'var(--text-primary)'
                    }}>
                        Stay Updated
                    </h3>
                    <p style={{
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6',
                        marginBottom: '24px'
                    }}>
                        Want to be the first to know when our mobile app launches? Join our beta program 
                        and get early access to test new features.
                    </p>
                    
                    <div style={{
                        display: 'flex',
                        gap: '16px',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                    }}>
                        <button className="nav-cta">
                            Join Beta Program
                        </button>
                        <button style={{
                            padding: '12px 24px',
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            fontFamily: 'inherit',
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}>
                            Follow Updates
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MobileApp;