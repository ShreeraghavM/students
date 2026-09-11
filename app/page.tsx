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
  FileSpreadsheet,
  Languages,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { getJobs, getUsers } from '@/lib/storage';
import { Job, User } from '@/types';
import JobCard from '@/components/jobs/JobCard';

export default function HomePage() {
  const { user, switchUser } = useAuth();
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    const allJobs = getJobs();
    setFeaturedJobs(allJobs.slice(0, 3));
    const allUsers = getUsers();
    setStudentCount(allUsers.filter((u) => u.role === 'student').length);
  }, []);

  const CATEGORIES = [
    { name: 'Web Development', icon: <Code className="w-5 h-5 text-brand-600" />, count: '2+ Open' },
    { name: 'Graphic Design', icon: <Palette className="w-5 h-5 text-pink-600" />, count: '2+ Open' },
    { name: 'Tutoring & STEM', icon: <BookOpen className="w-5 h-5 text-emerald-600" />, count: '1+ Open' },
    { name: 'Market Research', icon: <LineChart className="w-5 h-5 text-amber-600" />, count: '1+ Open' },
    { name: 'Data Entry', icon: <FileSpreadsheet className="w-5 h-5 text-blue-600" />, count: 'Available' },
    { name: 'Translation', icon: <Languages className="w-5 h-5 text-purple-600" />, count: 'Available' },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 bg-gradient-to-b from-brand-50/70 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* 18+ Guarantee Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 mb-6 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Strictly 18+ Verified University Students & Clients</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Empower Your Business With{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-700">
              Verified Student Talent
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            The trusted peer marketplace connecting businesses, founders, and professionals
            with vetted university students (18+ only) offering high-impact hourly assistance
            in coding, design, STEM tutoring, and research.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/jobs"
              className="px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl text-sm shadow-md hover:shadow-lg transition flex items-center gap-2 group"
            >
              <Briefcase className="w-4 h-4" />
              <span>Browse Open Tasks</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {user?.role === 'client' ? (
              <Link
                href="/jobs/new"
                className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold rounded-xl text-sm shadow-xs transition"
              >
                Post a New Job
              </Link>
            ) : (
              <Link
                href="/signup"
                className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold rounded-xl text-sm shadow-xs transition flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4 text-brand-600" />
                <span>Join as a Student (18+)</span>
              </Link>
            )}
          </div>

          {/* Quick 1-Click Interactive Demo Persona Switcher */}
          <div className="mt-12 p-4 bg-white/80 backdrop-blur-sm border border-slate-200/90 rounded-2xl max-w-3xl mx-auto shadow-xs text-left">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600 flex-shrink-0" />
                <span className="text-xs font-bold text-slate-700">Quick Test Personas (1-Click Switch):</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => switchUser('user_client_sarah')}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                    user?.id === 'user_client_sarah'
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  Client (Sarah)
                </button>
                <button
                  onClick={() => switchUser('user_student_alex')}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                    user?.id === 'user_student_alex'
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  Student Alex (Dev, 21)
                </button>
                <button
                  onClick={() => switchUser('user_student_maya')}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                    user?.id === 'user_student_maya'
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  Student Maya (Design, 20)
                </button>
                <button
                  onClick={() => switchUser('user_admin')}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                    user?.id === 'user_admin'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights & Platform Metrics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center shadow-xs">
            <p className="text-3xl font-extrabold text-brand-600">100%</p>
            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mt-1">
              18+ Age Verified
            </p>
            <p className="text-xs text-slate-400 mt-1">Zero underage accounts</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center shadow-xs">
            <p className="text-3xl font-extrabold text-slate-900">$25 - $40</p>
            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mt-1">
              Hourly Rates
            </p>
            <p className="text-xs text-slate-400 mt-1">Fair, transparent pay</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center shadow-xs">
            <p className="text-3xl font-extrabold text-emerald-600">98%</p>
            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mt-1">
              Job Success Rate
            </p>
            <p className="text-xs text-slate-400 mt-1">Reciprocal star ratings</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center shadow-xs">
            <p className="text-3xl font-extrabold text-indigo-600">AI Match</p>
            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mt-1">
              Smart Matching
            </p>
            <p className="text-xs text-slate-400 mt-1">Skill & rate alignment</p>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Task Categories</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Find specialized student talent across university disciplines
            </p>
          </div>
          <Link
            href="/jobs"
            className="text-xs sm:text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={i}
              href={`/jobs?category=${encodeURIComponent(cat.name)}`}
              className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-md transition text-center group"
            >
              <div className="w-12 h-12 mx-auto rounded-xl bg-slate-50 group-hover:bg-brand-50 flex items-center justify-center mb-3 transition">
                {cat.icon}
              </div>
              <p className="text-xs font-bold text-slate-900 leading-tight mb-1">{cat.name}</p>
              <p className="text-[11px] text-slate-400 font-medium">{cat.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* How it Works: Dual Pathway */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight">How GSAP Works</h2>
            <p className="mt-3 text-slate-300 text-sm">
              Designed for trust, verified age safety, and transparent hiring from day one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Clients */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400 block mb-2">
                For Clients & Businesses
              </span>
              <h3 className="text-xl font-bold mb-4">Post Tasks & Hire Verified Talent</h3>
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                  <span>Post hourly jobs with specific required skills and budget estimates.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                  <span>Review student applicants with verified 18+ badges and tailored cover letters.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                  <span>Hire with one click — automatically notifies applicants and starts work.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                  <span>Mark complete and exchange reciprocal 5-star reviews to build platform reputation.</span>
                </li>
              </ul>
            </div>

            {/* For Students */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-2">
                For Students (18+ Only)
              </span>
              <h3 className="text-xl font-bold mb-4">Earn Hourly With Flexible University Gigs</h3>
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Create a student profile highlighting your university, skills, and target hourly rate.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Gain instant insight from our AI Match Score % on every available job.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Apply with custom proposed rates and track status live in your dashboard.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Build verified client reviews and ratings to accelerate future career opportunities.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Featured Open Tasks</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Browse current projects needing university student assistance
            </p>
          </div>
          <Link
            href="/jobs"
            className="text-xs sm:text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>Explore All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} currentUser={user} />
          ))}
        </div>
      </section>
    </div>
  );
}
