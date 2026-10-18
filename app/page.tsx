'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Code,
  Palette,
  BookOpen,
  LineChart,
  Languages,
  CheckCircle2,
  Users,
  Globe,
  HeartHandshake,
  Lock,
  Wallet,
  PieChart,
  TrendingUp,
  Award,
  Zap,
  ArrowUpRight,
} from 'lucide-react';
import { getJobs, getUsers } from '@/lib/storage';
import { Job, User } from '@/types';
import JobCard from '@/components/jobs/JobCard';
import EscrowSimulator from '@/components/investor/EscrowSimulator';
import InvestorDeckModal from '@/components/investor/InvestorDeckModal';

export default function HomePage() {
  const { user, switchUser, currency, formatCurrency } = useAuth();
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [studentCount, setStudentCount] = useState(0);
  const [showPitchModal, setShowPitchModal] = useState(false);

  useEffect(() => {
    const allJobs = getJobs();
    setFeaturedJobs(allJobs.slice(0, 3));
    const allUsers = getUsers();
    setStudentCount(allUsers.filter((u) => u.role === 'student').length);
  }, []);

  const CATEGORIES = [
    {
      name: 'Family & Elderly Care',
      icon: <HeartHandshake className="w-5 h-5 text-rose-500" />,
      count: 'Diaspora Special',
      description: 'Clinic visits, medicine runs & digital paperwork assistance for parents back home.',
    },
    {
      name: 'Web Development',
      icon: <Code className="w-5 h-5 text-amber-500" />,
      count: '2+ Open Tasks',
      description: 'Next.js 14, React, Python, APIs, and modern full-stack web engineering.',
    },
    {
      name: 'Graphic Design',
      icon: <Palette className="w-5 h-5 text-purple-500" />,
      count: '2+ Open Tasks',
      description: 'Figma UI/UX, product mockups, pitch decks, and brand identities.',
    },
    {
      name: 'Tutoring & STEM',
      icon: <BookOpen className="w-5 h-5 text-emerald-500" />,
      count: '1+ Open Task',
      description: 'Calculus, computer science, physics, and university entrance tutoring.',
    },
    {
      name: 'Market Research',
      icon: <LineChart className="w-5 h-5 text-blue-500" />,
      count: '1+ Open Task',
      description: 'Competitive intelligence, local vendor surveys, and academic literature analysis.',
    },
    {
      name: 'Translation',
      icon: <Languages className="w-5 h-5 text-teal-500" />,
      count: 'Available',
      description: 'Multi-lingual local language translation (Kannada, Hindi, Telugu, Tamil, French).',
    },
  ];

  return (
    <div className="space-y-16 pb-20 bg-zinc-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-white border-b border-zinc-800 bg-grid-zinc-dark">
        {/* Ambient lighting glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* 18+ Guarantee & Seed Pitch Pill */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/90 text-zinc-300 text-xs font-mono font-medium border border-zinc-800 mb-6 shadow-glow-amber">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-amber-400 font-bold">🇬🇧 £8,000 Seed-Grant Ready</span>
            <span className="text-zinc-600">•</span>
            <span>Strictly 18+ Verified University Students</span>
            <span className="text-zinc-600">•</span>
            <span className="text-emerald-400">Neutral Escrow Vault</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-[1.12] font-display">
            The High-Trust Marketplace For Global Clients &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">
              Verified 18+ University Students
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            From technical freelance gigs to <strong>cross-border diaspora family concierge</strong>: Hire vetted
            university students with guaranteed milestone escrow, multi-currency billing (USD, GBP, EUR, INR),
            and live task workspace chat.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/jobs"
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-sm shadow-glow-amber transition flex items-center gap-2 group"
            >
              <Briefcase className="w-4 h-4" />
              <span>Browse Open Tasks</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {user?.role === 'client' ? (
              <Link
                href="/jobs/new"
                className="px-6 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 font-semibold rounded-xl text-sm transition"
              >
                Post a Task
              </Link>
            ) : (
              <Link
                href="/signup"
                className="px-6 py-3.5 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-semibold rounded-xl text-sm transition flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>Join as a Student (18+)</span>
              </Link>
            )}

            <button
              onClick={() => setShowPitchModal(true)}
              className="px-5 py-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-sm font-mono font-bold transition flex items-center gap-2"
            >
              <PieChart className="w-4 h-4" />
              <span>£8,000 Pitch & Roadmap</span>
            </button>
          </div>

          {/* Quick 1-Click Interactive Demo Persona Switcher */}
          <div className="mt-12 p-4 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-2xl max-w-4xl mx-auto shadow-2xl text-left">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-xs font-mono font-bold text-zinc-300">
                  Quick Demo Switcher (Simulate Any Persona):
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => switchUser('user_client_raj')}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-mono font-medium transition ${
                    user?.id === 'user_client_raj'
                      ? 'bg-amber-500 text-zinc-950 border-amber-500 font-bold shadow-xs'
                      : 'bg-zinc-800/80 hover:bg-zinc-750 text-zinc-300 border-zinc-700'
                  }`}
                >
                  Expat Raj (London)
                </button>
                <button
                  onClick={() => switchUser('user_client_sarah')}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-mono font-medium transition ${
                    user?.id === 'user_client_sarah'
                      ? 'bg-amber-500 text-zinc-950 border-amber-500 font-bold shadow-xs'
                      : 'bg-zinc-800/80 hover:bg-zinc-750 text-zinc-300 border-zinc-700'
                  }`}
                >
                  Founder Sarah (SF)
                </button>
                <button
                  onClick={() => switchUser('user_student_priya')}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-mono font-medium transition ${
                    user?.id === 'user_student_priya'
                      ? 'bg-emerald-500 text-zinc-950 border-emerald-500 font-bold shadow-xs'
                      : 'bg-zinc-800/80 hover:bg-zinc-750 text-zinc-300 border-zinc-700'
                  }`}
                >
                  Student Priya (Bangalore)
                </button>
                <button
                  onClick={() => switchUser('user_student_alex')}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-mono font-medium transition ${
                    user?.id === 'user_student_alex'
                      ? 'bg-emerald-500 text-zinc-950 border-emerald-500 font-bold shadow-xs'
                      : 'bg-zinc-800/80 hover:bg-zinc-750 text-zinc-300 border-zinc-700'
                  }`}
                >
                  Student Alex (Dev, 21)
                </button>
                <button
                  onClick={() => switchUser('user_admin')}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-mono font-medium transition ${
                    user?.id === 'user_admin'
                      ? 'bg-purple-500 text-zinc-950 border-purple-500 font-bold shadow-xs'
                      : 'bg-zinc-800/80 hover:bg-zinc-750 text-purple-300 border-zinc-700'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Simulator Section (Fintech / Escrow Polish) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EscrowSimulator />
      </section>

      {/* Cross-Border Hyper-Local Concierge Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-zinc-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-mono font-semibold text-rose-400">
                <Globe className="w-3.5 h-3.5" />
                <span>GLOBAL DIASPORA & NON-LOCAL INNOVATION</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-white font-display">
                Living Abroad? Hire Local 18+ Students To Help Your Family Back Home.
              </h2>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                Whether you live in London, New York, Toronto, or Sydney: Your elderly parents should never feel stranded.
                GSAP bridges the distance by connecting you directly to verified, bilingual local university students near your family&apos;s hometown.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-zinc-300">
                <div className="flex items-start gap-2 bg-zinc-950/50 p-2.5 rounded-xl border border-zinc-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Hospital escort, cardiology checks & medicine procurement</span>
                </div>
                <div className="flex items-start gap-2 bg-zinc-950/50 p-2.5 rounded-xl border border-zinc-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Digital banking, pension certificates & smartphone setup</span>
                </div>
                <div className="flex items-start gap-2 bg-zinc-950/50 p-2.5 rounded-xl border border-zinc-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Cross-border escrow: Fund in GBP/USD, student receives local INR</span>
                </div>
                <div className="flex items-start gap-2 bg-zinc-950/50 p-2.5 rounded-xl border border-zinc-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Direct workspace task chat with photo updates & doctor receipts</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                <Link
                  href="/jobs?category=Family%20%26%20Elderly%20Care"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-xs transition shadow-glow-amber"
                >
                  Explore Concierge Tasks
                </Link>
                <Link
                  href="/jobs/new"
                  className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl text-xs transition border border-zinc-700"
                >
                  Post a Family Task
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-zinc-950/80 backdrop-blur-md rounded-2xl p-6 border border-zinc-800 space-y-4">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                Real-Time Corridor Simulation
              </div>
              <div className="bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-xl p-4 space-y-2 text-xs shadow-sm">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                  <span className="font-semibold text-amber-400">Expat in London (GBP)</span>
                  <span>➔</span>
                  <span className="font-semibold text-emerald-400">Bangalore Student (INR)</span>
                </div>
                <p className="font-bold text-sm text-white">
                  Cardiology Hospital Companion & Digital Paperwork
                </p>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-zinc-800 font-mono">
                  <span className="text-zinc-400">Milestone Escrow:</span>
                  <span className="font-bold text-emerald-400">{formatCurrency(70)} (Held in Vault)</span>
                </div>
              </div>

              <div className="text-xs text-zinc-400 leading-relaxed italic bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/60">
                &quot;I work in London and couldn&apos;t travel for mom&apos;s routine clinic checks.
                Through GSAP, Priya escorted my mother, communicated in Kannada, and sent updates
                straight to my task workspace.&quot;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights & Platform Metrics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 text-center shadow-xs hover:border-amber-400 transition">
            <p className="text-3xl font-black font-mono text-amber-500">100%</p>
            <p className="text-xs font-bold text-zinc-800 uppercase tracking-wider mt-1">
              18+ Age Verified
            </p>
            <p className="text-xs text-zinc-400 mt-1">Strict zero-underage policy</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-zinc-200 text-center shadow-xs hover:border-amber-400 transition">
            <p className="text-3xl font-black font-mono text-zinc-900">4 Currencies</p>
            <p className="text-xs font-bold text-zinc-800 uppercase tracking-wider mt-1">
              USD, GBP, EUR, INR
            </p>
            <p className="text-xs text-zinc-400 mt-1">Live real-time FX engine</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-zinc-200 text-center shadow-xs hover:border-amber-400 transition">
            <p className="text-3xl font-black font-mono text-emerald-600">100% Escrow</p>
            <p className="text-xs font-bold text-zinc-800 uppercase tracking-wider mt-1">
              Milestone Vault
            </p>
            <p className="text-xs text-zinc-400 mt-1">Zero fraud or payment risk</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-zinc-200 text-center shadow-xs hover:border-amber-400 transition">
            <p className="text-3xl font-black font-mono text-indigo-600">1.2s Match</p>
            <p className="text-xs font-bold text-zinc-800 uppercase tracking-wider mt-1">
              AI Matching Engine
            </p>
            <p className="text-xs text-zinc-400 mt-1">Major, rate & corridor scoring</p>
          </div>
        </div>
      </section>

      {/* Task Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-zinc-900 font-display">
              Task Disciplines & Disciplined Talent
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
              Hire verified university students across professional disciplines and local family care
            </p>
          </div>
          <Link
            href="/jobs"
            className="text-xs sm:text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((cat, idx) => (
            <Link
              key={idx}
              href={`/jobs?category=${encodeURIComponent(cat.name)}`}
              className="bg-white p-6 rounded-2xl border border-zinc-200 hover:border-amber-400 hover:shadow-card-hover transition-all duration-200 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-100 group-hover:bg-amber-50 flex items-center justify-center transition">
                    {cat.icon}
                  </div>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-zinc-100 group-hover:bg-amber-100 text-zinc-700 group-hover:text-amber-800 border border-zinc-200 transition">
                    {cat.count}
                  </span>
                </div>
                <h3 className="text-base font-bold text-zinc-900 group-hover:text-amber-600 transition">
                  {cat.name}
                </h3>
                <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-zinc-400 group-hover:text-amber-600 transition">
                <span>Explore Open Tasks</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Open Tasks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-zinc-900 font-display">
              Featured Verified Tasks
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
              Live tasks awaiting student proposals with escrow funds guaranteed
            </p>
          </div>
          <Link
            href="/jobs"
            className="text-xs sm:text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            <span>Explore All Tasks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} currentUser={user} />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-zinc-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-zinc-800">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black tracking-tight font-display">How GSAP Works</h2>
            <p className="mt-3 text-zinc-400 text-sm">
              Engineered for institutional trust, verified age safety, and transparent escrow hiring from day one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-6">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 block mb-2">
                FOR CLIENTS, FOUNDERS & DIASPORAS
              </span>
              <h3 className="text-xl font-bold mb-4">Post Tasks & Deposit Escrow</h3>
              <ul className="space-y-3.5 text-xs sm:text-sm text-zinc-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Post hourly jobs or cross-border family concierge tasks in any currency (GBP, USD, EUR).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Review student proposals with cryptographic 18+ certificates and AI Match scores.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Deposit milestone funds into neutral GSAP Escrow when hiring — 100% risk-free.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Coordinate via in-app workspace chat, inspect work, and release funds with ratings.</span>
                </li>
              </ul>
            </div>

            <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-6">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 block mb-2">
                FOR STUDENTS (18+ ONLY)
              </span>
              <h3 className="text-xl font-bold mb-4">Earn Hourly With Protected Escrow</h3>
              <ul className="space-y-3.5 text-xs sm:text-sm text-zinc-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Complete instant 18+ student ID verification and earn your verified credential badge.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Gain instant insight from our AI Match Score % on open local & global opportunities.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Work with guaranteed payments locked in escrow before you ever begin work.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Withdraw earnings directly from your GSAP wallet to your bank account or local UPI.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Grant Investor Pitch Deck Modal */}
      <InvestorDeckModal
        isOpen={showPitchModal}
        onClose={() => setShowPitchModal(false)}
      />
    </div>
  );
}
