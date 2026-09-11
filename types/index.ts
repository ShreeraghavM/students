export type UserRole = 'client' | 'student' | 'admin';

export type VerificationStatus = 'verified' | 'pending' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // demo plain or hashed
  role: UserRole;
  dateOfBirth: string; // YYYY-MM-DD
  age: number;
  avatar?: string;
  bio?: string;
  location?: string;
  skills?: string[]; // for students
  hourlyRate?: number; // for students (e.g. $25/hr)
  university?: string; // for students (e.g. "UC Berkeley")
  degree?: string; // for students (e.g. "B.S. Computer Science")
  verificationStatus?: VerificationStatus; // Mocked verification status
  createdAt: string;
}

export type JobCategory =
  | 'Tutoring'
  | 'Web Development'
  | 'Graphic Design'
  | 'Content Writing'
  | 'Data Entry'
  | 'Translation'
  | 'Research'
  | 'Administrative';

export type JobStatus = 'open' | 'hired' | 'completed' | 'cancelled';

export interface Job {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail?: string;
  title: string;
  description: string;
  category: JobCategory;
  location: string;
  isRemote: boolean;
  hourlyRate: number;
  estimatedHours: number;
  requiredSkills: string[];
  status: JobStatus;
  hiredStudentId?: string;
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStatus = 'applied' | 'hired' | 'rejected';

export interface Application {
  id: string;
  jobId: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  studentHourlyRate?: number;
  studentSkills?: string[];
  studentVerificationStatus?: VerificationStatus;
  coverLetter: string;
  proposedRate: number;
  status: ApplicationStatus;
  createdAt: string;
}

export interface Review {
  id: string;
  jobId: string;
  jobTitle?: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: UserRole;
  revieweeId: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export type DisputeStatus = 'open' | 'resolved';

export interface Dispute {
  id: string;
  jobId: string;
  jobTitle: string;
  raisedById: string;
  raisedByName: string;
  raisedByRole: UserRole;
  againstId: string;
  againstName: string;
  reason: string;
  details: string;
  status: DisputeStatus;
  resolutionNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface JobFilters {
  query?: string;
  category?: string;
  location?: string;
  remoteOnly?: boolean;
  minRate?: number;
  maxRate?: number;
  status?: JobStatus;
}

export interface MatchScoreResult {
  score: number; // 0 to 100%
  breakdown: {
    skillsMatch: number;
    rateMatch: number;
    locationMatch: number;
    verificationBonus: number;
  };
  matchedSkills: string[];
  missingSkills: string[];
  verdict: 'Excellent Match' | 'Good Match' | 'Moderate Match' | 'Low Match';
}

export interface FaqItem {
  id: string;
  question: string;
  category: 'Safety & 18+' | 'Hiring' | 'Payments' | 'Disputes' | 'Verification';
  answer: string;
  keywords: string[];
}
