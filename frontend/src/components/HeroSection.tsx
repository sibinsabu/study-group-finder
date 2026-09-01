import React from 'react';
import { Play, ArrowRight, Compass } from 'lucide-react';
import studentsImg from '../assets/students_collaborating.jpg';

interface HeroSectionProps {
  onExploreClick?: () => void;
  onHowItWorksClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onHowItWorksClick
}) => {
  return (
    <section style={{
      position: 'relative',
      padding: '48px 48px 60px 48px',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
    }}>
      {/* Subtle geometric grid backdrop */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(to right, rgba(203, 213, 225, 0.45) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(203, 213, 225, 0.45) 1px, transparent 1px)
        `,
        backgroundSize: '54px 54px',
        opacity: 0.8,
        pointerEvents: 'none'
      }} />

      {/* Floating Compass Badge (Top Right) */}
      <div style={{
        position: 'absolute',
        top: '32px',
        right: '48px',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: '#ffffff',
        boxShadow: '0 8px 24px rgba(11, 26, 48, 0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '3px solid #f6d289',
        zIndex: 10,
        transform: 'rotate(-10deg)',
        transition: 'transform 0.3s ease'
      }}>
        <Compass size={32} color="#c7923e" />
      </div>

      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'grid',
        gridTemplateColumns: '1.05fr 0.95fr',
        gap: '40px',
        alignItems: 'center',
        maxWidth: '1280px',
        margin: '0 auto'
      }}>
        {/* Left Column: Headlines & CTAs */}
        <div style={{ maxWidth: '620px' }}>
          {/* Top Tag */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#eb5757',
            fontWeight: 700,
            fontSize: '13px',
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            marginBottom: '16px'
          }}>
            <span>#1 LMS FOR TRAINING SUCCESS</span>
          </div>

          {/* Main Hero Headline */}
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', var(--font-heading), sans-serif",
            fontSize: '52px',
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: '-1.5px',
            color: '#0b1a30',
            marginBottom: '20px'
          }}>
            Collaborate & Study.<br />
            Your Platform for Peak Performance.
          </h1>

          {/* Subtext */}
          <p style={{
            fontSize: '17px',
            lineHeight: 1.6,
            color: '#475569',
            marginBottom: '36px',
            maxWidth: '540px'
          }}>
            Connect, schedule, and excel with peers in minutes. Join a group and start learning today.
          </p>

          {/* Action CTAs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            flexWrap: 'wrap'
          }}>
            <button
              type="button"
              className="btn-primary"
              onClick={onExploreClick}
              style={{
                padding: '14px 32px',
                fontSize: '16px',
                borderRadius: '9999px',
                backgroundColor: '#0b1a30',
                color: '#ffffff',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(11, 26, 48, 0.25)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#172d50';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#0b1a30';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Explore Groups
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              className="btn-play"
              onClick={onHowItWorksClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 600,
                color: '#0b1a30'
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: '#eb5757',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(235, 87, 87, 0.35)',
                transition: 'transform 0.2s ease'
              }}>
                <Play size={18} color="#ffffff" fill="#ffffff" style={{ marginLeft: '2px' }} />
              </div>
              How It Works
            </button>
          </div>
        </div>

        {/* Right Column: Hero Visuals + Circular Best eLearning Platform Badge */}
        <div style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {/* Circular "Best eLearning Platform" Stamp Badge */}
          <div style={{
            position: 'absolute',
            top: '-20px',
            left: '20px',
            zIndex: 20,
            width: '110px',
            height: '110px'
          }}>
            <div className="circular-stamp" style={{ width: '100%', height: '100%' }}>
              <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <defs>
                  <path
                    id="circlePath"
                    d="M 60, 60 m -44, 0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
                  />
                </defs>
                <text fill="#0b1a30" fontSize="10.5" fontWeight="700" letterSpacing="2.2">
                  <textPath xlinkHref="#circlePath" startOffset="0%">
                    ★ BEST eLEARNING PLATFORM ★ EDUCATION & LEARNING
                  </textPath>
                </text>
              </svg>
              <div className="stamp-center" style={{ width: '48px', height: '48px' }}>
                <span style={{ fontSize: '22px', fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>S</span>
              </div>
            </div>
          </div>

          {/* Student Image Container */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '520px',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 20px 45px -10px rgba(11, 26, 48, 0.18)',
            border: '4px solid #ffffff',
            background: '#ffffff'
          }}>
            <img
              src={studentsImg}
              alt="Three diverse students collaborating on a laptop"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                objectFit: 'cover',
                transform: 'scale(1.01)',
                transition: 'transform 0.4s ease'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
