import {
  User,
  Job,
  Application,
  Review,
  Dispute,
  JobFilters,
  VerificationStatus,
  Message,
  Notification,
} from '@/types';

const STORAGE_KEYS = {
  USERS: 'gsap_users_v2',
  JOBS: 'gsap_jobs_v2',
  APPLICATIONS: 'gsap_applications_v2',
  REVIEWS: 'gsap_reviews_v2',
  DISPUTES: 'gsap_disputes_v2',
  MESSAGES: 'gsap_messages_v2',
  NOTIFICATIONS: 'gsap_notifications_v2',
  SESSION: 'gsap_session_user_id_v2',
  INITIALIZED: 'gsap_initialized_v2',
};

// SSR-safe storage helpers
function isClient(): boolean {
  return typeof window !== 'undefined';
}

function getItem<T>(key: string, fallback: T): T {
  if (!isClient()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
  }
}

// ---------------------------------------------------------------------------
// Seed Data
// ---------------------------------------------------------------------------

const SEED_USERS: User[] = [
  {
    id: 'user_admin',
    name: 'Platform Administrator',
    email: 'admin@gsap.com',
    password: 'admin123',
    role: 'admin',
    dateOfBirth: '1992-05-14',
    age: 32,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Platform safety supervisor and administrator.',
    location: 'San Francisco, CA',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'user_client_sarah',
    name: 'Sarah Jenkins',
    email: 'sarah.client@example.com',
    password: 'client123',
    role: 'client',
    dateOfBirth: '1989-11-20',
    age: 34,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bio: 'Startup founder & marketing director looking for talented university students for project-based work.',
    location: 'Austin, TX',
    createdAt: '2024-01-10T10:00:00.000Z',
  },
  {
    id: 'user_client_raj',
    name: 'Raj Patel (UK Expat)',
    email: 'raj.expat@london.co.uk',
    password: 'client123',
    role: 'client',
    dateOfBirth: '1987-08-14',
    age: 37,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    bio: 'Software Architect based in London. Seeking trusted, university-verified local students in India to assist my retired mother with hospital visits and digital banking.',
    location: 'London, UK / Bangalore, IN',
    createdAt: '2024-01-12T11:00:00.000Z',
  },
  {
    id: 'user_client_marcus',
    name: 'Marcus Vance',
    email: 'marcus.client@example.com',
    password: 'client123',
    role: 'client',
    dateOfBirth: '1995-03-12',
    age: 29,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Engineering manager and boutique consultancy owner building web tools and research reports.',
    location: 'Seattle, WA',
    createdAt: '2024-01-15T12:00:00.000Z',
  },
  {
    id: 'user_student_alex',
    name: 'Alex Rivera',
    email: 'alex.dev@mit.edu',
    password: 'student123',
    role: 'student',
    dateOfBirth: '2003-04-18',
    age: 21,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    bio: 'Junior CS student at MIT specializing in React, Next.js, and TypeScript. Looking for front-end & full-stack projects.',
    location: 'Cambridge, MA',
    university: 'Massachusetts Institute of Technology (MIT)',
    degree: 'B.S. Computer Science',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js', 'Python'],
    hourlyRate: 35,
    verificationStatus: 'verified',
    verificationCertId: 'GSAP-MIT-2024-8901',
    verifiedAt: '2024-01-20T10:00:00.000Z',
    walletBalance: 300,
    createdAt: '2024-01-18T14:30:00.000Z',
  },
  {
    id: 'user_student_maya',
    name: 'Maya Lin',
    email: 'maya.design@risd.edu',
    password: 'student123',
    role: 'student',
    dateOfBirth: '2004-08-09',
    age: 20,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    bio: 'Senior Graphic Design student at RISD passionate about UI/UX, brand identity, slide decks, and marketing visuals.',
    location: 'Providence, RI',
    university: 'Rhode Island School of Design (RISD)',
    degree: 'B.F.A. Graphic Design',
    skills: ['Figma', 'UI/UX', 'Graphic Design', 'Brand Identity', 'Illustration', 'Canva'],
    hourlyRate: 28,
    verificationStatus: 'verified',
    verificationCertId: 'GSAP-RISD-2024-4421',
    verifiedAt: '2024-01-22T12:00:00.000Z',
    walletBalance: 504,
    createdAt: '2024-01-20T09:15:00.000Z',
  },
  {
    id: 'user_student_leo',
    name: 'Leo Chen',
    email: 'leo.tutor@stanford.edu',
    password: 'student123',
    role: 'student',
    dateOfBirth: '2002-12-05',
    age: 22,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'Senior Mathematics & Physics major at Stanford. 3 years experience tutoring college calculus, linear algebra, and providing trusted elderly tech & local concierge support.',
    location: 'Palo Alto, CA / Bangalore',
    university: 'Stanford University',
    degree: 'B.S. Applied Mathematics',
    skills: ['Calculus', 'Physics', 'Senior Tech Setup', 'Elderly Care', 'Tutoring', 'Data Entry'],
    hourlyRate: 30,
    verificationStatus: 'verified',
    verificationCertId: 'GSAP-STANFORD-2024-7712',
    verifiedAt: '2024-01-25T08:00:00.000Z',
    walletBalance: 120,
    createdAt: '2024-01-22T16:45:00.000Z',
  },
  {
    id: 'user_student_priya',
    name: 'Priya Sharma',
    email: 'priya.concierge@iisc.ac.in',
    password: 'student123',
    role: 'student',
    dateOfBirth: '2002-09-14',
    age: 22,
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    bio: 'Pre-med & Healthcare Sciences student at IISc Bangalore. Experienced in hospital clinics, elderly accompaniment, bilingual communication (Kannada, Hindi, English), and medication management.',
    location: 'Bangalore, India',
    university: 'Indian Institute of Science (IISc)',
    degree: 'B.S. Biomedical Sciences',
    skills: ['Bilingual (Kannada/English)', 'Healthcare Support', 'Elderly Companion', 'Clinic Escort', 'Empathy'],
    hourlyRate: 26,
    verificationStatus: 'verified',
    verificationCertId: 'GSAP-IISC-2024-9921',
    verifiedAt: '2024-01-28T11:00:00.000Z',
    walletBalance: 260,
    createdAt: '2024-01-25T10:00:00.000Z',
  },
];

const SEED_JOBS: Job[] = [
  {
    id: 'job_cb_1',
    clientId: 'user_client_raj',
    clientName: 'Raj Patel (UK Expat)',
    clientEmail: 'raj.expat@london.co.uk',
    title: 'Elderly Mother Hospital Accompaniment & Doctor Prescription Update',
    description: 'I live in London, UK, and need a compassionate, trusted university student in Bangalore to accompany my 71-year-old mother for her routine cardiology checkup at Manipal Hospital. You will assist with registration, note the doctor’s dosage instructions, pick up medicines from the clinic pharmacy, and do a quick 5-minute video call with me afterwards. Taxi fares reimbursed.',
    category: 'Family & Elderly Care',
    location: 'Bangalore, India (Indiranagar / HAL)',
    isRemote: false,
    hourlyRate: 25,
    estimatedHours: 4,
    requiredSkills: ['Elderly Care', 'Healthcare Support', 'Local Language (Kannada/Hindi/English)', 'Empathy'],
    status: 'open',
    isCrossBorder: true,
    crossBorderInfo: {
      senderLocation: 'London, United Kingdom',
      recipientLocation: 'Indiranagar, Bangalore, India',
      recipientRelation: 'Aging Mother (71 yrs)',
      languagePreference: 'Kannada & English',
      urgency: 'Standard',
    },
    escrowStatus: 'unfunded',
    createdAt: '2024-02-10T09:00:00.000Z',
    updatedAt: '2024-02-10T09:00:00.000Z',
  },
  {
    id: 'job_cb_2',
    clientId: 'user_client_raj',
    clientName: 'Raj Patel (UK Expat)',
    clientEmail: 'raj.expat@london.co.uk',
    title: 'Senior Citizen Digital Banking & Smartphone Fraud-Safety Setup',
    description: 'Looking for an ethical, tech-savvy college student to visit my retired parents at their home for 2 hours to help them set up their pension verification portal, organize secure two-factor authentication, and teach them how to identify WhatsApp financial scams. High trust and university background strictly required.',
    category: 'Family & Elderly Care',
    location: 'Bangalore, India (Jayanagar)',
    isRemote: false,
    hourlyRate: 28,
    estimatedHours: 3,
    requiredSkills: ['Senior Tech Setup', 'Digital Literacy', 'Patience', 'Cybersecurity Awareness'],
    status: 'hired',
    hiredStudentId: 'user_student_leo',
    isCrossBorder: true,
    crossBorderInfo: {
      senderLocation: 'London, United Kingdom',
      recipientLocation: 'Jayanagar, Bangalore, India',
      recipientRelation: 'Retired Parents (68 & 73 yrs)',
      languagePreference: 'English & Hindi',
      urgency: 'Standard',
    },
    escrowStatus: 'held',
    escrowAmount: 84,
    createdAt: '2024-02-08T11:00:00.000Z',
    updatedAt: '2024-02-09T14:00:00.000Z',
  },
  {
    id: 'job_1',
    clientId: 'user_client_sarah',
    clientName: 'Sarah Jenkins',
    clientEmail: 'sarah.client@example.com',
    title: 'Interactive SaaS Dashboard UI in Next.js & Tailwind',
    description: 'We need a skilled front-end student developer to build responsive UI components for our analytics dashboard. Figma designs are fully prepared; you will translate them to modular React components with Tailwind CSS.',
    category: 'Web Development',
    location: 'Austin, TX',
    isRemote: true,
    hourlyRate: 35,
    estimatedHours: 20,
    requiredSkills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
    status: 'open',
    escrowStatus: 'unfunded',
    createdAt: '2024-02-01T10:00:00.000Z',
    updatedAt: '2024-02-01T10:00:00.000Z',
  },
  {
    id: 'job_2',
    clientId: 'user_client_sarah',
    clientName: 'Sarah Jenkins',
    clientEmail: 'sarah.client@example.com',
    title: 'Brand Identity & Investor Pitch Deck Redesign',
    description: 'Seeking a creative design student to overhaul our 15-slide pitch deck and establish clean typography and color system in Figma.',
    category: 'Graphic Design',
    location: 'Remote',
    isRemote: true,
    hourlyRate: 30,
    estimatedHours: 15,
    requiredSkills: ['Figma', 'Graphic Design', 'Brand Identity', 'UI/UX'],
    status: 'open',
    escrowStatus: 'unfunded',
    createdAt: '2024-02-03T11:30:00.000Z',
    updatedAt: '2024-02-03T11:30:00.000Z',
  },
  {
    id: 'job_3',
    clientId: 'user_client_marcus',
    clientName: 'Marcus Vance',
    clientEmail: 'marcus.client@example.com',
    title: 'AP Calculus BC & College Linear Algebra Tutoring',
    description: 'Looking for an enthusiastic STEM student to provide 2 hours of online weekly tutoring for freshman calculus and linear algebra topics.',
    category: 'Tutoring',
    location: 'Seattle, WA',
    isRemote: true,
    hourlyRate: 32,
    estimatedHours: 10,
    requiredSkills: ['Calculus', 'Linear Algebra', 'Tutoring', 'Physics'],
    status: 'open',
    escrowStatus: 'unfunded',
    createdAt: '2024-02-05T08:00:00.000Z',
    updatedAt: '2024-02-05T08:00:00.000Z',
  },
  {
    id: 'job_4',
    clientId: 'user_client_marcus',
    clientName: 'Marcus Vance',
    clientEmail: 'marcus.client@example.com',
    title: 'Market Research & Competitor Pricing Analysis',
    description: 'Compile a structured spreadsheet analyzing pricing structures, feature tiers, and customer segments for 20 B2B AI products.',
    category: 'Research',
    location: 'Remote',
    isRemote: true,
    hourlyRate: 25,
    estimatedHours: 12,
    requiredSkills: ['Research', 'Data Entry', 'Python'],
    status: 'hired',
    hiredStudentId: 'user_student_alex',
    escrowStatus: 'held',
    escrowAmount: 300,
    createdAt: '2024-01-25T14:00:00.000Z',
    updatedAt: '2024-01-28T09:00:00.000Z',
  },
  {
    id: 'job_5',
    clientId: 'user_client_sarah',
    clientName: 'Sarah Jenkins',
    clientEmail: 'sarah.client@example.com',
    title: 'Marketing Landing Page Illustration & Icon Set',
    description: 'Create custom SVG illustrations and 12 matching icons for our product relaunch website.',
    category: 'Graphic Design',
    location: 'Austin, TX',
    isRemote: true,
    hourlyRate: 28,
    estimatedHours: 18,
    requiredSkills: ['Figma', 'Illustration', 'Graphic Design'],
    status: 'completed',
    hiredStudentId: 'user_student_maya',
    escrowStatus: 'released',
    escrowAmount: 504,
    createdAt: '2024-01-12T09:00:00.000Z',
    updatedAt: '2024-01-22T17:00:00.000Z',
  },
];

const SEED_APPLICATIONS: Application[] = [
  {
    id: 'app_cb_1',
    jobId: 'job_cb_2',
    studentId: 'user_student_leo',
    studentName: 'Leo Chen',
    studentEmail: 'leo.tutor@stanford.edu',
    studentHourlyRate: 30,
    studentSkills: ['Senior Tech Setup', 'Elderly Care', 'Digital Literacy'],
    studentVerificationStatus: 'verified',
    coverLetter: "Hi Raj, I am based in Jayanagar 4th Block! I regularly help my own grandparents with tech setup and online banking safety. I would be honored to guide your parents with patience and care.",
    proposedRate: 28,
    status: 'hired',
    createdAt: '2024-02-08T14:30:00.000Z',
  },
  {
    id: 'app_1',
    jobId: 'job_1',
    studentId: 'user_student_alex',
    studentName: 'Alex Rivera',
    studentEmail: 'alex.dev@mit.edu',
    studentHourlyRate: 35,
    studentSkills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    studentVerificationStatus: 'verified',
    coverLetter: "Hi Sarah! I have built multiple Next.js 14 dashboards with Tailwind CSS. I'm very comfortable translating Figma specs into pixel-perfect responsive components. Looking forward to collaborating!",
    proposedRate: 35,
    status: 'applied',
    createdAt: '2024-02-01T14:20:00.000Z',
  },
  {
    id: 'app_2',
    jobId: 'job_1',
    studentId: 'user_student_maya',
    studentName: 'Maya Lin',
    studentEmail: 'maya.design@risd.edu',
    studentHourlyRate: 28,
    studentSkills: ['UI/UX', 'Figma'],
    studentVerificationStatus: 'verified',
    coverLetter: 'I would love to help organize your design tokens and assist in styling the layout directly in Tailwind.',
    proposedRate: 28,
    status: 'applied',
    createdAt: '2024-02-02T10:15:00.000Z',
  },
  {
    id: 'app_3',
    jobId: 'job_4',
    studentId: 'user_student_alex',
    studentName: 'Alex Rivera',
    studentEmail: 'alex.dev@mit.edu',
    studentHourlyRate: 35,
    studentSkills: ['Research', 'Python'],
    studentVerificationStatus: 'verified',
    coverLetter: 'I can automate data extraction with Python scripts and provide clean competitor comparison tables.',
    proposedRate: 25,
    status: 'hired',
    createdAt: '2024-01-26T08:00:00.000Z',
  },
  {
    id: 'app_5',
    jobId: 'job_5',
    studentId: 'user_student_maya',
    studentName: 'Maya Lin',
    studentEmail: 'maya.design@risd.edu',
    studentHourlyRate: 28,
    studentSkills: ['Figma', 'Illustration', 'Graphic Design'],
    studentVerificationStatus: 'verified',
    coverLetter: 'Custom illustration is my core focus at RISD! I can produce consistent SVG vectors and iconic hero graphics.',
    proposedRate: 28,
    status: 'hired',
    createdAt: '2024-01-13T10:00:00.000Z',
  },
];

const SEED_MESSAGES: Message[] = [
  {
    id: 'msg_1',
    jobId: 'job_cb_2',
    senderId: 'user_client_raj',
    senderName: 'Raj Patel (UK Expat)',
    senderRole: 'client',
    text: "Hi Leo, thanks for taking this up! My father's name is Suresh and my mother is Geetha. They are home after 3 PM. Can you bring a notepad to write down their simplified steps?",
    createdAt: '2024-02-09T14:05:00.000Z',
  },
  {
    id: 'msg_2',
    jobId: 'job_cb_2',
    senderId: 'user_student_leo',
    senderName: 'Leo Chen',
    senderRole: 'student',
    text: "Absolutely Raj! I have prepared step-by-step printed flashcards for phone fraud prevention and pension checking. I will call you as soon as I arrive at their doorstep.",
    createdAt: '2024-02-09T14:15:00.000Z',
  },
  {
    id: 'msg_3',
    jobId: 'job_5',
    senderId: 'user_client_sarah',
    senderName: 'Sarah Jenkins',
    senderRole: 'client',
    text: "Maya, the vector set was accepted by our front-end team. Releasing your escrow payment right now. Thank you so much!",
    createdAt: '2024-01-22T16:50:00.000Z',
  },
  {
    id: 'msg_4',
    jobId: 'job_5',
    senderId: 'user_student_maya',
    senderName: 'Maya Lin',
    senderRole: 'student',
    text: "Thank you Sarah! It was a delight collaborating with your team. Wishing you the best on the relaunch!",
    createdAt: '2024-01-22T16:55:00.000Z',
  },
];

const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_1',
    userId: 'user_student_alex',
    title: 'New High AI Match (95%)',
    message: 'A new SaaS Dashboard Task in Austin matches 4 of your top skills.',
    link: '/jobs/job_1',
    read: false,
    type: 'application',
    createdAt: '2024-02-01T10:05:00.000Z',
  },
  {
    id: 'notif_2',
    userId: 'user_student_leo',
    title: 'Hired & Escrow Funded ($84.00)',
    message: 'Raj Patel has hired you for "Senior Citizen Digital Banking & Smartphone Fraud-Safety Setup". Funds are locked in GSAP Escrow.',
    link: '/jobs/job_cb_2',
    read: false,
    type: 'escrow',
    createdAt: '2024-02-09T14:00:00.000Z',
  },
  {
    id: 'notif_3',
    userId: 'user_student_maya',
    title: 'Payment Released ($504.00)',
    message: 'Escrow payment for "Marketing Landing Page Illustration" has been released to your wallet.',
    link: '/jobs/job_5',
    read: true,
    type: 'completion',
    createdAt: '2024-01-22T17:00:00.000Z',
  },
  {
    id: 'notif_4',
    userId: 'user_client_raj',
    title: 'Application Received',
    message: 'Leo Chen (Stanford, Verified) applied for your family assistance task.',
    link: '/jobs/job_cb_2',
    read: true,
    type: 'application',
    createdAt: '2024-02-08T14:35:00.000Z',
  },
];

const SEED_REVIEWS: Review[] = [
  {
    id: 'review_1',
    jobId: 'job_5',
    jobTitle: 'Marketing Landing Page Illustration & Icon Set',
    reviewerId: 'user_client_sarah',
    reviewerName: 'Sarah Jenkins',
    reviewerRole: 'client',
    revieweeId: 'user_student_maya',
    rating: 5,
    comment: 'Maya delivered stunning illustrations well ahead of schedule! Her communication was top notch and the SVG assets integrated seamlessly into our website.',
    createdAt: '2024-01-23T11:00:00.000Z',
  },
  {
    id: 'review_2',
    jobId: 'job_5',
    jobTitle: 'Marketing Landing Page Illustration & Icon Set',
    reviewerId: 'user_student_maya',
    reviewerName: 'Maya Lin',
    reviewerRole: 'student',
    revieweeId: 'user_client_sarah',
    rating: 5,
    comment: 'Working with Sarah was a fantastic experience. Extremely clear design briefs, swift feedback, and prompt hourly approvals.',
    createdAt: '2024-01-23T14:30:00.000Z',
  },
];

const SEED_DISPUTES: Dispute[] = [
  {
    id: 'disp_1',
    jobId: 'job_5',
    jobTitle: 'Marketing Landing Page Illustration & Icon Set',
    raisedById: 'user_client_sarah',
    raisedByName: 'Sarah Jenkins',
    raisedByRole: 'client',
    againstId: 'user_student_maya',
    againstName: 'Maya Lin',
    reason: 'Clarification on vector licensing',
    details: 'Demo dispute logged to test the dispute resolution workflow for administrative review.',
    status: 'resolved',
    resolutionNotes: 'Resolved amicably between parties. Full commercial rights granted.',
    createdAt: '2024-01-24T09:00:00.000Z',
    resolvedAt: '2024-01-24T15:00:00.000Z',
  },
];

// ---------------------------------------------------------------------------
// Initialization
// ---------------------------------------------------------------------------

export function initStorage(forceReset = false): void {
  if (!isClient()) return;

  const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  if (!initialized || forceReset) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(SEED_JOBS));
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(SEED_APPLICATIONS));
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(SEED_MESSAGES));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(SEED_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(SEED_REVIEWS));
    localStorage.setItem(STORAGE_KEYS.DISPUTES, JSON.stringify(SEED_DISPUTES));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');

    if (!localStorage.getItem(STORAGE_KEYS.SESSION)) {
      localStorage.setItem(STORAGE_KEYS.SESSION, 'user_client_sarah');
    }
  }
}

export function resetStorageToDemo(): void {
  initStorage(true);
}

// ---------------------------------------------------------------------------
// Users Repository
// ---------------------------------------------------------------------------

export function getUsers(): User[] {
  initStorage();
  return getItem<User[]>(STORAGE_KEYS.USERS, SEED_USERS);
}

export function getUserById(id: string): User | undefined {
  const users = getUsers();
  return users.find((u) => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  const users = getUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(user: User): User {
  const users = getUsers();
  const existing = users.find((u) => u.email.toLowerCase() === user.email.toLowerCase());
  if (existing) {
    throw new Error('A user with this email address already exists.');
  }

  if (user.age < 18) {
    throw new Error('Platform rule violation: All users must be 18 years of age or older.');
  }

  users.push(user);
  setItem(STORAGE_KEYS.USERS, users);
  return user;
}

export function updateUser(id: string, partial: Partial<User>): User {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    throw new Error(`User not found with id: ${id}`);
  }

  if (partial.age !== undefined && partial.age < 18) {
    throw new Error('Platform rule violation: Age cannot be under 18.');
  }

  const updated: User = { ...users[index], ...partial };
  users[index] = updated;
  setItem(STORAGE_KEYS.USERS, users);
  return updated;
}

export function deleteUser(id: string): void {
  const users = getUsers().filter((u) => u.id !== id);
  setItem(STORAGE_KEYS.USERS, users);

  if (getCurrentSessionUserId() === id) {
    clearCurrentSession();
  }
}

// ---------------------------------------------------------------------------
// Jobs Repository
// ---------------------------------------------------------------------------

export function getJobs(filters?: JobFilters): Job[] {
  initStorage();
  let jobs = getItem<Job[]>(STORAGE_KEYS.JOBS, SEED_JOBS);

  if (!filters) return jobs;

  if (filters.status) {
    jobs = jobs.filter((j) => j.status === filters.status);
  }

  if (filters.category && filters.category !== 'All') {
    jobs = jobs.filter((j) => j.category === filters.category);
  }

  if (filters.remoteOnly) {
    jobs = jobs.filter((j) => j.isRemote);
  }

  if (filters.crossBorderOnly) {
    jobs = jobs.filter((j) => j.isCrossBorder);
  }

  if (filters.location) {
    const loc = filters.location.toLowerCase();
    jobs = jobs.filter(
      (j) => j.location.toLowerCase().includes(loc) || (j.isRemote && loc.includes('remote'))
    );
  }

  if (filters.minRate !== undefined && filters.minRate > 0) {
    jobs = jobs.filter((j) => j.hourlyRate >= filters.minRate!);
  }

  if (filters.maxRate !== undefined && filters.maxRate > 0) {
    jobs = jobs.filter((j) => j.hourlyRate <= filters.maxRate!);
  }

  if (filters.query && filters.query.trim() !== '') {
    const q = filters.query.toLowerCase().trim();
    jobs = jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        j.clientName.toLowerCase().includes(q) ||
        j.requiredSkills.some((s) => s.toLowerCase().includes(q))
    );
  }

  return jobs;
}

export function getJobById(id: string): Job | undefined {
  const jobs = getJobs();
  return jobs.find((j) => j.id === id);
}

export function createJob(job: Job): Job {
  const jobs = getJobs();
  jobs.unshift(job);
  setItem(STORAGE_KEYS.JOBS, jobs);
  return job;
}

export function updateJob(id: string, partial: Partial<Job>): Job {
  const jobs = getJobs();
  const index = jobs.findIndex((j) => j.id === id);
  if (index === -1) {
    throw new Error(`Job not found with id: ${id}`);
  }
  const updated: Job = {
    ...jobs[index],
    ...partial,
    updatedAt: new Date().toISOString(),
  };
  jobs[index] = updated;
  setItem(STORAGE_KEYS.JOBS, jobs);
  return updated;
}

export function deleteJob(id: string): void {
  const jobs = getJobs().filter((j) => j.id !== id);
  setItem(STORAGE_KEYS.JOBS, jobs);

  const apps = getApplications().filter((a) => a.jobId !== id);
  setItem(STORAGE_KEYS.APPLICATIONS, apps);
}

// ---------------------------------------------------------------------------
// Escrow Management
// ---------------------------------------------------------------------------

export function fundEscrow(jobId: string, amount: number): Job {
  const job = updateJob(jobId, {
    escrowStatus: 'held',
    escrowAmount: amount,
  });

  if (job.hiredStudentId) {
    addNotification({
      id: `notif_${Date.now()}`,
      userId: job.hiredStudentId,
      title: 'Escrow Funded',
      message: `Client deposited $${amount.toFixed(2)} in GSAP Escrow for "${job.title}". You can proceed with confidence.`,
      link: `/jobs/${job.id}`,
      read: false,
      type: 'escrow',
      createdAt: new Date().toISOString(),
    });
  }

  return job;
}

export function releaseEscrow(jobId: string): Job {
  const job = getJobById(jobId);
  if (!job) throw new Error('Job not found');

  const amount = job.escrowAmount || job.hourlyRate * job.estimatedHours;

  const updatedJob = updateJob(jobId, {
    status: 'completed',
    escrowStatus: 'released',
  });

  if (job.hiredStudentId) {
    const student = getUserById(job.hiredStudentId);
    if (student) {
      const currentBalance = student.walletBalance || 0;
      updateUser(student.id, {
        walletBalance: currentBalance + amount,
      });

      addNotification({
        id: `notif_${Date.now()}`,
        userId: student.id,
        title: 'Payment Released to Wallet',
        message: `Client approved completion! $${amount.toFixed(2)} has been released to your GSAP wallet.`,
        link: `/profile/${student.id}`,
        read: false,
        type: 'completion',
        createdAt: new Date().toISOString(),
      });
    }
  }

  return updatedJob;
}

// ---------------------------------------------------------------------------
// Applications Repository
// ---------------------------------------------------------------------------

export function getApplications(): Application[] {
  initStorage();
  return getItem<Application[]>(STORAGE_KEYS.APPLICATIONS, SEED_APPLICATIONS);
}

export function getApplicationsByJobId(jobId: string): Application[] {
  return getApplications().filter((a) => a.jobId === jobId);
}

export function getApplicationsByStudentId(studentId: string): Application[] {
  return getApplications().filter((a) => a.studentId === studentId);
}

export function createApplication(app: Application): Application {
  const apps = getApplications();
  const existing = apps.find(
    (a) => a.jobId === app.jobId && a.studentId === app.studentId
  );
  if (existing) {
    throw new Error('You have already submitted an application for this task.');
  }
  apps.unshift(app);
  setItem(STORAGE_KEYS.APPLICATIONS, apps);

  // Notify job owner
  const job = getJobById(app.jobId);
  if (job) {
    addNotification({
      id: `notif_${Date.now()}`,
      userId: job.clientId,
      title: 'New Applicant',
      message: `${app.studentName} applied for "${job.title}" at $${app.proposedRate}/hr.`,
      link: `/jobs/${job.id}`,
      read: false,
      type: 'application',
      createdAt: new Date().toISOString(),
    });
  }

  return app;
}

export function hireApplicant(
  jobId: string,
  applicationId: string,
  studentId: string,
  escrowDepositAmount?: number
): void {
  const job = getJobById(jobId);
  const deposit = escrowDepositAmount || (job ? job.hourlyRate * job.estimatedHours : 100);

  updateJob(jobId, {
    status: 'hired',
    hiredStudentId: studentId,
    escrowStatus: 'held',
    escrowAmount: deposit,
  });

  const apps = getApplications();
  const updatedApps = apps.map((app) => {
    if (app.jobId === jobId) {
      if (app.id === applicationId) {
        return { ...app, status: 'hired' as const };
      } else if (app.status === 'applied') {
        return { ...app, status: 'rejected' as const };
      }
    }
    return app;
  });

  setItem(STORAGE_KEYS.APPLICATIONS, updatedApps);

  // Notify hired student
  addNotification({
    id: `notif_${Date.now()}`,
    userId: studentId,
    title: 'Congratulations! You are Hired',
    message: `You were hired for "${job?.title || 'task'}" with $${deposit.toFixed(2)} funded in Escrow.`,
    link: `/jobs/${jobId}`,
    read: false,
    type: 'hire',
    createdAt: new Date().toISOString(),
  });
}

// ---------------------------------------------------------------------------
// Direct In-App Chat / Messages Repository
// ---------------------------------------------------------------------------

export function getMessagesByJobId(jobId: string): Message[] {
  initStorage();
  const messages = getItem<Message[]>(STORAGE_KEYS.MESSAGES, SEED_MESSAGES);
  return messages.filter((m) => m.jobId === jobId);
}

export function sendMessage(msg: Message): Message {
  const messages = getItem<Message[]>(STORAGE_KEYS.MESSAGES, SEED_MESSAGES);
  messages.push(msg);
  setItem(STORAGE_KEYS.MESSAGES, messages);

  // Notify the other participant
  const job = getJobById(msg.jobId);
  if (job) {
    const recipientId = msg.senderId === job.clientId ? job.hiredStudentId : job.clientId;
    if (recipientId) {
      addNotification({
        id: `notif_${Date.now()}`,
        userId: recipientId,
        title: `Message from ${msg.senderName}`,
        message: msg.text.length > 50 ? `${msg.text.slice(0, 50)}...` : msg.text,
        link: `/jobs/${job.id}`,
        read: false,
        type: 'message',
        createdAt: new Date().toISOString(),
      });
    }
  }

  return msg;
}

// ---------------------------------------------------------------------------
// Notifications Repository
// ---------------------------------------------------------------------------

export function getNotificationsByUserId(userId: string): Notification[] {
  initStorage();
  const notifs = getItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
  return notifs
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addNotification(notification: Notification): void {
  const notifs = getItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
  notifs.unshift(notification);
  setItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
}

export function markNotificationAsRead(id: string): void {
  const notifs = getItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
  const updated = notifs.map((n) => (n.id === id ? { ...n, read: true } : n));
  setItem(STORAGE_KEYS.NOTIFICATIONS, updated);
}

export function markAllNotificationsAsRead(userId: string): void {
  const notifs = getItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
  const updated = notifs.map((n) => (n.userId === userId ? { ...n, read: true } : n));
  setItem(STORAGE_KEYS.NOTIFICATIONS, updated);
}

// ---------------------------------------------------------------------------
// Reviews Repository
// ---------------------------------------------------------------------------

export function getReviews(): Review[] {
  initStorage();
  return getItem<Review[]>(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
}

export function getReviewsByRevieweeId(userId: string): Review[] {
  return getReviews().filter((r) => r.revieweeId === userId);
}

export function getReviewsByJobId(jobId: string): Review[] {
  return getReviews().filter((r) => r.jobId === jobId);
}

export function createReview(review: Review): Review {
  const reviews = getReviews();
  const existing = reviews.find(
    (r) => r.jobId === review.jobId && r.reviewerId === review.reviewerId
  );
  if (existing) {
    throw new Error('You have already submitted a review for this task.');
  }

  reviews.unshift(review);
  setItem(STORAGE_KEYS.REVIEWS, reviews);

  addNotification({
    id: `notif_${Date.now()}`,
    userId: review.revieweeId,
    title: 'New Star Rating & Review',
    message: `${review.reviewerName} gave you a ${review.rating}-star review: "${review.comment.slice(0, 40)}..."`,
    link: `/profile/${review.revieweeId}`,
    read: false,
    type: 'review',
    createdAt: new Date().toISOString(),
  });

  return review;
}

export function deleteReview(id: string): void {
  const reviews = getReviews().filter((r) => r.id !== id);
  setItem(STORAGE_KEYS.REVIEWS, reviews);
}

export function getUserAverageRating(userId: string): { average: number; count: number } {
  const userReviews = getReviewsByRevieweeId(userId);
  if (userReviews.length === 0) {
    return { average: 5.0, count: 0 };
  }
  const sum = userReviews.reduce((acc, r) => acc + r.rating, 0);
  const avg = Math.round((sum / userReviews.length) * 10) / 10;
  return { average: avg, count: userReviews.length };
}

// ---------------------------------------------------------------------------
// Disputes Repository
// ---------------------------------------------------------------------------

export function getDisputes(): Dispute[] {
  initStorage();
  return getItem<Dispute[]>(STORAGE_KEYS.DISPUTES, SEED_DISPUTES);
}

export function createDispute(dispute: Dispute): Dispute {
  const disputes = getDisputes();
  disputes.unshift(dispute);
  setItem(STORAGE_KEYS.DISPUTES, disputes);

  addNotification({
    id: `notif_${Date.now()}`,
    userId: 'user_admin',
    title: 'New Dispute Escalated',
    message: `${dispute.raisedByName} raised a dispute on "${dispute.jobTitle}": ${dispute.reason}`,
    link: '/admin',
    read: false,
    type: 'dispute',
    createdAt: new Date().toISOString(),
  });

  return dispute;
}

export function updateDisputeStatus(
  id: string,
  status: 'open' | 'resolved',
  resolutionNotes?: string
): Dispute {
  const disputes = getDisputes();
  const index = disputes.findIndex((d) => d.id === id);
  if (index === -1) {
    throw new Error(`Dispute not found with id: ${id}`);
  }
  const updated: Dispute = {
    ...disputes[index],
    status,
    resolutionNotes: resolutionNotes || disputes[index].resolutionNotes,
    resolvedAt: status === 'resolved' ? new Date().toISOString() : undefined,
  };
  disputes[index] = updated;
  setItem(STORAGE_KEYS.DISPUTES, disputes);
  return updated;
}

export function deleteDispute(id: string): void {
  const disputes = getDisputes().filter((d) => d.id !== id);
  setItem(STORAGE_KEYS.DISPUTES, disputes);
}

// ---------------------------------------------------------------------------
// Session Repository
// ---------------------------------------------------------------------------

export function getCurrentSessionUserId(): string | null {
  if (!isClient()) return null;
  return localStorage.getItem(STORAGE_KEYS.SESSION);
}

export function setCurrentSessionUserId(userId: string): void {
  if (!isClient()) return;
  localStorage.setItem(STORAGE_KEYS.SESSION, userId);
}

export function clearCurrentSession(): void {
  if (!isClient()) return;
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}
