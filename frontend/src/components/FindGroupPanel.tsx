import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Calendar, Video, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const FindGroupPanel: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section style={{
      background: 'linear-gradient(180deg, #0b1a30 0%, #071222 100%)',
      width: '100%',
      borderRadius: '0 0 28px 28px',
      padding: '48px 48px 32px 48px',
      color: '#ffffff',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Header Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Circular Stamp Badge */}
          <div className="circular-stamp" style={{ width: '70px', height: '70px', flexShrink: 0 }}>
            <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%' }}>
              <defs>
                <path
                  id="simpleCirclePath"
                  d="M 60, 60 m -44, 0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
                />
              </defs>
              <text fill="#ffffff" fontSize="10.5" fontWeight="700" letterSpacing="2">
                <textPath xlinkHref="#simpleCirclePath" startOffset="0%">
                  ★ BEST eLEARNING PLATFORM ★ EDUCATION
                </textPath>
              </text>
            </svg>
            <div className="stamp-center" style={{ width: '36px', height: '36px', background: '#ffffff', color: '#0b1a30' }}>
              <span style={{ fontSize: '17px', fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>S</span>
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
              Find Your Ideal Study Group
            </h2>
            <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '4px' }}>
              Connect with peers for course discussions, exam preparation, and collaborative study sprints.
            </p>
          </div>
        </div>

        <Link
          to={isAuthenticated ? "/dashboard" : "/register"}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#ffffff',
            color: '#0b1a30',
            padding: '10px 24px',
            borderRadius: '9999px',
            fontWeight: 700,
            fontSize: '14px',
            textDecoration: 'none'
          }}
        >
          <span>{isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}</span>
          <ArrowRight size={15} />
        </Link>
      </div>

      {/* 4 Clean Feature Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '36px'
      }}>
        {[
          { icon: Users, title: 'Peer Matching', desc: 'Connect by course & syllabus' },
          { icon: Calendar, title: 'Schedule Sync', desc: 'Weekly study timetable' },
          { icon: Video, title: 'Virtual Study Rooms', desc: 'Synchronized study sessions' },
          { icon: MessageSquare, title: 'Shared Notes', desc: 'Collaborate with verified peers' }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div style={{
                padding: '8px',
                borderRadius: '10px',
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8'
              }}>
                <Icon size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>{item.title}</h4>
                <p style={{ fontSize: '11px', color: '#94a3b8' }}>{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Line */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        fontSize: '12px',
        color: '#94a3b8',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontWeight: 800, color: '#ffffff', fontFamily: "'Outfit', sans-serif" }}>STUDYSPHERE</span>
          <span>© 2026 Study Group Finder. All rights reserved.</span>
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>
          <Link to={isAuthenticated ? "/dashboard" : "/login"} style={{ color: '#94a3b8', textDecoration: 'none' }}>Study Groups</Link>
          <a href="#about" style={{ color: '#94a3b8', textDecoration: 'none' }}>Privacy</a>
        </div>
      </div>
    </section>
  );
};
