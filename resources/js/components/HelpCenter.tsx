import * as React from 'react';
import { useState } from 'react';

const HelpCenter: React.FC = () => {
    const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

    const toggleQuestion = (questionId: string) => {
        setActiveQuestion(activeQuestion === questionId ? null : questionId);
    };

    const faqItems = [
        {
            id: 'find-events',
            question: 'How do I find events in my area?',
            answer: 'Use our search functionality on the homepage to filter events by location, technology, or event type. You can also browse all events and use the filter options to narrow down results.'
        },
        {
            id: 'submit-event',
            question: 'How can I submit an event to eventLoop?',
            answer: 'Click on "Submit Event" in the navigation or footer. Fill out the event form with details including title, location, date, and description. Our team will review and approve quality events.'
        },
        {
            id: 'event-types',
            question: 'What types of events can I find here?',
            answer: 'eventLoop features conferences, meetups, workshops, hackathons, and other developer-focused events. We cover all programming languages, frameworks, and tech topics.'
        },
        {
            id: 'registration',
            question: 'How do I register for events?',
            answer: 'Click on any event card to view details, then use the registration link provided by the event organizer. Registration is handled directly by event organizers, not through eventLoop.'
        },
        {
            id: 'api-access',
            question: 'Is there an API available?',
            answer: 'Yes! Check out our API documentation to integrate eventLoop data into your applications. The API provides access to event listings and search functionality.'
        },
        {
            id: 'mobile-app',
            question: 'Is there a mobile app?',
            answer: 'We\'re currently developing a mobile app for iOS and Android. Sign up for our newsletter to get notified when it launches.'
        }
    ];

    const supportCategories = [
        {
            title: 'Getting Started',
            icon: '🚀',
            description: 'New to eventLoop? Learn the basics of finding and attending developer events.',
            topics: ['Account setup', 'Finding events', 'Event registration', 'Platform navigation']
        },
        {
            title: 'Event Organizers',
            icon: '📅',
            description: 'Resources for event organizers looking to promote their events.',
            topics: ['Submit events', 'Event guidelines', 'Best practices', 'Promotion tips']
        },
        {
            title: 'Technical Support',
            icon: '🔧',
            description: 'Having technical issues? Find solutions to common problems.',
            topics: ['API documentation', 'Browser compatibility', 'Account issues', 'Bug reports']
        },
        {
            title: 'Community',
            icon: '👥',
            description: 'Connect with other developers and learn about community guidelines.',
            topics: ['Community rules', 'Code of conduct', 'Discord server', 'Networking tips']
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
                        Help Center
                    </h1>
                    <p style={{
                        fontSize: '18px',
                        color: 'var(--text-secondary)',
                        maxWidth: '800px',
                        lineHeight: '1.6'
                    }}>
                        Find answers to common questions and get help with using eventLoop.
                    </p>
                </div>

                {/* Search Bar */}
                <div style={{ marginBottom: '48px' }}>
                    <div className="search-bar" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search help articles..."
                        />
                        <button className="search-btn">
                            Search
                        </button>
                    </div>
                </div>

                {/* Support Categories */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '24px',
                    marginBottom: '48px'
                }}>
                    {supportCategories.map((category) => (
                        <div key={category.title} style={{
                            background: 'var(--bg-secondary)',
                            borderRadius: '12px',
                            padding: '24px',
                            border: '1px solid var(--border-color)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}>
                            <div style={{
                                fontSize: '32px',
                                marginBottom: '12px'
                            }}>
                                {category.icon}
                            </div>
                            <h3 style={{
                                fontSize: '18px',
                                fontWeight: '500',
                                marginBottom: '8px',
                                color: 'var(--text-primary)'
                            }}>
                                {category.title}
                            </h3>
                            <p style={{
                                color: 'var(--text-secondary)',
                                fontSize: '14px',
                                lineHeight: '1.5',
                                marginBottom: '16px'
                            }}>
                                {category.description}
                            </p>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '8px'
                            }}>
                                {category.topics.map((topic) => (
                                    <span key={topic} style={{
                                        background: 'var(--bg-tertiary)',
                                        color: 'var(--text-muted)',
                                        padding: '4px 8px',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        border: '1px solid var(--border-color)'
                                    }}>
                                        {topic}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div>
                    <h2 style={{
                        fontSize: '28px',
                        fontWeight: '500',
                        marginBottom: '32px',
                        color: 'var(--text-primary)',
                        textAlign: 'center'
                    }}>
                        Frequently Asked Questions
                    </h2>

                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        {faqItems.map((item) => (
                            <div key={item.id} style={{
                                background: 'var(--bg-secondary)',
                                borderRadius: '12px',
                                marginBottom: '16px',
                                border: '1px solid var(--border-color)',
                                overflow: 'hidden'
                            }}>
                                <div 
                                    style={{
                                        padding: '20px 24px',
                                        cursor: 'pointer',
                                        borderBottom: activeQuestion === item.id ? '1px solid var(--border-color)' : 'none',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                    onClick={() => toggleQuestion(item.id)}
                                >
                                    <h3 style={{
                                        fontSize: '16px',
                                        fontWeight: '500',
                                        color: 'var(--text-primary)',
                                        margin: 0
                                    }}>
                                        {item.question}
                                    </h3>
                                    <span style={{
                                        color: 'var(--text-muted)',
                                        fontSize: '18px',
                                        transition: 'transform 0.2s ease',
                                        transform: activeQuestion === item.id ? 'rotate(180deg)' : 'rotate(0deg)'
                                    }}>
                                        ▼
                                    </span>
                                </div>

                                {activeQuestion === item.id && (
                                    <div style={{
                                        padding: '0 24px 20px',
                                        animation: 'slideDown 0.3s ease-out'
                                    }}>
                                        <p style={{
                                            color: 'var(--text-secondary)',
                                            lineHeight: '1.6',
                                            margin: 0
                                        }}>
                                            {item.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Support */}
                <div style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    padding: '32px',
                    border: '1px solid var(--border-color)',
                    textAlign: 'center',
                    marginTop: '48px'
                }}>
                    <h3 style={{
                        fontSize: '20px',
                        fontWeight: '500',
                        marginBottom: '12px',
                        color: 'var(--text-primary)'
                    }}>
                        Still need help?
                    </h3>
                    <p style={{
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6',
                        marginBottom: '24px'
                    }}>
                        Can't find what you're looking for? Our support team is here to help.
                    </p>
                    <div style={{
                        display: 'flex',
                        gap: '16px',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                    }}>
                        <button className="nav-cta">
                            Contact Support
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
                            Join Discord
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HelpCenter;