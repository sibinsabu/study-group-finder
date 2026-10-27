import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { FindGroupPanel } from '../components/FindGroupPanel';
import { ViewGroupModal } from '../components/ViewGroupModal';
import { MentorManageModal } from '../components/MentorManageModal';
import { useAuth } from '../context/AuthContext';
import type { StudyGroup, GroupEvent } from '../data/mockData';
import { INITIAL_STUDY_GROUPS } from '../data/mockData';
import {
  Clock,
  Plus,
  Users,
  X,
  Sparkles,
  CheckCircle2,
  Eye,
  Settings,
  ShieldCheck,
  Crown
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isMentor } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [groups, setGroups] = useState<StudyGroup[]>(() => {
    const saved = localStorage.getItem('studysphere_groups');
    return saved ? JSON.parse(saved) : INITIAL_STUDY_GROUPS;
  });

  // Selected Group for "View Group" modal
  const [viewingGroup, setViewingGroup] = useState<StudyGroup | null>(null);

  // Selected Group for "Mentor Manage" modal
  const [managingGroup, setManagingGroup] = useState<StudyGroup | null>(null);

  // Modal State for Create Group
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState('Computer Science');
  const [newSchedule, setNewSchedule] = useState('Tue & Thu • 6:00 PM');
  const [newMaxMembers, setNewMaxMembers] = useState(6);
  const [newDescription, setNewDescription] = useState('');

  // Unauthenticated Fallback
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
            Please log in or register to access the dashboard.
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

  // Toggle Join (Students or Mentors joining a group)
  const handleToggleJoin = (id: string) => {
    const updated = groups.map(g => {
      if (g.id === id) {
        const isJoined = !g.isJoined;
        let newMembers = g.members ? [...g.members] : [];
        if (isJoined) {
          const alreadyIn = newMembers.some(m => m.id === user.id || m.email === user.email);
          if (!alreadyIn) {
            newMembers.push({
              id: user.id || `u-${Date.now()}`,
              name: user.name,
              email: user.email,
              role: (user.role as 'student' | 'mentor') || 'student',
              joinedAt: 'Just now',
              university: user.university
            });
          }
        } else {
          newMembers = newMembers.filter(m => m.id !== user.id && m.email !== user.email);
        }

        return {
          ...g,
          isJoined,
          members: newMembers,
          membersCount: isJoined ? (g.membersCount + 1) : Math.max(1, g.membersCount - 1)
        };
      }
      return g;
    });

    setGroups(updated);
    localStorage.setItem('studysphere_groups', JSON.stringify(updated));

    // Also update currently open modals if any
    if (viewingGroup && viewingGroup.id === id) {
      const cur = updated.find(g => g.id === id) || null;
      setViewingGroup(cur);
    }
    if (managingGroup && managingGroup.id === id) {
      const cur = updated.find(g => g.id === id) || null;
      setManagingGroup(cur);
    }
  };

  // Kick / Remove Member from Group (Mentor Feature)
  const handleKickMember = (groupId: string, memberId: string) => {
    const updated = groups.map(g => {
      if (g.id === groupId) {
        const remainingMembers = (g.members || []).filter(m => m.id !== memberId);
        return {
          ...g,
          members: remainingMembers,
          membersCount: Math.max(1, remainingMembers.length)
        };
      }
      return g;
    });

    setGroups(updated);
    localStorage.setItem('studysphere_groups', JSON.stringify(updated));

    if (managingGroup && managingGroup.id === groupId) {
      const cur = updated.find(g => g.id === groupId) || null;
      setManagingGroup(cur);
    }
    if (viewingGroup && viewingGroup.id === groupId) {
      const cur = updated.find(g => g.id === groupId) || null;
      setViewingGroup(cur);
    }
  };

  // Add Workshop / Event to Group (Mentor Feature)
  const handleAddEvent = (groupId: string, eventData: Omit<GroupEvent, 'id'>) => {
    const newEvent: GroupEvent = {
      id: `evt-${Date.now()}`,
      ...eventData
    };

    const updated = groups.map(g => {
      if (g.id === groupId) {
        const existingEvents = g.events || [];
        return {
          ...g,
          events: [...existingEvents, newEvent]
        };
      }
      return g;
    });

    setGroups(updated);
    localStorage.setItem('studysphere_groups', JSON.stringify(updated));

    if (managingGroup && managingGroup.id === groupId) {
      const cur = updated.find(g => g.id === groupId) || null;
      setManagingGroup(cur);
    }
    if (viewingGroup && viewingGroup.id === groupId) {
      const cur = updated.find(g => g.id === groupId) || null;
      setViewingGroup(cur);
    }
  };

  // Delete Workshop / Event (Mentor Feature)
  const handleDeleteEvent = (groupId: string, eventId: string) => {
    const updated = groups.map(g => {
      if (g.id === groupId) {
        const remainingEvents = (g.events || []).filter(e => e.id !== eventId);
        return {
          ...g,
          events: remainingEvents
        };
      }
      return g;
    });

    setGroups(updated);
    localStorage.setItem('studysphere_groups', JSON.stringify(updated));

    if (managingGroup && managingGroup.id === groupId) {
      const cur = updated.find(g => g.id === groupId) || null;
      setManagingGroup(cur);
    }
    if (viewingGroup && viewingGroup.id === groupId) {
      const cur = updated.find(g => g.id === groupId) || null;
      setViewingGroup(cur);
    }
  };

  // Create New Group (Mentor or Student)
  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSubject.trim()) return;

    const newGroup: StudyGroup = {
      id: `grp-${Date.now()}`,
      title: newTitle.trim(),
      subject: newSubject.trim(),
      category: newCategory,
      university: user.university || 'University Network',
      schedule: newSchedule,
      membersCount: 1,
      maxMembers: Number(newMaxMembers) || 6,
      description: newDescription.trim() || (isMentor ? 'Official mentor-guided collaborative study circle.' : 'Collaborative course study group.'),
      isJoined: true,
      topics: ['Course Fundamentals', 'Midterm Prep', 'Homework Discussions'],
      meetingRoom: 'Room #Live (Online Virtual Room)',
      createdBy: user.id || user.email,
      creatorName: user.name,
      creatorRole: isMentor ? 'mentor' : 'student',
      members: [
        {
          id: user.id || `u-${Date.now()}`,
          name: user.name,
          email: user.email,
          role: isMentor ? 'mentor' : 'student',
          joinedAt: 'Group Creator & Host',
          university: user.university
        }
      ],
      events: []
    };

    const updated = [newGroup, ...groups];
    setGroups(updated);
    localStorage.setItem('studysphere_groups', JSON.stringify(updated));
    setCreateModalOpen(false);
    setNewTitle('');
    setNewSubject('');
    setNewDescription('');
  };

  const categories = ['All', 'My Groups', 'Computer Science', 'Mathematics', 'AI & Data Science', 'Chemistry', 'Business'];

  const filteredGroups = groups.filter(grp => {
    const matchesCategory = 
      selectedCategory === 'All' ? true :
      selectedCategory === 'My Groups' ? grp.isJoined :
      grp.category === selectedCategory;
    const matchesSearch = !searchTerm ||
      grp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grp.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grp.university.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', padding: '16px 0 32px 0' }}>
      <main className="app-viewport">
        {/* Navigation Bar */}
        <Navbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          activeTab="Study Groups"
        />

        {/* Dashboard Welcome Header */}
        <section style={{
          padding: '36px 48px',
          background: isMentor
            ? 'linear-gradient(180deg, #f0fdf4 0%, #f8fafc 100%)'
            : 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
          borderBottom: '1px solid #e2e8f0',
          position: 'relative'
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
                color: isMentor ? '#059669' : '#eb5757',
                fontWeight: 700,
                fontSize: '12px',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                marginBottom: '8px'
              }}>
                {isMentor ? <Crown size={15} color="#059669" /> : <Sparkles size={14} />}
                <span>
                  {isMentor ? 'MENTOR & INSTRUCTOR DASHBOARD' : 'STUDENT DASHBOARD'} • {user.university}
                </span>
              </div>
              <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0b1a30', marginBottom: '6px' }}>
                Welcome back, {user.name}! {isMentor ? '🎓' : '👋'}
              </h1>
              <p style={{ fontSize: '14px', color: '#64748b' }}>
                {isMentor
                  ? 'Manage your communities, monitor enrolled students, kick inactive members, and organize workshops.'
                  : 'Find and collaborate with peers in your course study groups.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCreateModalOpen(true)}
              className="btn-primary"
              style={{
                padding: '10px 22px',
                fontSize: '14px',
                backgroundColor: isMentor ? '#059669' : undefined,
                borderColor: isMentor ? '#059669' : undefined
              }}
            >
              <Plus size={16} />
              {isMentor ? 'Create Mentor Group' : 'Create Study Group'}
            </button>
          </div>
        </section>

        {/* Study Groups List Section */}
        <section style={{ padding: '36px 48px', background: '#ffffff' }}>
          {/* Category Filter Chips */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '28px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
              Showing {filteredGroups.length} Groups
            </span>
          </div>

          {/* Groups Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '20px'
          }}>
            {filteredGroups.map((group) => {
              const isCreatorOrLead = isMentor && (
                group.createdBy === user.id ||
                group.createdBy === user.email ||
                group.creatorName === user.name ||
                group.creatorRole === 'mentor' ||
                !group.createdBy
              );

              return (
                <div key={group.id} className="study-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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

                      {group.creatorRole === 'mentor' && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          backgroundColor: '#eff6ff',
                          color: '#1d4ed8',
                          fontSize: '11px',
                          fontWeight: 700
                        }}>
                          <ShieldCheck size={11} />
                          Mentor
                        </span>
                      )}

                      {(group.createdBy === user.id || group.createdBy === user.email || group.creatorName === user.name) && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          backgroundColor: '#fef3c7',
                          color: '#92400e',
                          fontSize: '11px',
                          fontWeight: 700
                        }}>
                          <Crown size={11} />
                          Yours
                        </span>
                      )}
                    </div>

                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748b' }}>
                      <Clock size={13} />
                      {group.schedule}
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
                    justifyContent: 'space-between',
                    paddingTop: '14px',
                    borderTop: '1px solid #f1f5f9',
                    gap: '8px',
                    flexWrap: 'wrap'
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

                      {/* Mentor Manage Action */}
                      {isCreatorOrLead && (
                        <button
                          type="button"
                          onClick={() => setManagingGroup(group)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '9999px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            border: '1px solid #059669',
                            backgroundColor: '#ecfdf5',
                            color: '#065f46',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <Settings size={13} />
                          Manage
                        </button>
                      )}

                      {/* Join / Leave toggle */}
                      {!isCreatorOrLead && (
                        <button
                          type="button"
                          onClick={() => handleToggleJoin(group.id)}
                          style={{
                            padding: '6px 16px',
                            borderRadius: '9999px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            border: '1px solid',
                            borderColor: group.isJoined ? '#10b981' : '#0b1a30',
                            backgroundColor: group.isJoined ? '#ecfdf5' : '#0b1a30',
                            color: group.isJoined ? '#065f46' : '#ffffff',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {group.isJoined ? (
                            <>
                              <CheckCircle2 size={13} color="#10b981" />
                              <span>Joined</span>
                            </>
                          ) : (
                            'Join'
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Modal: View Group Details */}
        <ViewGroupModal
          group={viewingGroup}
          onClose={() => setViewingGroup(null)}
          onToggleJoin={handleToggleJoin}
          isMentor={isMentor}
          onManageGroup={(g) => {
            setViewingGroup(null);
            setManagingGroup(g);
          }}
        />

        {/* Modal: Mentor Group Management (Kick Members, Create Workshops/Events) */}
        <MentorManageModal
          group={managingGroup}
          onClose={() => setManagingGroup(null)}
          onKickMember={handleKickMember}
          onAddEvent={handleAddEvent}
          onDeleteEvent={handleDeleteEvent}
        />


        {/* Modal: Create Study Group */}
        {createModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(11, 26, 48, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '32px',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(11, 26, 48, 0.3)',
              position: 'relative'
            }}>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                style={{
                  position: 'absolute',
                  top: '18px',
                  right: '18px',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                <X size={16} />
              </button>

              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0b1a30', marginBottom: '16px' }}>
                Create Study Group
              </h3>

              <form onSubmit={handleCreateGroup} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Group Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Algorithms & LeetCode Sprint"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Data Structures"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        fontSize: '14px',
                        outline: 'none',
                        background: '#ffffff'
                      }}
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="AI & Data Science">AI & Data Science</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Business">Business</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Schedule
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tue & Thu • 6:00 PM"
                      value={newSchedule}
                      onChange={(e) => setNewSchedule(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Max Members
                    </label>
                    <input
                      type="number"
                      min={2}
                      max={12}
                      value={newMaxMembers}
                      onChange={(e) => setNewMaxMembers(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of the study group..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14px',
                      outline: 'none',
                      resize: 'none'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', padding: '12px', marginTop: '6px' }}
                >
                  Create Group
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Clean Footer */}
        <FindGroupPanel />
      </main>
    </div>
  );
};
