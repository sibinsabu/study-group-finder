import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { FindGroupPanel } from '../components/FindGroupPanel';
import { ViewGroupModal } from '../components/ViewGroupModal';
import { useAuth } from '../context/AuthContext';
import type { StudyGroup } from '../data/mockData';
import { INITIAL_STUDY_GROUPS } from '../data/mockData';
import {
  Clock,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Plus,
  BookOpen,
  Eye
} from 'lucide-react';

export const MyGroupsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const [groups, setGroups] = useState<StudyGroup[]>(() => {
    const saved = localStorage.getItem('studysphere_groups');
    return saved ? JSON.parse(saved) : INITIAL_STUDY_GROUPS;
  });

  const [viewingGroup, setViewingGroup] = useState<StudyGroup | null>(null);

  if (!isAuthenticated || !user) {
    return (
      <div className="grid-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
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
          <h2 style={{ color: '#0b1a30', marginBottom: '8px', fontSize: '22px', fontWeight: 800 }}>
            Session Required
          </h2>
          <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '14px' }}>
            Please log in or register to view your joined study groups.
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

  // Toggle Leave Group
  const handleToggleJoin = (id: string) => {
    const updated = groups.map(g => {
      if (g.id === id) {
        const isJoined = !g.isJoined;
        return {
          ...g,
          isJoined,
          membersCount: isJoined ? g.membersCount + 1 : Math.max(1, g.membersCount - 1)
        };
      }
      return g;
    });
    setGroups(updated);
    localStorage.setItem('studysphere_groups', JSON.stringify(updated));

    if (viewingGroup && viewingGroup.id === id) {
      setViewingGroup(prev => prev ? {
        ...prev,
        isJoined: !prev.isJoined,
        membersCount: !prev.isJoined ? prev.membersCount + 1 : Math.max(1, prev.membersCount - 1)
      } : null);
    }
  };

  const joinedGroups = groups.filter(g =>
    g.isJoined &&
    (!searchTerm ||
      g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.university.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', padding: '16px 0 32px 0' }}>
      <main className="app-viewport">
        {/* Navigation Bar */}
        <Navbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          activeTab="My Groups"
        />

        {/* Header Section */}
        <section style={{
          padding: '36px 48px',
          background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
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
                marginBottom: '8px'
              }}>
                <Sparkles size={14} />
                <span>MY ACTIVE ENROLLMENTS</span>
              </div>
              <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0b1a30', marginBottom: '6px' }}>
                My Joined Study Groups
              </h1>
              <p style={{ fontSize: '14px', color: '#64748b' }}>
                You are currently enrolled in <strong style={{ color: '#0b1a30' }}>{joinedGroups.length}</strong> study circles.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <Link
                to="/dashboard"
                className="btn-primary"
                style={{ padding: '10px 20px', fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={16} />
                Find More Groups
              </Link>
            </div>
          </div>
        </section>

        {/* Joined Groups List Section */}
        <section style={{ padding: '36px 48px', background: '#ffffff', minHeight: '380px' }}>
          {joinedGroups.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              maxWidth: '480px',
              margin: '0 auto',
              background: '#f8fafc',
              borderRadius: '20px',
              border: '1px dashed #cbd5e1'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'rgba(235, 87, 87, 0.1)',
                color: '#eb5757',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}>
                <BookOpen size={28} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0b1a30', marginBottom: '8px' }}>
                No Study Groups Joined Yet
              </h3>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.5, marginBottom: '24px' }}>
                Browse our university course circles and join peers for weekly problem solving and exam sprints.
              </p>
              <Link
                to="/dashboard"
                className="btn-primary"
                style={{ padding: '10px 24px', fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <span>Browse All Study Groups</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '20px'
            }}>
              {joinedGroups.map((group) => (
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
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      backgroundColor: '#ecfdf5',
                      color: '#065f46',
                      fontSize: '11px',
                      fontWeight: 700
                    }}>
                      <CheckCircle2 size={12} color="#10b981" />
                      Enrolled
                    </span>
                  </div>

                  <h3
                    onClick={() => setViewingGroup(group)}
                    style={{
                      fontSize: '17px',
                      fontWeight: 700,
                      color: '#0b1a30',
                      marginBottom: '4px',
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = '#0284c7')}
                    onMouseOut={(e) => (e.currentTarget.style.color = '#0b1a30')}
                  >
                    {group.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#0284c7', fontWeight: 600, marginBottom: '8px' }}>
                    {group.subject} • {group.university}
                  </p>
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, marginBottom: '16px', minHeight: '38px' }}>
                    {group.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                    color: '#64748b',
                    marginBottom: '14px'
                  }}>
                    <Clock size={13} />
                    <span>{group.schedule}</span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '14px',
                    borderTop: '1px solid #f1f5f9',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                      <Users size={15} />
                      <span>{group.membersCount}/{group.maxMembers}</span>
                    </div>

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
                        onClick={() => handleToggleJoin(group.id)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          border: '1px solid #fecaca',
                          backgroundColor: '#ffffff',
                          color: '#ef4444',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                      >
                        Leave
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Modal: View Group Details */}
        <ViewGroupModal
          group={viewingGroup}
          onClose={() => setViewingGroup(null)}
          onToggleJoin={handleToggleJoin}
        />

        {/* Dark Footer */}
        <FindGroupPanel />
      </main>
    </div>
  );
};
