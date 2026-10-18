'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
import InvestorDeckModal from '@/components/investor/InvestorDeckModal';

export default function LivePlatformTicker() {
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const UPDATES = [
    {
      corridor: '🇬🇧 London ➔ 🇮🇳 Bangalore',
      task: 'Priya S. completed Cardiology Hospital Escort',
      escrow: '£55.30 Escrow Released',
      status: 'success',
    },
    {
      corridor: '🇺🇸 San Francisco ➔ 🇮🇳 Pune',
      task: 'Alex C. submitted Next.js 14 Dashboard',
      escrow: '$120.00 Escrow Held',
      status: 'pending',
    },
    {
      corridor: '🇬🇧 Manchester ➔ 🇮🇳 Hyderabad',
      task: 'Digital Pension & Land Paperwork Assistance',
      escrow: '£45.00 Funded (Kannada / Telugu)',
      status: 'active',
    },
    {
      corridor: '🛡️ Platform Telemetry (2026)',
      task: 'AI Match Latency: 1.1s • 18+ Verification: 100% • Zero Chargeback Risk',
      escrow: '£8,000 Grant Ready',
      status: 'grant',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % UPDATES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [UPDATES.length]);

  const current = UPDATES[activeIdx];

  return (
    <>
      <div className="bg-zinc-900/90 border-b border-zinc-800 text-zinc-300 text-xs py-2 px-4 overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Left: Ticker item */}
          <div className="flex items-center gap-2.5 truncate w-full sm:w-auto">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[11px] font-bold text-amber-400 shrink-0">
              [LIVE FEED]
            </span>
            <div className="truncate text-xs animate-fade-in flex items-center gap-2">
              <span className="font-semibold text-white">{current.corridor}:</span>
              <span className="text-zinc-300 truncate">{current.task}</span>
              <span className="hidden md:inline font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 text-[10px]">
                {current.escrow}
              </span>
            </div>
          </div>

          {/* Right: Funding pitch link */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowPitchModal(true)}
              className="text-[11px] font-mono font-bold text-amber-400 hover:text-amber-300 transition flex items-center gap-1 group"
            >
              <span>£8,000 Grant Allocation Deck</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
            </button>
          </div>
        </div>
      </div>

      <InvestorDeckModal
        isOpen={showPitchModal}
        onClose={() => setShowPitchModal(false)}
      />
    </>
  );
}
