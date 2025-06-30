import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, loading, isAttendee, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleNavigation = (path: string, query?: string) => {
    if (query) {
      navigate(`${path}?${query}`);
    } else {
      navigate(path);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header>
      <nav className="container">
        <div 
          className="logo"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          eventLoop
        </div>
        
        <div className="nav-content">
          <ul className="nav-links">
            <li>
              <button
                onClick={() => handleNavigation('/events')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isActive('/events') ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.2s ease',
                  position: 'relative',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                Events
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/events', 'type=Conference')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.2s ease',
                  position: 'relative',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                Conferences
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/events', 'type=Meetup')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.2s ease',
                  position: 'relative',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                Meetups
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/api')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isActive('/api') ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.2s ease',
                  position: 'relative',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                API
              </button>
            </li>
          </ul>
          
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            title="Toggle theme"
          >
            {theme === 'light' ? '☀️' : '🌙'}
          </button>
          
          {loading ? (
            <div style={{
              width: '32px',
              height: '32px',
              border: '2px solid var(--border-color)',
              borderTop: '2px solid var(--accent-primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          ) : user ? (
            // Authenticated user menu
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{
                color: 'var(--text-secondary)',
                fontSize: '14px'
              }}>
                Hello, {user.name}
                <span style={{
                  marginLeft: '4px',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  textTransform: 'capitalize'
                }}>
                  ({user.role})
                </span>
              </span>
              {isAdmin && (
                <button
                  onClick={() => navigate('/admin')}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--accent-primary)',
                    borderRadius: '4px',
                    color: 'var(--accent-primary)',
                    padding: '6px 12px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: 'inherit',
                    marginRight: '12px'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'var(--accent-primary)';
                    e.currentTarget.style.color = 'var(--bg-primary)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--accent-primary)';
                  }}
                >
                  🛠️ Admin
                </button>
              )}
              {isAttendee && (
                <>
                  <button
                    onClick={() => navigate('/saved-events')}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      color: isActive('/saved-events') ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      padding: '6px 12px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontFamily: 'inherit'
                    }}
                    onMouseOver={(e) => {
                      if (!isActive('/saved-events')) {
                        e.currentTarget.style.borderColor = 'var(--accent-primary)';
                        e.currentTarget.style.color = 'var(--accent-primary)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isActive('/saved-events')) {
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }
                    }}
                  >
                    💾 Saved
                  </button>
                  <button
                    onClick={() => navigate('/preferences')}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      color: isActive('/preferences') ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      padding: '6px 12px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontFamily: 'inherit'
                    }}
                    onMouseOver={(e) => {
                      if (!isActive('/preferences')) {
                        e.currentTarget.style.borderColor = 'var(--accent-primary)';
                        e.currentTarget.style.color = 'var(--accent-primary)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isActive('/preferences')) {
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }
                    }}
                  >
                    Preferences
                  </button>
                  <button
                    onClick={() => navigate('/speaker-application')}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      color: isActive('/speaker-application') ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      padding: '6px 12px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontFamily: 'inherit'
                    }}
                    onMouseOver={(e) => {
                      if (!isActive('/speaker-application')) {
                        e.currentTarget.style.borderColor = 'var(--accent-primary)';
                        e.currentTarget.style.color = 'var(--accent-primary)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isActive('/speaker-application')) {
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }
                    }}
                  >
                    Become Speaker
                  </button>
                </>
              )}
              <button
                onClick={() => navigate('/profile')}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  color: 'var(--text-secondary)',
                  padding: '6px 12px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  e.currentTarget.style.color = 'var(--accent-primary)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  color: 'var(--text-secondary)',
                  padding: '6px 12px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  e.currentTarget.style.color = 'var(--accent-primary)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            // Guest user menu
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  color: 'var(--text-secondary)',
                  padding: '8px 16px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  e.currentTarget.style.color = 'var(--accent-primary)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="nav-cta"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;