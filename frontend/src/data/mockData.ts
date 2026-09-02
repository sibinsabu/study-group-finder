export interface StudyGroup {
  id: string;
  title: string;
  subject: string;
  category: string;
  university: string;
  schedule: string;
  membersCount: number;
  maxMembers: number;
  description: string;
  isJoined?: boolean;
  topics?: string[];
  meetingRoom?: string;
}

export const INITIAL_STUDY_GROUPS: StudyGroup[] = [
  {
    id: 'grp-1',
    title: 'Algorithms & LeetCode Sprint',
    subject: 'Data Structures & Algorithms',
    category: 'Computer Science',
    university: 'Stanford & MIT',
    schedule: 'Mon & Wed • 6:00 PM',
    membersCount: 5,
    maxMembers: 6,
    description: 'Weekly practice on dynamic programming, trees, graph algorithms, and technical interview problems.',
    isJoined: true,
    topics: ['Dynamic Programming', 'Graph Theory', 'Trees & Tries', 'System Design Basics'],
    meetingRoom: 'Room #1 (Zoom / Live Scratchpad)'
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
    topics: ['Green\'s Theorem', 'Surface Integrals', 'Eigenvalues', 'Vector Calculus'],
    meetingRoom: 'Room #3 (Google Meet)'
  },
  {
    id: 'grp-3',
    title: 'Machine Learning & PyTorch Cohort',
    subject: 'AI & Deep Learning',
    category: 'AI & Data Science',
    university: 'Carnegie Mellon',
    schedule: 'Fridays • 4:00 PM',
    membersCount: 6,
    maxMembers: 8,
    description: 'Hands-on neural network architectures, backprop mechanics, PyTorch labs, and paper discussions.',
    isJoined: false,
    topics: ['Backpropagation', 'Transformers', 'CNNs & Vision', 'PyTorch GPU Training'],
    meetingRoom: 'Room #4 (Discord Voice & Screen Share)'
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
    meetingRoom: 'Room #2 (Zoom)'
  },
  {
    id: 'grp-5',
    title: 'Full-Stack Web Dev & Cloud Labs',
    subject: 'Software Engineering',
    category: 'Computer Science',
    university: 'Univ of Washington',
    schedule: 'Saturdays • 2:00 PM',
    membersCount: 4,
    maxMembers: 6,
    description: 'Building microservices, Spring Boot backends, React interfaces, and database integrations.',
    isJoined: false,
    topics: ['Spring Boot REST APIs', 'React State', 'MongoDB Queries', 'Docker & Cloud Deploy'],
    meetingRoom: 'Room #5 (Live Collaboration)'
  },
  {
    id: 'grp-6',
    title: 'Corporate Finance & Valuation Models',
    subject: 'Finance & Economics',
    category: 'Business',
    university: 'NYU Stern',
    schedule: 'Tuesdays • 6:30 PM',
    membersCount: 3,
    maxMembers: 5,
    description: 'DCF valuation models, financial statement analysis, and Excel modeling sprints.',
    isJoined: false,
    topics: ['DCF Modeling', 'WACC Calculations', 'LBO Analysis', 'Financial Statement Analysis'],
    meetingRoom: 'Room #6 (Google Meet)'
  }
];
