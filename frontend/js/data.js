/**
 * StudySphere - Data Management Module
 * Manages study groups, categories, enrollment, workshops, and localStorage synchronization.
 */

const STORAGE_KEY_GROUPS = 'studysphere_groups';

export const DEFAULT_STUDY_GROUPS = [
  {
    id: 'grp-1',
    title: 'Algorithms & LeetCode Sprint',
    subject: 'Data Structures & Algorithms',
    category: 'Computer Science',
    university: 'Stanford & MIT',
    schedule: 'Mon & Wed • 6:00 PM',
    membersCount: 4,
    maxMembers: 6,
    description: 'Weekly practice on dynamic programming, trees, graph algorithms, and technical interview problems.',
    isJoined: true,
    createdBy: 'mentor-default',
    creatorName: 'Senior Academic Mentor',
    creatorRole: 'mentor',
    topics: ['Dynamic Programming', 'Graph Theory', 'Trees & Tries', 'System Design Basics'],
    meetingRoom: 'Room #1 (Zoom / Live Scratchpad)',
    members: [
      { id: 'm-1', name: 'Senior Academic Mentor', email: 'mentor@university.edu', role: 'mentor', joinedAt: 'Creator / Host', university: 'Stanford & MIT' },
      { id: 'm-2', name: 'Sarah Lin', email: 'sarah.lin@stanford.edu', role: 'student', joinedAt: 'Oct 1, 2026', university: 'Stanford' },
      { id: 'm-3', name: 'Marcus Vance', email: 'marcus@mit.edu', role: 'student', joinedAt: 'Oct 3, 2026', university: 'MIT' },
      { id: 'm-4', name: 'Elena Rostova', email: 'elena@stanford.edu', role: 'student', joinedAt: 'Oct 4, 2026', university: 'Stanford' }
    ],
    events: [
      {
        id: 'ev-1',
        title: 'Dynamic Programming & Graph Patterns Masterclass',
        description: 'Deep-dive 2-hour interactive workshop breaking down 2D memoization and Dijkstra graphs.',
        date: 'Thursday • 6:30 PM',
        time: '90 mins',
        linkOrLocation: 'Live Zoom Room #1'
      },
      {
        id: 'ev-2',
        title: 'System Design Fundamentals Workshop',
        description: 'Mentored review on caching, database sharding, and CAP theorem trade-offs.',
        date: 'Saturday • 4:00 PM',
        time: '60 mins',
        linkOrLocation: 'Discord Voice & Miro Board'
      }
    ]
  },
  {
    id: 'grp-2',
    title: 'Multivariable Calculus Circle',
    subject: 'Calculus III & Linear Algebra',
    category: 'Mathematics',
    university: 'UC Berkeley',
    schedule: 'Tue & Thu • 5:00 PM',
    membersCount: 4,
    maxMembers: 6,
    description: 'Collaborative problem solving on Green theorem, vector fields, multiple integrals, and exam prep.',
    isJoined: true,
    createdBy: 'mentor-default',
    creatorName: 'Senior Academic Mentor',
    creatorRole: 'mentor',
    topics: ["Green's Theorem", 'Surface Integrals', 'Eigenvalues', 'Vector Calculus'],
    meetingRoom: 'Room #3 (Google Meet)',
    members: [
      { id: 'm-1', name: 'Senior Academic Mentor', email: 'mentor@university.edu', role: 'mentor', joinedAt: 'Creator / Host', university: 'UC Berkeley' },
      { id: 'm-5', name: 'David K.', email: 'david.k@berkeley.edu', role: 'student', joinedAt: 'Oct 2, 2026', university: 'UC Berkeley' },
      { id: 'm-6', name: 'Priya Sharma', email: 'priya@berkeley.edu', role: 'student', joinedAt: 'Oct 3, 2026', university: 'UC Berkeley' },
      { id: 'm-7', name: 'Liam O\'Connor', email: 'liam@berkeley.edu', role: 'student', joinedAt: 'Oct 5, 2026', university: 'UC Berkeley' }
    ],
    events: [
      {
        id: 'ev-3',
        title: 'Vector Field Calculus & Stokes Theorem Problem Set Sprints',
        description: 'Guided problem set solving session for upcoming midterm examination.',
        date: 'Tuesday • 5:00 PM',
        time: '60 mins',
        linkOrLocation: 'Google Meet #3'
      }
    ]
  },
  {
    id: 'grp-3',
    title: 'Machine Learning & PyTorch Cohort',
    subject: 'AI & Deep Learning',
    category: 'AI & Data Science',
    university: 'Carnegie Mellon',
    schedule: 'Fridays • 4:00 PM',
    membersCount: 3,
    maxMembers: 8,
    description: 'Hands-on neural network architectures, backprop mechanics, PyTorch labs, and paper discussions.',
    isJoined: false,
    createdBy: 'mentor-other',
    creatorName: 'Dr. Aris Thorne',
    creatorRole: 'mentor',
    topics: ['Backpropagation', 'Transformers', 'CNNs & Vision', 'PyTorch GPU Training'],
    meetingRoom: 'Room #4 (Discord Voice & Screen Share)',
    members: [
      { id: 'm-8', name: 'Dr. Aris Thorne', email: 'thorne@cmu.edu', role: 'mentor', joinedAt: 'Host', university: 'Carnegie Mellon' },
      { id: 'm-9', name: 'Rahul Patel', email: 'rahul.p@cmu.edu', role: 'student', joinedAt: 'Oct 2, 2026', university: 'Carnegie Mellon' },
      { id: 'm-10', name: 'Chloe Dubois', email: 'chloe@cmu.edu', role: 'student', joinedAt: 'Oct 5, 2026', university: 'Carnegie Mellon' }
    ],
    events: [
      {
        id: 'ev-4',
        title: 'PyTorch Backprop & Custom Autograd Workshop',
        description: 'Hands-on coding session implementing custom backpropagation and loss tensors from scratch.',
        date: 'Friday • 4:00 PM',
        time: '75 mins',
        linkOrLocation: 'Google Meet #4'
      }
    ]
  },
  {
    id: 'grp-4',
    title: 'Organic Chemistry Reaction Mechanisms',
    subject: 'Organic Chemistry II',
    category: 'Chemistry',
    university: 'Johns Hopkins',
    schedule: 'Sun & Wed • 7:00 PM',
    membersCount: 3,
    maxMembers: 5,
    description: 'Mastering carbonyl reactions, synthesis retrosynthesis pathways, and MCAT prep.',
    isJoined: false,
    topics: ['Carbonyl Addition', 'Aldol Condensations', 'Retrosynthesis', 'Spectroscopy NMR'],
    meetingRoom: 'Room #2 (Zoom)',
    members: [
      { id: 'm-11', name: 'Dr. Evelyn Vance', email: 'evance@jhu.edu', role: 'mentor', joinedAt: 'Host', university: 'Johns Hopkins' },
      { id: 'm-12', name: 'Samira Gomez', email: 'sgomez@jhu.edu', role: 'student', joinedAt: 'Oct 3, 2026', university: 'Johns Hopkins' },
      { id: 'm-13', name: 'Noah Weiss', email: 'noah@jhu.edu', role: 'student', joinedAt: 'Oct 4, 2026', university: 'Johns Hopkins' }
    ],
    events: []
  },
  {
    id: 'grp-5',
    title: 'Full-Stack Web Dev & Cloud Labs',
    subject: 'Software Engineering',
    category: 'Computer Science',
    university: 'Univ of Washington',
    schedule: 'Saturdays • 2:00 PM',
    membersCount: 3,
    maxMembers: 6,
    description: 'Building microservices, Spring Boot backends, HTML5/CSS3 interfaces, and database integrations.',
    isJoined: false,
    topics: ['Spring Boot REST APIs', 'HTML5 Semantic UI', 'MongoDB Queries', 'Docker & Cloud Deploy'],
    meetingRoom: 'Room #5 (Live Collaboration)',
    members: [
      { id: 'm-14', name: 'Alex Wong', email: 'alexw@uw.edu', role: 'mentor', joinedAt: 'Host', university: 'Univ of Washington' },
      { id: 'm-15', name: 'Jordan Hayes', email: 'jhayes@uw.edu', role: 'student', joinedAt: 'Oct 2, 2026', university: 'Univ of Washington' },
      { id: 'm-16', name: 'Tanya Smith', email: 'tsmith@uw.edu', role: 'student', joinedAt: 'Oct 4, 2026', university: 'Univ of Washington' }
    ],
    events: []
  },
  {
    id: 'grp-6',
    title: 'Corporate Finance & Valuation Models',
    subject: 'Finance & Economics',
    category: 'Business',
    university: 'NYU Stern',
    schedule: 'Tuesdays • 6:30 PM',
    membersCount: 2,
    maxMembers: 5,
    description: 'DCF valuation models, financial statement analysis, and Excel modeling sprints.',
    isJoined: false,
    topics: ['DCF Modeling', 'WACC Calculations', 'LBO Analysis', 'Financial Statement Analysis'],
    meetingRoom: 'Room #6 (Google Meet)',
    members: [
      { id: 'm-17', name: 'Jonathan Pierce', email: 'jpierce@nyu.edu', role: 'mentor', joinedAt: 'Host', university: 'NYU Stern' },
      { id: 'm-18', name: 'Maya Lin', email: 'mlin@nyu.edu', role: 'student', joinedAt: 'Oct 3, 2026', university: 'NYU Stern' }
    ],
    events: []
  }
];

export function getGroups() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GROUPS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(DEFAULT_STUDY_GROUPS));
      return DEFAULT_STUDY_GROUPS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading groups from localStorage:', e);
    return DEFAULT_STUDY_GROUPS;
  }
}

export function saveGroups(groups) {
  try {
    localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(groups));
  } catch (e) {
    console.error('Error saving groups to localStorage:', e);
  }
}

export function getGroupById(id) {
  const groups = getGroups();
  return groups.find(g => g.id === id) || null;
}

export function toggleJoinGroup(groupId, currentUser) {
  const groups = getGroups();
  let updatedGroup = null;

  const updated = groups.map(g => {
    if (g.id === groupId) {
      const isJoined = !g.isJoined;
      let members = g.members ? [...g.members] : [];

      if (isJoined && currentUser) {
        const alreadyIn = members.some(m => m.id === currentUser.id || m.email === currentUser.email);
        if (!alreadyIn) {
          members.push({
            id: currentUser.id || `u-${Date.now()}`,
            name: currentUser.name || 'Student Member',
            email: currentUser.email || 'student@university.edu',
            role: currentUser.role || 'student',
            joinedAt: 'Just now',
            university: currentUser.university || 'University'
          });
        }
      } else if (!isJoined && currentUser) {
        members = members.filter(m => m.id !== currentUser.id && m.email !== currentUser.email);
      }

      updatedGroup = {
        ...g,
        isJoined,
        members,
        membersCount: isJoined ? (g.membersCount + 1) : Math.max(1, g.membersCount - 1)
      };
      return updatedGroup;
    }
    return g;
  });

  saveGroups(updated);
  return updatedGroup;
}

export function createStudyGroup(groupData, currentUser) {
  const groups = getGroups();
  const newGroup = {
    id: `grp-${Date.now()}`,
    title: groupData.title,
    subject: groupData.subject,
    category: groupData.category || 'Computer Science',
    university: currentUser?.university || 'Open Campus',
    schedule: groupData.schedule || 'Flexible • Weekly',
    membersCount: 1,
    maxMembers: parseInt(groupData.maxMembers, 10) || 6,
    description: groupData.description,
    isJoined: true,
    createdBy: currentUser?.id || 'creator',
    creatorName: currentUser?.name || 'Group Host',
    creatorRole: currentUser?.role || 'student',
    topics: groupData.topics || [],
    meetingRoom: `Room #${Math.floor(Math.random() * 90 + 10)} (Online)`,
    members: [
      {
        id: currentUser?.id || `m-${Date.now()}`,
        name: currentUser?.name || 'Creator',
        email: currentUser?.email || 'host@university.edu',
        role: currentUser?.role || 'student',
        joinedAt: 'Creator / Host',
        university: currentUser?.university || 'University'
      }
    ],
    events: []
  };

  groups.unshift(newGroup);
  saveGroups(groups);
  return newGroup;
}

export function kickMemberFromGroup(groupId, memberId) {
  const groups = getGroups();
  let updatedGroup = null;

  const updated = groups.map(g => {
    if (g.id === groupId) {
      const remaining = (g.members || []).filter(m => m.id !== memberId);
      updatedGroup = {
        ...g,
        members: remaining,
        membersCount: Math.max(1, remaining.length)
      };
      return updatedGroup;
    }
    return g;
  });

  saveGroups(updated);
  return updatedGroup;
}

export function addEventToGroup(groupId, eventData) {
  const groups = getGroups();
  let updatedGroup = null;
  const newEvent = {
    id: `ev-${Date.now()}`,
    title: eventData.title,
    description: eventData.description,
    date: eventData.date,
    time: eventData.time || '60 mins',
    linkOrLocation: eventData.linkOrLocation || 'Virtual Room'
  };

  const updated = groups.map(g => {
    if (g.id === groupId) {
      const existing = g.events || [];
      updatedGroup = {
        ...g,
        events: [...existing, newEvent]
      };
      return updatedGroup;
    }
    return g;
  });

  saveGroups(updated);
  return updatedGroup;
}

export function deleteEventFromGroup(groupId, eventId) {
  const groups = getGroups();
  let updatedGroup = null;

  const updated = groups.map(g => {
    if (g.id === groupId) {
      const remaining = (g.events || []).filter(e => e.id !== eventId);
      updatedGroup = {
        ...g,
        events: remaining
      };
      return updatedGroup;
    }
    return g;
  });

  saveGroups(updated);
  return updatedGroup;
}
