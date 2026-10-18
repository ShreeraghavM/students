'use client';

import React, { useState } from 'react';
import { Job, Application } from '@/types';
import { useAuth, CURRENCY_RATES } from '@/context/AuthContext';
import { hireApplicant, fundEscrow } from '@/lib/storage';

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
    }, 1200);
  };

  const handleFinish = () => {
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="p-2 bg-white/10 rounded-lg text-xl">🛡️</span>
              <div>
                <h3 className="text-lg font-bold">GSAP Escrow Milestone Guarantee</h3>
                <p className="text-xs text-blue-100">Zero-risk milestone protection for client & student</p>
              </div>
            </div>
            {step === 'review' && (
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white text-xl leading-none"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {step === 'review' ? (
          <div className="p-6 space-y-5">
            {/* Candidate summary */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-slate-600 tracking-wider">Hiring Candidate</span>
                <h4 className="text-base font-semibold text-slate-800">{applicant.studentName}</h4>
                <p className="text-xs text-slate-600">{job.title}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-600">Offered Rate</span>
                <p className="text-sm font-bold text-blue-600">
                  {formatCurrency(rate)}/hr
                </p>
              </div>
            </div>

            {/* Escrow protection details */}
            <div className="rounded-xl bg-blue-50/70 border border-blue-100 p-4 text-xs text-blue-900 space-y-1.5">
              <div className="font-semibold flex items-center text-blue-800">
                <span className="mr-1.5">🔒</span> How GSAP Escrow Works:
              </div>
              <ul className="list-disc pl-5 space-y-1 text-blue-700">
                <li>Your payment is deposited securely in GSAP Escrow right now.</li>
                <li>The student gets instant notification to begin the work.</li>
                <li>
                  Funds are <strong>only released</strong> to the student after you verify and mark
                  the task as completed.
                </li>
                <li>If the task is not fulfilled, funds are 100% refunded.</li>
              </ul>
            </div>

            {/* Price breakdown */}
            <div className="border border-slate-200 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Task Est. Hours</span>
                <span className="font-medium text-slate-800">{hours} hrs</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Milestone Base ({formatCurrency(rate)} × {hours}h)</span>
                <span className="font-medium text-slate-800">{formatCurrency(subtotalUSD)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GSAP Escrow & 18+ Verification Guarantee (5%)</span>
                <span className="font-medium text-slate-800">{formatCurrency(platformFeeUSD)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-bold text-slate-900">
                <span>Total Escrow Deposit:</span>
                <div className="text-right">
                  <span className="text-blue-600">{formatCurrency(totalUSD)}</span>
                  {currency !== 'USD' && (
                    <span className="block text-xs font-normal text-slate-600">
                      (Approx. ${totalUSD.toFixed(2)} USD base)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Simulated Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-blue-600 bg-blue-50/60 text-blue-700 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <span className="text-base">💳</span>
                  <span>Credit Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank')}
                  className={`p-2.5 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition-all ${
                    paymentMethod === 'bank'
                      ? 'border-blue-600 bg-blue-50/60 text-blue-700 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <span className="text-base">🏦</span>
                  <span>Wire / Bank</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-2.5 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-blue-600 bg-blue-50/60 text-blue-700 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <span className="text-base">📱</span>
                  <span>UPI / Multi-pay</span>
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="w-1/3 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmEscrow}
                disabled={isProcessing}
                className="w-2/3 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 transition disabled:opacity-60"
              >
                {isProcessing ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Securing Escrow...</span>
                  </>
                ) : (
                  <span>Deposit {formatCurrency(totalUSD)} & Hire</span>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Success step */
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl">
              ✓
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900">Escrow Funded & Student Hired!</h4>
              <p className="text-sm text-slate-600 mt-1 max-w-sm mx-auto">
                <span className="font-semibold text-emerald-600">{formatCurrency(totalUSD)}</span> is
                now safely held in GSAP Escrow. {applicant.studentName} has been notified and direct
                messaging is activated.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs text-slate-600 text-left space-y-1">
              <div className="font-semibold text-slate-800">Next Steps:</div>
              <div>• Coordinate directly via the Job Messaging Tab.</div>
              <div>• Review work once the student submits proof of completion.</div>
              <div>• Click &quot;Release Escrow Payout&quot; to transfer funds to the student&apos;s wallet.</div>
            </div>
            <button
              onClick={handleFinish}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow transition"
            >
              Continue to Job Workspace
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
