import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { FindGroupPanel } from '../components/FindGroupPanel';
import { ViewGroupModal } from '../components/ViewGroupModal';
import { useAuth } from '../context/AuthContext';
import type { StudyGroup } from '../data/mockData';
import { INITIAL_STUDY_GROUPS } from '../data/mockData';
import { Clock, Plus, Users, X, Sparkles, CheckCircle2, Eye } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [groups, setGroups] = useState<StudyGroup[]>(() => {
    const saved = localStorage.getItem('studysphere_groups');
    return saved ? JSON.parse(saved) : INITIAL_STUDY_GROUPS;
  });

  // Selected Group for "View Group" modal
  const [viewingGroup, setViewingGroup] = useState<StudyGroup | null>(null);

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

  // Toggle Join
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

    // Also update currently open modal if any
    if (viewingGroup && viewingGroup.id === id) {
      setViewingGroup(prev => prev ? {
        ...prev,
        isJoined: !prev.isJoined,
        membersCount: !prev.isJoined ? prev.membersCount + 1 : Math.max(1, prev.membersCount - 1)
      } : null);
    }
  };

  // Create New Group
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
      description: newDescription.trim() || 'Collaborative course study group.',
      isJoined: true,
      topics: ['Course Fundamentals', 'Midterm Prep', 'Homework Discussions'],
      meetingRoom: 'Room #Live (Online Virtual Room)'
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
          background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
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
                color: '#eb5757',
                fontWeight: 700,
                fontSize: '12px',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                marginBottom: '8px'
              }}>
                <Sparkles size={14} />
                <span>STUDENT DASHBOARD • {user.university}</span>
              </div>
              <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0b1a30', marginBottom: '6px' }}>
                Welcome back, {user.name}! 👋
              </h1>
              <p style={{ fontSize: '14px', color: '#64748b' }}>
                Find and collaborate with peers in your course study groups.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCreateModalOpen(true)}
              className="btn-primary"
              style={{ padding: '10px 22px', fontSize: '14px' }}
            >
              <Plus size={16} />
              Create Study Group
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
            {filteredGroups.map((group) => (
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
          onToggleJoin={handleToggleJoin}
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
