import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CTA: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    return (
        <section style={{
            padding: '80px 0',
            background: 'var(--bg-secondary)',
            textAlign: 'center'
        }}>
            <div className="container">
                <h2 style={{
                    fontSize: '32px',
                    fontWeight: '500',
                    marginBottom: '16px',
                    color: 'var(--text-primary)'
                }}>
                    Ready to connect with the community?
                </h2>
                
                <p style={{
                    fontSize: '16px',
                    color: 'var(--text-secondary)',
                    marginBottom: '32px',
                    maxWidth: '600px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}>
                    Join thousands of developers who use eventLoop to discover events, expand their skills, and build meaningful connections in the tech industry.
                </p>
                
                <div style={{
                    display: 'flex',
                    gap: '16px',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                }}>
                    {!isAuthenticated ? (
                        <button
                            onClick={() => navigate('/register')}
                            style={{
                                padding: '14px 28px',
                                background: 'var(--accent-primary)',
                                color: 'var(--bg-primary)',
                                border: 'none',
                                borderRadius: '4px',
                                fontFamily: 'inherit',
                                fontWeight: '500',
                                fontSize: '16px',
                                cursor: 'pointer',
                                transition: 'opacity 0.2s ease',
                                textDecoration: 'none',
                                display: 'inline-block'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.opacity = '0.9';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.opacity = '1';
                            }}
                        >
                            Create Account
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/events')}
                            style={{
                                padding: '14px 28px',
                                background: 'var(--accent-primary)',
                                color: 'var(--bg-primary)',
                                border: 'none',
                                borderRadius: '4px',
                                fontFamily: 'inherit',
                                fontWeight: '500',
                                fontSize: '16px',
                                cursor: 'pointer',
                                transition: 'opacity 0.2s ease',
                                textDecoration: 'none',
                                display: 'inline-block'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.opacity = '0.9';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.opacity = '1';
                            }}
                        >
                            My Events
                        </button>
                    )}
                    
                    <button
                        onClick={() => navigate('/events')}
                        style={{
                            padding: '14px 28px',
                            background: 'transparent',
                            color: 'var(--accent-secondary)',
                            border: '1px solid var(--accent-secondary)',
                            borderRadius: '4px',
                            fontFamily: 'inherit',
                            fontWeight: '500',
                            fontSize: '16px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            textDecoration: 'none',
                            display: 'inline-block'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = 'var(--accent-secondary)';
                            e.currentTarget.style.color = 'var(--bg-primary)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'var(--accent-secondary)';
                        }}
                    >
                        Browse Events
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CTA;