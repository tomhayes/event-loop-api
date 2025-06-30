import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Event } from '../types/Event';
import { api } from '../services/api';
import EventCard from './EventCard';

const EventListing: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const eventsGridRef = useRef<HTMLDivElement>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [previousEvents, setPreviousEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [eventsLoading, setEventsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [activeFilter, setActiveFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [allTags, setAllTags] = useState<Array<{name: string; count: number; display: string}>>([]);
    const [loadingTags, setLoadingTags] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 12,
        total: 0,
        from: 0,
        to: 0
    });

    const searchQuery = searchParams.get('search') || '';
    const tagFilter = searchParams.get('tag') || '';
    const tagsFilter = searchParams.get('tags') || '';
    const selectedTags = tagsFilter ? tagsFilter.split(',').map(tag => tag.trim()) : [];
    const typeFilter = searchParams.get('type') || '';
    const formatFilter = searchParams.get('format') || '';
    const regionFilter = searchParams.get('region') || '';
    const startDateFilter = searchParams.get('start_date') || '';
    const endDateFilter = searchParams.get('end_date') || '';
    const upcomingOnlyFilter = searchParams.get('upcoming_only') !== 'false'; // Default to true unless explicitly set to false
    const sortByFilter = searchParams.get('sort_by') || 'soonest';

    // Local filter state - initialized after URL parameters
    const [localFilters, setLocalFilters] = useState({
        search: searchQuery,
        tags: selectedTags,
        type: typeFilter,
        format: formatFilter,
        region: regionFilter,
        start_date: startDateFilter,
        end_date: endDateFilter,
        upcoming_only: upcomingOnlyFilter,
        sort_by: sortByFilter
    });

    const fetchEvents = async (page: number = 1, customFilters?: any, isInitialLoad = false) => {
        try {
            if (isInitialLoad) {
                setLoading(true);
            } else {
                setEventsLoading(true);
                // Store previous events to keep layout stable
                if (events.length > 0) {
                    setPreviousEvents(events);
                }
            }
            
            const filtersToUse = customFilters || localFilters;
            const filters: any = {
                per_page: 12,
                page
            };
            
            if (filtersToUse.search) filters.search = filtersToUse.search;
            if (tagFilter) filters.tag = tagFilter; // Keep backward compatibility
            if (filtersToUse.tags && filtersToUse.tags.length > 0) filters.tags = filtersToUse.tags;
            if (filtersToUse.type && filtersToUse.type !== 'All') filters.type = filtersToUse.type;
            if (filtersToUse.format && filtersToUse.format !== 'All') filters.format = filtersToUse.format;
            if (filtersToUse.region) filters.region = filtersToUse.region;
            if (filtersToUse.start_date) filters.start_date = filtersToUse.start_date;
            if (filtersToUse.end_date) filters.end_date = filtersToUse.end_date;
            if (filtersToUse.upcoming_only) filters.upcoming_only = true;
            if (filtersToUse.sort_by) filters.sort_by = filtersToUse.sort_by;
            
            const response = await api.getEvents(filters);
            
            if (!isInitialLoad) {
                // Add a delay to allow the fade-out to complete before updating content
                setTimeout(() => {
                    setEvents(response.data);
                    setPagination(response);
                    setCurrentPage(page);
                    setEventsLoading(false);
                }, 400); // Half of the transition duration
            } else {
                setEvents(response.data);
                setPagination(response);
                setCurrentPage(page);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch events');
            if (isInitialLoad) {
                setLoading(false);
            } else {
                setEventsLoading(false);
            }
        } finally {
            if (isInitialLoad) {
                setLoading(false);
            }
        }
    };

    // Initial load - only run once when component mounts
    useEffect(() => {
        // Use URL parameters for initial load
        const initialFilters = {
            search: searchQuery,
            tags: selectedTags,
            type: typeFilter,
            format: formatFilter,
            region: regionFilter,
            start_date: startDateFilter,
            end_date: endDateFilter,
            upcoming_only: upcomingOnlyFilter,
            sort_by: sortByFilter
        };
        setLocalFilters(initialFilters);
        fetchEvents(1, initialFilters, true); // true = isInitialLoad
        setCurrentPage(1);
    }, []); // Empty dependency array - only run on mount

    const fetchAllTags = async (filters?: any) => {
        try {
            setLoadingTags(true);
            // Pass current filters but exclude tags to avoid circular dependency
            const filtersForTags = filters ? {
                search: filters.search,
                type: filters.type && filters.type !== 'All' ? filters.type : undefined,
                format: filters.format && filters.format !== 'All' ? filters.format : undefined,
                region: filters.region,
                start_date: filters.start_date,
                end_date: filters.end_date,
                upcoming_only: filters.upcoming_only
            } : {};
            
            const tags = await api.getAllTags(filtersForTags);
            setAllTags(tags);
        } catch (err) {
            console.error('Failed to fetch tags:', err);
        } finally {
            setLoadingTags(false);
        }
    };

    useEffect(() => {
        // Use the same initial filters as events for consistency
        const initialFilters = {
            search: searchQuery,
            tags: selectedTags,
            type: typeFilter,
            format: formatFilter,
            region: regionFilter,
            start_date: startDateFilter,
            end_date: endDateFilter,
            upcoming_only: upcomingOnlyFilter,
            sort_by: sortByFilter
        };
        fetchAllTags(initialFilters);
    }, []);

    const getEventType = (title: string) => {
        const titleLower = title.toLowerCase();
        if (titleLower.includes('conference') || titleLower.includes('conf')) return 'Conference';
        if (titleLower.includes('meetup') || titleLower.includes('study group')) return 'Meetup';
        if (titleLower.includes('workshop') || titleLower.includes('fundamental')) return 'Workshop';
        if (titleLower.includes('hackathon')) return 'Hackathon';
        return 'Conference';
    };

    const handleUpdateEvent = async (id: number, eventData: Partial<Omit<Event, 'id' | 'created_at' | 'updated_at'>>) => {
        try {
            const updatedEvent = await api.updateEvent(id, eventData);
            setEvents(events.map(event => event.id === id ? updatedEvent : event));
            setEditingEvent(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update event');
        }
    };

    const handleDeleteEvent = async (id: number) => {
        try {
            await api.deleteEvent(id);
            fetchEvents(currentPage); // Refresh current page
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete event');
        }
    };

    const handlePageChange = (page: number) => {
        fetchEvents(page, localFilters); // Use current local filters for pagination
        
        // Scroll to top of events grid smoothly with offset for sticky header
        if (eventsGridRef.current) {
            const rect = eventsGridRef.current.getBoundingClientRect();
            const headerOffset = 80; // Adjust this value based on your header height
            const offsetPosition = window.pageYOffset + rect.top - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const getPageTitle = () => {
        if (searchQuery) return `Search results for "${searchQuery}"`;
        if (tagFilter) return `Events tagged with "${tagFilter}"`;
        if (typeFilter && typeFilter !== 'All') return `${typeFilter} Events`;
        return 'All Events';
    };

    const getPageSubtitle = () => {
        const count = pagination.total;
        if (count === 0) return 'No events found';
        if (count === 1) return '1 event found';
        return `${count} events found`;
    };

    const filterOptions = ['All', 'Conference', 'Meetup', 'Workshop', 'Hackathon'];

    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
        const newSearchParams = new URLSearchParams(searchParams);
        if (filter === 'All') {
            newSearchParams.delete('type');
        } else {
            newSearchParams.set('type', filter);
        }
        navigate(`/events?${newSearchParams.toString()}`);
    };

    const handleTagToggle = (tag: string) => {
        const currentTags = [...localFilters.tags];
        let updatedTags;
        
        if (currentTags.includes(tag)) {
            // Remove tag
            updatedTags = currentTags.filter(t => t !== tag);
        } else {
            // Add tag
            updatedTags = [...currentTags, tag];
        }
        
        const newFilters = { ...localFilters, tags: updatedTags };
        setLocalFilters(newFilters);
        fetchEvents(1, newFilters);
        
        // Update URL without triggering React Router
        const currentUrl = new URL(window.location.href);
        const params = currentUrl.searchParams;
        
        if (updatedTags.length === 0) {
            params.delete('tags');
        } else {
            params.set('tags', updatedTags.join(','));
        }
        
        const newUrl = `${currentUrl.pathname}${params.toString() ? '?' + params.toString() : ''}`;
        window.history.replaceState(null, '', newUrl);
    };

    const updateFilter = (key: string, value: any) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        fetchEvents(1, newFilters);
        
        // Refetch tags when filters change (except when tags themselves change)
        if (key !== 'tags') {
            fetchAllTags(newFilters);
        }
        
        // Update URL without triggering React Router
        const currentUrl = new URL(window.location.href);
        const params = currentUrl.searchParams;
        
        if (value && value !== 'All' && value !== '' && !(Array.isArray(value) && value.length === 0)) {
            if (Array.isArray(value)) {
                params.set(key, value.join(','));
            } else {
                params.set(key, value.toString());
            }
        } else {
            params.delete(key);
        }
        
        // Update URL silently without navigation
        const newUrl = `${currentUrl.pathname}${params.toString() ? '?' + params.toString() : ''}`;
        window.history.replaceState(null, '', newUrl);
    };

    if (loading) {
        return (
            <section className="events">
                <div className="container">
                    <div className="flex justify-center items-center py-12">
                        <div 
                            className="w-8 h-8 border-2 border-solid rounded-full animate-spin"
                            style={{ 
                                borderColor: 'var(--accent-primary) transparent var(--accent-primary) transparent'
                            }}
                        ></div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="events">
                <div className="container">
                    <div 
                        className="border rounded-lg p-4"
                        style={{ 
                            background: 'rgba(239, 68, 68, 0.1)',
                            borderColor: '#ef4444'
                        }}
                    >
                        <p style={{ color: '#ef4444' }}>{error}</p>
                        <button 
                            onClick={fetchEvents}
                            className="mt-2 underline hover:no-underline"
                            style={{ color: '#dc2626' }}
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="events">
            <div className="container">
                {/* Breadcrumb Navigation */}
                <div style={{ 
                    marginBottom: '32px',
                    fontSize: '14px',
                    color: 'var(--text-muted)'
                }}>
                    <button 
                        onClick={() => navigate('/')}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--accent-secondary)',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            fontSize: '14px',
                            fontFamily: 'inherit'
                        }}
                    >
                        ← Back to Home
                    </button>
                </div>

                {/* Page Header */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start', 
                    marginBottom: '40px',
                    flexWrap: 'wrap',
                    gap: '16px'
                }}>
                    <div>
                        <h1 style={{
                            fontSize: 'clamp(28px, 4vw, 36px)',
                            fontWeight: '500',
                            marginBottom: '8px',
                            color: 'var(--text-primary)',
                            lineHeight: '1.2'
                        }}>
                            {getPageTitle()}
                        </h1>
                        <p style={{
                            fontSize: '16px',
                            color: 'var(--text-secondary)'
                        }}>
                            {getPageSubtitle()}
                        </p>
                    </div>
                </div>

                {/* Search Bar */}
                <div style={{ marginBottom: '32px' }}>
                    <div className="search-bar" style={{ maxWidth: '500px' }}>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search events..."
                            defaultValue={searchQuery}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const value = (e.target as HTMLInputElement).value;
                                    updateFilter('search', value);
                                }
                            }}
                        />
                        <button 
                            className="search-btn"
                            onClick={() => {
                                const input = document.querySelector('.search-input') as HTMLInputElement;
                                const value = input.value;
                                updateFilter('search', value);
                            }}
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Advanced Filters */}
                <div style={{
                    marginBottom: '32px',
                    padding: '24px',
                    background: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)'
                }}>
                    <h3 style={{
                        fontSize: '16px',
                        fontWeight: '500',
                        marginBottom: '16px',
                        color: 'var(--text-primary)'
                    }}>
                        Advanced Filters
                    </h3>
                    
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px'
                    }}>
                        {/* Event Type Filter */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '500',
                                marginBottom: '8px',
                                color: 'var(--text-secondary)'
                            }}>
                                Event Type
                            </label>
                            <select
                                value={localFilters.type || 'All'}
                                onChange={(e) => updateFilter('type', e.target.value === 'All' ? '' : e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid var(--border-color)',
                                    background: 'var(--bg-primary)',
                                    color: 'var(--text-primary)',
                                    fontSize: '14px'
                                }}
                            >
                                <option value="All">All Types</option>
                                <option value="Conference">Conferences</option>
                                <option value="Meetup">Meetups</option>
                                <option value="Workshop">Workshops</option>
                                <option value="Hackathon">Hackathons</option>
                            </select>
                        </div>

                        {/* Format Filter */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '500',
                                marginBottom: '8px',
                                color: 'var(--text-secondary)'
                            }}>
                                Format
                            </label>
                            <select
                                value={localFilters.format || 'All'}
                                onChange={(e) => updateFilter('format', e.target.value === 'All' ? '' : e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid var(--border-color)',
                                    background: 'var(--bg-primary)',
                                    color: 'var(--text-primary)',
                                    fontSize: '14px'
                                }}
                            >
                                <option value="All">All Formats</option>
                                <option value="online">Online</option>
                                <option value="in-person">In-Person</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                        </div>

                        {/* Region Filter */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '500',
                                marginBottom: '8px',
                                color: 'var(--text-secondary)'
                            }}>
                                Region
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. London, UK"
                                value={localFilters.region}
                                onChange={(e) => updateFilter('region', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid var(--border-color)',
                                    background: 'var(--bg-primary)',
                                    color: 'var(--text-primary)',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        {/* Date Range */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '500',
                                marginBottom: '8px',
                                color: 'var(--text-secondary)'
                            }}>
                                Start Date From
                            </label>
                            <input
                                type="date"
                                value={localFilters.start_date}
                                onChange={(e) => updateFilter('start_date', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid var(--border-color)',
                                    background: 'var(--bg-primary)',
                                    color: 'var(--text-primary)',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        {/* End Date */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '500',
                                marginBottom: '8px',
                                color: 'var(--text-secondary)'
                            }}>
                                End Date Until
                            </label>
                            <input
                                type="date"
                                value={localFilters.end_date}
                                onChange={(e) => updateFilter('end_date', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid var(--border-color)',
                                    background: 'var(--bg-primary)',
                                    color: 'var(--text-primary)',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        {/* Tags Selection */}
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '500',
                                marginBottom: '12px',
                                color: 'var(--text-secondary)'
                            }}>
                                Tags ({localFilters.tags.length} selected)
                            </label>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '8px',
                                maxHeight: '120px',
                                overflowY: 'auto',
                                padding: '8px',
                                border: '1px solid var(--border-color)',
                                borderRadius: '6px',
                                background: 'var(--bg-primary)'
                            }}>
                                {allTags.map(tagObj => (
                                    <button
                                        key={tagObj.name}
                                        onClick={() => handleTagToggle(tagObj.name)}
                                        style={{
                                            fontSize: '11px',
                                            padding: '4px 12px',
                                            borderRadius: '12px',
                                            background: localFilters.tags.includes(tagObj.name) 
                                                ? 'rgba(203, 166, 247, 0.3)' 
                                                : 'rgba(203, 166, 247, 0.1)',
                                            color: localFilters.tags.includes(tagObj.name)
                                                ? 'var(--accent-primary)'
                                                : 'var(--text-muted)',
                                            border: localFilters.tags.includes(tagObj.name)
                                                ? '1px solid var(--accent-primary)'
                                                : '1px solid rgba(203, 166, 247, 0.2)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            fontWeight: localFilters.tags.includes(tagObj.name) ? '500' : '400'
                                        }}
                                        onMouseOver={(e) => {
                                            if (!localFilters.tags.includes(tagObj.name)) {
                                                e.currentTarget.style.background = 'rgba(203, 166, 247, 0.2)';
                                                e.currentTarget.style.color = 'var(--accent-primary)';
                                            }
                                        }}
                                        onMouseOut={(e) => {
                                            if (!localFilters.tags.includes(tagObj.name)) {
                                                e.currentTarget.style.background = 'rgba(203, 166, 247, 0.1)';
                                                e.currentTarget.style.color = 'var(--text-muted)';
                                            }
                                        }}
                                    >
                                        {tagObj.display}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sort By */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '500',
                                marginBottom: '8px',
                                color: 'var(--text-secondary)'
                            }}>
                                Sort By
                            </label>
                            <select
                                value={localFilters.sort_by}
                                onChange={(e) => updateFilter('sort_by', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid var(--border-color)',
                                    background: 'var(--bg-primary)',
                                    color: 'var(--text-primary)',
                                    fontSize: '14px'
                                }}
                            >
                                <option value="soonest">Soonest</option>
                                <option value="relevance">Relevance</option>
                                <option value="newest">Newest Listed</option>
                                <option value="oldest">Oldest Listed</option>
                            </select>
                        </div>

                        {/* Upcoming Only Toggle */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '500',
                                marginBottom: '8px',
                                color: 'var(--text-secondary)'
                            }}>
                                Show Only
                            </label>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                color: 'var(--text-primary)'
                            }}>
                                <input
                                    type="checkbox"
                                    checked={!localFilters.upcoming_only}
                                    onChange={(e) => updateFilter('upcoming_only', !e.target.checked)}
                                    style={{
                                        accentColor: 'var(--accent-primary)'
                                    }}
                                />
                                Include past events
                            </label>
                        </div>
                    </div>

                    {/* Clear Filters Button */}
                    {(localFilters.search || tagFilter || localFilters.tags.length > 0 || localFilters.type || localFilters.format || localFilters.region || localFilters.start_date || localFilters.end_date || !localFilters.upcoming_only || localFilters.sort_by !== 'soonest') && (
                        <div style={{ marginTop: '16px' }}>
                            <button
                                onClick={() => {
                                    const clearedFilters = {
                                        search: '',
                                        tags: [],
                                        type: '',
                                        format: '',
                                        region: '',
                                        start_date: '',
                                        end_date: '',
                                        upcoming_only: true,
                                        sort_by: 'soonest'
                                    };
                                    setLocalFilters(clearedFilters);
                                    fetchEvents(1, clearedFilters);
                                    fetchAllTags(clearedFilters);
                                    window.history.replaceState(null, '', '/events');
                                }}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid var(--accent-secondary)',
                                    borderRadius: '6px',
                                    color: 'var(--accent-secondary)',
                                    padding: '8px 16px',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
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
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Active Filters Display */}
                {(localFilters.search || tagFilter || localFilters.tags.length > 0 || localFilters.type || localFilters.format || localFilters.region || localFilters.start_date || localFilters.end_date || !localFilters.upcoming_only || localFilters.sort_by !== 'soonest') && (
                    <div style={{ 
                        marginBottom: '32px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                        alignItems: 'center'
                    }}>
                        <span style={{ 
                            fontSize: '14px', 
                            color: 'var(--text-muted)',
                            marginRight: '8px'
                        }}>
                            Active filters:
                        </span>
                        
                        {searchQuery && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '4px 12px',
                                background: 'rgba(203, 166, 247, 0.2)',
                                color: 'var(--accent-primary)',
                                border: '1px solid var(--accent-primary)',
                                borderRadius: '16px',
                                fontSize: '12px'
                            }}>
                                Search: "{searchQuery}"
                                <button
                                    onClick={() => {
                                        const newSearchParams = new URLSearchParams(searchParams);
                                        newSearchParams.delete('search');
                                        navigate(`/events?${newSearchParams.toString()}`);
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--accent-primary)',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        lineHeight: '1'
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        {tagFilter && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '4px 12px',
                                background: 'rgba(137, 180, 250, 0.2)',
                                color: 'var(--accent-secondary)',
                                border: '1px solid var(--accent-secondary)',
                                borderRadius: '16px',
                                fontSize: '12px'
                            }}>
                                Tag: {tagFilter}
                                <button
                                    onClick={() => {
                                        const newSearchParams = new URLSearchParams(searchParams);
                                        newSearchParams.delete('tag');
                                        navigate(`/events?${newSearchParams.toString()}`);
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--accent-secondary)',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        lineHeight: '1'
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        {localFilters.tags.map((tag) => (
                            <div key={tag} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '4px 12px',
                                background: 'rgba(203, 166, 247, 0.2)',
                                color: 'var(--accent-primary)',
                                border: '1px solid var(--accent-primary)',
                                borderRadius: '16px',
                                fontSize: '12px'
                            }}>
                                Tag: {tag}
                                <button
                                    onClick={() => handleTagToggle(tag)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--accent-primary)',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        lineHeight: '1'
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        ))}

                        {typeFilter && typeFilter !== 'All' && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '4px 12px',
                                background: 'rgba(137, 180, 250, 0.2)',
                                color: 'var(--accent-secondary)',
                                border: '1px solid var(--accent-secondary)',
                                borderRadius: '16px',
                                fontSize: '12px'
                            }}>
                                Type: {typeFilter}
                                <button
                                    onClick={() => {
                                        const newSearchParams = new URLSearchParams(searchParams);
                                        newSearchParams.delete('type');
                                        navigate(`/events?${newSearchParams.toString()}`);
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--accent-secondary)',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        lineHeight: '1'
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        {formatFilter && formatFilter !== 'All' && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '4px 12px',
                                background: 'rgba(34, 197, 94, 0.2)',
                                color: '#22c55e',
                                border: '1px solid #22c55e',
                                borderRadius: '16px',
                                fontSize: '12px'
                            }}>
                                Format: {formatFilter === 'in-person' ? 'In-Person' : formatFilter}
                                <button
                                    onClick={() => {
                                        const newSearchParams = new URLSearchParams(searchParams);
                                        newSearchParams.delete('format');
                                        navigate(`/events?${newSearchParams.toString()}`);
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#22c55e',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        lineHeight: '1'
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        {regionFilter && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '4px 12px',
                                background: 'rgba(234, 179, 8, 0.2)',
                                color: '#eab308',
                                border: '1px solid #eab308',
                                borderRadius: '16px',
                                fontSize: '12px'
                            }}>
                                Region: {regionFilter}
                                <button
                                    onClick={() => {
                                        const newSearchParams = new URLSearchParams(searchParams);
                                        newSearchParams.delete('region');
                                        navigate(`/events?${newSearchParams.toString()}`);
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#eab308',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        lineHeight: '1'
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        {startDateFilter && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '4px 12px',
                                background: 'rgba(168, 85, 247, 0.2)',
                                color: '#a855f7',
                                border: '1px solid #a855f7',
                                borderRadius: '16px',
                                fontSize: '12px'
                            }}>
                                From: {startDateFilter}
                                <button
                                    onClick={() => {
                                        const newSearchParams = new URLSearchParams(searchParams);
                                        newSearchParams.delete('start_date');
                                        navigate(`/events?${newSearchParams.toString()}`);
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#a855f7',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        lineHeight: '1'
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        {endDateFilter && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '4px 12px',
                                background: 'rgba(168, 85, 247, 0.2)',
                                color: '#a855f7',
                                border: '1px solid #a855f7',
                                borderRadius: '16px',
                                fontSize: '12px'
                            }}>
                                Until: {endDateFilter}
                                <button
                                    onClick={() => {
                                        const newSearchParams = new URLSearchParams(searchParams);
                                        newSearchParams.delete('end_date');
                                        navigate(`/events?${newSearchParams.toString()}`);
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#a855f7',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        lineHeight: '1'
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        {!upcomingOnlyFilter && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '4px 12px',
                                background: 'rgba(239, 68, 68, 0.2)',
                                color: '#ef4444',
                                border: '1px solid #ef4444',
                                borderRadius: '16px',
                                fontSize: '12px'
                            }}>
                                Including Past Events
                                <button
                                    onClick={() => {
                                        const newSearchParams = new URLSearchParams(searchParams);
                                        newSearchParams.delete('upcoming_only');
                                        navigate(`/events?${newSearchParams.toString()}`);
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#ef4444',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        lineHeight: '1'
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        {localFilters.sort_by !== 'soonest' && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '4px 12px',
                                background: 'rgba(99, 102, 241, 0.2)',
                                color: '#6366f1',
                                border: '1px solid #6366f1',
                                borderRadius: '16px',
                                fontSize: '12px'
                            }}>
                                Sort: {localFilters.sort_by === 'relevance' ? 'Relevance' : 
                                       localFilters.sort_by === 'newest' ? 'Newest Listed' : 
                                       localFilters.sort_by === 'oldest' ? 'Oldest Listed' : 
                                       'Soonest'}
                                <button
                                    onClick={() => updateFilter('sort_by', 'soonest')}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#6366f1',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        lineHeight: '1'
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Event Type Filters */}
                <div className="event-filters">
                    {filterOptions.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => handleFilterChange(filter)}
                            className={`filter-btn ${(typeFilter || 'All') === filter ? 'active' : ''}`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Events Grid */}
                {events.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 0' }}>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
                            No events found matching your criteria.
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="nav-cta"
                        >
                            Browse All Events
                        </button>
                    </div>
                ) : (
                    <>
                        <div style={{ position: 'relative' }}>
                            {/* Loading overlay for filter changes */}
                            {eventsLoading && (
                                <div 
                                    className="w-8 h-8 border-2 border-solid rounded-full animate-spin"
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        zIndex: 10,
                                        borderColor: 'var(--accent-primary) transparent var(--accent-primary) transparent'
                                    }}
                                ></div>
                            )}

                            {/* Single grid container - shows either current events or previous events while loading */}
                            <div ref={eventsGridRef} className="events-grid" style={{ 
                                opacity: eventsLoading ? 0.3 : 1,
                                transition: 'opacity 0.8s ease',
                                pointerEvents: eventsLoading ? 'none' : 'auto'
                            }}>
                                {events.map(event => (
                                    <EventCard
                                        key={event.id}
                                        event={event}
                                        onEdit={setEditingEvent}
                                        onDelete={handleDeleteEvent}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Pagination Controls */}
                        {pagination.last_page > 1 && (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '8px',
                                marginTop: '48px',
                                paddingTop: '32px',
                                borderTop: '1px solid var(--border-color)'
                            }}>
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    style={{
                                        background: 'transparent',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '6px',
                                        padding: '10px 16px',
                                        fontSize: '14px',
                                        color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-secondary)',
                                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                        fontFamily: 'inherit',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseOver={(e) => {
                                        if (currentPage !== 1) {
                                            e.currentTarget.style.borderColor = 'var(--accent-primary)';
                                            e.currentTarget.style.color = 'var(--accent-primary)';
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        if (currentPage !== 1) {
                                            e.currentTarget.style.borderColor = 'var(--border-color)';
                                            e.currentTarget.style.color = 'var(--text-secondary)';
                                        }
                                    }}
                                >
                                    ← Previous
                                </button>

                                <div style={{ display: 'flex', gap: '4px' }}>
                                    {Array.from({ length: Math.min(pagination.last_page, 7) }, (_, i) => {
                                        let page;
                                        if (pagination.last_page <= 7) {
                                            page = i + 1;
                                        } else if (currentPage <= 4) {
                                            page = i + 1;
                                        } else if (currentPage >= pagination.last_page - 3) {
                                            page = pagination.last_page - 6 + i;
                                        } else {
                                            page = currentPage - 3 + i;
                                        }
                                        
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                style={{
                                                    background: page === currentPage ? 'var(--accent-primary)' : 'transparent',
                                                    border: '1px solid var(--border-color)',
                                                    borderColor: page === currentPage ? 'var(--accent-primary)' : 'var(--border-color)',
                                                    borderRadius: '6px',
                                                    padding: '10px 14px',
                                                    fontSize: '14px',
                                                    color: page === currentPage ? 'var(--bg-primary)' : 'var(--text-secondary)',
                                                    cursor: 'pointer',
                                                    fontFamily: 'inherit',
                                                    minWidth: '44px',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseOver={(e) => {
                                                    if (page !== currentPage) {
                                                        e.currentTarget.style.borderColor = 'var(--accent-primary)';
                                                        e.currentTarget.style.color = 'var(--accent-primary)';
                                                    }
                                                }}
                                                onMouseOut={(e) => {
                                                    if (page !== currentPage) {
                                                        e.currentTarget.style.borderColor = 'var(--border-color)';
                                                        e.currentTarget.style.color = 'var(--text-secondary)';
                                                    }
                                                }}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === pagination.last_page}
                                    style={{
                                        background: 'transparent',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '6px',
                                        padding: '10px 16px',
                                        fontSize: '14px',
                                        color: currentPage === pagination.last_page ? 'var(--text-muted)' : 'var(--text-secondary)',
                                        cursor: currentPage === pagination.last_page ? 'not-allowed' : 'pointer',
                                        fontFamily: 'inherit',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseOver={(e) => {
                                        if (currentPage !== pagination.last_page) {
                                            e.currentTarget.style.borderColor = 'var(--accent-primary)';
                                            e.currentTarget.style.color = 'var(--accent-primary)';
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        if (currentPage !== pagination.last_page) {
                                            e.currentTarget.style.borderColor = 'var(--border-color)';
                                            e.currentTarget.style.color = 'var(--text-secondary)';
                                        }
                                    }}
                                >
                                    Next →
                                </button>
                            </div>
                        )}

                        <div style={{
                            textAlign: 'center',
                            marginTop: '24px',
                            fontSize: '14px',
                            color: 'var(--text-muted)'
                        }}>
                            Showing {pagination.from}-{pagination.to} of {pagination.total} events
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default EventListing;