export interface Event {
    id: number;
    title: string;
    location: string;
    region?: string;
    start_date: string;
    end_date: string;
    description: string;
    short_description?: string;
    long_description?: string;
    header_image?: string;
    organizer_logo?: string;
    type?: string;
    format?: 'online' | 'in-person' | 'hybrid';
    tags?: string[];
    user_id?: number;
    is_saved?: boolean;
    is_attending?: boolean;
    attendees_count?: number;
    created_at: string;
    updated_at: string;
}