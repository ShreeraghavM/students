'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, ShieldCheck, Heart, PieChart, Sparkles, Globe, Terminal } from 'lucide-react';
import InvestorDeckModal from '@/components/investor/InvestorDeckModal';

export default function Footer() {
  const [showPitchModal, setShowPitchModal] = useState(false);

  return (
    <>
      <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
            {/* Column 1: Brand & Guarantee */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3 text-white">
                <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-zinc-950 font-black shadow-glow-amber">
                  <GraduationCap className="w-5 h-5 text-zinc-950 stroke-[2.5]" />
                </div>
                <div>
                  <span className="font-black text-lg tracking-tight font-display text-white">
                    GSAP
                  </span>
                  <span className="block text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                    Global Student Assistance Platform
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md leading-relaxed">
                A high-trust peer marketplace connecting global clients and diasporas with verified 18+ university students
                for high-skill technology, research, design, and family concierge assistance with neutral milestone escrow.
              </p>

              {/* 18+ Safety Notice Banner */}
              <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-start gap-3 max-w-md">
                <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-zinc-200 block mb-0.5 font-mono">
                    Strict 18+ University Age Policy
                  </span>
                  <span className="text-zinc-400 text-[11px] leading-relaxed">
                    All student participants must be at least 18 years of age with verified academic standing. Underage participation is strictly prohibited by cryptographic verification.
                  </span>
                </div>
              </div>

              {/* Seed grant badge */}
              <button
                onClick={() => setShowPitchModal(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold hover:bg-amber-500/20 transition"
              >
                <PieChart className="w-3.5 h-3.5" />
                <span>Review £8,000 GBP Grant Allocation & Moat</span>
              </button>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200 mb-4">
                Explore Tasks
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li>
                  <Link href="/jobs" className="text-zinc-400 hover:text-amber-400 transition">
                    Browse All Open Tasks
                  </Link>
                </li>
                <li>
                  <Link href="/jobs?category=Family%20%26%20Elderly%20Care" className="text-zinc-400 hover:text-amber-400 transition">
                    Diaspora Family Concierge
                  </Link>
                </li>
                <li>
                  <Link href="/jobs?category=Web%20Development" className="text-zinc-400 hover:text-amber-400 transition">
                    Web & Software Engineering
                  </Link>
                </li>
                <li>
                  <Link href="/jobs?category=Graphic%20Design" className="text-zinc-400 hover:text-amber-400 transition">
                    Design & Figma Prototyping
                  </Link>
                </li>
                <li>
                  <Link href="/jobs?category=Tutoring" className="text-zinc-400 hover:text-amber-400 transition">
                    STEM & University Tutoring
                  </Link>
                </li>
                <li>
                  <Link href="/jobs?remoteOnly=true" className="text-zinc-400 hover:text-amber-400 transition">
                    Remote-Only Work
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Platform & Trust */}
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200 mb-4">
                Trust & Architecture
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li>
                  <Link href="/login" className="text-zinc-400 hover:text-amber-400 transition">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="text-zinc-400 hover:text-amber-400 transition">
                    Student Registration (18+)
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="text-zinc-400 hover:text-amber-400 transition">
                    Admin Control Panel
                  </Link>
                </li>
                <li className="pt-2 text-xs font-mono text-zinc-500">
                  Engine: Next.js 14 App Router
                </li>
                <li className="text-xs font-mono text-zinc-500">
                  Escrow: Neutral Vault Guarantee
                </li>
                <li className="text-xs font-mono text-zinc-500">
                  Design: Garry Tan gstack Inspired
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-800/80 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4 font-mono">
            <p>© {new Date().getFullYear()} Global Student Assistance Platform (GSAP). All rights reserved.</p>
            <div className="flex items-center gap-2 text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Full-Stack 2026 Production Architecture</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Grant Investor Pitch Deck Modal */}
      <InvestorDeckModal
        isOpen={showPitchModal}
        onClose={() => setShowPitchModal(false)}
      />
    </>
  );
}
