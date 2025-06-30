import * as React from 'react';

const About: React.FC = () => {
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
                        About eventLoop
                    </h1>
                    <p style={{
                        fontSize: '18px',
                        color: 'var(--text-secondary)',
                        maxWidth: '800px',
                        lineHeight: '1.6'
                    }}>
                        Connecting developers with the events that matter most.
                    </p>
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
                        border: '1px solid var(--border-color)'
                    }}>
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: '500',
                            marginBottom: '16px',
                            color: 'var(--text-primary)'
                        }}>
                            <span style={{ color: 'var(--accent-secondary)' }}>🎯 </span>
                            Our Mission
                        </h3>
                        <p style={{
                            color: 'var(--text-secondary)',
                            lineHeight: '1.6'
                        }}>
                            eventLoop exists to bridge the gap between developers and the learning opportunities they need. 
                            We believe that continuous learning and community connection are essential for every developer's growth.
                        </p>
                    </div>

                    <div style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: '12px',
                        padding: '32px',
                        border: '1px solid var(--border-color)'
                    }}>
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: '500',
                            marginBottom: '16px',
                            color: 'var(--text-primary)'
                        }}>
                            <span style={{ color: 'var(--accent-secondary)' }}>💡 </span>
                            What We Do
                        </h3>
                        <p style={{
                            color: 'var(--text-secondary)',
                            lineHeight: '1.6'
                        }}>
                            We curate and organize developer events including conferences, meetups, workshops, and hackathons. 
                            Our platform makes it easy to discover, filter, and attend events that match your interests and skill level.
                        </p>
                    </div>

                    <div style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: '12px',
                        padding: '32px',
                        border: '1px solid var(--border-color)'
                    }}>
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: '500',
                            marginBottom: '16px',
                            color: 'var(--text-primary)'
                        }}>
                            <span style={{ color: 'var(--accent-secondary)' }}>🌍 </span>
                            Global Community
                        </h3>
                        <p style={{
                            color: 'var(--text-secondary)',
                            lineHeight: '1.6'
                        }}>
                            From local meetups to international conferences, we connect developers across the globe. 
                            Whether you're a beginner or a seasoned expert, there's always something new to learn and someone to meet.
                        </p>
                    </div>
                </div>

                <div style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    padding: '48px',
                    border: '1px solid var(--border-color)',
                    textAlign: 'center',
                    marginBottom: '48px'
                }}>
                    <h2 style={{
                        fontSize: '28px',
                        fontWeight: '500',
                        marginBottom: '24px',
                        color: 'var(--text-primary)'
                    }}>
                        Built for Developers, by Developers
                    </h2>
                    <p style={{
                        fontSize: '16px',
                        color: 'var(--text-secondary)',
                        maxWidth: '600px',
                        margin: '0 auto 32px',
                        lineHeight: '1.6'
                    }}>
                        eventLoop was created by developers who understand the importance of staying connected with the community. 
                        We've experienced firsthand how attending the right event at the right time can transform your career and perspective.
                    </p>
                    
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '32px',
                        marginTop: '32px'
                    }}>
                        <div>
                            <div style={{
                                fontSize: '32px',
                                fontWeight: '600',
                                color: 'var(--accent-primary)',
                                marginBottom: '8px'
                            }}>
                                10,000+
                            </div>
                            <div style={{
                                fontSize: '14px',
                                color: 'var(--text-muted)'
                            }}>
                                Events Listed
                            </div>
                        </div>
                        
                        <div>
                            <div style={{
                                fontSize: '32px',
                                fontWeight: '600',
                                color: 'var(--accent-primary)',
                                marginBottom: '8px'
                            }}>
                                50,000+
                            </div>
                            <div style={{
                                fontSize: '14px',
                                color: 'var(--text-muted)'
                            }}>
                                Developers Connected
                            </div>
                        </div>
                        
                        <div>
                            <div style={{
                                fontSize: '32px',
                                fontWeight: '600',
                                color: 'var(--accent-primary)',
                                marginBottom: '8px'
                            }}>
                                100+
                            </div>
                            <div style={{
                                fontSize: '14px',
                                color: 'var(--text-muted)'
                            }}>
                                Cities Worldwide
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    padding: '32px',
                    border: '1px solid var(--border-color)'
                }}>
                    <h3 style={{
                        fontSize: '20px',
                        fontWeight: '500',
                        marginBottom: '16px',
                        color: 'var(--text-primary)'
                    }}>
                        <span style={{ color: 'var(--accent-secondary)' }}>🚀 </span>
                        Get Involved
                    </h3>
                    <p style={{
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6',
                        marginBottom: '24px'
                    }}>
                        Ready to join the community? Start by browsing events in your area, or help us grow by submitting events you know about. 
                        eventLoop is stronger when we all contribute to making the developer community more connected.
                    </p>
                    
                    <div style={{
                        display: 'flex',
                        gap: '16px',
                        flexWrap: 'wrap'
                    }}>
                        <button className="nav-cta">
                            Browse Events
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
                            Submit an Event
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;