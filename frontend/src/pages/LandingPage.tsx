import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { FindGroupPanel } from '../components/FindGroupPanel';
import { ViewGroupModal } from '../components/ViewGroupModal';
import { useAuth } from '../context/AuthContext';
import type { StudyGroup } from '../data/mockData';
import { INITIAL_STUDY_GROUPS } from '../data/mockData';
import { Clock, ArrowRight, Flame, Eye } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingGroup, setViewingGroup] = useState<StudyGroup | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleExplore = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const showHowItWorks = () => {
    alert(
      'How StudySphere Works:\n\n1. Search for study groups by university course or subject.\n2. Connect with verified peer students.\n3. Join collaborative study sessions and share notes.'
    );
  };

  const featuredGroups = INITIAL_STUDY_GROUPS.filter(grp =>
    !searchTerm ||
    grp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grp.subject.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 3);

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', padding: '16px 0 32px 0' }}>
      <main className="app-viewport">
        {/* Navigation Bar */}
        <Navbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          activeTab="Home"
        />

        {/* Hero Section */}
        <HeroSection
          onExploreClick={handleExplore}
          onHowItWorksClick={showHowItWorks}
        />

        {/* Featured Study Groups Preview Section */}
        <section style={{
          padding: '48px',
          background: '#ffffff',
          borderTop: '1px solid #f1f5f9'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '28px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#eb5757',
                fontWeight: 700,
                fontSize: '12px',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                marginBottom: '6px'
              }}>
                <Flame size={15} />
                <span>POPULAR STUDY GROUPS</span>
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0b1a30' }}>
                Join Active Student Circles
              </h2>
            </div>

            <button
              type="button"
              onClick={handleExplore}
              className="btn-outline"
              style={{ fontSize: '13px', padding: '8px 20px' }}
            >
              <span>View All Groups</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* 3 Simple, Clean Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px'
          }}>
            {featuredGroups.map((group) => (
              <div key={group.id} className="study-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    backgroundColor: '#f1f5f9',
                    color: '#0b1a30',
                    fontSize: '12px',
                    fontWeight: 700
                  }}>
                    {group.category}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748b' }}>
                    <Clock size={13} />
                    {group.schedule}
                  </span>
                </div>

                <h3
                  onClick={() => setViewingGroup(group)}
                  style={{ fontSize: '17px', fontWeight: 700, color: '#0b1a30', marginBottom: '6px', cursor: 'pointer' }}
                  onMouseOver={(e) => (e.currentTarget.style.color = '#0284c7')}
                  onMouseOut={(e) => (e.currentTarget.style.color = '#0b1a30')}
                >
                  {group.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#0284c7', fontWeight: 600, marginBottom: '8px' }}>
                  {group.subject} • {group.university}
                </p>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, marginBottom: '16px' }}>
                  {group.description}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '14px',
                  borderTop: '1px solid #f1f5f9'
                }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                    {group.membersCount}/{group.maxMembers} Members
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setViewingGroup(group)}
                      className="btn-outline"
                      style={{
                        padding: '6px 12px',
                        fontSize: '12px',
                        borderRadius: '9999px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Eye size={13} />
                      View
                    </button>

                    <button
                      type="button"
                      onClick={handleExplore}
                      className="btn-primary"
                      style={{ padding: '6px 16px', fontSize: '13px' }}
                    >
                      Join Group
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Modal: View Group Details */}
        <ViewGroupModal
          group={viewingGroup}
          onClose={() => setViewingGroup(null)}
          onToggleJoin={handleExplore}
        />

        {/* Clean Dark Footer */}
        <FindGroupPanel />
      </main>
    </div>
  );
};
