import * as React from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        login: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user starts typing
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await login(formData.login, formData.password);
            navigate('/'); // Redirect to home after successful login
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="events">
            <div className="container">
                <div style={{ 
                    maxWidth: '400px', 
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
                            Sign In
                        </h1>
                        <p style={{
                            fontSize: '16px',
                            color: 'var(--text-secondary)'
                        }}>
                            Welcome back to eventLoop
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
                            <div className="form-group">
                                <label htmlFor="login" className="form-label">
                                    Email or Username
                                </label>
                                <input
                                    type="text"
                                    id="login"
                                    name="login"
                                    value={formData.login}
                                    onChange={handleChange}
                                    required
                                    className="form-input"
                                    placeholder="email@example.com or username"
                                    disabled={loading}
                                />
                            </div>

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
                                    placeholder="Enter your password"
                                    disabled={loading}
                                />
                            </div>

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
                                    {loading ? 'Signing In...' : 'Sign In'}
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
                                Don't have an account?
                            </p>
                            <Link 
                                to="/register"
                                style={{
                                    color: 'var(--accent-primary)',
                                    textDecoration: 'none',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}
                            >
                                Create an account →
                            </Link>
                        </div>

                        <div style={{
                            textAlign: 'center',
                            marginTop: '16px'
                        }}>
                            <Link 
                                to="/forgot-password"
                                style={{
                                    color: 'var(--text-muted)',
                                    textDecoration: 'none',
                                    fontSize: '12px'
                                }}
                            >
                                Forgot your password?
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;