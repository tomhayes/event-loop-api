import * as React from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'attendee' as 'attendee' | 'organizer'
    });
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [showAllTags, setShowAllTags] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Most popular tags (based on typical event frequency)
    const popularTags = [
        'JavaScript', 'React', 'Python', 'Node.js', 'AWS', 'DevOps', 'Docker',
        'Frontend', 'Backend', 'Full Stack', 'Machine Learning', 'AI', 'API',
        'Testing', 'UI/UX'
    ];

    // Less common but still relevant tags
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
    
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user starts typing
        if (error) setError(null);
    };

    const handleTagToggle = (tag: string) => {
        setSelectedTags(prev => 
            prev.includes(tag) 
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Client-side validation
        if (formData.password !== formData.password_confirmation) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            setLoading(false);
            return;
        }

        if (!/^[a-zA-Z0-9]+$/.test(formData.username)) {
            setError('Username can only contain letters and numbers');
            setLoading(false);
            return;
        }

        if (formData.username.length < 3) {
            setError('Username must be at least 3 characters long');
            setLoading(false);
            return;
        }

        try {
            const preferences = formData.role === 'attendee' ? { tags: selectedTags } : undefined;
            
            await register(
                formData.name,
                formData.username, 
                formData.email, 
                formData.password, 
                formData.password_confirmation,
                formData.role,
                preferences
            );
            navigate('/'); // Redirect to home after successful registration
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="events">
            <div className="container">
                <div style={{ 
                    maxWidth: '800px', 
                    margin: '0 auto',
                    paddingTop: '48px'
                }}>
                    <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                        <h1 style={{
                            fontSize: '32px',
                            fontWeight: '500',
                            marginBottom: '8px',
                            color: 'var(--text-primary)',
                            lineHeight: '1.2'
                        }}>
                            <span style={{ color: 'var(--accent-secondary)' }}>// </span>
                            Create Account
                        </h1>
                        <p style={{
                            fontSize: '16px',
                            color: 'var(--text-secondary)'
                        }}>
                            Join the eventLoop community
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

                    <div className="form-container">
                        <form onSubmit={handleSubmit}>
                            {/* Personal Information Section */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                gap: '24px',
                                marginBottom: '32px'
                            }}>
                                <div className="form-group">
                                    <label htmlFor="name" className="form-label">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="form-input"
                                        placeholder="John Doe"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="username" className="form-label">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                        className="form-input"
                                        placeholder="johndoe123"
                                        disabled={loading}
                                        pattern="[a-zA-Z0-9]+"
                                        minLength={3}
                                        maxLength={30}
                                        title="Username can only contain letters and numbers"
                                    />
                                    <p style={{
                                        fontSize: '12px',
                                        color: 'var(--text-muted)',
                                        marginTop: '4px'
                                    }}>
                                        Letters and numbers only, 3-30 characters
                                    </p>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="form-input"
                                        placeholder="your.email@example.com"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* Account Type Section */}
                            <div className="form-group" style={{ marginBottom: '32px' }}>
                                <label htmlFor="role" className="form-label">
                                    Account Type
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                    className="form-input"
                                    disabled={loading}
                                    style={{ maxWidth: '500px' }}
                                >
                                    <option value="attendee">Attendee - Discover and attend events</option>
                                    <option value="organizer">Organizer - Create and manage events</option>
                                </select>
                                <p style={{
                                    fontSize: '12px',
                                    color: 'var(--text-muted)',
                                    marginTop: '8px',
                                    maxWidth: '500px'
                                }}>
                                    {formData.role === 'attendee' 
                                        ? 'As an attendee, you can discover events tailored to your interests'
                                        : 'As an organizer, you can create and manage your own developer events'
                                    }
                                </p>
                            </div>

                            {/* Password Section */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                gap: '24px',
                                marginBottom: '32px'
                            }}>
                                <div className="form-group">
                                    <label htmlFor="password" className="form-label">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="form-input"
                                        placeholder="At least 8 characters"
                                        disabled={loading}
                                        minLength={8}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password_confirmation" className="form-label">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                        required
                                        className="form-input"
                                        placeholder="Repeat your password"
                                        disabled={loading}
                                        minLength={8}
                                    />
                                </div>
                            </div>

                            {formData.role === 'attendee' && (
                                <div className="form-group" style={{ marginBottom: '32px' }}>
                                    <label className="form-label">
                                        Interests (Optional)
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
                            )}

                            <div className="form-actions">
                                <button 
                                    type="submit" 
                                    className="btn-submit"
                                    disabled={loading}
                                    style={{
                                        width: '100%',
                                        opacity: loading ? 0.7 : 1,
                                        cursor: loading ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </button>
                            </div>
                        </form>

                        <div style={{
                            textAlign: 'center',
                            marginTop: '24px',
                            paddingTop: '24px',
                            borderTop: '1px solid var(--border-color)'
                        }}>
                            <p style={{
                                color: 'var(--text-secondary)',
                                fontSize: '14px',
                                marginBottom: '16px'
                            }}>
                                Already have an account?
                            </p>
                            <Link 
                                to="/login"
                                style={{
                                    color: 'var(--accent-primary)',
                                    textDecoration: 'none',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}
                            >
                                Sign in instead →
                            </Link>
                        </div>

                        <div style={{
                            background: 'var(--bg-tertiary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            padding: '16px',
                            marginTop: '24px'
                        }}>
                            <p style={{
                                color: 'var(--text-muted)',
                                fontSize: '12px',
                                lineHeight: '1.5',
                                margin: 0,
                                textAlign: 'center'
                            }}>
                                By creating an account, you agree to our{' '}
                                <Link 
                                    to="/terms" 
                                    style={{ color: 'var(--accent-secondary)', textDecoration: 'none' }}
                                >
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link 
                                    to="/privacy" 
                                    style={{ color: 'var(--accent-secondary)', textDecoration: 'none' }}
                                >
                                    Privacy Policy
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Register;