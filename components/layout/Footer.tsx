import React from 'react';
import Link from 'next/link';
import { GraduationCap, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand & Guarantee */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight">
                Global Student Assistance Platform
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              A high-trust peer marketplace connecting clients with verified university students
              (18+ only) offering skilled hourly services across technology, design, tutoring,
              and research.
            </p>
            {/* 18+ Safety Notice Banner */}
            <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl flex items-start gap-3 max-w-md">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-semibold text-slate-200 block mb-0.5">
                  Strict 18+ Age Policy
                </span>
                <span className="text-slate-400">
                  All platform participants must be at least 18 years of age. Registration validates
                  date of birth, and underage participation is strictly prohibited.
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/jobs" className="hover:text-white transition">
                  Browse All Jobs
                </Link>
              </li>
              <li>
                <Link href="/jobs?category=Web+Development" className="hover:text-white transition">
                  Web Development
                </Link>
              </li>
              <li>
                <Link href="/jobs?category=Graphic+Design" className="hover:text-white transition">
                  Graphic Design
                </Link>
              </li>
              <li>
                <Link href="/jobs?category=Tutoring" className="hover:text-white transition">
                  Tutoring & STEM
                </Link>
              </li>
              <li>
                <Link href="/jobs?remoteOnly=true" className="hover:text-white transition">
                  Remote Opportunities
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform & Trust */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Trust & System
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/login" className="hover:text-white transition">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-white transition">
                  Student Sign Up (18+)
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition">
                  Admin Control Panel
                </Link>
              </li>
              <li className="pt-2 text-xs text-slate-500">
                Storage: LocalStorage (Offline / In-Browser Demo)
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Global Student Assistance Platform (GSAP). All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with Next.js 14, TypeScript & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
