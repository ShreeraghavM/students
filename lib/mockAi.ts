import { User, Job, MatchScoreResult, FaqItem } from '@/types';

/**
 * Deterministic AI Match Score Calculation for Students and Jobs.
 * Compares student skills, desired hourly rate, location/remote preference,
 * and verification status to generate a transparent percentage score.
 */
export function calculateMatchScore(student: User, job: Job): MatchScoreResult {
  const studentSkills = (student.skills || []).map((s) => s.toLowerCase().trim());
  const jobSkills = (job.requiredSkills || []).map((s) => s.toLowerCase().trim());

  // 1. Skills match (0 to 50 points)
  let skillsScore = 0;
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  job.requiredSkills.forEach((skill) => {
    const sLower = skill.toLowerCase().trim();
    if (studentSkills.some((sk) => sk.includes(sLower) || sLower.includes(sk))) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  if (jobSkills.length > 0) {
    const skillRatio = matchedSkills.length / jobSkills.length;
    skillsScore = Math.round(skillRatio * 50);
  } else {
    skillsScore = 40;
  }

  // 2. Hourly Rate alignment (0 to 25 points)
  let rateScore = 15;
  const studentRate = student.hourlyRate || 25;
  if (studentRate <= job.hourlyRate) {
    rateScore = 25; // Student fits within or matches client budget
  } else if (studentRate <= job.hourlyRate * 1.25) {
    rateScore = 15; // Within reasonable negotiation range
  } else {
    rateScore = 5; // Higher than client budget
  }

  // 3. Location / Remote alignment (0 to 20 points)
  let locationScore = 10;
  if (job.isRemote) {
    locationScore = 20; // Fully remote is universally compatible
  } else if (
    student.location &&
    job.location &&
    (student.location.toLowerCase().includes(job.location.toLowerCase()) ||
      job.location.toLowerCase().includes(student.location.toLowerCase()))
  ) {
    locationScore = 20; // In-person location match
  } else {
    locationScore = 5; // Different location without remote tag
  }

  // 4. Verification bonus (0 to 5 points)
  let verificationBonus = 0;
  if (student.verificationStatus === 'verified') {
    verificationBonus = 5;
  } else if (student.verificationStatus === 'pending') {
    verificationBonus = 2;
  }

  // Calculate total score and clamp between 35% and 99%
  const total = Math.min(99, Math.max(35, skillsScore + rateScore + locationScore + verificationBonus));

  let verdict: MatchScoreResult['verdict'] = 'Low Match';
  if (total >= 85) verdict = 'Excellent Match';
  else if (total >= 70) verdict = 'Good Match';
  else if (total >= 50) verdict = 'Moderate Match';

  return {
    score: total,
    breakdown: {
      skillsMatch: skillsScore,
      rateMatch: rateScore,
      locationMatch: locationScore,
      verificationBonus,
    },
    matchedSkills,
    missingSkills,
    verdict,
  };
}

/**
 * Canned FAQ Database for Rule-Based AI Assistant
 */
export const FAQ_DATABASE: FaqItem[] = [
  {
    id: 'faq_1',
    category: 'Safety & 18+',
    question: 'Is this platform strictly 18+ only?',
    keywords: ['18+', 'age', 'under 18', 'minor', 'eligibility', 'signup', 'birth', 'dob'],
    answer:
      'Yes, absolutely. The Global Student Assistance Platform is hard-enforced for adults aged 18 and older. Both clients and students must provide their date of birth upon registration. Users under 18 cannot register or post/apply for tasks under any category.',
  },
  {
    id: 'faq_2',
    category: 'Verification',
    question: 'How does student verification work?',
    keywords: ['verify', 'verification', 'badge', 'student id', 'edu', 'email', 'identity'],
    answer:
      'Students are awarded a "Verified Student" badge on their profile. In this demo system, verification can be toggled directly on the student profile to simulate passing, pending, and rejection states. Verified students receive higher prominence and a boost in AI match scores.',
  },
  {
    id: 'faq_3',
    category: 'Hiring',
    question: 'How do clients review and hire applicants?',
    keywords: ['hire', 'applicant', 'choose', 'hiring', 'select', 'accept'],
    answer:
      'Clients post a job with required skills, budget, and estimated hours. Interested students submit an application with a custom cover letter and proposed hourly rate. The client views all applicants on the job page and can click "Hire Student". Once hired, the job status changes to "Hired" and remaining applicants are automatically notified and marked rejected.',
  },
  {
    id: 'faq_4',
    category: 'Payments',
    question: 'How do hourly rates and payments work?',
    keywords: ['pay', 'payment', 'rate', 'hourly', 'money', 'budget', 'cost', 'fee', 'charge'],
    answer:
      'Every job displays a transparent hourly rate. Students can apply matching the posted rate or propose their preferred hourly rate in their application. Once a job is completed, clients approve the final work and complete the task.',
  },
  {
    id: 'faq_5',
    category: 'Disputes',
    question: 'What happens if there is a dispute on a completed job?',
    keywords: ['dispute', 'problem', 'conflict', 'issue', 'complaint', 'raise', 'admin'],
    answer:
      'If an issue arises after a job is finished, either party can click "Raise a Dispute" directly on the job page. A dispute record is opened with the specified reason and details. Platform administrators can inspect all open disputes from the /admin portal and mark them resolved.',
  },
  {
    id: 'faq_6',
    category: 'Safety & 18+',
    question: 'How do reviews and ratings work?',
    keywords: ['review', 'rating', 'star', 'feedback', 'testimonial', 'score'],
    answer:
      'Once a client marks a job as "Completed", reciprocal review capabilities unlock for both parties. The client can rate the student from 1 to 5 stars with a feedback comment, and the student can rate the client. Average ratings update immediately on user profile pages.',
  },
  {
    id: 'faq_7',
    category: 'Hiring',
    question: 'How is the AI Match Score calculated?',
    keywords: ['ai', 'match', 'score', 'algorithm', 'percentage', 'skills match'],
    answer:
      'The AI Match Score is a transparent deterministic metric evaluating: 1) Skill overlap (up to 50 pts), 2) Hourly rate compatibility (up to 25 pts), 3) Remote & location compatibility (up to 20 pts), and 4) A verification bonus (+5 pts). It helps students quickly identify the jobs best suited for their skills.',
  },
];

/**
 * Rule-Based FAQ Matcher
 */
export function getFaqAnswer(query: string): { answer: string; matchedItem?: FaqItem; suggestions: string[] } {
  const normalized = query.toLowerCase().trim();

  if (!normalized) {
    return {
      answer: 'Hello! I am the GSAP Assistant. Ask me anything about how the platform works, student verification, 18+ policy, hiring, or payments!',
      suggestions: [
        'Is this platform strictly 18+ only?',
        'How does student verification work?',
        'How do clients hire applicants?',
        'How do hourly rates and payments work?',
      ],
    };
  }

  // Check exact question match
  const exactMatch = FAQ_DATABASE.find((item) =>
    item.question.toLowerCase().includes(normalized) || normalized.includes(item.question.toLowerCase())
  );
  if (exactMatch) {
    return {
      answer: exactMatch.answer,
      matchedItem: exactMatch,
      suggestions: FAQ_DATABASE.filter((i) => i.id !== exactMatch.id).slice(0, 3).map((i) => i.question),
    };
  }

  // Check keyword matches
  let bestItem: FaqItem | null = null;
  let bestMatches = 0;

  for (const item of FAQ_DATABASE) {
    let matches = 0;
    for (const keyword of item.keywords) {
      if (normalized.includes(keyword)) {
        matches += 1;
      }
    }
    if (matches > bestMatches) {
      bestMatches = matches;
      bestItem = item;
    }
  }

  if (bestItem && bestMatches > 0) {
    return {
      answer: bestItem.answer,
      matchedItem: bestItem,
      suggestions: FAQ_DATABASE.filter((i) => i.id !== bestItem!.id).slice(0, 3).map((i) => i.question),
    };
  }

  // Fallback response with suggestions
  return {
    answer: `I couldn't find an exact answer for "${query}". Here are the most popular topics I can assist with:`,
    suggestions: [
      'Is this platform strictly 18+ only?',
      'How does student verification work?',
      'How do clients hire a student?',
      'What happens if there is a dispute on a completed job?',
    ],
  };
}
