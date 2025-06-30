import { Event } from '../types/Event';

const API_BASE_URL = '/api';

export const api = {
    async getEvents(filters?: {
        search?: string;
        tag?: string;
        tags?: string | string[];
        type?: string;
        format?: string;
        region?: string;
        start_date?: string;
        end_date?: string;
        upcoming_only?: boolean;
        sort_by?: string;
        per_page?: number;
        page?: number;
    }): Promise<{
        data: Event[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    }> {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (key === 'tags' && Array.isArray(value)) {
                        // Join multiple tags with comma for backend processing
                        params.append(key, value.join(','));
                    } else {
                        params.append(key, value.toString());
                    }
                }
            });
        }
        
        const url = `${API_BASE_URL}/events${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch events');
        return response.json();
    },

    async getEvent(id: number): Promise<Event> {
        const response = await fetch(`${API_BASE_URL}/events/${id}`);
        if (!response.ok) throw new Error('Failed to fetch event');
        return response.json();
    },

    async createEvent(event: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<Event> {
        const response = await fetch(`${API_BASE_URL}/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
            body: JSON.stringify(event),
        });
        if (!response.ok) throw new Error('Failed to create event');
        return response.json();
    },

    async updateEvent(id: number, event: Partial<Omit<Event, 'id' | 'created_at' | 'updated_at'>>): Promise<Event> {
        const response = await fetch(`${API_BASE_URL}/events/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
            body: JSON.stringify(event),
        });
        if (!response.ok) throw new Error('Failed to update event');
        return response.json();
    },

    async deleteEvent(id: number): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/events/${id}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
        });
        if (!response.ok) throw new Error('Failed to delete event');
    },

    async getPopularTags(): Promise<Array<{name: string; count: number; display: string}>> {
        const response = await fetch(`${API_BASE_URL}/events/popular-tags`);
        if (!response.ok) throw new Error('Failed to fetch popular tags');
        return response.json();
    },

    async getAllTags(filters?: {
        search?: string;
        type?: string;
        format?: string;
        region?: string;
        start_date?: string;
        end_date?: string;
        upcoming_only?: boolean;
    }): Promise<Array<{name: string; count: number; display: string}>> {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    params.append(key, value.toString());
                }
            });
        }
        
        const url = `${API_BASE_URL}/events/all-tags${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch all tags');
        return response.json();
    },
};