'use client';

import React, { useState } from 'react';
import { VerificationStatus } from '@/types';
import { ShieldCheck, Clock, XCircle, Sparkles, SlidersHorizontal, Check } from 'lucide-react';
import { updateUser } from '@/lib/storage';
import { useAuth } from '@/context/AuthContext';

interface VerificationBadgeProps {
  userId: string;
  status?: VerificationStatus;
  editable?: boolean;
  onStatusChange?: (newStatus: VerificationStatus) => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function VerificationBadge({
  userId,
  status = 'pending',
  editable = false,
  onStatusChange,
  size = 'md',
}: VerificationBadgeProps) {
  const [currentStatus, setCurrentStatus] = useState<VerificationStatus>(status);
  const [showSimulator, setShowSimulator] = useState(false);
  const { refreshUser } = useAuth();

  const handleSimulate = (nextStatus: VerificationStatus) => {
    try {
      updateUser(userId, { verificationStatus: nextStatus });
      setCurrentStatus(nextStatus);
      if (onStatusChange) onStatusChange(nextStatus);
      refreshUser();
      setShowSimulator(false);
    } catch (e) {
      console.error('Failed to update verification status:', e);
    }
  };

  const getBadgeConfig = () => {
    switch (currentStatus) {
      case 'verified':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-mono',
          icon: <ShieldCheck className={size === 'sm' ? 'w-3.5 h-3.5 text-emerald-600' : 'w-4 h-4 text-emerald-600'} />,
          label: '18+ Verified Student',
          description: 'Official academic enrollment & date of birth cryptographically confirmed (18+ only).',
        };
      case 'pending':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300 font-mono',
          icon: <Clock className={size === 'sm' ? 'w-3.5 h-3.5 text-amber-600' : 'w-4 h-4 text-amber-600'} />,
          label: 'Verification Pending',
          description: 'Document under automated institutional review.',
        };
      case 'rejected':
      default:
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-300 font-mono',
          icon: <XCircle className={size === 'sm' ? 'w-3.5 h-3.5 text-rose-600' : 'w-4 h-4 text-rose-600'} />,
          label: 'Unverified Account',
          description: 'Identity credentials need re-validation.',
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <div className="flex items-center gap-1.5">
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-full border shadow-2xs ${config.bg} ${
            size === 'sm' ? 'px-2 py-0.5 text-[10px]' : size === 'lg' ? 'px-3 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'
          }`}
          title={config.description}
        >
          {config.icon}
          <span>{config.label}</span>
        </span>

        {editable && (
          <button
            type="button"
            onClick={() => setShowSimulator(!showSimulator)}
            className="p-1 text-zinc-400 hover:text-amber-600 rounded-md hover:bg-zinc-100 transition"
            title="Simulate Verification State (Demo Feature)"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Interactive Simulation Drawer */}
      {showSimulator && editable && (
        <div className="mt-2 p-3 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl w-64 z-20 animate-fade-in text-zinc-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono font-bold text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Simulate Status (Demo)
            </span>
            <button
              onClick={() => setShowSimulator(false)}
              className="text-zinc-400 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>
          <p className="text-[10px] text-zinc-400 mb-2 leading-tight">
            Toggle state to observe UI reaction, matching engine compatibility, and badge:
          </p>
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => handleSimulate('verified')}
              className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-mono font-medium flex items-center justify-between transition ${
                currentStatus === 'verified'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                  : 'hover:bg-zinc-800 text-zinc-300'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Pass (18+ Verified)
              </span>
              {currentStatus === 'verified' && <Check className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => handleSimulate('pending')}
              className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-mono font-medium flex items-center justify-between transition ${
                currentStatus === 'pending'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                  : 'hover:bg-zinc-800 text-zinc-300'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Pending Review
              </span>
              {currentStatus === 'pending' && <Check className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => handleSimulate('rejected')}
              className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-mono font-medium flex items-center justify-between transition ${
                currentStatus === 'rejected'
                  ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30'
                  : 'hover:bg-zinc-800 text-zinc-300'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5 text-rose-400" /> Fail / Needs Review
              </span>
              {currentStatus === 'rejected' && <Check className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
