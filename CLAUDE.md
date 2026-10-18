# GSAP (Global Student Assistance Platform) & Garry Tan's gstack

This repository is equipped with **Garry Tan's `gstack`** tooling and agile workflows for building production-grade, venture-backed marketplace software.

---

## 🚀 Garry Tan's gstack Workflows

Use the `gstack` framework commands for structured product execution:

- **/office-hours**: Strategic ideation, user persona alignment, and core value proposition mapping.
- **/spec**: Define rigorous product specifications, edge-case handling, and user journey stories.
- **/plan-ceo-review**: Evaluate product decisions from the perspective of an early-stage investor and marketplace CEO.
- **/review**: Conduct strict code reviews against clean architectural boundaries, zero-trust security, and static export constraints.
- **/qa**: Run automated and manual end-to-end tests across all user roles (Client, Student, Admin).
- **/ship**: Verify clean build artifacts, Git commits, push to remote, and prepare production deployment.

---

## 🌟 What GSAP Solves: The Market-Ready Product

**Global Student Assistance Platform (GSAP)** is a dual-sided, 18+ verified marketplace solving two massive global problems:

1. **Student Underemployment & Inflexible Work**: University students need flexible, dignifying hourly income ($25–$40/hr) aligned with their skills and academic schedules, without the predatory fees of legacy freelancing giants.
2. **The Cross-Border Diaspora Care Crisis (Hyper-Local Concierge)**: Millions of expats and immigrants living abroad (in the UK, USA, Canada, UAE) have aging, uneducated, or non-English-speaking parents in their hometowns (e.g., India). When parents need assistance with hospital consultations, digital banking, pension documentation, or local errands, diaspora children are thousands of miles away. GSAP allows expats to hire verified, bilingual local university students near their parents' hometown to provide in-person accompaniment, reporting back live via in-app chat.

---

## 🛠️ Tech Stack & Key Architecture

- **Framework**: Next.js 14 (App Router) with static export mode (`output: 'export'`).
- **Language**: TypeScript (strict type safety, zero compile warnings).
- **Styling**: Tailwind CSS + Lucide React icons.
- **Data Layer**: SSR-safe LocalStorage repository pattern (`lib/storage.ts`) with realistic seed data, real-time message stream, and notification dispatching.
- **Target Deployment**: Netlify Static Hosting (`out/` directory with `out/_redirects` for client-side routing).

---

## 🛡️ Core Market-Ready Features

1. **Strict 18+ Age Verification**:
   - DOB calculation strictly denies anyone under 18 from registering or applying.
   - Interactive Student Verification Center: Validates university email/student ID and government photo ID, issuing a verifiable certificate ID (e.g., `GSAP-VERIFIED-2026-XXXX`).

2. **Cross-Border Hyper-Local Concierge ("Family & Elderly Care")**:
   - Dedicated corridor fields: Sender location (e.g., London, UK), Recipient hometown (e.g., Bangalore, India), Beneficiary details, and required local dialects.
   - Filterable in marketplace search.

3. **Multi-Currency Escrow Milestone Guarantee**:
   - Live FX support across **USD ($)**, **GBP (£)**, **EUR (€)**, and **INR (₹)**.
   - 100% Escrow deposit upon student hire — funds are locked securely until client inspects deliverables and clicks "Release Escrow Payout".
   - Direct student wallet balance with simulated local bank/UPI withdrawal.

4. **In-App Task Direct Messaging (`JobChat`)**:
   - Real-time communication on tasks between client and hired student.
   - Quick reply action pills for fast status coordination.

5. **Notification Center**:
   - Top navigation bell icon with unread badge counter, alert summaries, and quick navigation links.

6. **Algorithmic AI Match Scoring**:
   - Deterministic 0–100% compatibility score based on required skills, hourly rates, location/remote preferences, and 18+ verification bonus.

---

## 💻 Build & Deploy Commands

```bash
# 1. Type check
npx tsc --noEmit

# 2. Build static export for Netlify
npm run build

# 3. Test & review Git status
git status
git commit -am "feat: ..."
git push origin main
```
