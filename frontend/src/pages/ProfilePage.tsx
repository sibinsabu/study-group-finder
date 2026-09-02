import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { FindGroupPanel } from '../components/FindGroupPanel';
import { useAuth } from '../context/AuthContext';
import type { StudyGroup } from '../data/mockData';
import { INITIAL_STUDY_GROUPS } from '../data/mockData';
import {
  CheckCircle2,
  ShieldCheck,
  User as UserIcon,
  BookOpen,
  GraduationCap,
  Sparkles,
  Save,
  LogOut,
  Users,
  Clock,
  ArrowLeft
} from 'lucide-react';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
];

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, updateProfile } = useAuth();

  // Form State
  const [name, setName] = useState(user?.name || '');
  const [university, setUniversity] = useState(user?.university || '');
  const [major, setMajor] = useState(user?.major || 'Computer Science & Engineering');
  const [year, setYear] = useState(user?.year || 'Junior');
  const [bio, setBio] = useState(
    user?.bio || 'Passionate student preparing for midterms and collaborative study sprints.'
  );
  const [avatar, setAvatar] = useState(
    user?.avatar || AVATAR_OPTIONS[0]
  );
  const [interests, setInterests] = useState(
    user?.interests ? user.interests.join(', ') : 'Algorithms, Calculus, Web Dev'
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Groups state
  const [groups, setGroups] = useState<StudyGroup[]>(() => {
    const saved = localStorage.getItem('studysphere_groups');
    return saved ? JSON.parse(saved) : INITIAL_STUDY_GROUPS;
  });

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
            Please log in or register to view and manage your student profile.
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

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      university: university.trim(),
      major: major.trim(),
      year: year.trim(),
      bio: bio.trim(),
      avatar,
      interests: interests.split(',').map(i => i.trim()).filter(Boolean)
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  const handleLeaveGroup = (groupId: string) => {
    const updated = groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          isJoined: false,
          membersCount: Math.max(1, g.membersCount - 1)
        };
      }
      return g;
    });
    setGroups(updated);
    localStorage.setItem('studysphere_groups', JSON.stringify(updated));
  };

  const joinedGroups = groups.filter(g => g.isJoined);

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', padding: '16px 0 32px 0' }}>
      <main className="app-viewport">
        {/* Top Navbar */}
        <Navbar />

        {/* Profile Hero Section */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={avatar}
                  alt={name}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '4px solid #ffffff',
                    boxShadow: '0 8px 20px rgba(11, 26, 48, 0.12)'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  border: '2px solid #ffffff'
                }} />
              </div>

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
                  marginBottom: '4px'
                }}>
                  <Sparkles size={14} />
                  <span>STUDENT PROFILE</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0b1a30' }}>
                    {name || user.name}
                  </h1>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    background: 'rgba(16, 185, 129, 0.12)',
                    color: '#10b981',
                    fontSize: '11px',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <CheckCircle2 size={12} />
                    Verified
                  </span>
                </div>

                <p style={{ fontSize: '13px', color: '#64748b' }}>
                  {user.email} • {university || user.university}
                </p>
              </div>
            </div>

            <Link
              to="/dashboard"
              className="btn-outline"
              style={{ fontSize: '13px', padding: '8px 18px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <ArrowLeft size={15} />
              Back to Dashboard
            </Link>
          </div>
        </section>

        {/* Profile Content Body */}
        <section style={{ padding: '36px 48px', background: '#ffffff' }}>
          {savedSuccess && (
            <div style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: '12px',
              padding: '12px 18px',
              marginBottom: '24px',
              color: '#065f46',
              fontSize: '14px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={18} color="#10b981" />
              <span>Profile updated successfully! Changes are saved to your account.</span>
            </div>
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '32px'
          }}>
            {/* Left: Edit Profile Form */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '28px',
              boxShadow: '0 4px 14px rgba(11, 26, 48, 0.04)'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0b1a30', marginBottom: '18px' }}>
                Edit Personal Information
              </h3>

              {/* Avatar Selector */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                  Choose Avatar
                </label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {AVATAR_OPTIONS.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Avatar option ${idx}`}
                      onClick={() => setAvatar(img)}
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        cursor: 'pointer',
                        border: avatar === img ? '3px solid #0b1a30' : '2px solid transparent',
                        padding: '1px',
                        transition: 'all 0.15s ease'
                      }}
                    />
                  ))}
                </div>
              </div>

              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Full Name
                    </label>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '10px',
                      padding: '8px 12px'
                    }}>
                      <UserIcon size={15} color="#64748b" style={{ marginRight: '8px' }} />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '13px', color: '#0f172a' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      University
                    </label>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '10px',
                      padding: '8px 12px'
                    }}>
                      <GraduationCap size={15} color="#64748b" style={{ marginRight: '8px' }} />
                      <input
                        type="text"
                        required
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '13px', color: '#0f172a' }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Major / Field of Study
                    </label>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '10px',
                      padding: '8px 12px'
                    }}>
                      <BookOpen size={15} color="#64748b" style={{ marginRight: '8px' }} />
                      <input
                        type="text"
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '13px', color: '#0f172a' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Year
                    </label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        background: '#f8fafc',
                        fontSize: '13px',
                        outline: 'none',
                        color: '#0f172a'
                      }}
                    >
                      <option value="Freshman">Freshman</option>
                      <option value="Sophomore">Sophomore</option>
                      <option value="Junior">Junior</option>
                      <option value="Senior">Senior</option>
                      <option value="Graduate">Graduate</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Study Interests (comma separated)
                  </label>
                  <input
                    type="text"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      background: '#f8fafc',
                      fontSize: '13px',
                      outline: 'none',
                      color: '#0f172a'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    About / Study Goals
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      background: '#f8fafc',
                      fontSize: '13px',
                      outline: 'none',
                      resize: 'none',
                      color: '#0f172a'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', padding: '10px', marginTop: '4px', fontSize: '14px' }}
                >
                  <Save size={15} />
                  Save Profile Changes
                </button>
              </form>
            </div>

            {/* Right Column: Enrolled Groups & Security Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Enrolled Study Groups */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 4px 14px rgba(11, 26, 48, 0.04)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={16} color="#0b1a30" />
                    <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0b1a30' }}>
                      My Study Circles ({joinedGroups.length})
                    </h3>
                  </div>
                  <Link to="/dashboard" style={{ fontSize: '12px', fontWeight: 600, color: '#0284c7', textDecoration: 'none' }}>
                    Explore More
                  </Link>
                </div>

                {joinedGroups.length === 0 ? (
                  <p style={{ fontSize: '13px', color: '#64748b' }}>
                    You have not joined any study circles yet. Visit the dashboard to discover groups!
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {joinedGroups.map(grp => (
                      <div
                        key={grp.id}
                        style={{
                          padding: '12px',
                          background: '#f8fafc',
                          borderRadius: '12px',
                          border: '1px solid #f1f5f9',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0b1a30' }}>{grp.title}</h4>
                          <p style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <Clock size={11} /> {grp.schedule}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleLeaveGroup(grp.id)}
                          style={{
                            background: 'none',
                            border: '1px solid #fecaca',
                            color: '#ef4444',
                            borderRadius: '9999px',
                            padding: '4px 10px',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Leave
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Database & Account Status */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 4px 14px rgba(11, 26, 48, 0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <ShieldCheck size={16} color="#10b981" />
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0b1a30' }}>
                    Account & Security
                  </h3>
                </div>

                <div style={{
                  background: '#f8fafc',
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  fontSize: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Account Status:</span>
                    <span style={{ color: '#10b981', fontWeight: 700 }}>Verified Student (Active)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>MongoDB Connection:</span>
                    <span style={{ color: '#0b1a30', fontWeight: 600 }}>Encrypted & Synchronized</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Database ID:</span>
                    <span style={{ color: '#64748b', fontFamily: 'monospace' }}>{user.id}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '9999px',
                    background: '#ffffff',
                    border: '1px solid #fecaca',
                    color: '#ef4444',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Clean Footer */}
        <FindGroupPanel />
      </main>
    </div>
  );
};
