import * as React from 'react';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    role: 'attendee' | 'organizer' | 'admin';
    preferences?: {
        tags?: string[];
    };
    is_active: boolean;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, username: string, email: string, password: string, passwordConfirmation: string, role: 'attendee' | 'organizer', preferences?: { tags?: string[] }) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (name: string, email: string) => Promise<void>;
    updatePassword: (currentPassword: string, password: string, passwordConfirmation: string) => Promise<void>;
    updatePreferences: (tags: string[]) => Promise<void>;
    loading: boolean;
    isAuthenticated: boolean;
    isOrganizer: boolean;
    isAttendee: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!user && !!token;
    const isOrganizer = !!user && user.role === 'organizer';
    const isAttendee = !!user && user.role === 'attendee';
    const isAdmin = !!user && user.role === 'admin';

    // Initialize auth state from localStorage
    useEffect(() => {
        const savedToken = localStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('auth_user');

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
            // Verify token is still valid
            verifyToken(savedToken);
        } else {
            setLoading(false);
        }
    }, []);

    const verifyToken = async (authToken: string) => {
        try {
            const response = await fetch('/api/user', {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                // Token is invalid, clear it
                clearAuth();
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            clearAuth();
        } finally {
            setLoading(false);
        }
    };

    const saveAuth = (authToken: string, userData: User) => {
        setToken(authToken);
        setUser(userData);
        localStorage.setItem('auth_token', authToken);
        localStorage.setItem('auth_user', JSON.stringify(userData));
    };

    const clearAuth = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
    };

    const login = async (login: string, password: string) => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ login, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const data = await response.json();
            saveAuth(data.access_token, data.user);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (name: string, username: string, email: string, password: string, passwordConfirmation: string, role: 'attendee' | 'organizer', preferences?: { tags?: string[] }) => {
        try {
            const requestBody: any = { 
                name,
                username,
                email, 
                password, 
                password_confirmation: passwordConfirmation,
                role
            };

            if (role === 'attendee' && preferences?.tags) {
                requestBody.preferences = {
                    tags: preferences.tags
                };
            }

            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            const data = await response.json();
            saveAuth(data.access_token, data.user);
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            if (token) {
                await fetch('/api/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            clearAuth();
        }
    };

    const updateProfile = async (name: string, email: string) => {
        try {
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ name, email }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Profile update failed');
            }

            const data = await response.json();
            setUser(data.user);
            localStorage.setItem('auth_user', JSON.stringify(data.user));
        } catch (error) {
            console.error('Profile update error:', error);
            throw error;
        }
    };

    const updatePassword = async (currentPassword: string, password: string, passwordConfirmation: string) => {
        try {
            const response = await fetch('/api/user/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ 
                    current_password: currentPassword,
                    password, 
                    password_confirmation: passwordConfirmation 
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Password update failed');
            }
        } catch (error) {
            console.error('Password update error:', error);
            throw error;
        }
    };

    const updatePreferences = async (tags: string[]) => {
        try {
            const response = await fetch('/api/user/preferences', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ tags }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Preferences update failed');
            }

            const data = await response.json();
            setUser(data.user);
            localStorage.setItem('auth_user', JSON.stringify(data.user));
        } catch (error) {
            console.error('Preferences update error:', error);
            throw error;
        }
    };

    const value: AuthContextType = {
        user,
        token,
        login,
        register,
        logout,
        updateProfile,
        updatePassword,
        updatePreferences,
        loading,
        isAuthenticated,
        isOrganizer,
        isAttendee,
        isAdmin,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};