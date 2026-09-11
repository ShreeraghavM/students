# Global Student Assistance Platform (GSAP)

A modern, responsive peer marketplace web application connecting clients who need assistance with tasks to verified university students (**strictly 18+ only**) offering paid hourly services across engineering, design, STEM tutoring, and research.

Built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**.

---

## 🌟 Key Features

### 1. In-Browser Data Layer (`/lib/storage.ts`)
- **Zero Backend / No Database Required**: All data (users, jobs, applications, reviews, disputes, sessions) is stored in the browser via `localStorage`.
- **Strictly Typed Repository Pattern**: Wrapped behind typed functions (`getUsers`, `createJob`, `updateApplication`, `deleteReview`, `hireApplicant`, etc.). `localStorage` is never accessed directly outside `/lib/storage.ts`.
- **Pre-Seeded Demo Data**: Auto-populated on first launch with 4 user personas, 6 realistic job listings, applications, reciprocal reviews, and an arbitration dispute.
- **1-Click Reset Helper**: Administrators can restore initial seed data at any time from `/admin`.

### 2. Strict 18+ Age Hard Enforcement
- Both clients and students must provide their **Date of Birth (DOB)** at signup.
- Age is accurately calculated; registration is **immediately rejected if under 18**.
- Underage accounts and categories are strictly prohibited across the entire platform.

### 3. Full Marketplace CRUD Workflows
- **Task Discovery (`/jobs`)**: Filter by category, location, remote-only, rate range ($/hr), and search query.
- **Client Job Wizard (`/jobs/new`)**: Interactive skills tagger, hourly rate and budget estimator.
- **Task Management (`/jobs/[id]`)**: Full task specs, client applicant management, edit/delete controls.
- **Atomic Hiring Flow**: When a client hires one applicant, the job and selected application transition to `hired`, and all remaining applicants for that task are **automatically marked rejected**.
- **Task Completion & Reciprocal Reviews**: Marking a task `completed` unlocks 1-to-5 star ratings and testimonials for both client and student.
- **Arbitration & Disputes**: "Raise a Dispute" button on completed tasks creates an arbitration record visible in the `/admin` portal.

### 4. Mocked AI Features (Simulated / Local)
- **Deterministic AI Match Score %**: Displayed on `/jobs` for logged-in students based on skills overlap (up to 50 pts), hourly rate fit (up to 25 pts), remote/location preference (up to 20 pts), and 18+ verification bonus (+5 pts).
- **Rule-Based FAQ Chatbot Widget**: Floating bottom-right assistant (`Ask AI Assistant`) with canned Q&A answering questions on platform safety, 18+ policy, hiring, and dispute resolution.
- **Simulated Verification Badge**: Interactive badge on student profiles with an on-demand state toggle simulator (`Verified` / `Pending` / `Needs Review`).

---

## 👥 Demo Personas & Credentials

A **1-Click Demo Switcher** is included directly in the top navigation bar and on `/login`:

| Name | Role | Email | Password | Details |
| :--- | :--- | :--- | :--- | :--- |
| **Sarah Jenkins** | Client | `sarah.client@example.com` | `client123` | Startup Founder, Austin TX |
| **Marcus Vance** | Client | `marcus.client@example.com` | `client123` | Engineering Manager, Seattle WA |
| **Alex Rivera** | Student | `alex.dev@mit.edu` | `student123` | MIT CS (React, TypeScript, $35/hr) |
| **Maya Lin** | Student | `maya.design@risd.edu` | `student123` | RISD Design (Figma, UI/UX, $28/hr) |
| **Leo Chen** | Student | `leo.tutor@stanford.edu` | `student123` | Stanford STEM (Calculus, Physics, $30/hr) |
| **Administrator** | Admin | `admin@gsap.com` | `admin123` | Platform Supervision & Moderation |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17+ or 20+
- npm, pnpm, or yarn

### Installation
```bash
# Clone repository
git clone https://github.com/ShreeraghavM/students.git
cd students

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
# Build optimized production bundle
npm run build

# Start production server
npm run start
```

---

## 📁 Project Structure

```
├── app/
│   ├── admin/page.tsx         # Admin operations & dispute portal
│   ├── dashboard/page.tsx     # Role-aware dashboard (Client vs Student)
│   ├── jobs/
│   │   ├── page.tsx           # Filterable task board with AI Match Scores
│   │   ├── new/page.tsx       # Client task creation wizard
│   │   └── [id]/page.tsx      # Task detail, apply, hire, review, dispute
│   ├── login/page.tsx         # Login with 1-click demo presets
│   ├── profile/[id]/page.tsx  # User profile & verification simulator
│   ├── signup/page.tsx        # Registration with strict 18+ enforcement
│   ├── globals.css            # Tailwind styles
│   ├── layout.tsx             # Root layout with AuthProvider & Chatbot
│   └── page.tsx               # Modern landing page
├── components/
│   ├── ai/
│   │   ├── FaqChatbot.tsx     # Rule-based floating AI FAQ assistant
│   │   └── VerificationBadge.tsx # Verification badge & demo simulator
│   ├── auth/
│   │   └── ProtectedRoute.tsx # Route guard with role gating
│   ├── disputes/
│   │   └── DisputeModal.tsx   # Modal to log issues to admin
│   ├── jobs/
│   │   ├── JobCard.tsx        # Card with match badge & details
│   │   └── JobFilters.tsx     # Search and filter panel
│   ├── layout/
│   │   ├── Navbar.tsx         # Header with 1-click persona switcher
│   │   └── Footer.tsx         # Footer with 18+ policy guarantee
│   └── reviews/
│       └── ReviewModal.tsx    # 1-5 star reciprocal rating modal
├── context/
│   └── AuthContext.tsx        # Authentication & session provider
├── lib/
│   ├── mockAi.ts              # Match score calculation & canned FAQ engine
│   └── storage.ts             # Typed localStorage repository & seed data
└── types/
    └── index.ts               # Core TypeScript definitions
```

---

## 📜 License
MIT License.
