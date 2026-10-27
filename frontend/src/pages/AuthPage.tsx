import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { FindGroupPanel } from '../components/FindGroupPanel';
import { AuthCard } from '../components/AuthCard';
import { ShieldCheck, Sparkles, Clock, Users, AlertCircle, X, ArrowUp } from 'lucide-react';
import { INITIAL_STUDY_GROUPS } from '../data/mockData';
import type { StudyGroup } from '../data/mockData';

export const AuthPage: React.FC = () => {
  const location = useLocation();
  const isRegister = location.pathname.includes('register');

  // Parse notice param if navigated from "Join Group" elsewhere
  const [joinNotice, setJoinNotice] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const notice = params.get('notice');
    const groupTitle = params.get('title');
    if (notice === 'join_group' && groupTitle) {
      setJoinNotice(`Please log in or register to join group: "${groupTitle}"! Complete sign in above to proceed.`);
    }
  }, [location.search]);

  const handleJoinClick = (group: StudyGroup) => {
    setJoinNotice(`Please log in or register to join group: "${group.title}"! Sign in or create an account above to join.`);
    // Smooth scroll to login form
    window.scrollTo({ top: 140, behavior: 'smooth' });
  };

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', padding: '16px 0 32px 0' }}>
      <main className="app-viewport">
        {/* Top Navbar */}
        <Navbar activeTab={isRegister ? 'Register' : 'Sign In'} />

        {/* Auth Hero Section */}
        <section style={{
          padding: '48px 24px 50px 24px',
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
            <span>SECURE UNIVERSITY PEER & MENTOR ACCESS</span>
          </div>

          <h1 style={{
            fontSize: '32px',
            fontWeight: 800,
            color: '#0b1a30',
            textAlign: 'center',
            marginBottom: '20px',
            position: 'relative',
            zIndex: 2,
            letterSpacing: '-0.5px'
          }}>
            {isRegister ? 'Create Your Student or Mentor Account' : 'Welcome Back to StudySphere'}
          </h1>

          {/* Join Group Login Notice Banner */}
          {joinNotice && (
            <div style={{
              position: 'relative',
              zIndex: 3,
              width: '100%',
              maxWidth: '840px',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '14px',
              padding: '12px 18px',
              marginBottom: '22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.1)',
              animation: 'fadeIn 0.3s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={20} color="#2563eb" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '13px', color: '#1e40af', fontWeight: 600 }}>
                  {joinNotice}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setJoinNotice(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px'
                }}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Main Auth Card Container (Supports Student & Mentor Login / Register) */}
          <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '840px' }}>
            <AuthCard initialMode={isRegister ? 'register' : 'login'} />
          </div>

          {/* University Trust Badge Footer */}
          <div style={{
            marginTop: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#64748b',
            fontSize: '13px',
            position: 'relative',
            zIndex: 2
          }}>
            <ShieldCheck size={16} color="#10b981" />
            <span>Verified Peer & Mentor Network • Spring Boot Security & MongoDB</span>
          </div>
        </section>

        {/* Study Groups Preview Section in Login Page */}
        <section style={{
          padding: '44px 48px',
          background: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          position: 'relative'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '14px'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#2563eb',
                fontWeight: 700,
                fontSize: '12px',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                marginBottom: '4px'
              }}>
                <Users size={14} />
                <span>ACTIVE STUDY GROUPS</span>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0b1a30' }}>
                Browse Circles (Login Required to Join)
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '420px' }}>
              Want to join a study session? Click <strong>Join Group</strong> on any circle to sign in and enroll.
            </p>
          </div>

          {/* Grid of Study Groups */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {INITIAL_STUDY_GROUPS.slice(0, 3).map((group) => (
              <div
                key={group.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}
              >
                <div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px'
                  }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      backgroundColor: '#e2e8f0',
                      color: '#0b1a30',
                      fontSize: '11px',
                      fontWeight: 700
                    }}>
                      {group.category}
                    </span>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      color: '#64748b'
                    }}>
                      <Clock size={12} />
                      {group.schedule}
                    </span>
                  </div>

                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#0b1a30',
                    marginBottom: '4px'
                  }}>
                    {group.title}
                  </h3>

                  <p style={{
                    fontSize: '12px',
                    color: '#2563eb',
                    fontWeight: 600,
                    marginBottom: '8px'
                  }}>
                    {group.subject} • {group.university}
                  </p>

                  <p style={{
                    fontSize: '13px',
                    color: '#64748b',
                    lineHeight: 1.45,
                    marginBottom: '16px'
                  }}>
                    {group.description}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '14px',
                  borderTop: '1px solid #e2e8f0'
                }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                    {group.membersCount}/{group.maxMembers} Members
                  </span>

                  <button
                    type="button"
                    onClick={() => handleJoinClick(group)}
                    style={{
                      padding: '8px 18px',
                      backgroundColor: '#0b1a30',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#eb5757')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#0b1a30')}
                  >
                    <span>Join Group</span>
                    <ArrowUp size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dark Navy Footer */}
        <FindGroupPanel />
      </main>
    </div>
  );
};
