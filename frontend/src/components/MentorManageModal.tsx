import React, { useState } from 'react';
import type { StudyGroup, GroupMember, GroupEvent } from '../data/mockData';
import {
  X,
  Users,
  UserX,
  Calendar,
  Plus,
  Trash2,
  Clock,
  Video,
  Award,
  CheckCircle2
} from 'lucide-react';

interface MentorManageModalProps {
  group: StudyGroup | null;
  onClose: () => void;
  onKickMember: (groupId: string, memberId: string) => void;
  onAddEvent: (groupId: string, event: Omit<GroupEvent, 'id'>) => void;
  onDeleteEvent: (groupId: string, eventId: string) => void;
}

export const MentorManageModal: React.FC<MentorManageModalProps> = ({
  group,
  onClose,
  onKickMember,
  onAddEvent,
  onDeleteEvent
}) => {
  const [activeTab, setActiveTab] = useState<'members' | 'events'>('members');

  // New Event Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState('Friday • 5:00 PM');
  const [eventTime, setEventTime] = useState('60 mins');
  const [eventLink, setEventLink] = useState('Room #1 (Live Interactive Room)');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!group) return null;

  const members: GroupMember[] = group.members || [];
  const events: GroupEvent[] = group.events || [];

  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDescription.trim()) return;

    onAddEvent(group.id, {
      title: eventTitle.trim(),
      description: eventDescription.trim(),
      date: eventDate.trim(),
      time: eventTime.trim(),
      linkOrLocation: eventLink.trim()
    });

    setFeedbackMsg(`Workshop "${eventTitle}" published successfully!`);
    setTimeout(() => setFeedbackMsg(null), 3000);

    setEventTitle('');
    setEventDescription('');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(11, 26, 48, 0.7)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '32px',
          maxWidth: '680px',
          width: '100%',
          boxShadow: '0 25px 60px -15px rgba(11, 26, 48, 0.35)',
          border: '1px solid #e2e8f0',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748b'
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
        >
          <X size={18} />
        </button>

        {/* Header Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 12px',
            borderRadius: '9999px',
            background: 'rgba(235, 87, 87, 0.1)',
            color: '#eb5757',
            fontSize: '12px',
            fontWeight: 700,
            border: '1px solid rgba(235, 87, 87, 0.25)'
          }}>
            <Award size={13} />
            MENTOR LEAD MANAGEMENT
          </span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            {group.category} • {group.university}
          </span>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0b1a30', marginBottom: '4px' }}>
          {group.title}
        </h2>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
          Manage enrolled members and schedule group events & workshops.
        </p>

        {feedbackMsg && (
          <div style={{
            padding: '10px 14px',
            borderRadius: '10px',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px'
          }}>
            <CheckCircle2 size={16} color="#10b981" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Tab Switcher: Members vs Workshops */}
        <div style={{
          display: 'flex',
          background: '#f1f5f9',
          borderRadius: '12px',
          padding: '4px',
          gap: '4px',
          marginBottom: '24px'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('members')}
            style={{
              flex: 1,
              padding: '10px 16px',
              border: 'none',
              borderRadius: '9px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: activeTab === 'members' ? '#ffffff' : 'transparent',
              color: activeTab === 'members' ? '#0b1a30' : '#64748b',
              boxShadow: activeTab === 'members' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <Users size={16} color={activeTab === 'members' ? '#eb5757' : '#64748b'} />
            <span>Enrolled Members ({members.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('events')}
            style={{
              flex: 1,
              padding: '10px 16px',
              border: 'none',
              borderRadius: '9px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: activeTab === 'events' ? '#ffffff' : 'transparent',
              color: activeTab === 'events' ? '#0b1a30' : '#64748b',
              boxShadow: activeTab === 'events' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <Calendar size={16} color={activeTab === 'events' ? '#eb5757' : '#64748b'} />
            <span>Workshops & Events ({events.length})</span>
          </button>
        </div>

        {/* TAB 1: MEMBERS MANAGEMENT */}
        {activeTab === 'members' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '14px'
            }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                Active Student & Peer Roster
              </span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Capacity: {group.membersCount} / {group.maxMembers}
              </span>
            </div>

            {members.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '36px 20px',
                background: '#f8fafc',
                borderRadius: '16px',
                border: '1px dashed #cbd5e1',
                color: '#64748b'
              }}>
                <Users size={32} color="#94a3b8" style={{ margin: '0 auto 10px auto' }} />
                <p style={{ fontSize: '14px', fontWeight: 600 }}>No members have joined this group yet.</p>
                <p style={{ fontSize: '12px', marginTop: '4px' }}>Students who enroll will appear here.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {members.map((member) => (
                  <div
                    key={member.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: '14px',
                      background: member.role === 'mentor' ? 'rgba(235, 87, 87, 0.04)' : '#f8fafc',
                      border: member.role === 'mentor' ? '1px solid rgba(235, 87, 87, 0.2)' : '1px solid #e2e8f0',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {/* Avatar */}
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: member.role === 'mentor' ? '#eb5757' : '#0b1a30',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 700
                      }}>
                        {member.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0b1a30' }}>
                            {member.name}
                          </h4>
                          {member.role === 'mentor' && (
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              background: 'rgba(235, 87, 87, 0.1)',
                              color: '#eb5757',
                              padding: '2px 8px',
                              borderRadius: '9999px'
                            }}>
                              Lead Mentor (Host)
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '12px', color: '#64748b' }}>
                          {member.email} {member.university ? `• ${member.university}` : ''}
                        </p>
                      </div>
                    </div>

                    {/* Action: Kick Button (Only for students, mentor cannot kick self) */}
                    <div>
                      {member.role !== 'mentor' ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove "${member.name}" from this study group?`)) {
                              onKickMember(group.id, member.id);
                              setFeedbackMsg(`"${member.name}" was removed from the study group.`);
                              setTimeout(() => setFeedbackMsg(null), 3000);
                            }
                          }}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            background: '#fee2e2',
                            color: '#b91c1c',
                            border: '1px solid #fca5a5',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#ef4444';
                            e.currentTarget.style.color = '#ffffff';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#fee2e2';
                            e.currentTarget.style.color = '#b91c1c';
                          }}
                        >
                          <UserX size={14} />
                          <span>Kick Member</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>
                          Circle Creator
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: EVENTS & WORKSHOPS */}
        {activeTab === 'events' && (
          <div>
            {/* List Existing Events */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#334155', marginBottom: '12px' }}>
                Scheduled Workshops & Review Sprints
              </h3>

              {events.length === 0 ? (
                <div style={{
                  padding: '24px',
                  background: '#f8fafc',
                  border: '1px dashed #cbd5e1',
                  borderRadius: '14px',
                  textAlign: 'center',
                  color: '#64748b'
                }}>
                  <Calendar size={28} color="#94a3b8" style={{ margin: '0 auto 8px auto' }} />
                  <p style={{ fontSize: '13px', fontWeight: 600 }}>No events scheduled yet.</p>
                  <p style={{ fontSize: '12px', marginTop: '2px' }}>Use the form below to publish your first workshop session.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {events.map((evt) => (
                    <div
                      key={evt.id}
                      style={{
                        padding: '16px',
                        borderRadius: '14px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <div>
                          <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0b1a30' }}>
                            {evt.title}
                          </h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#eb5757', fontWeight: 600 }}>
                              <Clock size={13} />
                              {evt.date} {evt.time ? `(${evt.time})` : ''}
                            </span>
                            {evt.linkOrLocation && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0284c7' }}>
                                <Video size={13} />
                                {evt.linkOrLocation}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete workshop "${evt.title}"?`)) {
                              onDeleteEvent(group.id, evt.id);
                              setFeedbackMsg(`Event "${evt.title}" deleted.`);
                              setTimeout(() => setFeedbackMsg(null), 3000);
                            }
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#94a3b8',
                            padding: '4px',
                            borderRadius: '6px'
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.color = '#ef4444')}
                          onMouseOut={(e) => (e.currentTarget.style.color = '#94a3b8')}
                          title="Delete Event"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, marginTop: '8px' }}>
                        {evt.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Create Event Form */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Plus size={16} color="#eb5757" />
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0b1a30' }}>
                  Schedule New Workshop or Event
                </h4>
              </div>

              <form onSubmit={handleCreateEventSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Workshop / Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Midterm Problem Solving Sprint & Graph Deep-Dive"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Event Description & Agenda *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe what concepts will be reviewed, problem sets covered, or agenda..."
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Date & Time
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Thursday • 6:30 PM"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Duration
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 60 mins"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Virtual Room / Platform
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Zoom Room #1"
                      value={eventLink}
                      onChange={(e) => setEventLink(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    marginTop: '6px',
                    padding: '11px',
                    borderRadius: '8px',
                    background: '#eb5757',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(235, 87, 87, 0.25)'
                  }}
                >
                  <Plus size={16} />
                  <span>Publish Workshop to Members</span>
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
