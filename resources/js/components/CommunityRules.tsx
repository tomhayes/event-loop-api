import * as React from 'react';

const CommunityRules: React.FC = () => {
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
                        Community Rules
                    </h1>
                    <p style={{
                        fontSize: '18px',
                        color: 'var(--text-secondary)',
                        maxWidth: '800px',
                        lineHeight: '1.6'
                    }}>
                        Guidelines for maintaining a welcoming and professional community.
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
                        Our Code of Conduct
                    </h2>
                    <p style={{
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6',
                        marginBottom: '16px'
                    }}>
                        eventLoop is committed to providing a harassment-free experience for everyone, regardless of:
                    </p>
                    <ul style={{
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6',
                        paddingLeft: '20px'
                    }}>
                        <li>Gender, gender identity, and expression</li>
                        <li>Age, sexual orientation, disability</li>
                        <li>Physical appearance, body size, race, ethnicity</li>
                        <li>Religion, nationality, or experience level</li>
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
                        Expected Behavior
                    </h2>
                    <ul style={{
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6',
                        paddingLeft: '20px'
                    }}>
                        <li>Be respectful and professional in all interactions</li>
                        <li>Use welcoming and inclusive language</li>
                        <li>Be open to constructive feedback</li>
                        <li>Focus on what's best for the community</li>
                        <li>Show empathy towards other members</li>
                    </ul>
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
                    Prohibited Behavior
                    </h2>
                    <ul style={{
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6',
                        paddingLeft: '20px'
                    }}>
                        <li>Harassment, trolling, or discriminatory language</li>
                        <li>Spam, self-promotion without value</li>
                        <li>Sharing inappropriate or offensive content</li>
                        <li>Impersonation or false information</li>
                        <li>Any illegal or harmful activities</li>
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default CommunityRules;