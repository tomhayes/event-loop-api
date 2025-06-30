import * as React from 'react';
import { useState } from 'react';
import { Event } from '../types/Event';

interface EventFormProps {
    event?: Event;
    onSubmit: (data: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => void;
    onCancel: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: event?.title || '',
        location: event?.location || '',
        region: event?.region || '',
        start_date: event?.start_date ? new Date(event.start_date).toISOString().slice(0, 16) : '',
        end_date: event?.end_date ? new Date(event.end_date).toISOString().slice(0, 16) : '',
        description: event?.description || '',
        type: event?.type || 'Meetup',
        format: event?.format || 'in-person',
    });
    const [selectedTags, setSelectedTags] = useState<string[]>(event?.tags || []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            tags: selectedTags
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleTagToggle = (tag: string) => {
        setSelectedTags(prev => 
            prev.includes(tag) 
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    return (
        <div className="form-container">
            <h3 className="form-title">
                {event ? 'Edit Event' : 'Create Event'}
            </h3>
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title" className="form-label">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="form-input"
                        placeholder="Enter event title..."
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="location" className="form-label">
                        Location
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="form-input"
                        placeholder="Enter event location..."
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="region" className="form-label">
                        Region
                    </label>
                    <input
                        type="text"
                        id="region"
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="e.g., San Francisco, London, Remote"
                    />
                    <p style={{
                        fontSize: '12px',
                        color: 'var(--text-muted)',
                        marginTop: '4px'
                    }}>
                        City, country, or "Remote" for online events
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                    marginBottom: '24px'
                }}>
                    <div className="form-group">
                        <label htmlFor="type" className="form-label">
                            Event Type
                        </label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                            className="form-input"
                        >
                            <option value="Meetup">Meetup</option>
                            <option value="Conference">Conference</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Hackathon">Hackathon</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="format" className="form-label">
                            Format
                        </label>
                        <select
                            id="format"
                            name="format"
                            value={formData.format}
                            onChange={handleChange}
                            required
                            className="form-input"
                        >
                            <option value="in-person">In-Person</option>
                            <option value="online">Online</option>
                            <option value="hybrid">Hybrid</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <div className="form-grid">
                        <div>
                            <label htmlFor="start_date" className="form-label">
                                Start Date
                            </label>
                            <input
                                type="datetime-local"
                                id="start_date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                                required
                                className="form-input"
                                min={new Date().toISOString().slice(0, 16)}
                                max="2099-12-31T23:59"
                            />
                        </div>

                        <div>
                            <label htmlFor="end_date" className="form-label">
                                End Date
                            </label>
                            <input
                                type="datetime-local"
                                id="end_date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleChange}
                                required
                                className="form-input"
                                min={new Date().toISOString().slice(0, 16)}
                                max="2099-12-31T23:59"
                            />
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Technologies & Topics (Optional)
                    </label>
                    <p style={{
                        fontSize: '14px',
                        color: 'var(--text-muted)',
                        marginBottom: '16px',
                        lineHeight: '1.5'
                    }}>
                        Select relevant technologies and topics for your event
                    </p>
                    <div style={{
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        background: 'var(--bg-tertiary)',
                        padding: '20px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                        gap: '12px',
                        maxHeight: '300px',
                        overflowY: 'auto'
                    }}>
                        {[
                            'JavaScript', 'React', 'Vue', 'Angular', 'Node.js', 'Python', 'Django',
                            'PHP', 'Laravel', 'Ruby', 'Rails', 'Java', 'Spring', 'C#', '.NET',
                            'Go', 'Rust', 'Swift', 'Kotlin', 'Flutter', 'React Native', 'iOS',
                            'Android', 'DevOps', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
                            'Machine Learning', 'AI', 'Data Science', 'Blockchain', 'Web3', 'Crypto',
                            'Frontend', 'Backend', 'Full Stack', 'UI/UX', 'Design', 'Testing',
                            'Security', 'Performance', 'Databases', 'GraphQL', 'API', 'Microservices',
                            'TypeScript', 'Svelte', 'Next.js', 'Nuxt.js', 'Express', 'FastAPI',
                            'MongoDB', 'PostgreSQL', 'Redis', 'Elasticsearch', 'Kafka', 'RabbitMQ',
                            'Jenkins', 'GitLab CI', 'GitHub Actions', 'Terraform', 'Ansible'
                        ].map((tag) => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => handleTagToggle(tag)}
                                style={{
                                    padding: '8px 12px',
                                    border: `2px solid ${selectedTags.includes(tag) ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                                    borderRadius: '8px',
                                    background: selectedTags.includes(tag) ? 'rgba(203, 166, 247, 0.1)' : 'var(--bg-secondary)',
                                    color: selectedTags.includes(tag) ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                    fontSize: '13px',
                                    fontWeight: selectedTags.includes(tag) ? '500' : '400',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    fontFamily: 'inherit',
                                    textAlign: 'center',
                                    minHeight: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onMouseOver={(e) => {
                                    if (!selectedTags.includes(tag)) {
                                        e.currentTarget.style.borderColor = 'var(--accent-secondary)';
                                        e.currentTarget.style.color = 'var(--accent-secondary)';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (!selectedTags.includes(tag)) {
                                        e.currentTarget.style.borderColor = 'var(--border-color)';
                                        e.currentTarget.style.color = 'var(--text-secondary)';
                                    }
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
                            marginTop: '12px',
                            padding: '8px 12px',
                            background: 'rgba(137, 180, 250, 0.1)',
                            borderRadius: '6px',
                            border: '1px solid rgba(137, 180, 250, 0.2)'
                        }}>
                            ✓ {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''} selected: {selectedTags.join(', ')}
                        </p>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="description" className="form-label">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="form-textarea"
                        placeholder="Enter event description..."
                    />
                </div>

                <div className="form-actions">
                    <button type="button" onClick={onCancel} className="btn-cancel">
                        Cancel
                    </button>
                    <button type="submit" className="btn-submit">
                        {event ? 'Update' : 'Create'} Event
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EventForm;