import React from 'react';
import { Link } from 'react-router-dom';
import { Hammer, Sparkles, ArrowRight, Users, Calendar, Video, MessageSquare } from 'lucide-react';

export const FindGroupPanel: React.FC = () => {
  return (
    <section style={{
      background: 'linear-gradient(180deg, #0b1a30 0%, #071222 100%)',
      width: '100%',
      margin: '0',
      borderRadius: '0 0 28px 28px',
      padding: '52px 48px 36px 48px',
      color: '#ffffff',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Background Glows */}
      <div style={{
        position: 'absolute',
        top: '-120px',
        right: '-100px',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Main Header Row with Stamp Badge & Title */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '28px',
        marginBottom: '36px',
        flexWrap: 'wrap'
      }}>
        {/* Circular Stamp Badge */}
        <div style={{
          width: '84px',
          height: '84px',
          position: 'relative',
          flexShrink: 0
        }}>
          <div className="circular-stamp" style={{ width: '100%', height: '100%' }}>
            <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <defs>
                <path
                  id="navyCirclePath"
                  d="M 60, 60 m -44, 0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
                />
              </defs>
              <text fill="#ffffff" fontSize="10.5" fontWeight="700" letterSpacing="2">
                <textPath xlinkHref="#navyCirclePath" startOffset="0%">
                  ★ BEST eLEARNING PLATFORM ★ LEARNING PLATFORM
                </textPath>
              </text>
            </svg>
            <div className="stamp-center" style={{
              width: '44px',
              height: '44px',
              backgroundColor: '#ffffff',
              color: '#0b1a30'
            }}>
              <span style={{ fontSize: '20px', fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>S</span>
            </div>
          </div>
        </div>

        {/* Section Headline */}
        <div>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', var(--font-heading), sans-serif",
            fontSize: '32px',
            fontWeight: 800,
            letterSpacing: '-0.5px',
            color: '#ffffff',
            lineHeight: 1.2
          }}>
            Find Your Ideal Group:{' '}
            <span style={{
              background: 'linear-gradient(90deg, #fde047 0%, #a3e635 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Connect with Peers With Potential.
            </span>
          </h2>
          <p style={{
            fontSize: '15px',
            color: '#94a3b8',
            marginTop: '4px'
          }}>
            Filter by academic subject, schedule compatibility, and collaborative sprint frequency.
          </p>
        </div>
      </div>

      {/* Under Development Hero Card */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        padding: '48px 36px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '40px',
        position: 'relative'
      }}>
        {/* Development Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 18px',
          borderRadius: '9999px',
          background: 'rgba(235, 87, 87, 0.15)',
          color: '#f87171',
          border: '1px solid rgba(235, 87, 87, 0.3)',
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '0.6px',
          textTransform: 'uppercase',
          marginBottom: '20px'
        }}>
          <Hammer size={16} />
          <span>Study Groups Section Under Development</span>
        </div>

        {/* Headline */}
        <h3 style={{
          fontFamily: "'Plus Jakarta Sans', var(--font-heading), sans-serif",
          fontSize: '28px',
          fontWeight: 800,
          color: '#ffffff',
          marginBottom: '12px',
          maxWidth: '620px',
          lineHeight: 1.25
        }}>
          Live Study Circles & Peer Matching Coming Soon
        </h3>

        <p style={{
          fontSize: '16px',
          color: '#94a3b8',
          maxWidth: '580px',
          lineHeight: 1.6,
          marginBottom: '32px'
        }}>
          We are building the complete study group discovery engine. You will soon be able to create custom study circles, match with verified students across subjects, and launch real-time collaboration rooms.
        </p>

        {/* Feature Preview Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          width: '100%',
          maxWidth: '860px',
          marginBottom: '36px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '18px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textAlign: 'left'
          }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
              <Users size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>Peer Matching</h4>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>Connect by course & goal</p>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '18px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textAlign: 'left'
          }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(250, 204, 21, 0.15)', color: '#facc15' }}>
              <Calendar size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>Schedule Sync</h4>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>Weekly sprint timetable</p>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '18px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textAlign: 'left'
          }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <Video size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>Live Study Rooms</h4>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>Video & code whiteboard</p>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '18px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textAlign: 'left'
          }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(235, 87, 87, 0.15)', color: '#eb5757' }}>
              <MessageSquare size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>Group Chat</h4>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>Direct peer discussions</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to="/register"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 32px',
            borderRadius: '9999px',
            backgroundColor: '#ffffff',
            color: '#0b1a30',
            fontWeight: 700,
            fontSize: '15px',
            textDecoration: 'none',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
            transition: 'transform 0.2s, background-color 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#f1f5f9';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Sparkles size={16} color="#0b1a30" />
          <span>Register for Early Access</span>
          <ArrowRight size={16} color="#0b1a30" />
        </Link>
      </div>

      {/* Dark Navy Blue Footer Bar Links */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '24px',
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        fontSize: '13px',
        color: '#94a3b8',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontWeight: 700, color: '#ffffff' }}>STUDYSPHERE</span>
          <span>© 2026 Study Group Finder. All rights reserved.</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {['About Us', 'Privacy', 'Support', 'Terms'].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
              style={{
                color: '#94a3b8',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseOut={(e) => (e.currentTarget.style.color = '#94a3b8')}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
