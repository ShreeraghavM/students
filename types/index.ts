export type UserRole = 'client' | 'student' | 'admin';

export type VerificationStatus = 'verified' | 'pending' | 'rejected';

export type Currency = 'USD' | 'GBP' | 'EUR' | 'INR';

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
  verificationStatus?: VerificationStatus;
  verificationCertId?: string; // e.g. "GSAP-VERIFIED-2026-8849"
  verifiedAt?: string;
  walletBalance?: number; // In-app wallet for students
  createdAt: string;
}

export type JobCategory =
  | 'Family & Elderly Care'
  | 'Tutoring'
  | 'Web Development'
  | 'Graphic Design'
  | 'Content Writing'
  | 'Data Entry'
  | 'Translation'
  | 'Research'
  | 'Administrative';

export type JobStatus = 'open' | 'hired' | 'completed' | 'cancelled';

export interface CrossBorderInfo {
  senderLocation: string; // e.g. "London, UK"
  recipientLocation: string; // e.g. "Bangalore, India"
  recipientRelation: string; // e.g. "Aging Mother (72 yrs)"
  languagePreference: string; // e.g. "Kannada & English"
  urgency: 'Standard' | 'Urgent' | 'Recurring Weekly';
}

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
  hourlyRate: number; // Stored in USD base
  estimatedHours: number;
  requiredSkills: string[];
  status: JobStatus;
  hiredStudentId?: string;
  isCrossBorder?: boolean;
  crossBorderInfo?: CrossBorderInfo;
  escrowStatus?: 'unfunded' | 'held' | 'released';
  escrowAmount?: number;
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

export interface Message {
  id: string;
  jobId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  createdAt: string;
}

export type NotificationType =
  | 'application'
  | 'hire'
  | 'escrow'
  | 'completion'
  | 'review'
  | 'dispute'
  | 'message';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  type: NotificationType;
  createdAt: string;
}

export interface JobFilters {
  query?: string;
  category?: string;
  location?: string;
  remoteOnly?: boolean;
  crossBorderOnly?: boolean;
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
  category: 'Safety & 18+' | 'Hiring' | 'Payments' | 'Disputes' | 'Verification' | 'Cross-Border Care';
  answer: string;
  keywords: string[];
}
