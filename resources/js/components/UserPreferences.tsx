import * as React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserPreferences: React.FC = () => {
    const { user, updatePreferences, isAttendee } = useAuth();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [showAllTags, setShowAllTags] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    // Popular tags (based on typical event frequency)
    const popularTags = [
        'JavaScript', 'React', 'Python', 'Node.js', 'AWS', 'DevOps', 'Docker',
        'Frontend', 'Backend', 'Full Stack', 'Machine Learning', 'AI', 'API',
        'Testing', 'UI/UX'
    ];

    // All available tags
    const allTags = [
        'JavaScript', 'React', 'Vue', 'Angular', 'Node.js', 'Python', 'Django',
        'PHP', 'Laravel', 'Ruby', 'Rails', 'Java', 'Spring', 'C#', '.NET',
        'Go', 'Rust', 'Swift', 'Kotlin', 'Flutter', 'React Native', 'iOS',
        'Android', 'DevOps', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
        'Machine Learning', 'AI', 'Data Science', 'Blockchain', 'Web3', 'Crypto',
        'Frontend', 'Backend', 'Full Stack', 'UI/UX', 'Design', 'Testing',
        'Security', 'Performance', 'Databases', 'GraphQL', 'API', 'Microservices',
        'TypeScript', 'Svelte', 'Next.js', 'Nuxt.js', 'Express', 'FastAPI',
        'MongoDB', 'PostgreSQL', 'Redis', 'Elasticsearch', 'Kafka', 'RabbitMQ',
        'Jenkins', 'GitLab CI', 'GitHub Actions', 'Terraform', 'Ansible',
        'Prometheus', 'Grafana', 'Linux', 'Windows', 'macOS', 'Unity',
        'Unreal Engine', 'WebGL', 'Three.js', 'WebRTC', 'PWA', 'Jamstack',
        'Serverless', 'Edge Computing', 'IoT', 'AR', 'VR', 'Quantum Computing'
    ];

    const displayedTags = showAllTags ? allTags : popularTags;

    // Initialize selected tags from user preferences
    useEffect(() => {
        if (user?.preferences?.tags) {
            setSelectedTags(user.preferences.tags);
        }
    }, [user]);

    // Redirect non-attendees
    useEffect(() => {
        if (user && !isAttendee) {
            navigate('/');
        }
    }, [user, isAttendee, navigate]);

    const handleTagToggle = (tag: string) => {
        setSelectedTags(prev => 
            prev.includes(tag) 
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
        // Clear success message when making changes
        if (success) setSuccess(false);
        if (error) setError(null);
    };

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await updatePreferences(selectedTags);
            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update preferences');
        } finally {
            setLoading(false);
        }
    };

    const hasChanges = JSON.stringify(selectedTags.sort()) !== JSON.stringify((user?.preferences?.tags || []).sort());

    if (!user) {
        return (
            <section className="events">
                <div className="container">
                    <div style={{ textAlign: 'center', padding: '48px 0' }}>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Please log in to manage your preferences.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    if (!isAttendee) {
        return (
            <section className="events">
                <div className="container">
                    <div style={{ textAlign: 'center', padding: '48px 0' }}>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Preferences are only available for attendee accounts.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="events">
            <div className="container">
                <div style={{ 
                    maxWidth: '800px', 
                    margin: '0 auto',
                    paddingTop: '48px'
                }}>
                    <div style={{ marginBottom: '32px' }}>
                        <h1 style={{
                            fontSize: '32px',
                            fontWeight: '500',
                            marginBottom: '8px',
                            color: 'var(--text-primary)',
                            lineHeight: '1.2'
                        }}>
                            <span style={{ color: 'var(--accent-secondary)' }}>// </span>
                            My Preferences
                        </h1>
                        <p style={{
                            fontSize: '16px',
                            color: 'var(--text-secondary)',
                            lineHeight: '1.5'
                        }}>
                            Select your technology interests to see relevant events on your homepage. 
                            Your preferences help us personalize your event recommendations.
                        </p>
                    </div>

                    {error && (
                        <div style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid #ef4444',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            marginBottom: '24px',
                            color: '#ef4444',
                            fontSize: '14px'
                        }}>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div style={{
                            background: 'rgba(34, 197, 94, 0.1)',
                            border: '1px solid #22c55e',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            marginBottom: '24px',
                            color: '#22c55e',
                            fontSize: '14px'
                        }}>
                            ✓ Preferences updated successfully!
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">
                            Technology Interests
                        </label>
                        <p style={{
                            fontSize: '14px',
                            color: 'var(--text-muted)',
                            marginBottom: '16px',
                            lineHeight: '1.5'
                        }}>
                            Select technologies and topics you're interested in to see relevant events
                        </p>
                        <div style={{
                            border: '1px solid var(--border-color)',
                            borderRadius: '12px',
                            background: 'var(--bg-tertiary)'
                        }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                                gap: '12px',
                                padding: '20px',
                                maxHeight: showAllTags ? '350px' : 'auto',
                                overflowY: showAllTags ? 'auto' : 'visible'
                            }}>
                                {displayedTags.map((tag) => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => handleTagToggle(tag)}
                                        disabled={loading}
                                        style={{
                                            padding: '8px 12px',
                                            border: `2px solid ${selectedTags.includes(tag) ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                                            borderRadius: '8px',
                                            background: selectedTags.includes(tag) ? 'rgba(203, 166, 247, 0.1)' : 'var(--bg-secondary)',
                                            color: selectedTags.includes(tag) ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                            fontSize: '13px',
                                            fontWeight: selectedTags.includes(tag) ? '500' : '400',
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            transition: 'all 0.2s ease',
                                            fontFamily: 'inherit',
                                            textAlign: 'center',
                                            minHeight: '40px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        onMouseOver={(e) => {
                                            if (!loading && !selectedTags.includes(tag)) {
                                                e.currentTarget.style.borderColor = 'var(--accent-secondary)';
                                                e.currentTarget.style.color = 'var(--accent-secondary)';
                                            }
                                        }}
                                        onMouseOut={(e) => {
                                            if (!loading && !selectedTags.includes(tag)) {
                                                e.currentTarget.style.borderColor = 'var(--border-color)';
                                                e.currentTarget.style.color = 'var(--text-secondary)';
                                            }
                                        }}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                            
                            <div style={{
                                borderTop: '1px solid var(--border-color)',
                                padding: '16px 20px',
                                textAlign: 'center',
                                background: 'var(--bg-secondary)',
                                borderBottomLeftRadius: '12px',
                                borderBottomRightRadius: '12px'
                            }}>
                                <button
                                    type="button"
                                    onClick={() => setShowAllTags(!showAllTags)}
                                    disabled={loading}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--accent-secondary)',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        textDecoration: 'underline',
                                        fontFamily: 'inherit',
                                        transition: 'color 0.2s ease'
                                    }}
                                    onMouseOver={(e) => {
                                        if (!loading) e.currentTarget.style.color = 'var(--accent-primary)';
                                    }}
                                    onMouseOut={(e) => {
                                        if (!loading) e.currentTarget.style.color = 'var(--accent-secondary)';
                                    }}
                                >
                                    {showAllTags ? (
                                        <>▲ Show fewer interests ({popularTags.length} popular)</>
                                    ) : (
                                        <>▼ Show more interests (+{allTags.length - popularTags.length} more)</>
                                    )}
                                </button>
                            </div>
                        </div>
                        {selectedTags.length > 0 && (
                            <p style={{
                                fontSize: '14px',
                                color: 'var(--accent-secondary)',
                                marginTop: '12px',
                                padding: '8px 12px',
                                background: 'rgba(137, 180, 250, 0.1)',
                                borderRadius: '6px',
                                border: '1px solid rgba(137, 180, 250, 0.2)'
                            }}>
                                ✓ {selectedTags.length} interest{selectedTags.length !== 1 ? 's' : ''} selected
                            </p>
                        )}
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        justifyContent: 'flex-end',
                        marginTop: '32px',
                        paddingTop: '24px',
                        borderTop: '1px solid var(--border-color)'
                    }}>
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            style={{
                                background: 'none',
                                border: '1px solid var(--border-color)',
                                borderRadius: '6px',
                                padding: '12px 24px',
                                fontSize: '14px',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={loading || !hasChanges}
                            className="nav-cta"
                            style={{
                                fontSize: '14px',
                                opacity: loading || !hasChanges ? 0.7 : 1,
                                cursor: loading || !hasChanges ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? 'Saving...' : 'Save Preferences'}
                        </button>
                    </div>

                    {!hasChanges && selectedTags.length > 0 && (
                        <p style={{
                            fontSize: '12px',
                            color: 'var(--text-muted)',
                            textAlign: 'center',
                            marginTop: '12px'
                        }}>
                            No changes to save
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default UserPreferences;