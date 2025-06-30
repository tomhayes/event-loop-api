import * as React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
    users: {
        total: number;
        attendees: number;
        organizers: number;
        admins: number;
        recent: number;
    };
    events: {
        total: number;
        upcoming: number;
        past: number;
        current: number;
        by_type: Record<string, number>;
        by_format: Record<string, number>;
    };
    speaker_applications: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        recent: number;
    };
    engagement: {
        saved_events: number;
        active_users: number;
        popular_events: Array<{
            id: number;
            title: string;
            saved_events_count: number;
        }>;
    };
}

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    role: string;
    is_active: boolean;
    created_at: string;
    events_count: number;
    saved_events_count: number;
    speaker_applications_count: number;
}

interface Event {
    id: number;
    title: string;
    location: string;
    region: string;
    format: string;
    type: string;
    start_date: string;
    end_date: string;
    saved_events_count: number;
    user: {
        name: string;
        username: string;
    };
}

interface SpeakerApplication {
    id: number;
    topic: string;
    proficiency_level: string;
    status: string;
    created_at: string;
    user: {
        name: string;
        username: string;
        email: string;
    };
}

interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

const AdminDashboard: React.FC = () => {
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'events' | 'applications'>('overview');
    const [loading, setLoading] = useState(true);
    const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
    const [users, setUsers] = useState<PaginatedResponse<User> | null>(null);
    const [events, setEvents] = useState<PaginatedResponse<Event> | null>(null);
    const [applications, setApplications] = useState<PaginatedResponse<SpeakerApplication> | null>(null);

    // Filters
    const [userFilters, setUserFilters] = useState({ role: 'all', search: '', active: '' });
    const [eventFilters, setEventFilters] = useState({ type: 'all', format: 'all', date_filter: '', search: '' });
    const [appFilters, setAppFilters] = useState({ status: 'all', proficiency: 'all', search: '' });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (!isAdmin) {
            navigate('/');
            return;
        }

        loadDashboardStats();
    }, [user, isAdmin, navigate]);

    const loadDashboardStats = async () => {
        try {
            const response = await fetch('/api/admin/dashboard', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setDashboardStats(data);
            }
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadUsers = async (page = 1) => {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                per_page: '10'
            });

            // Only add non-empty filters
            if (userFilters.role && userFilters.role !== 'all') {
                params.append('role', userFilters.role);
            }
            if (userFilters.search && userFilters.search.trim()) {
                params.append('search', userFilters.search.trim());
            }
            if (userFilters.active && userFilters.active !== '') {
                params.append('active', userFilters.active);
            }

            const token = localStorage.getItem('auth_token');
            console.log('Loading users with params:', params.toString());
            console.log('Auth token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
            console.log('Current user:', user);
            console.log('Is admin:', isAdmin);
            
            const response = await fetch(`/api/admin/users?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            console.log('Users API response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Users data received:', data);
                setUsers(data);
            } else {
                const errorText = await response.text();
                console.error('Users API error:', response.status, errorText);
                
                // If unauthorized, try to refresh or redirect to login
                if (response.status === 401) {
                    console.log('Unauthorized - clearing token and redirecting to login');
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('auth_user');
                    navigate('/login');
                }
            }
        } catch (error) {
            console.error('Error loading users:', error);
        }
    };

    const loadEvents = async (page = 1) => {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                per_page: '10',
                ...eventFilters
            });

            const response = await fetch(`/api/admin/events?${params}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setEvents(data);
            }
        } catch (error) {
            console.error('Error loading events:', error);
        }
    };

    const loadApplications = async (page = 1) => {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                per_page: '10',
                ...appFilters
            });

            const response = await fetch(`/api/admin/speaker-applications?${params}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setApplications(data);
            }
        } catch (error) {
            console.error('Error loading applications:', error);
        }
    };

    const handleTabChange = (tab: typeof activeTab) => {
        setActiveTab(tab);
        if (tab === 'users') loadUsers();
        if (tab === 'events' && !events) loadEvents();
        if (tab === 'applications' && !applications) loadApplications();
    };

    const updateUserStatus = async (userId: number, isActive: boolean) => {
        try {
            const response = await fetch(`/api/admin/users/${userId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ is_active: isActive }),
            });

            if (response.ok) {
                loadUsers(users?.current_page);
            }
        } catch (error) {
            console.error('Error updating user status:', error);
        }
    };

    const updateUserRole = async (userId: number, role: string) => {
        try {
            const response = await fetch(`/api/admin/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ role }),
            });

            if (response.ok) {
                loadUsers(users?.current_page);
            }
        } catch (error) {
            console.error('Error updating user role:', error);
        }
    };

    const deleteEvent = async (eventId: number) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        try {
            const response = await fetch(`/api/admin/events/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                loadEvents(events?.current_page);
            }
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    const handleApplicationAction = async (applicationId: number, action: 'approve' | 'reject') => {
        try {
            const response = await fetch(`/api/speaker-applications/${applicationId}/${action}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                loadApplications(applications?.current_page);
            }
        } catch (error) {
            console.error(`Error ${action}ing application:`, error);
        }
    };

    if (loading) {
        return (
            <section className="events">
                <div className="container">
                    <div style={{ textAlign: 'center', padding: '48px 0' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            border: '2px solid var(--border-color)',
                            borderTop: '2px solid var(--accent-primary)',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto'
                        }} />
                        <p style={{ color: 'var(--text-muted)', marginTop: '16px' }}>
                            Loading admin dashboard...
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    if (!dashboardStats) {
        return (
            <section className="events">
                <div className="container">
                    <div style={{ textAlign: 'center', padding: '48px 0' }}>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Failed to load dashboard data.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="events">
            <div className="container">
                <div style={{ paddingTop: '48px' }}>
                    <div style={{ marginBottom: '32px' }}>
                        <h1 style={{
                            fontSize: '32px',
                            fontWeight: '500',
                            marginBottom: '8px',
                            color: 'var(--text-primary)',
                            lineHeight: '1.2'
                        }}>
                            <span style={{ color: 'var(--accent-secondary)' }}>// </span>
                            Admin Dashboard
                        </h1>
                        <p style={{
                            fontSize: '16px',
                            color: 'var(--text-secondary)',
                            lineHeight: '1.5'
                        }}>
                            Manage users, events, and speaker applications across the platform.
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div style={{
                        borderBottom: '1px solid var(--border-color)',
                        marginBottom: '32px'
                    }}>
                        <div style={{
                            display: 'flex',
                            gap: '32px'
                        }}>
                            {[
                                { key: 'overview', label: 'Overview' },
                                { key: 'users', label: 'Users' },
                                { key: 'events', label: 'Events' },
                                { key: 'applications', label: 'Speaker Applications' }
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => handleTabChange(tab.key as typeof activeTab)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: '16px 0',
                                        fontSize: '16px',
                                        color: activeTab === tab.key ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                        borderBottom: activeTab === tab.key ? '2px solid var(--accent-primary)' : '2px solid transparent',
                                        cursor: 'pointer',
                                        fontFamily: 'inherit',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'overview' && (
                        <div>
                            {/* Stats Cards */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                gap: '24px',
                                marginBottom: '32px'
                            }}>
                                <div style={{
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '12px',
                                    padding: '24px'
                                }}>
                                    <h3 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--accent-primary)' }}>
                                        👤 Users
                                    </h3>
                                    <div style={{ fontSize: '24px', fontWeight: '500', marginBottom: '8px' }}>
                                        {dashboardStats.users.total}
                                    </div>
                                    <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                                        {dashboardStats.users.attendees} attendees • {dashboardStats.users.organizers} organizers
                                    </div>
                                </div>

                                <div style={{
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '12px',
                                    padding: '24px'
                                }}>
                                    <h3 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--accent-secondary)' }}>
                                        📅 Events
                                    </h3>
                                    <div style={{ fontSize: '24px', fontWeight: '500', marginBottom: '8px' }}>
                                        {dashboardStats.events.total}
                                    </div>
                                    <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                                        {dashboardStats.events.upcoming} upcoming • {dashboardStats.events.current} current
                                    </div>
                                </div>

                                <div style={{
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '12px',
                                    padding: '24px'
                                }}>
                                    <h3 style={{ fontSize: '18px', marginBottom: '16px', color: '#22c55e' }}>
                                        🎤 Speaker Applications
                                    </h3>
                                    <div style={{ fontSize: '24px', fontWeight: '500', marginBottom: '8px' }}>
                                        {dashboardStats.speaker_applications.total}
                                    </div>
                                    <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                                        {dashboardStats.speaker_applications.pending} pending review
                                    </div>
                                </div>

                                <div style={{
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '12px',
                                    padding: '24px'
                                }}>
                                    <h3 style={{ fontSize: '18px', marginBottom: '16px', color: '#f59e0b' }}>
                                        💾 Engagement
                                    </h3>
                                    <div style={{ fontSize: '24px', fontWeight: '500', marginBottom: '8px' }}>
                                        {dashboardStats.engagement.saved_events}
                                    </div>
                                    <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                                        saved events by {dashboardStats.engagement.active_users} users
                                    </div>
                                </div>
                            </div>

                            {/* Popular Events */}
                            {dashboardStats.engagement.popular_events.length > 0 && (
                                <div style={{
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '12px',
                                    padding: '24px'
                                }}>
                                    <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>
                                        🔥 Most Popular Events
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {dashboardStats.engagement.popular_events.map((event) => (
                                            <div key={event.id} style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '12px',
                                                background: 'var(--bg-tertiary)',
                                                borderRadius: '8px'
                                            }}>
                                                <span style={{ color: 'var(--text-primary)' }}>
                                                    {event.title}
                                                </span>
                                                <span style={{
                                                    color: 'var(--accent-primary)',
                                                    fontSize: '14px',
                                                    fontWeight: '500'
                                                }}>
                                                    {event.saved_events_count} saves
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div>
                            {/* User Filters */}
                            <div style={{
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '12px',
                                padding: '24px',
                                marginBottom: '24px'
                            }}>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                    gap: '16px'
                                }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                                            Role
                                        </label>
                                        <select
                                            value={userFilters.role}
                                            onChange={(e) => {
                                                setUserFilters({ ...userFilters, role: e.target.value });
                                                setTimeout(() => loadUsers(), 100);
                                            }}
                                            className="form-input"
                                        >
                                            <option value="all">All Roles</option>
                                            <option value="attendee">Attendees</option>
                                            <option value="organizer">Organizers</option>
                                            <option value="admin">Admins</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                                            Status
                                        </label>
                                        <select
                                            value={userFilters.active}
                                            onChange={(e) => {
                                                setUserFilters({ ...userFilters, active: e.target.value });
                                                setTimeout(() => loadUsers(), 100);
                                            }}
                                            className="form-input"
                                        >
                                            <option value="">All Status</option>
                                            <option value="true">Active</option>
                                            <option value="false">Inactive</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                                            Search
                                        </label>
                                        <input
                                            type="text"
                                            value={userFilters.search}
                                            onChange={(e) => {
                                                setUserFilters({ ...userFilters, search: e.target.value });
                                                setTimeout(() => loadUsers(), 500);
                                            }}
                                            placeholder="Name, email, or username"
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Users Table */}
                            {users && (
                                <div style={{
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '12px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 150px',
                                        gap: '16px',
                                        padding: '16px 24px',
                                        background: 'var(--bg-tertiary)',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        color: 'var(--text-secondary)'
                                    }}>
                                        <div>User</div>
                                        <div>Role</div>
                                        <div>Events</div>
                                        <div>Saved</div>
                                        <div>Status</div>
                                        <div>Actions</div>
                                    </div>
                                    {users.data.map((user) => (
                                        <div key={user.id} style={{
                                            display: 'grid',
                                            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 150px',
                                            gap: '16px',
                                            padding: '16px 24px',
                                            borderTop: '1px solid var(--border-color)',
                                            alignItems: 'center'
                                        }}>
                                            <div>
                                                <div style={{ fontWeight: '500' }}>{user.name}</div>
                                                <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                                                    @{user.username} • {user.email}
                                                </div>
                                            </div>
                                            <div>
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => updateUserRole(user.id, e.target.value)}
                                                    style={{
                                                        background: 'var(--bg-primary)',
                                                        border: '1px solid var(--border-color)',
                                                        borderRadius: '4px',
                                                        padding: '4px 8px',
                                                        fontSize: '12px',
                                                        color: 'var(--text-primary)'
                                                    }}
                                                >
                                                    <option value="attendee">Attendee</option>
                                                    <option value="organizer">Organizer</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </div>
                                            <div>{user.events_count}</div>
                                            <div>{user.saved_events_count}</div>
                                            <div>
                                                <button
                                                    onClick={() => updateUserStatus(user.id, !user.is_active)}
                                                    style={{
                                                        background: user.is_active ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                        border: `1px solid ${user.is_active ? '#22c55e' : '#ef4444'}`,
                                                        borderRadius: '4px',
                                                        padding: '4px 8px',
                                                        fontSize: '12px',
                                                        color: user.is_active ? '#22c55e' : '#ef4444',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {user.is_active ? 'Active' : 'Inactive'}
                                                </button>
                                            </div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Users Pagination */}
                            {users && users.last_page > 1 && (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginTop: '24px'
                                }}>
                                    <button
                                        onClick={() => loadUsers(users.current_page - 1)}
                                        disabled={users.current_page === 1}
                                        style={{
                                            background: 'transparent',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '6px',
                                            padding: '8px 12px',
                                            fontSize: '14px',
                                            color: users.current_page === 1 ? 'var(--text-muted)' : 'var(--text-secondary)',
                                            cursor: users.current_page === 1 ? 'not-allowed' : 'pointer',
                                            fontFamily: 'inherit'
                                        }}
                                    >
                                        ← Previous
                                    </button>

                                    {Array.from({ length: Math.min(users.last_page, 7) }, (_, i) => {
                                        let page;
                                        if (users.last_page <= 7) {
                                            page = i + 1;
                                        } else if (users.current_page <= 4) {
                                            page = i + 1;
                                        } else if (users.current_page >= users.last_page - 3) {
                                            page = users.last_page - 6 + i;
                                        } else {
                                            page = users.current_page - 3 + i;
                                        }
                                        
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => loadUsers(page)}
                                                style={{
                                                    background: page === users.current_page ? 'var(--accent-primary)' : 'transparent',
                                                    border: '1px solid var(--border-color)',
                                                    borderColor: page === users.current_page ? 'var(--accent-primary)' : 'var(--border-color)',
                                                    borderRadius: '6px',
                                                    padding: '8px 12px',
                                                    fontSize: '14px',
                                                    color: page === users.current_page ? 'var(--bg-primary)' : 'var(--text-secondary)',
                                                    cursor: 'pointer',
                                                    fontFamily: 'inherit',
                                                    minWidth: '40px'
                                                }}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={() => loadUsers(users.current_page + 1)}
                                        disabled={users.current_page === users.last_page}
                                        style={{
                                            background: 'transparent',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '6px',
                                            padding: '8px 12px',
                                            fontSize: '14px',
                                            color: users.current_page === users.last_page ? 'var(--text-muted)' : 'var(--text-secondary)',
                                            cursor: users.current_page === users.last_page ? 'not-allowed' : 'pointer',
                                            fontFamily: 'inherit'
                                        }}
                                    >
                                        Next →
                                    </button>
                                </div>
                            )}

                            {/* Users Total Count */}
                            {users && (
                                <div style={{
                                    textAlign: 'center',
                                    marginTop: '16px',
                                    fontSize: '14px',
                                    color: 'var(--text-muted)'
                                }}>
                                    Showing {users.from}-{users.to} of {users.total} users
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'events' && (
                        <div>
                            {/* Event Filters */}
                            <div style={{
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '12px',
                                padding: '24px',
                                marginBottom: '24px'
                            }}>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                    gap: '16px'
                                }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                                            Type
                                        </label>
                                        <select
                                            value={eventFilters.type}
                                            onChange={(e) => {
                                                setEventFilters({ ...eventFilters, type: e.target.value });
                                                setTimeout(() => loadEvents(), 100);
                                            }}
                                            className="form-input"
                                        >
                                            <option value="all">All Types</option>
                                            <option value="Conference">Conferences</option>
                                            <option value="Meetup">Meetups</option>
                                            <option value="Workshop">Workshops</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                                            Format
                                        </label>
                                        <select
                                            value={eventFilters.format}
                                            onChange={(e) => {
                                                setEventFilters({ ...eventFilters, format: e.target.value });
                                                setTimeout(() => loadEvents(), 100);
                                            }}
                                            className="form-input"
                                        >
                                            <option value="all">All Formats</option>
                                            <option value="online">Online</option>
                                            <option value="in-person">In-Person</option>
                                            <option value="hybrid">Hybrid</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                                            Date Range
                                        </label>
                                        <select
                                            value={eventFilters.date_filter}
                                            onChange={(e) => {
                                                setEventFilters({ ...eventFilters, date_filter: e.target.value });
                                                setTimeout(() => loadEvents(), 100);
                                            }}
                                            className="form-input"
                                        >
                                            <option value="">All Dates</option>
                                            <option value="upcoming">Upcoming</option>
                                            <option value="current">Current</option>
                                            <option value="past">Past</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                                            Search
                                        </label>
                                        <input
                                            type="text"
                                            value={eventFilters.search}
                                            onChange={(e) => {
                                                setEventFilters({ ...eventFilters, search: e.target.value });
                                                setTimeout(() => loadEvents(), 500);
                                            }}
                                            placeholder="Title, location, or description"
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Events Table */}
                            {events && (
                                <div style={{
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '12px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 100px',
                                        gap: '16px',
                                        padding: '16px 24px',
                                        background: 'var(--bg-tertiary)',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        color: 'var(--text-secondary)'
                                    }}>
                                        <div>Event</div>
                                        <div>Type</div>
                                        <div>Format</div>
                                        <div>Organizer</div>
                                        <div>Saves</div>
                                        <div>Actions</div>
                                    </div>
                                    {events.data.map((event) => (
                                        <div key={event.id} style={{
                                            display: 'grid',
                                            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 100px',
                                            gap: '16px',
                                            padding: '16px 24px',
                                            borderTop: '1px solid var(--border-color)',
                                            alignItems: 'center'
                                        }}>
                                            <div>
                                                <div style={{ fontWeight: '500' }}>{event.title}</div>
                                                <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                                                    {event.location} • {new Date(event.start_date).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div>{event.type}</div>
                                            <div style={{
                                                textTransform: 'capitalize',
                                                fontSize: '12px',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                background: event.format === 'online' ? 'rgba(34, 197, 94, 0.1)' :
                                                           event.format === 'hybrid' ? 'rgba(234, 179, 8, 0.1)' :
                                                           'rgba(59, 130, 246, 0.1)',
                                                color: event.format === 'online' ? '#22c55e' :
                                                       event.format === 'hybrid' ? '#eab308' :
                                                       '#3b82f6'
                                            }}>
                                                {event.format === 'in-person' ? 'In-Person' : event.format}
                                            </div>
                                            <div style={{ fontSize: '14px' }}>
                                                {event.user.name}
                                            </div>
                                            <div>{event.saved_events_count}</div>
                                            <div>
                                                <button
                                                    onClick={() => deleteEvent(event.id)}
                                                    style={{
                                                        background: 'rgba(239, 68, 68, 0.1)',
                                                        border: '1px solid #ef4444',
                                                        borderRadius: '4px',
                                                        padding: '4px 8px',
                                                        fontSize: '12px',
                                                        color: '#ef4444',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'applications' && (
                        <div>
                            {/* Application Filters */}
                            <div style={{
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '12px',
                                padding: '24px',
                                marginBottom: '24px'
                            }}>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                    gap: '16px'
                                }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                                            Status
                                        </label>
                                        <select
                                            value={appFilters.status}
                                            onChange={(e) => {
                                                setAppFilters({ ...appFilters, status: e.target.value });
                                                setTimeout(() => loadApplications(), 100);
                                            }}
                                            className="form-input"
                                        >
                                            <option value="all">All Status</option>
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approved</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                                            Proficiency
                                        </label>
                                        <select
                                            value={appFilters.proficiency}
                                            onChange={(e) => {
                                                setAppFilters({ ...appFilters, proficiency: e.target.value });
                                                setTimeout(() => loadApplications(), 100);
                                            }}
                                            className="form-input"
                                        >
                                            <option value="all">All Levels</option>
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                            <option value="expert">Expert</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                                            Search
                                        </label>
                                        <input
                                            type="text"
                                            value={appFilters.search}
                                            onChange={(e) => {
                                                setAppFilters({ ...appFilters, search: e.target.value });
                                                setTimeout(() => loadApplications(), 500);
                                            }}
                                            placeholder="Topic or speaker name"
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Applications Table */}
                            {applications && (
                                <div style={{
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '12px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 150px',
                                        gap: '16px',
                                        padding: '16px 24px',
                                        background: 'var(--bg-tertiary)',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        color: 'var(--text-secondary)'
                                    }}>
                                        <div>Speaker & Topic</div>
                                        <div>Proficiency</div>
                                        <div>Status</div>
                                        <div>Applied</div>
                                        <div>Contact</div>
                                        <div>Actions</div>
                                    </div>
                                    {applications.data.map((application) => (
                                        <div key={application.id} style={{
                                            display: 'grid',
                                            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 150px',
                                            gap: '16px',
                                            padding: '16px 24px',
                                            borderTop: '1px solid var(--border-color)',
                                            alignItems: 'center'
                                        }}>
                                            <div>
                                                <div style={{ fontWeight: '500' }}>{application.user.name}</div>
                                                <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                                                    {application.topic}
                                                </div>
                                            </div>
                                            <div style={{ textTransform: 'capitalize' }}>
                                                {application.proficiency_level}
                                            </div>
                                            <div>
                                                <span style={{
                                                    fontSize: '12px',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    background: application.status === 'approved' ? 'rgba(34, 197, 94, 0.1)' :
                                                               application.status === 'rejected' ? 'rgba(239, 68, 68, 0.1)' :
                                                               'rgba(234, 179, 8, 0.1)',
                                                    color: application.status === 'approved' ? '#22c55e' :
                                                           application.status === 'rejected' ? '#ef4444' :
                                                           '#eab308'
                                                }}>
                                                    {application.status}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: '14px' }}>
                                                {new Date(application.created_at).toLocaleDateString()}
                                            </div>
                                            <div style={{ fontSize: '12px' }}>
                                                {application.user.email}
                                            </div>
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                {application.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApplicationAction(application.id, 'approve')}
                                                            style={{
                                                                background: 'rgba(34, 197, 94, 0.1)',
                                                                border: '1px solid #22c55e',
                                                                borderRadius: '4px',
                                                                padding: '4px 6px',
                                                                fontSize: '11px',
                                                                color: '#22c55e',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            ✓
                                                        </button>
                                                        <button
                                                            onClick={() => handleApplicationAction(application.id, 'reject')}
                                                            style={{
                                                                background: 'rgba(239, 68, 68, 0.1)',
                                                                border: '1px solid #ef4444',
                                                                borderRadius: '4px',
                                                                padding: '4px 6px',
                                                                fontSize: '11px',
                                                                color: '#ef4444',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            ✗
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AdminDashboard;