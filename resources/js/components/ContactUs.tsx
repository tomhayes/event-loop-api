import * as React from 'react';
import { useState } from 'react';

const ContactUs: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log('Contact form submitted:', formData);
    };

    const contactMethods = [
        {
            icon: '✉️',
            title: 'Email Support',
            description: 'Get help with your account or technical issues',
            contact: 'support@eventloop.dev',
            responseTime: 'Usually responds within 24 hours'
        },
        {
            icon: '💬',
            title: 'Live Chat',
            description: 'Chat with our team in real-time',
            contact: 'Available 9AM-5PM EST',
            responseTime: 'Instant response during business hours'
        },
        {
            icon: '📱',
            title: 'Discord Community',
            description: 'Join our developer community',
            contact: 'discord.gg/eventloop',
            responseTime: 'Community-driven support'
        }
    ];

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
                        Contact Us
                    </h1>
                    <p style={{
                        fontSize: '18px',
                        color: 'var(--text-secondary)',
                        maxWidth: '800px',
                        lineHeight: '1.6'
                    }}>
                        Have questions, feedback, or need support? We'd love to hear from you.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '32px',
                    marginBottom: '48px'
                }}>
                    {contactMethods.map((method) => (
                        <div key={method.title} style={{
                            background: 'var(--bg-secondary)',
                            borderRadius: '12px',
                            padding: '24px',
                            border: '1px solid var(--border-color)',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                fontSize: '32px',
                                marginBottom: '16px'
                            }}>
                                {method.icon}
                            </div>
                            <h3 style={{
                                fontSize: '18px',
                                fontWeight: '500',
                                marginBottom: '8px',
                                color: 'var(--text-primary)'
                            }}>
                                {method.title}
                            </h3>
                            <p style={{
                                color: 'var(--text-secondary)',
                                fontSize: '14px',
                                lineHeight: '1.5',
                                marginBottom: '12px'
                            }}>
                                {method.description}
                            </p>
                            <div style={{
                                background: 'var(--bg-tertiary)',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                border: '1px solid var(--border-color)',
                                marginBottom: '8px'
                            }}>
                                <code style={{
                                    color: 'var(--accent-primary)',
                                    fontSize: '14px'
                                }}>
                                    {method.contact}
                                </code>
                            </div>
                            <p style={{
                                color: 'var(--text-muted)',
                                fontSize: '12px'
                            }}>
                                {method.responseTime}
                            </p>
                        </div>
                    ))}
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                    gap: '32px'
                }}>
                    {/* Contact Form */}
                    <div>
                        <h2 style={{
                            fontSize: '24px',
                            fontWeight: '500',
                            marginBottom: '24px',
                            color: 'var(--text-primary)'
                        }}>
                            Send us a message
                        </h2>
                        
                        <div className="form-container">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="name" className="form-label">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="form-input"
                                        placeholder="Your full name"
                                    />
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
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="subject" className="form-label">
                                        Subject
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="form-input"
                                    >
                                        <option value="">Select a subject</option>
                                        <option value="general">General Inquiry</option>
                                        <option value="technical">Technical Support</option>
                                        <option value="event-submission">Event Submission</option>
                                        <option value="partnership">Partnership</option>
                                        <option value="feedback">Feedback</option>
                                        <option value="bug-report">Bug Report</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message" className="form-label">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        className="form-textarea"
                                        placeholder="Tell us how we can help you..."
                                        style={{ minHeight: '120px' }}
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn-submit">
                                        Send Message
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div>
                        <h2 style={{
                            fontSize: '24px',
                            fontWeight: '500',
                            marginBottom: '24px',
                            color: 'var(--text-primary)'
                        }}>
                            Other ways to reach us
                        </h2>
                        
                        <div style={{
                            background: 'var(--bg-secondary)',
                            borderRadius: '12px',
                            padding: '24px',
                            border: '1px solid var(--border-color)',
                            marginBottom: '24px'
                        }}>
                            <h3 style={{
                                fontSize: '16px',
                                fontWeight: '500',
                                marginBottom: '12px',
                                color: 'var(--text-primary)'
                            }}>
                                <span style={{ color: 'var(--accent-secondary)' }}>🏢 </span>
                                Office Address
                            </h3>
                            <p style={{
                                color: 'var(--text-secondary)',
                                lineHeight: '1.6',
                                margin: 0
                            }}>
                                123 Developer Street<br />
                                Code City, CC 12345<br />
                                United States
                            </p>
                        </div>

                        <div style={{
                            background: 'var(--bg-secondary)',
                            borderRadius: '12px',
                            padding: '24px',
                            border: '1px solid var(--border-color)',
                            marginBottom: '24px'
                        }}>
                            <h3 style={{
                                fontSize: '16px',
                                fontWeight: '500',
                                marginBottom: '12px',
                                color: 'var(--text-primary)'
                            }}>
                                <span style={{ color: 'var(--accent-secondary)' }}>🕒 </span>
                                Business Hours
                            </h3>
                            <p style={{
                                color: 'var(--text-secondary)',
                                lineHeight: '1.6',
                                margin: 0
                            }}>
                                Monday - Friday: 9:00 AM - 5:00 PM EST<br />
                                Saturday - Sunday: Community support only
                            </p>
                        </div>

                        <div style={{
                            background: 'var(--bg-secondary)',
                            borderRadius: '12px',
                            padding: '24px',
                            border: '1px solid var(--border-color)'
                        }}>
                            <h3 style={{
                                fontSize: '16px',
                                fontWeight: '500',
                                marginBottom: '12px',
                                color: 'var(--text-primary)'
                            }}>
                                <span style={{ color: 'var(--accent-secondary)' }}>🚀 </span>
                                Quick Links
                            </h3>
                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: 0
                            }}>
                                <li style={{ marginBottom: '8px' }}>
                                    <a href="#" style={{
                                        color: 'var(--accent-secondary)',
                                        textDecoration: 'none',
                                        fontSize: '14px'
                                    }}>
                                        → Help Center
                                    </a>
                                </li>
                                <li style={{ marginBottom: '8px' }}>
                                    <a href="#" style={{
                                        color: 'var(--accent-secondary)',
                                        textDecoration: 'none',
                                        fontSize: '14px'
                                    }}>
                                        → API Documentation
                                    </a>
                                </li>
                                <li style={{ marginBottom: '8px' }}>
                                    <a href="#" style={{
                                        color: 'var(--accent-secondary)',
                                        textDecoration: 'none',
                                        fontSize: '14px'
                                    }}>
                                        → Event Guidelines
                                    </a>
                                </li>
                                <li>
                                    <a href="#" style={{
                                        color: 'var(--accent-secondary)',
                                        textDecoration: 'none',
                                        fontSize: '14px'
                                    }}>
                                        → Community Rules
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactUs;