'use client';

import React, { useState } from 'react';
import { Job, Application } from '@/types';
import { useAuth, CURRENCY_RATES } from '@/context/AuthContext';
import { hireApplicant, fundEscrow } from '@/lib/storage';
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  Coins,
  CreditCard,
  Building,
  Smartphone,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react';

interface EscrowModalProps {
  job: Job;
  applicant: Application;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EscrowModal({
  job,
  applicant,
  isOpen,
  onClose,
  onSuccess,
}: EscrowModalProps) {
  const { currency, formatCurrency, convertFromUSD } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'upi'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'review' | 'success'>('review');

  if (!isOpen) return null;

  const hours = job.estimatedHours || 4;
  const rate = applicant.proposedRate || job.hourlyRate || 25;
  const subtotalUSD = rate * hours;
  const platformFeeUSD = Math.round(subtotalUSD * 0.05 * 100) / 100; // 5% platform escrow guarantee
  const totalUSD = subtotalUSD + platformFeeUSD;

  const handleConfirmEscrow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Execute hire with escrow funding
      hireApplicant(job.id, applicant.id, applicant.studentId, totalUSD);
      fundEscrow(job.id, totalUSD);
      setIsProcessing(false);
      setStep('success');
    }, 1100);
  };

  const handleFinish = () => {
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden text-zinc-100">
        {/* Header */}
        <div className="bg-zinc-950 px-6 py-5 border-b border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-zinc-950 font-black shadow-glow-amber">
                <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white font-display">
                  GSAP Escrow Milestone Guarantee
                </h3>
                <p className="text-xs text-zinc-400 font-mono">
                  Zero-risk milestone protection for client & student
                </p>
              </div>
            </div>
            {step === 'review' && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-zinc-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {step === 'review' ? (
          <div className="p-6 space-y-5">
            {/* Candidate summary */}
            <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                  Hiring Student Candidate
                </span>
                <span className="font-bold text-sm text-white">{applicant.studentName}</span>
                <div className="text-xs text-amber-400 font-mono mt-0.5">
                  Proposed: {formatCurrency(rate)}/hr (~{hours} hrs estimated)
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                  Escrow Vault Total
                </span>
                <span className="text-xl font-black font-mono text-emerald-400">
                  {formatCurrency(totalUSD)}
                </span>
              </div>
            </div>

            {/* Financial breakdown */}
            <div className="space-y-2.5 text-xs text-zinc-300 border border-zinc-800 bg-zinc-950/40 p-4 rounded-2xl">
              <div className="flex justify-between">
                <span className="text-zinc-400">Task Scope ({hours} hrs @ {formatCurrency(rate)}/hr):</span>
                <span className="font-mono font-medium text-white">{formatCurrency(subtotalUSD)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">5% Neutral Escrow Guarantee Fee:</span>
                <span className="font-mono text-zinc-400">{formatCurrency(platformFeeUSD)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-zinc-800 font-bold text-sm">
                <span className="text-white">Total Locked In Escrow:</span>
                <span className="font-mono text-emerald-400 font-black">{formatCurrency(totalUSD)}</span>
              </div>
            </div>

            {/* Payment method selector */}
            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                Deposit Funding Source ({currency}):
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === 'card'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold'
                      : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === 'bank'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold'
                      : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>Bank / Wire</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === 'upi'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold'
                      : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>UPI / Local</span>
                </button>
              </div>
            </div>

            {/* Escrow terms reassurance */}
            <div className="p-3 bg-zinc-950/60 border border-zinc-800 rounded-xl space-y-1.5 text-[11px] text-zinc-400">
              <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
                <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>How the Escrow Vault protects your deposit:</span>
              </div>
              <p className="leading-relaxed">
                Funds are held in neutral custody. The student only receives payout after you inspect
                and approve their completed task submission. You retain 100% dispute freeze protection.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="px-4 py-2.5 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmEscrow}
                disabled={isProcessing}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition shadow-glow-amber flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                    <span>Locking in Vault...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Authorize & Fund Escrow ({formatCurrency(totalUSD)})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-xl font-black text-white font-display">Escrow Vault Funded!</h4>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto leading-relaxed">
                <strong>{applicant.studentName}</strong> has been notified and officially hired for{' '}
                <span className="text-white font-medium">&quot;{job.title}&quot;</span>.
              </p>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-xs space-y-2 text-left font-mono">
              <div className="flex justify-between">
                <span className="text-zinc-500">Vault Escrow Status:</span>
                <span className="text-emerald-400 font-bold">LOCKED & HELD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Amount Protected:</span>
                <span className="text-white font-bold">{formatCurrency(totalUSD)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Workspace Status:</span>
                <span className="text-amber-400 font-bold">IN PROGRESS</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-xs transition shadow-glow-amber"
            >
              Go To Task Workspace
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
