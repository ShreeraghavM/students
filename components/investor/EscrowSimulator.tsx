'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth, CURRENCY_RATES } from '@/context/AuthContext';
import { Currency } from '@/types';
import {
  Globe,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  CheckCircle2,
  HelpCircle,
  Repeat,
  Wallet,
} from 'lucide-react';

export default function EscrowSimulator() {
  const { currency, setCurrency, formatCurrency, convertFromUSD } = useAuth();
  const [amountUSD, setAmountUSD] = useState<number>(75);
  const [selectedCorridor, setSelectedCorridor] = useState<'london-blr' | 'nyc-hyd' | 'berlin-del' | 'toronto-pun'>('london-blr');

  const CORRIDORS = {
    'london-blr': {
      sourceCity: 'London, UK',
      sourceCurrency: 'GBP' as Currency,
      destCity: 'Bangalore, India',
      destCurrency: 'INR' as Currency,
      sampleTask: 'Elderly Clinic Escrow & Paperwork',
      language: 'Kannada & English',
    },
    'nyc-hyd': {
      sourceCity: 'New York, USA',
      sourceCurrency: 'USD' as Currency,
      destCity: 'Hyderabad, India',
      destCurrency: 'INR' as Currency,
      sampleTask: 'Property Deed & Digital Land Survey',
      language: 'Telugu & English',
    },
    'berlin-del': {
      sourceCity: 'Berlin, Germany',
      sourceCurrency: 'EUR' as Currency,
      destCity: 'New Delhi, India',
      destCurrency: 'INR' as Currency,
      sampleTask: 'Smartphone Banking & Pension Assist',
      language: 'Hindi & English',
    },
    'toronto-pun': {
      sourceCity: 'Toronto, Canada',
      sourceCurrency: 'USD' as Currency,
      destCity: 'Pune, India',
      destCurrency: 'INR' as Currency,
      sampleTask: 'Home Wi-Fi & Smart TV Setup for Parents',
      language: 'Marathi & English',
    },
  };

  const active = CORRIDORS[selectedCorridor];

  // Calculations
  const sourceAmount = amountUSD * CURRENCY_RATES[active.sourceCurrency].rate;
  const destAmount = amountUSD * CURRENCY_RATES[active.destCurrency].rate;
  const feeUSD = Math.round(amountUSD * 0.05 * 100) / 100;
  const sourceFee = feeUSD * CURRENCY_RATES[active.sourceCurrency].rate;
  const studentReceivesLocal = destAmount;

  const milestone1 = Math.round((destAmount * 0.5) * 100) / 100;
  const milestone2 = Math.round((destAmount * 0.5) * 100) / 100;

  const formatSource = (val: number) => {
    const sym = active.sourceCurrency === 'GBP' ? '£' : active.sourceCurrency === 'EUR' ? '€' : '$';
    return `${sym}${val.toFixed(2)}`;
  };

  const formatDest = (val: number) => {
    return `₹${Math.round(val).toLocaleString()}`;
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-medium mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>INTERACTIVE CROSS-BORDER ESCROW CALCULATOR</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Simulate Live Diaspora Milestone Escrow
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Test how an expat client pays in GBP or USD while local 18+ university students receive protected INR.
            </p>
          </div>

          {/* Preset Corridor Selector */}
          <div className="flex flex-wrap gap-1.5 bg-zinc-950/70 p-1 rounded-2xl border border-zinc-800 self-start">
            <button
              onClick={() => setSelectedCorridor('london-blr')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCorridor === 'london-blr'
                  ? 'bg-amber-500 text-zinc-950 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              London ➔ Bangalore
            </button>
            <button
              onClick={() => setSelectedCorridor('nyc-hyd')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCorridor === 'nyc-hyd'
                  ? 'bg-amber-500 text-zinc-950 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              NYC ➔ Hyderabad
            </button>
            <button
              onClick={() => setSelectedCorridor('berlin-del')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCorridor === 'berlin-del'
                  ? 'bg-amber-500 text-zinc-950 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Berlin ➔ Delhi
            </button>
          </div>
        </div>

        {/* Input slider & live numbers */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Slider and Controls */}
          <div className="lg:col-span-7 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 space-y-5">
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                <span>Task Budget Amount:</span>
                <span className="font-mono text-white text-base font-bold">
                  {formatSource(sourceAmount)} ({active.sourceCurrency})
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="300"
                step="5"
                value={amountUSD}
                onChange={(e) => setAmountUSD(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[11px] text-zinc-500 font-mono mt-1">
                <span>Min: $20 (~£16)</span>
                <span>Typical Task: $75 (~£59)</span>
                <span>Max: $300 (~£237)</span>
              </div>
            </div>

            {/* Task Details Info */}
            <div className="pt-2 border-t border-zinc-800/80 grid grid-cols-2 gap-3 text-xs">
              <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[11px]">Route & Language:</span>
                <span className="text-zinc-200 font-medium">{active.sourceCity} ➔ {active.destCity}</span>
                <span className="text-amber-400/90 text-[11px] block mt-0.5">({active.language})</span>
              </div>
              <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[11px]">Representative Task:</span>
                <span className="text-zinc-200 font-medium line-clamp-1">{active.sampleTask}</span>
                <span className="text-emerald-400 text-[11px] block mt-0.5">18+ Student Verified</span>
              </div>
            </div>

            {/* Escrow Milestone Timeline Breakdown */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                Two-Stage Escrow Protection Schedule:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-zinc-900/80 border border-zinc-800 p-3 rounded-xl">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-zinc-400">Milestone 1 (Start)</span>
                    <span className="font-mono text-emerald-400 font-bold">{formatDest(milestone1)}</span>
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    Locked in neutral escrow vault upon student hiring. Released when student arrives at parent location.
                  </p>
                </div>
                <div className="bg-zinc-900/80 border border-zinc-800 p-3 rounded-xl">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-zinc-400">Milestone 2 (Complete)</span>
                    <span className="font-mono text-emerald-400 font-bold">{formatDest(milestone2)}</span>
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    Released to student bank/UPI only after diaspora client confirms receipt of photos & doctor report.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: High-Impact Payout Summary Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-zinc-800/80 via-zinc-900 to-zinc-950 border border-zinc-700/70 rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400">FINANCIAL SUMMARY</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold border border-emerald-500/20">
                100% Escrow Backed
              </span>
            </div>

            {/* Price figures */}
            <div className="space-y-3 pb-3 border-b border-zinc-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Sponsor Pays ({active.sourceCurrency}):</span>
                <span className="font-mono font-bold text-white text-base">
                  {formatSource(sourceAmount + sourceFee)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">5% Platform Escrow Guarantee:</span>
                <span className="font-mono text-zinc-400">{formatSource(sourceFee)}</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-zinc-800/50">
                <span className="text-emerald-400 font-medium">Student Net Earnings:</span>
                <span className="font-mono font-bold text-emerald-400 text-lg">
                  {formatDest(studentReceivesLocal)}
                </span>
              </div>
            </div>

            {/* Zero-Risk Guarantees */}
            <div className="space-y-2 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero foreign transaction or wire transfer friction</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Client retains 100% dispute freeze protection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant UPI / NEFT payout to student upon approval</span>
              </div>
            </div>

            {/* Action CTA */}
            <Link
              href="/jobs/new"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-glow-amber"
            >
              <span>Post This Task In Escrow</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
