import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, ArrowLeft, Hammer, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <div className="grid-bg" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '40px',
          maxWidth: '440px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(11, 26, 48, 0.15)',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{ color: '#0b1a30', marginBottom: '12px', fontSize: '24px', fontWeight: 700 }}>
            Session Required
          </h2>
          <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '15px' }}>
            Please log in or register to access the student dashboard.
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate('/login')}
            style={{ width: '100%' }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', padding: '16px 0 32px 0' }}>
      <div className="app-viewport">
        {/* Top Header Bar */}
        <header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 48px',
          background: '#ffffff',
          borderBottom: '1px solid #f1f5f9'
        }}>
          {/* Brand */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              fontSize: '24px',
              color: '#0b1a30'
            }}
          >
            <span>STUDYSPHERE</span>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#eb5757',
              display: 'inline-block'
            }} />
          </Link>

          {/* Action Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#475569',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '9999px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = '#0b1a30';
                e.currentTarget.style.borderColor = '#0b1a30';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = '#475569';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <ArrowLeft size={16} />
              Explore Landing Page
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 18px',
                borderRadius: '9999px',
                background: '#ffffff',
                border: '1px solid #fecaca',
                color: '#ef4444',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#fef2f2';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main style={{
          padding: '60px 48px 80px 48px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          {/* Under Development Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 18px',
            borderRadius: '9999px',
            background: 'rgba(235, 87, 87, 0.1)',
            color: '#eb5757',
            border: '1px solid rgba(235, 87, 87, 0.25)',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.6px',
            textTransform: 'uppercase',
            marginBottom: '24px'
          }}>
            <Hammer size={16} />
            <span>Dashboard Under Development</span>
          </div>

          {/* Greeting Headline */}
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', var(--font-heading), sans-serif",
            fontSize: '44px',
            fontWeight: 800,
            color: '#0b1a30',
            lineHeight: 1.15,
            letterSpacing: '-1px',
            marginBottom: '16px',
            maxWidth: '680px'
          }}>
            Welcome, {user.name}! 👋
          </h1>

          <p style={{
            fontSize: '17px',
            color: '#64748b',
            lineHeight: 1.6,
            maxWidth: '560px',
            marginBottom: '40px'
          }}>
            Your student account is authenticated and connected to MongoDB. The custom dashboard layout and collaborative workspace tools are currently under active development.
          </p>

          {/* Authenticated Account Profile Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
            padding: '32px 40px',
            maxWidth: '520px',
            width: '100%',
            boxShadow: '0 20px 45px -10px rgba(11, 26, 48, 0.08)',
            marginBottom: '36px',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <img
                src={user.avatar}
                alt={user.name}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #f1f5f9',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0b1a30' }}>
                    {user.name}
                  </h3>
                  <CheckCircle2 size={16} color="#10b981" />
                </div>
                <p style={{ fontSize: '14px', color: '#64748b' }}>{user.email}</p>
              </div>
            </div>

            <div style={{
              background: '#f8fafc',
              borderRadius: '14px',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontSize: '13px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontWeight: 500 }}>University Affiliation:</span>
                <span style={{ color: '#0b1a30', fontWeight: 700 }}>{user.university}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontWeight: 500 }}>Account Status:</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>Verified Student (MongoDB)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontWeight: 500 }}>Database ID:</span>
                <span style={{ color: '#64748b', fontFamily: 'monospace', fontSize: '12px' }}>{user.id}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link
              to="/"
              className="btn-primary"
              style={{
                textDecoration: 'none',
                padding: '12px 28px',
                fontSize: '15px'
              }}
            >
              Browse Study Circles
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              style={{
                padding: '12px 24px',
                borderRadius: '9999px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#334155',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#0b1a30';
                e.currentTarget.style.backgroundColor = '#f8fafc';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              Sign Out
            </button>
          </div>

          {/* Footer note */}
          <div style={{
            marginTop: '48px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#94a3b8',
            fontSize: '13px'
          }}>
            <ShieldCheck size={16} color="#10b981" />
            <span>StudySphere Secure Learning Platform • Spring Boot & MongoDB</span>
          </div>
        </main>
      </div>
    </div>
  );
};
