import {
  User,
  Job,
  Application,
  Review,
  Dispute,
  JobFilters,
  VerificationStatus,
} from '@/types';

const STORAGE_KEYS = {
  USERS: 'gsap_users_v1',
  JOBS: 'gsap_jobs_v1',
  APPLICATIONS: 'gsap_applications_v1',
  REVIEWS: 'gsap_reviews_v1',
  DISPUTES: 'gsap_disputes_v1',
  SESSION: 'gsap_session_user_id_v1',
  INITIALIZED: 'gsap_initialized_v1',
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
    bio: 'Senior Mathematics & Physics major at Stanford. 3 years experience tutoring college calculus, linear algebra, and data entry.',
    location: 'Palo Alto, CA',
    university: 'Stanford University',
    degree: 'B.S. Applied Mathematics',
    skills: ['Calculus', 'Physics', 'Linear Algebra', 'Tutoring', 'Python', 'Data Entry'],
    hourlyRate: 30,
    verificationStatus: 'pending',
    createdAt: '2024-01-22T16:45:00.000Z',
  },
];

const SEED_JOBS: Job[] = [
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
    createdAt: '2024-01-12T09:00:00.000Z',
    updatedAt: '2024-01-22T17:00:00.000Z',
  },
  {
    id: 'job_6',
    clientId: 'user_client_marcus',
    clientName: 'Marcus Vance',
    clientEmail: 'marcus.client@example.com',
    title: 'Technical Documentation & API Endpoint Verification',
    description: 'Test and document 30 REST API endpoints, creating clear markdown examples and verifying JSON payloads.',
    category: 'Web Development',
    location: 'Seattle, WA',
    isRemote: true,
    hourlyRate: 30,
    estimatedHours: 15,
    requiredSkills: ['TypeScript', 'Node.js', 'Web Development'],
    status: 'open',
    createdAt: '2024-02-07T13:00:00.000Z',
    updatedAt: '2024-02-07T13:00:00.000Z',
  },
];

const SEED_APPLICATIONS: Application[] = [
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
    id: 'app_4',
    jobId: 'job_4',
    studentId: 'user_student_leo',
    studentName: 'Leo Chen',
    studentEmail: 'leo.tutor@stanford.edu',
    studentHourlyRate: 30,
    studentSkills: ['Data Entry', 'Research'],
    studentVerificationStatus: 'pending',
    coverLetter: 'Happy to research and structure your competitor dataset carefully with accurate financial metrics.',
    proposedRate: 25,
    status: 'rejected',
    createdAt: '2024-01-26T09:30:00.000Z',
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
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(SEED_REVIEWS));
    localStorage.setItem(STORAGE_KEYS.DISPUTES, JSON.stringify(SEED_DISPUTES));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');

    // Default session to client demo if no session exists
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

  // Enforce 18+ platform policy
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

  // If current session belongs to deleted user, clear it
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

  // Clean up associated applications
  const apps = getApplications().filter((a) => a.jobId !== id);
  setItem(STORAGE_KEYS.APPLICATIONS, apps);
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

export function getApplicationById(id: string): Application | undefined {
  return getApplications().find((a) => a.id === id);
}

export function createApplication(app: Application): Application {
  const apps = getApplications();
  // Check if student already applied
  const existing = apps.find(
    (a) => a.jobId === app.jobId && a.studentId === app.studentId
  );
  if (existing) {
    throw new Error('You have already submitted an application for this job.');
  }
  apps.unshift(app);
  setItem(STORAGE_KEYS.APPLICATIONS, apps);
  return app;
}

export function updateApplication(
  id: string,
  partial: Partial<Application>
): Application {
  const apps = getApplications();
  const index = apps.findIndex((a) => a.id === id);
  if (index === -1) {
    throw new Error(`Application not found with id: ${id}`);
  }
  const updated: Application = { ...apps[index], ...partial };
  apps[index] = updated;
  setItem(STORAGE_KEYS.APPLICATIONS, apps);
  return updated;
}

export function deleteApplication(id: string): void {
  const apps = getApplications().filter((a) => a.id !== id);
  setItem(STORAGE_KEYS.APPLICATIONS, apps);
}

/**
 * Hiring Flow:
 * Client hires one applicant -> job becomes "hired", that application becomes "hired",
 * and other applicants for that job are automatically marked "rejected".
 */
export function hireApplicant(jobId: string, applicationId: string, studentId: string): void {
  // Update job
  updateJob(jobId, {
    status: 'hired',
    hiredStudentId: studentId,
  });

  // Update applications
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

export function getReviewForJobAndUser(jobId: string, reviewerId: string): Review | undefined {
  return getReviews().find((r) => r.jobId === jobId && r.reviewerId === reviewerId);
}

export function createReview(review: Review): Review {
  const reviews = getReviews();
  // Check if reviewer already reviewed for this job
  const existing = reviews.find(
    (r) => r.jobId === review.jobId && r.reviewerId === review.reviewerId
  );
  if (existing) {
    throw new Error('You have already submitted a review for this job.');
  }

  reviews.unshift(review);
  setItem(STORAGE_KEYS.REVIEWS, reviews);
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

export function getDisputeById(id: string): Dispute | undefined {
  return getDisputes().find((d) => d.id === id);
}

export function createDispute(dispute: Dispute): Dispute {
  const disputes = getDisputes();
  disputes.unshift(dispute);
  setItem(STORAGE_KEYS.DISPUTES, disputes);
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
