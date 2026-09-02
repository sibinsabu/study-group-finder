import React from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { FindGroupPanel } from '../components/FindGroupPanel';
import { AuthCard } from '../components/AuthCard';
import { ShieldCheck, Sparkles } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const location = useLocation();
  const isRegister = location.pathname.includes('register');

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', padding: '16px 0 32px 0' }}>
      <main className="app-viewport">
        {/* Top Navbar */}
        <Navbar activeTab={isRegister ? 'Register' : 'Sign In'} />

        {/* Auth Hero Section */}
        <section style={{
          padding: '48px 24px 60px 24px',
          background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative'
        }}>
          {/* Subtle Grid Backdrop */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(to right, rgba(203, 213, 225, 0.35) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(203, 213, 225, 0.35) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
            opacity: 0.7,
            pointerEvents: 'none'
          }} />

          {/* Heading Tag */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 14px',
            borderRadius: '9999px',
            background: 'rgba(235, 87, 87, 0.1)',
            color: '#eb5757',
            border: '1px solid rgba(235, 87, 87, 0.25)',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.6px',
            textTransform: 'uppercase',
            marginBottom: '16px',
            position: 'relative',
            zIndex: 2
          }}>
            <Sparkles size={14} />
            <span>SECURE UNIVERSITY PEER ACCESS</span>
          </div>

          <h1 style={{
            fontSize: '32px',
            fontWeight: 800,
            color: '#0b1a30',
            textAlign: 'center',
            marginBottom: '28px',
            position: 'relative',
            zIndex: 2,
            letterSpacing: '-0.5px'
          }}>
            {isRegister ? 'Create Your Verified Student Account' : 'Welcome Back to StudySphere'}
          </h1>

          {/* Main Auth Card Container */}
          <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '840px' }}>
            <AuthCard initialMode={isRegister ? 'register' : 'login'} />
          </div>

          {/* University Trust Badge Footer */}
          <div style={{
            marginTop: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#64748b',
            fontSize: '13px',
            position: 'relative',
            zIndex: 2
          }}>
            <ShieldCheck size={16} color="#10b981" />
            <span>Verified University Email Protection • Spring Boot Security & MongoDB</span>
          </div>
        </section>

        {/* Dark Navy Footer */}
        <FindGroupPanel />
      </main>
    </div>
  );
};
