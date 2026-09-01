import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ChevronDown, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onSearchChange?: (val: string) => void;
  searchTerm?: string;
  onNavigateTab?: (tab: string) => void;
  activeTab?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearchChange,
  searchTerm = '',
  onNavigateTab,
  activeTab = 'Home'
}) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [pagesDropdownOpen, setPagesDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/', hasDot: true },
    { label: 'Our Course', path: '/#find-groups-section', hasDot: false },
    { label: 'Pages', hasDropdown: true },
    { label: 'Mentors', path: '/#find-groups-section', hasDot: false },
    { label: 'Resources', path: '/#find-groups-section', hasDot: false },
  ];

  const handleLinkClick = (link: { label: string; path?: string }) => {
    onNavigateTab?.(link.label);
    if (link.path?.includes('#')) {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById('find-groups-section');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (link.path) {
      navigate(link.path);
    }
  };

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '18px 48px',
      background: '#ffffff',
      borderBottom: '1px solid #f1f5f9',
      position: 'relative',
      zIndex: 40
    }}>
      {/* Brand Logo */}
      <Link 
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textDecoration: 'none',
          cursor: 'pointer'
        }}
      >
        <span style={{
          fontFamily: "'Outfit', var(--font-brand), sans-serif",
          fontWeight: 800,
          fontSize: '24px',
          letterSpacing: '-0.5px',
          color: '#0b1a30',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          STUDYSPHERE
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#eb5757',
            display: 'inline-block'
          }} />
        </span>
      </Link>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        {navLinks.map((link) => {
          const isActive = activeTab === link.label;
          if (link.hasDropdown) {
            return (
              <div 
                key={link.label}
                style={{ position: 'relative' }}
                onMouseEnter={() => setPagesDropdownOpen(true)}
                onMouseLeave={() => setPagesDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setPagesDropdownOpen(!pagesDropdownOpen)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontFamily: 'inherit',
                    fontSize: '15px',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#0b1a30' : '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    padding: '6px 0',
                    transition: 'color 0.2s'
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.color = '#0b1a30')}
                  onMouseOut={(e) => (e.currentTarget.style.color = isActive ? '#0b1a30' : '#475569')}
                >
                  {link.hasDot && (
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#eb5757',
                      marginRight: '2px'
                    }} />
                  )}
                  {link.label}
                  <ChevronDown size={14} style={{ transform: pagesDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                {pagesDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    width: '190px',
                    background: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(11, 26, 48, 0.12)',
                    border: '1px solid #e2e8f0',
                    padding: '8px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 50
                  }}>
                    {['Study Circles', 'Virtual Rooms', 'Exam Schedules', 'Peer Reviews'].map((subItem) => (
                      <button
                        key={subItem}
                        type="button"
                        onClick={() => {
                          setPagesDropdownOpen(false);
                          if (isAuthenticated) {
                            navigate('/dashboard');
                          } else {
                            navigate('/login');
                          }
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          textAlign: 'left',
                          padding: '10px 18px',
                          fontSize: '14px',
                          color: '#334155',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          transition: 'background 0.15s, color 0.15s'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = '#f8fafc';
                          e.currentTarget.style.color = '#0b1a30';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'none';
                          e.currentTarget.style.color = '#334155';
                        }}
                      >
                        {subItem}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <button
              key={link.label}
              type="button"
              onClick={() => handleLinkClick(link)}
              style={{
                background: 'none',
                border: 'none',
                fontFamily: 'inherit',
                fontSize: '15px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#0b1a30' : '#475569',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                padding: '6px 0',
                transition: 'color 0.2s'
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = '#0b1a30')}
              onMouseOut={(e) => (e.currentTarget.style.color = isActive ? '#0b1a30' : '#475569')}
            >
              {link.hasDot && (
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#eb5757'
                }} />
              )}
              {link.label}
            </button>
          );
        })}
      </nav>

      {/* Right Controls: Search Bar & Auth Buttons / User Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Search Bar */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          background: '#f1f5f9',
          borderRadius: '9999px',
          padding: '8px 16px 8px 14px',
          width: '210px',
          border: '1px solid #e2e8f0',
          transition: 'all 0.2s ease'
        }}>
          <Search size={16} color="#64748b" style={{ marginRight: '8px', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Find Study Group"
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontFamily: 'inherit',
              fontSize: '14px',
              color: '#0f172a',
              width: '100%',
              lineHeight: 1.2
            }}
          />
        </div>

        {/* Conditional Auth State: Login/Register buttons OR Authenticated User Avatar */}
        {isAuthenticated && user ? (
          /* Logged In User Avatar & Dropdown */
          <div 
            style={{ position: 'relative', cursor: 'pointer' }}
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 8px',
              borderRadius: '9999px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              transition: 'background 0.2s'
            }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #ffffff'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  border: '2px solid #ffffff'
                }} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#0b1a30' }}>
                {user.name.split(' ')[0]}
              </span>
              <ChevronDown size={14} color="#64748b" />
            </div>

            {profileDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '120%',
                right: '0',
                width: '220px',
                background: '#ffffff',
                borderRadius: '14px',
                boxShadow: '0 12px 30px rgba(11, 26, 48, 0.15)',
                border: '1px solid #e2e8f0',
                padding: '12px',
                zIndex: 60
              }}>
                <div style={{ paddingBottom: '10px', borderBottom: '1px solid #f1f5f9', marginBottom: '8px' }}>
                  <p style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>{user.name}</p>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>{user.email}</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => {
                    navigate('/dashboard');
                    setProfileDropdownOpen(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    padding: '8px 10px',
                    fontSize: '13px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    color: '#0b1a30',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 500
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <LayoutDashboard size={15} color="#0b1a30" />
                  My Dashboard
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    logout();
                    navigate('/');
                    setProfileDropdownOpen(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    padding: '8px 10px',
                    fontSize: '13px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    color: '#ef4444',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 500
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = '#fef2f2')}
                  onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <LogOut size={15} color="#ef4444" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Unauthenticated: Sign In & Register Buttons */
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={() => navigate('/login')}
              style={{
                background: 'transparent',
                border: '1px solid #cbd5e1',
                padding: '8px 18px',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#0b1a30',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#0b1a30';
                e.currentTarget.style.backgroundColor = '#f8fafc';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => navigate('/register')}
              style={{
                background: '#0b1a30',
                border: 'none',
                padding: '8px 20px',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#ffffff',
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: '0 4px 12px rgba(11, 26, 48, 0.2)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#162b4c';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#0b1a30';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Register
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
