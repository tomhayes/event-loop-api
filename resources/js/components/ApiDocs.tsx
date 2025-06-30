import * as React from 'react';
import { useState } from 'react';

const ApiDocs: React.FC = () => {
    const [activeEndpoint, setActiveEndpoint] = useState<string | null>(null);

    const toggleEndpoint = (endpoint: string) => {
        setActiveEndpoint(activeEndpoint === endpoint ? null : endpoint);
    };

    const apiEndpoints = [
        {
            id: 'get-events',
            method: 'GET',
            path: '/api/events',
            title: 'Get All Events',
            description: 'Retrieve a list of all events',
            parameters: [],
            response: {
                status: 200,
                body: `[
  {
    "id": 1,
    "title": "React Developer Conference 2025",
    "location": "San Francisco, CA",
    "start_date": "2025-07-15T09:00:00.000000Z",
    "end_date": "2025-07-17T18:00:00.000000Z",
    "description": "The premier React conference for developers",
    "created_at": "2025-06-29T10:00:00.000000Z",
    "updated_at": "2025-06-29T10:00:00.000000Z"
  }
]`
            }
        },
        {
            id: 'get-event',
            method: 'GET',
            path: '/api/events/{id}',
            title: 'Get Single Event',
            description: 'Retrieve a specific event by ID',
            parameters: [
                {
                    name: 'id',
                    type: 'integer',
                    location: 'path',
                    required: true,
                    description: 'The ID of the event to retrieve'
                }
            ],
            response: {
                status: 200,
                body: `{
  "id": 1,
  "title": "React Developer Conference 2025",
  "location": "San Francisco, CA",
  "start_date": "2025-07-15T09:00:00.000000Z",
  "end_date": "2025-07-17T18:00:00.000000Z",
  "description": "The premier React conference for developers",
  "created_at": "2025-06-29T10:00:00.000000Z",
  "updated_at": "2025-06-29T10:00:00.000000Z"
}`
            },
            errorResponse: {
                status: 404,
                body: `{
  "message": "Event not found"
}`
            }
        },
        {
            id: 'create-event',
            method: 'POST',
            path: '/api/events',
            title: 'Create New Event',
            description: 'Create a new event',
            parameters: [
                {
                    name: 'title',
                    type: 'string',
                    location: 'body',
                    required: true,
                    description: 'The title of the event'
                },
                {
                    name: 'location',
                    type: 'string',
                    location: 'body',
                    required: true,
                    description: 'The location where the event will take place'
                },
                {
                    name: 'start_date',
                    type: 'datetime',
                    location: 'body',
                    required: true,
                    description: 'The start date and time of the event (ISO 8601 format)'
                },
                {
                    name: 'end_date',
                    type: 'datetime',
                    location: 'body',
                    required: true,
                    description: 'The end date and time of the event (ISO 8601 format)'
                },
                {
                    name: 'description',
                    type: 'string',
                    location: 'body',
                    required: false,
                    description: 'A description of the event'
                }
            ],
            requestBody: `{
  "title": "React Developer Conference 2025",
  "location": "San Francisco, CA",
  "start_date": "2025-07-15T09:00:00Z",
  "end_date": "2025-07-17T18:00:00Z",
  "description": "The premier React conference for developers"
}`,
            response: {
                status: 201,
                body: `{
  "id": 1,
  "title": "React Developer Conference 2025",
  "location": "San Francisco, CA",
  "start_date": "2025-07-15T09:00:00.000000Z",
  "end_date": "2025-07-17T18:00:00.000000Z",
  "description": "The premier React conference for developers",
  "created_at": "2025-06-29T10:00:00.000000Z",
  "updated_at": "2025-06-29T10:00:00.000000Z"
}`
            },
            errorResponse: {
                status: 422,
                body: `{
  "message": "The given data was invalid.",
  "errors": {
    "title": ["The title field is required."],
    "start_date": ["The start date field is required."]
  }
}`
            }
        },
        {
            id: 'update-event',
            method: 'PUT',
            path: '/api/events/{id}',
            title: 'Update Event',
            description: 'Update an existing event',
            parameters: [
                {
                    name: 'id',
                    type: 'integer',
                    location: 'path',
                    required: true,
                    description: 'The ID of the event to update'
                },
                {
                    name: 'title',
                    type: 'string',
                    location: 'body',
                    required: false,
                    description: 'The title of the event'
                },
                {
                    name: 'location',
                    type: 'string',
                    location: 'body',
                    required: false,
                    description: 'The location where the event will take place'
                },
                {
                    name: 'start_date',
                    type: 'datetime',
                    location: 'body',
                    required: false,
                    description: 'The start date and time of the event (ISO 8601 format)'
                },
                {
                    name: 'end_date',
                    type: 'datetime',
                    location: 'body',
                    required: false,
                    description: 'The end date and time of the event (ISO 8601 format)'
                },
                {
                    name: 'description',
                    type: 'string',
                    location: 'body',
                    required: false,
                    description: 'A description of the event'
                }
            ],
            requestBody: `{
  "title": "Updated React Developer Conference 2025",
  "description": "The premier React conference for developers - now with more workshops!"
}`,
            response: {
                status: 200,
                body: `{
  "id": 1,
  "title": "Updated React Developer Conference 2025",
  "location": "San Francisco, CA",
  "start_date": "2025-07-15T09:00:00.000000Z",
  "end_date": "2025-07-17T18:00:00.000000Z",
  "description": "The premier React conference for developers - now with more workshops!",
  "created_at": "2025-06-29T10:00:00.000000Z",
  "updated_at": "2025-06-29T12:30:00.000000Z"
}`
            },
            errorResponse: {
                status: 404,
                body: `{
  "message": "Event not found"
}`
            }
        }
    ];

    const methodColors = {
        GET: 'var(--accent-secondary)',
        POST: '#10b981',
        PUT: '#f59e0b',
        DELETE: '#ef4444'
    };

    return (
        <section className="events">
            <div className="container">
                {/* Header */}
                <div style={{ marginBottom: '48px' }}>
                    <h1 style={{
                        fontSize: 'clamp(32px, 5vw, 48px)',
                        fontWeight: '500',
                        marginBottom: '16px',
                        color: 'var(--text-primary)',
                        lineHeight: '1.2'
                    }}>
                        <span style={{ color: 'var(--accent-secondary)' }}>// </span>
                        API Documentation
                    </h1>
                    <p style={{
                        fontSize: '18px',
                        color: 'var(--text-secondary)',
                        maxWidth: '800px',
                        lineHeight: '1.6'
                    }}>
                        Complete REST API documentation for the eventLoop platform. 
                        Use these endpoints to integrate with our event management system.
                    </p>
                </div>

                {/* API Base URL */}
                <div style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    padding: '24px',
                    marginBottom: '32px',
                    border: '1px solid var(--border-color)'
                }}>
                    <h3 style={{
                        fontSize: '18px',
                        fontWeight: '500',
                        marginBottom: '12px',
                        color: 'var(--text-primary)'
                    }}>
                        <span style={{ color: 'var(--accent-secondary)' }}>🌐 </span>
                        Base URL
                    </h3>
                    <div style={{
                        background: 'var(--bg-tertiary)',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '14px',
                        color: 'var(--accent-primary)',
                        border: '1px solid var(--border-color)'
                    }}>
                        https://your-domain.com/api
                    </div>
                </div>

                {/* Authentication Info */}
                <div style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    padding: '24px',
                    marginBottom: '32px',
                    border: '1px solid var(--border-color)'
                }}>
                    <h3 style={{
                        fontSize: '18px',
                        fontWeight: '500',
                        marginBottom: '12px',
                        color: 'var(--text-primary)'
                    }}>
                        <span style={{ color: 'var(--accent-secondary)' }}>🔑 </span>
                        Authentication
                    </h3>
                    <p style={{
                        color: 'var(--text-secondary)',
                        marginBottom: '16px',
                        lineHeight: '1.6'
                    }}>
                        This API uses CSRF protection. Include the CSRF token in your requests:
                    </p>
                    <div style={{
                        background: 'var(--bg-tertiary)',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '14px',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-color)'
                    }}>
                        <div style={{ color: 'var(--text-muted)' }}>// Add to request headers:</div>
                        <div style={{ color: 'var(--accent-primary)' }}>X-CSRF-TOKEN: your-csrf-token</div>
                        <div style={{ color: 'var(--accent-primary)' }}>Content-Type: application/json</div>
                    </div>
                </div>

                {/* API Endpoints */}
                <div>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: '500',
                        marginBottom: '32px',
                        color: 'var(--text-primary)'
                    }}>
                        <span style={{ color: 'var(--accent-secondary)' }}>📋 </span>
                        Endpoints
                    </h2>

                    {apiEndpoints.map((endpoint) => (
                        <div key={endpoint.id} style={{
                            background: 'var(--bg-secondary)',
                            borderRadius: '12px',
                            marginBottom: '24px',
                            border: '1px solid var(--border-color)',
                            overflow: 'hidden'
                        }}>
                            {/* Endpoint Header */}
                            <div 
                                style={{
                                    padding: '20px 24px',
                                    cursor: 'pointer',
                                    borderBottom: activeEndpoint === endpoint.id ? '1px solid var(--border-color)' : 'none'
                                }}
                                onClick={() => toggleEndpoint(endpoint.id)}
                            >
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    marginBottom: '8px'
                                }}>
                                    <span style={{
                                        background: methodColors[endpoint.method as keyof typeof methodColors],
                                        color: 'white',
                                        padding: '4px 12px',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        minWidth: '60px',
                                        textAlign: 'center'
                                    }}>
                                        {endpoint.method}
                                    </span>
                                    <code style={{
                                        fontFamily: 'JetBrains Mono, monospace',
                                        fontSize: '16px',
                                        color: 'var(--text-primary)',
                                        background: 'var(--bg-tertiary)',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        flex: 1
                                    }}>
                                        {endpoint.path}
                                    </code>
                                    <span style={{
                                        color: 'var(--text-muted)',
                                        fontSize: '14px'
                                    }}>
                                        {activeEndpoint === endpoint.id ? '▼' : '▶'}
                                    </span>
                                </div>
                                <h3 style={{
                                    fontSize: '18px',
                                    fontWeight: '500',
                                    color: 'var(--text-primary)',
                                    marginBottom: '4px'
                                }}>
                                    {endpoint.title}
                                </h3>
                                <p style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '14px'
                                }}>
                                    {endpoint.description}
                                </p>
                            </div>

                            {/* Endpoint Details */}
                            {activeEndpoint === endpoint.id && (
                                <div style={{ padding: '0 24px 24px' }}>
                                    {/* Parameters */}
                                    {endpoint.parameters.length > 0 && (
                                        <div style={{ marginBottom: '24px' }}>
                                            <h4 style={{
                                                fontSize: '16px',
                                                fontWeight: '500',
                                                color: 'var(--text-primary)',
                                                marginBottom: '12px'
                                            }}>
                                                Parameters
                                            </h4>
                                            <div style={{
                                                background: 'var(--bg-tertiary)',
                                                borderRadius: '8px',
                                                border: '1px solid var(--border-color)',
                                                overflow: 'hidden'
                                            }}>
                                                {endpoint.parameters.map((param, index) => (
                                                    <div key={param.name} style={{
                                                        padding: '12px 16px',
                                                        borderBottom: index < endpoint.parameters.length - 1 ? '1px solid var(--border-color)' : 'none'
                                                    }}>
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            marginBottom: '4px'
                                                        }}>
                                                            <code style={{
                                                                color: 'var(--accent-primary)',
                                                                fontSize: '14px',
                                                                fontWeight: '500'
                                                            }}>
                                                                {param.name}
                                                            </code>
                                                            <span style={{
                                                                color: 'var(--text-muted)',
                                                                fontSize: '12px',
                                                                background: 'var(--bg-primary)',
                                                                padding: '2px 6px',
                                                                borderRadius: '3px'
                                                            }}>
                                                                {param.type}
                                                            </span>
                                                            <span style={{
                                                                color: 'var(--text-muted)',
                                                                fontSize: '12px',
                                                                background: 'var(--bg-primary)',
                                                                padding: '2px 6px',
                                                                borderRadius: '3px'
                                                            }}>
                                                                {param.location}
                                                            </span>
                                                            {param.required && (
                                                                <span style={{
                                                                    color: '#ef4444',
                                                                    fontSize: '12px',
                                                                    background: 'rgba(239, 68, 68, 0.1)',
                                                                    padding: '2px 6px',
                                                                    borderRadius: '3px'
                                                                }}>
                                                                    required
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p style={{
                                                            color: 'var(--text-secondary)',
                                                            fontSize: '13px',
                                                            margin: 0
                                                        }}>
                                                            {param.description}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Request Body */}
                                    {endpoint.requestBody && (
                                        <div style={{ marginBottom: '24px' }}>
                                            <h4 style={{
                                                fontSize: '16px',
                                                fontWeight: '500',
                                                color: 'var(--text-primary)',
                                                marginBottom: '12px'
                                            }}>
                                                Request Body
                                            </h4>
                                            <pre style={{
                                                background: 'var(--bg-tertiary)',
                                                padding: '16px',
                                                borderRadius: '8px',
                                                border: '1px solid var(--border-color)',
                                                overflow: 'auto',
                                                fontSize: '13px',
                                                color: 'var(--text-secondary)',
                                                margin: 0,
                                                fontFamily: 'JetBrains Mono, monospace'
                                            }}>
                                                {endpoint.requestBody}
                                            </pre>
                                        </div>
                                    )}

                                    {/* Response */}
                                    <div style={{ marginBottom: '16px' }}>
                                        <h4 style={{
                                            fontSize: '16px',
                                            fontWeight: '500',
                                            color: 'var(--text-primary)',
                                            marginBottom: '12px'
                                        }}>
                                            Response ({endpoint.response.status})
                                        </h4>
                                        <pre style={{
                                            background: 'var(--bg-tertiary)',
                                            padding: '16px',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border-color)',
                                            overflow: 'auto',
                                            fontSize: '13px',
                                            color: 'var(--text-secondary)',
                                            margin: 0,
                                            fontFamily: 'JetBrains Mono, monospace'
                                        }}>
                                            {endpoint.response.body}
                                        </pre>
                                    </div>

                                    {/* Error Response */}
                                    {endpoint.errorResponse && (
                                        <div>
                                            <h4 style={{
                                                fontSize: '16px',
                                                fontWeight: '500',
                                                color: 'var(--text-primary)',
                                                marginBottom: '12px'
                                            }}>
                                                Error Response ({endpoint.errorResponse.status})
                                            </h4>
                                            <pre style={{
                                                background: 'var(--bg-tertiary)',
                                                padding: '16px',
                                                borderRadius: '8px',
                                                border: '1px solid var(--border-color)',
                                                overflow: 'auto',
                                                fontSize: '13px',
                                                color: 'var(--text-secondary)',
                                                margin: 0,
                                                fontFamily: 'JetBrains Mono, monospace'
                                            }}>
                                                {endpoint.errorResponse.body}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Rate Limiting Info */}
                <div style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    padding: '24px',
                    marginTop: '32px',
                    border: '1px solid var(--border-color)'
                }}>
                    <h3 style={{
                        fontSize: '18px',
                        fontWeight: '500',
                        marginBottom: '12px',
                        color: 'var(--text-primary)'
                    }}>
                        <span style={{ color: 'var(--accent-secondary)' }}>⚡ </span>
                        Rate Limiting
                    </h3>
                    <p style={{
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6'
                    }}>
                        The API is rate limited to prevent abuse. Current limits are generous for development use. 
                        Contact us if you need higher limits for production applications.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ApiDocs;