import * as React from 'react';

const PrivacyPolicy: React.FC = () => {
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
                        Privacy Policy
                    </h1>
                    <p style={{
                        fontSize: '18px',
                        color: 'var(--text-secondary)',
                        maxWidth: '800px',
                        lineHeight: '1.6'
                    }}>
                        Last updated: June 29, 2025
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
                        Information We Collect
                    </h2>
                    <p style={{
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6',
                        marginBottom: '16px'
                    }}>
                        We collect information you provide directly to us, such as when you create an account, 
                        submit an event, or contact us for support.
                    </p>
                    <ul style={{
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6',
                        paddingLeft: '20px'
                    }}>
                        <li>Email address and name</li>
                        <li>Event information you submit</li>
                        <li>Communication preferences</li>
                        <li>Usage data and analytics</li>
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
                        How We Use Your Information
                    </h2>
                    <p style={{
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6',
                        marginBottom: '16px'
                    }}>
                        We use the information we collect to provide, maintain, and improve our services:
                    </p>
                    <ul style={{
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6',
                        paddingLeft: '20px'
                    }}>
                        <li>To operate and maintain the eventLoop platform</li>
                        <li>To send you event recommendations and updates</li>
                        <li>To respond to your comments and questions</li>
                        <li>To analyze usage patterns and improve our service</li>
                        <li>To prevent fraud and ensure platform security</li>
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
                        Information Sharing
                    </h2>
                    <p style={{
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6'
                    }}>
                        We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, 
                        except as described in this policy. We may share information in the following circumstances:
                    </p>
                    <ul style={{
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6',
                        paddingLeft: '20px',
                        marginTop: '16px'
                    }}>
                        <li>With event organizers when you register for their events</li>
                        <li>With service providers who assist in operating our platform</li>
                        <li>When required by law or to protect our rights</li>
                        <li>In connection with a business transfer or acquisition</li>
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
                        Your Rights and Choices
                    </h2>
                    <p style={{
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6',
                        marginBottom: '16px'
                    }}>
                        You have several rights regarding your personal information:
                    </p>
                    <ul style={{
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6',
                        paddingLeft: '20px'
                    }}>
                        <li>Access and update your account information</li>
                        <li>Delete your account and associated data</li>
                        <li>Opt out of marketing communications</li>
                        <li>Request a copy of your data</li>
                        <li>Restrict processing of your information</li>
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
                        Data Security
                    </h2>
                    <p style={{
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6'
                    }}>
                        We implement appropriate technical and organizational measures to protect your personal information 
                        against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission 
                        over the internet is 100% secure, and we cannot guarantee absolute security.
                    </p>
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
                        Contact Us
                    </h2>
                    <p style={{
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6',
                        marginBottom: '16px'
                    }}>
                        If you have any questions about this Privacy Policy or our data practices, please contact us:
                    </p>
                    <div style={{
                        background: 'var(--bg-tertiary)',
                        padding: '16px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)'
                    }}>
                        <p style={{
                            color: 'var(--text-secondary)',
                            margin: '0 0 8px 0'
                        }}>
                            Email: privacy@eventloop.dev
                        </p>
                        <p style={{
                            color: 'var(--text-secondary)',
                            margin: 0
                        }}>
                            Address: 123 Developer Street, Code City, CC 12345
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PrivacyPolicy;