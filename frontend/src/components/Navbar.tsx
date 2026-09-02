import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Search, ChevronDown, LogOut, LayoutDashboard, User as UserIcon, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onSearchChange?: (val: string) => void;
  searchTerm?: string;
  activeTab?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearchChange,
  searchTerm = '',
  activeTab
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const currentPath = location.pathname;

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Study Groups', path: isAuthenticated ? '/dashboard' : '/login' },
    ...(isAuthenticated ? [
      { label: 'My Groups', path: '/my-groups' },
      { label: 'My Profile', path: '/profile' }
    ] : [])
  ];

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
          color: '#0b1a30'
        }}>
          STUDYSPHERE
        </span>
      </Link>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        {navLinks.map((link) => {
          const isActive = activeTab === link.label || (link.path !== '/' && currentPath === link.path) || (link.path === '/' && currentPath === '/');
          return (
            <button
              key={link.label}
              type="button"
              onClick={() => navigate(link.path)}
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
              {isActive && (
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

      {/* Right Controls: Search & Auth Profile / Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Search Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: '#f1f5f9',
          borderRadius: '9999px',
          padding: '8px 16px',
          width: '210px',
          border: '1px solid #e2e8f0'
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
              width: '100%'
            }}
          />
        </div>

        {/* User Auth Controls */}
        {isAuthenticated && user ? (
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setProfileOpen(!profileOpen)}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 10px 4px 6px',
              borderRadius: '9999px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0'
            }}>
              <img
                src={user.avatar}
                alt={user.name}
                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#0b1a30' }}>
                {user.name.split(' ')[0]}
              </span>
              <ChevronDown size={14} color="#64748b" />
            </div>

            {profileOpen && (
              <div style={{
                position: 'absolute',
                top: '120%',
                right: 0,
                width: '200px',
                background: '#ffffff',
                borderRadius: '14px',
                boxShadow: '0 12px 30px rgba(11, 26, 48, 0.15)',
                border: '1px solid #e2e8f0',
                padding: '10px',
                zIndex: 60
              }}>
                <div style={{ paddingBottom: '8px', borderBottom: '1px solid #f1f5f9', marginBottom: '6px' }}>
                  <p style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>{user.name}</p>
                  <p style={{ fontSize: '11px', color: '#64748b' }}>{user.email}</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => {
                    navigate('/dashboard');
                    setProfileOpen(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    padding: '8px',
                    fontSize: '13px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    color: '#0b1a30',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 500
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <LayoutDashboard size={14} />
                  Dashboard
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    navigate('/my-groups');
                    setProfileOpen(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    padding: '8px',
                    fontSize: '13px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    color: '#0b1a30',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 500
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <Users size={14} />
                  My Groups
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    navigate('/profile');
                    setProfileOpen(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    padding: '8px',
                    fontSize: '13px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    color: '#0b1a30',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 500
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <UserIcon size={14} />
                  My Profile
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    logout();
                    navigate('/');
                    setProfileOpen(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    padding: '8px',
                    fontSize: '13px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 500
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = '#fef2f2')}
                  onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="btn-outline"
              style={{ padding: '8px 18px', fontSize: '13px' }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="btn-primary"
              style={{ padding: '8px 20px', fontSize: '13px' }}
            >
              Register
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
