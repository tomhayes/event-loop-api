import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SpeakerApplication: React.FC = () => {
    const { user, isAttendee } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        topic: '',
        description: '',
        proficiency_level: 'intermediate' as 'beginner' | 'intermediate' | 'advanced' | 'expert',
        bio: '',
        linkedin_url: '',
        github_url: '',
        portfolio_url: '',
        available_for_remote: true,
    });

    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

    const expertiseTags = [
        'JavaScript', 'React', 'Vue', 'Angular', 'Node.js', 'Python', 'Django',
        'PHP', 'Laravel', 'Ruby', 'Rails', 'Java', 'Spring', 'C#', '.NET',
        'Go', 'Rust', 'Swift', 'Kotlin', 'Flutter', 'React Native',
        'DevOps', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
        'Machine Learning', 'AI', 'Data Science', 'Blockchain', 'Web3',
        'Frontend', 'Backend', 'Full Stack', 'UI/UX', 'Design', 'Testing',
        'Security', 'Performance', 'Databases', 'GraphQL', 'API', 'Microservices'
    ];

    const commonRegions = [
        'North America', 'Europe', 'Asia Pacific', 'Latin America', 'Africa',
        'San Francisco Bay Area', 'New York', 'London', 'Berlin', 'Tokyo',
        'Singapore', 'Sydney', 'Toronto', 'Remote'
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        });
        if (error) setError(null);
    };

    const handleTagToggle = (tag: string) => {
        setSelectedTags(prev => 
            prev.includes(tag) 
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const handleRegionToggle = (region: string) => {
        setSelectedRegions(prev => 
            prev.includes(region) 
                ? prev.filter(r => r !== region)
                : [...prev, region]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (selectedTags.length === 0) {
            setError('Please select at least one expertise area');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/speaker-applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                },
                body: JSON.stringify({
                    ...formData,
                    expertise_tags: selectedTags,
                    preferred_regions: selectedRegions,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Application submission failed');
            }

            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Application submission failed');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <section className="events">
                <div className="container">
                    <div style={{ textAlign: 'center', padding: '48px 0' }}>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Please log in to apply as a speaker.
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
                            Only attendees can apply to become speakers.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    if (success) {
        return (
            <section className="events">
                <div className="container">
                    <div style={{ 
                        maxWidth: '600px', 
                        margin: '0 auto',
                        paddingTop: '48px',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            background: 'rgba(34, 197, 94, 0.1)',
                            border: '1px solid #22c55e',
                            borderRadius: '12px',
                            padding: '32px',
                            marginBottom: '24px'
                        }}>
                            <h1 style={{
                                fontSize: '24px',
                                fontWeight: '500',
                                marginBottom: '16px',
                                color: '#22c55e'
                            }}>
                                ✓ Application Submitted!
                            </h1>
                            <p style={{
                                fontSize: '16px',
                                color: 'var(--text-secondary)',
                                lineHeight: '1.5',
                                marginBottom: '24px'
                            }}>
                                Thank you for applying to become a speaker. Your application has been submitted 
                                and is now under review by our admin team. You'll be notified once it's been reviewed.
                            </p>
                            <button
                                onClick={() => navigate('/')}
                                className="nav-cta"
                                style={{ fontSize: '14px' }}
                            >
                                Back to Events
                            </button>
                        </div>
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
                            Become a Speaker
                        </h1>
                        <p style={{
                            fontSize: '16px',
                            color: 'var(--text-secondary)',
                            lineHeight: '1.5'
                        }}>
                            Share your expertise with the developer community. Apply to speak at events 
                            and help others learn from your experience.
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

                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: '24px' }}>
                            <label htmlFor="topic" className="form-label">
                                Speaking Topic
                            </label>
                            <input
                                type="text"
                                id="topic"
                                name="topic"
                                value={formData.topic}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="e.g., Introduction to React Hooks"
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '24px' }}>
                            <label htmlFor="description" className="form-label">
                                Talk Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                className="form-textarea"
                                placeholder="Describe your talk, what attendees will learn, and why it's valuable..."
                                disabled={loading}
                                rows={4}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '24px' }}>
                            <label htmlFor="proficiency_level" className="form-label">
                                Proficiency Level
                            </label>
                            <select
                                id="proficiency_level"
                                name="proficiency_level"
                                value={formData.proficiency_level}
                                onChange={handleChange}
                                required
                                className="form-input"
                                disabled={loading}
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                                <option value="expert">Expert</option>
                            </select>
                        </div>

                        <div className="form-group" style={{ marginBottom: '24px' }}>
                            <label className="form-label">
                                Expertise Areas
                            </label>
                            <p style={{
                                fontSize: '14px',
                                color: 'var(--text-muted)',
                                marginBottom: '16px'
                            }}>
                                Select the technologies and topics you can speak about
                            </p>
                            <div style={{
                                border: '1px solid var(--border-color)',
                                borderRadius: '12px',
                                background: 'var(--bg-tertiary)',
                                padding: '20px',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                                gap: '12px',
                                maxHeight: '250px',
                                overflowY: 'auto'
                            }}>
                                {expertiseTags.map((tag) => (
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
                                            fontFamily: 'inherit'
                                        }}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                            {selectedTags.length > 0 && (
                                <p style={{
                                    fontSize: '14px',
                                    color: 'var(--accent-secondary)',
                                    marginTop: '12px'
                                }}>
                                    ✓ {selectedTags.length} expertise area{selectedTags.length !== 1 ? 's' : ''} selected
                                </p>
                            )}
                        </div>

                        <div className="form-group" style={{ marginBottom: '24px' }}>
                            <label htmlFor="bio" className="form-label">
                                Bio (Optional)
                            </label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                className="form-textarea"
                                placeholder="Tell us about yourself, your background, and experience..."
                                disabled={loading}
                                rows={3}
                            />
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '16px',
                            marginBottom: '24px'
                        }}>
                            <div className="form-group">
                                <label htmlFor="linkedin_url" className="form-label">
                                    LinkedIn URL (Optional)
                                </label>
                                <input
                                    type="url"
                                    id="linkedin_url"
                                    name="linkedin_url"
                                    value={formData.linkedin_url}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="https://linkedin.com/in/yourprofile"
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="github_url" className="form-label">
                                    GitHub URL (Optional)
                                </label>
                                <input
                                    type="url"
                                    id="github_url"
                                    name="github_url"
                                    value={formData.github_url}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="https://github.com/yourusername"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '24px' }}>
                            <label htmlFor="portfolio_url" className="form-label">
                                Portfolio/Website URL (Optional)
                            </label>
                            <input
                                type="url"
                                id="portfolio_url"
                                name="portfolio_url"
                                value={formData.portfolio_url}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="https://yourwebsite.com"
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '24px' }}>
                            <label className="form-label">
                                <input
                                    type="checkbox"
                                    name="available_for_remote"
                                    checked={formData.available_for_remote}
                                    onChange={handleChange}
                                    disabled={loading}
                                    style={{ marginRight: '8px' }}
                                />
                                Available for remote speaking
                            </label>
                            <p style={{
                                fontSize: '12px',
                                color: 'var(--text-muted)',
                                marginTop: '4px'
                            }}>
                                Check this if you can present at online events
                            </p>
                        </div>

                        <div className="form-group" style={{ marginBottom: '32px' }}>
                            <label className="form-label">
                                Preferred Regions (Optional)
                            </label>
                            <p style={{
                                fontSize: '14px',
                                color: 'var(--text-muted)',
                                marginBottom: '16px'
                            }}>
                                Select regions where you'd prefer to speak
                            </p>
                            <div style={{
                                border: '1px solid var(--border-color)',
                                borderRadius: '12px',
                                background: 'var(--bg-tertiary)',
                                padding: '20px',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                                gap: '12px'
                            }}>
                                {commonRegions.map((region) => (
                                    <button
                                        key={region}
                                        type="button"
                                        onClick={() => handleRegionToggle(region)}
                                        disabled={loading}
                                        style={{
                                            padding: '8px 12px',
                                            border: `2px solid ${selectedRegions.includes(region) ? 'var(--accent-secondary)' : 'var(--border-color)'}`,
                                            borderRadius: '8px',
                                            background: selectedRegions.includes(region) ? 'rgba(137, 180, 250, 0.1)' : 'var(--bg-secondary)',
                                            color: selectedRegions.includes(region) ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                                            fontSize: '13px',
                                            fontWeight: selectedRegions.includes(region) ? '500' : '400',
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            transition: 'all 0.2s ease',
                                            fontFamily: 'inherit'
                                        }}
                                    >
                                        {region}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            justifyContent: 'flex-end',
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
                                    fontFamily: 'inherit'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="nav-cta"
                                style={{
                                    fontSize: '14px',
                                    opacity: loading ? 0.7 : 1,
                                    cursor: loading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {loading ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default SpeakerApplication;