import React from 'react';
import type { StudyGroup } from '../data/mockData';
import {
  X,
  Clock,
  Users,
  Video,
  BookOpen,
  GraduationCap,
  CheckCircle2,
  Tag
} from 'lucide-react';

interface ViewGroupModalProps {
  group: StudyGroup | null;
  onClose: () => void;
  onToggleJoin?: (id: string) => void;
}

export const ViewGroupModal: React.FC<ViewGroupModalProps> = ({
  group,
  onClose,
  onToggleJoin
}) => {
  if (!group) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(11, 26, 48, 0.65)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '32px',
          maxWidth: '560px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(11, 26, 48, 0.25)',
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
            color: '#64748b',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
        >
          <X size={18} />
        </button>

        {/* Top Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <span style={{
            padding: '4px 12px',
            borderRadius: '9999px',
            backgroundColor: '#f1f5f9',
            color: '#0b1a30',
            fontSize: '12px',
            fontWeight: 700
          }}>
            {group.category}
          </span>

          {group.isJoined && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              borderRadius: '9999px',
              backgroundColor: '#ecfdf5',
              color: '#065f46',
              fontSize: '12px',
              fontWeight: 700
            }}>
              <CheckCircle2 size={13} color="#10b981" />
              You are Enrolled
            </span>
          )}
        </div>

        {/* Group Title */}
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0b1a30', lineHeight: 1.25, marginBottom: '8px' }}>
          {group.title}
        </h2>

        {/* Course & University */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#64748b', fontSize: '13px', marginBottom: '18px', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600, color: '#0284c7' }}>
            <BookOpen size={15} />
            {group.subject}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <GraduationCap size={15} />
            {group.university}
          </span>
        </div>

        {/* Description */}
        <div style={{
          backgroundColor: '#f8fafc',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '20px',
          border: '1px solid #f1f5f9'
        }}>
          <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
            About This Study Group
          </h4>
          <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>
            {group.description}
          </p>
        </div>

        {/* Schedule & Meeting Details */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{
            padding: '14px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>
              <Clock size={14} color="#0b1a30" />
              <span>Meeting Timetable</span>
            </div>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#0b1a30' }}>
              {group.schedule}
            </p>
          </div>

          <div style={{
            padding: '14px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>
              <Video size={14} color="#0284c7" />
              <span>Virtual Room</span>
            </div>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#0b1a30' }}>
              {group.meetingRoom || 'Virtual Zoom Room'}
            </p>
          </div>
        </div>

        {/* Topics Covered */}
        {group.topics && group.topics.length > 0 && (
          <div style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>
              <Tag size={14} />
              <span>Focus Syllabus & Topics</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {group.topics.map((topic, i) => (
                <span
                  key={i}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(56, 189, 248, 0.1)',
                    color: '#0369a1',
                    fontSize: '12px',
                    fontWeight: 600
                  }}
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Member Capacity */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          borderRadius: '14px',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={16} color="#0b1a30" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#0b1a30' }}>
              Member Capacity
            </span>
          </div>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#0284c7' }}>
            {group.membersCount} of {group.maxMembers} Students Enrolled
          </span>
        </div>

        {/* Actions Row */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {onToggleJoin && (
            <button
              type="button"
              onClick={() => onToggleJoin(group.id)}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: group.isJoined ? '#10b981' : '#0b1a30',
                backgroundColor: group.isJoined ? '#ecfdf5' : '#0b1a30',
                color: group.isJoined ? '#065f46' : '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
            >
              {group.isJoined ? (
                <>
                  <CheckCircle2 size={16} color="#10b981" />
                  <span>Enrolled • Leave Group</span>
                </>
              ) : (
                'Join This Study Group'
              )}
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="btn-outline"
            style={{ padding: '12px 24px', fontSize: '14px' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
