import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { AuthCard } from '../components/AuthCard';

export const AuthPage: React.FC = () => {
  const location = useLocation();
  const isRegister = location.pathname.includes('register');

  return (
    <div className="grid-bg" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 16px'
    }}>
      {/* Top Navigation */}
      <header style={{
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px'
      }}>
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            color: '#0b1a30',
            fontWeight: 800,
            fontSize: '22px',
            fontFamily: "'Outfit', sans-serif"
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
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
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
          Back to Home
        </Link>
      </header>

      {/* Main Centered Card Container */}
      <main style={{
        maxWidth: '1200px',
        margin: '20px auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}>
        <AuthCard initialMode={isRegister ? 'register' : 'login'} />
        
        {/* University trust badge footer */}
        <div style={{
          marginTop: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#64748b',
          fontSize: '13px'
        }}>
          <ShieldCheck size={16} color="#10b981" />
          <span>Verified University Email Network • Peer Protection Standard</span>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        fontSize: '13px',
        color: '#94a3b8',
        padding: '16px'
      }}>
        © 2026 StudySphere Study Group Finder. All rights reserved.
      </footer>
    </div>
  );
};
