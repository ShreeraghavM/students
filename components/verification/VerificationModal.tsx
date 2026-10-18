'use client';

import React, { useState } from 'react';
import { User } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface VerificationModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function VerificationModal({
  user,
  isOpen,
  onClose,
  onSuccess,
}: VerificationModalProps) {
  const { updateCurrentUserProfile } = useAuth();
  const [eduEmail, setEduEmail] = useState(user.email.endsWith('.edu') ? user.email : '');
  const [universityName, setUniversityName] = useState(user.university || 'Stanford University');
  const [docType, setDocType] = useState<'passport' | 'drivers_license' | 'national_id'>('passport');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [certId, setCertId] = useState('');

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    const generatedCert = `GSAP-VERIFIED-${new Date().getFullYear()}-${Math.floor(
      100000 + Math.random() * 900000
    )}`;

    setTimeout(() => {
      updateCurrentUserProfile({
        verificationStatus: 'verified',
        verificationCertId: generatedCert,
        verifiedAt: new Date().toISOString(),
        university: universityName,
      });
      setCertId(generatedCert);
      setIsVerifying(false);
      setVerifiedSuccess(true);
    }, 1500);
  };

  const handleFinish = () => {
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="p-2 bg-white/10 rounded-lg text-xl">🎓</span>
              <div>
                <h3 className="text-lg font-bold">18+ Student Identity Verification</h3>
                <p className="text-xs text-emerald-100">Official Trust & Safety Credential Badge</p>
              </div>
            </div>
            {!verifiedSuccess && (
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white text-xl leading-none"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {!verifiedSuccess ? (
          <form onSubmit={handleVerify} className="p-6 space-y-4">
            <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3.5 text-xs text-emerald-900 flex items-start space-x-2">
              <span className="text-emerald-700 text-base">🛡️</span>
              <div>
                <p className="font-semibold text-emerald-800">Verified Marketplace Guarantee</p>
                <p className="text-emerald-700 mt-0.5">
                  Clients prioritize 18+ verified students by over 400%. Verification grants you
                  the Verified Badge, access to High-Value Concierge tasks, and instant escrow payouts.
                </p>
              </div>
            </div>

            {/* University Name */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Accredited University / College
              </label>
              <input
                type="text"
                required
                value={universityName}
                onChange={(e) => setUniversityName(e.target.value)}
                placeholder="e.g. Oxford University, IISc, UC Berkeley"
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
              />
            </div>

            {/* Student .edu or Institutional Email */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Institutional / University Email (.edu or campus domain)
              </label>
              <input
                type="email"
                required
                value={eduEmail}
                onChange={(e) => setEduEmail(e.target.value)}
                placeholder="yourname@university.edu"
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
              />
            </div>

            {/* Government ID Type */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Government Photo ID (18+ Proof of Age)
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as any)}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none bg-white"
              >
                <option value="passport">International Passport</option>
                <option value="drivers_license">Driver&apos;s License / State ID</option>
                <option value="national_id">National Identity Card / Aadhaar</option>
              </select>
            </div>

            {/* Age Confirmation Pill */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs">
              <span className="text-slate-600">Calculated Account Age:</span>
              <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                {user.age} Years Old (18+ Eligible ✓)
              </span>
            </div>

            {/* Simulated file upload area */}
            <div className="border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-xl p-4 text-center cursor-pointer bg-slate-50/50 hover:bg-emerald-50/20 transition">
              <span className="text-2xl block mb-1">📷</span>
              <p className="text-xs font-semibold text-slate-700">
                Student ID & Photo ID Mock Uploaded
              </p>
              <p className="text-[11px] text-slate-600">
                Encrypted with 256-bit automated identity verification protocol
              </p>
            </div>

            <div className="pt-2 flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isVerifying}
                className="w-1/3 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isVerifying}
                className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-500/20 flex items-center justify-center space-x-2 transition disabled:opacity-60"
              >
                {isVerifying ? (
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
                    <span>Validating 18+ Credentials...</span>
                  </>
                ) : (
                  <span>Submit for Instant Verification</span>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Verification Success screen */
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl">
              ✓
            </div>
            <div>
              <span className="inline-block bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider mb-2">
                18+ Verified Talent
              </span>
              <h4 className="text-xl font-bold text-slate-900">Verification Certificate Issued!</h4>
              <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                Your student status and 18+ legal eligibility have been confirmed. Your verified badge
                is now active across all platform proposals.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-mono text-slate-700 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-600">Certificate ID:</span>
                <span className="font-bold text-emerald-600">{certId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Institution:</span>
                <span className="font-bold text-slate-800">{universityName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Status:</span>
                <span className="font-bold text-emerald-600">Legally Verified (18+)</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow transition"
            >
              Done & Return to Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
