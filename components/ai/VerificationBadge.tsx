'use client';

import React, { useState } from 'react';
import { VerificationStatus } from '@/types';
import { ShieldCheck, Clock, XCircle, Sparkles, SlidersHorizontal, Check } from 'lucide-react';
import { updateUser } from '@/lib/storage';
import { useAuth } from '@/context/AuthContext';

interface VerificationBadgeProps {
  userId: string;
  status?: VerificationStatus;
  editable?: boolean; // Can current viewer trigger simulated state changes?
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
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <ShieldCheck className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4 text-emerald-600'} />,
          label: 'Verified 18+ Student',
          description: 'Identity & university student status validated (18+ confirmed).',
        };
      case 'pending':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <Clock className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4 text-amber-600'} />,
          label: 'Verification Pending',
          description: 'Simulated verification under automated document review.',
        };
      case 'rejected':
      default:
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: <XCircle className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4 text-rose-600'} />,
          label: 'Verification Incomplete',
          description: 'Identity credentials need re-validation.',
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <div className="flex items-center gap-1.5">
        <span
          className={`inline-flex items-center gap-1.5 font-semibold rounded-full border shadow-2xs ${config.bg} ${
            size === 'sm' ? 'px-2 py-0.5 text-[11px]' : size === 'lg' ? 'px-3 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'
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
            className="p-1 text-slate-400 hover:text-brand-600 rounded-md hover:bg-slate-100 transition"
            title="Simulate Verification State (Demo Feature)"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Interactive Simulation Drawer */}
      {showSimulator && editable && (
        <div className="mt-2 p-3 bg-white border border-brand-200 rounded-xl shadow-lg w-64 z-20 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand-600" />
              Simulate Status (Demo)
            </span>
            <button
              onClick={() => setShowSimulator(false)}
              className="text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          </div>
          <p className="text-[10px] text-slate-500 mb-2 leading-tight">
            Switch states to observe UI reactions, match scores, and badge styling:
          </p>
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => handleSimulate('verified')}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                currentStatus === 'verified'
                  ? 'bg-emerald-100 text-emerald-900 font-semibold'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Pass (Verified)
              </span>
              {currentStatus === 'verified' && <Check className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => handleSimulate('pending')}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                currentStatus === 'pending'
                  ? 'bg-amber-100 text-amber-900 font-semibold'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Review
              </span>
              {currentStatus === 'pending' && <Check className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => handleSimulate('rejected')}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                currentStatus === 'rejected'
                  ? 'bg-rose-100 text-rose-900 font-semibold'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5 text-rose-600" /> Fail / Needs Review
              </span>
              {currentStatus === 'rejected' && <Check className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
