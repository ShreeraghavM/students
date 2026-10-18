'use client';

import React, { useState } from 'react';
import { User } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, GraduationCap, CheckCircle2, Lock, Sparkles, X, Award } from 'lucide-react';

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
  const [universityName, setUniversityName] = useState(user.university || 'Imperial College London');
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
    }, 1200);
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
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white font-display">
                  18+ Student Identity Verification
                </h3>
                <p className="text-xs text-zinc-400 font-mono">
                  Official Trust & Safety Credential Badge
                </p>
              </div>
            </div>
            {!verifiedSuccess && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-zinc-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {!verifiedSuccess ? (
          <form onSubmit={handleVerify} className="p-6 space-y-4">
            <div className="bg-zinc-950/70 border border-zinc-800 rounded-2xl p-3.5 text-xs text-zinc-300 flex items-start space-x-3">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-400 font-mono">Verified Student Guarantee</p>
                <p className="text-zinc-400 text-[11px] mt-0.5 leading-relaxed">
                  Verified students gain priority matching on high-value diaspora concierge tasks, instant escrow payouts, and a cryptographic credentials badge.
                </p>
              </div>
            </div>

            {/* University Name */}
            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                Accredited University / College
              </label>
              <input
                type="text"
                required
                value={universityName}
                onChange={(e) => setUniversityName(e.target.value)}
                placeholder="e.g. Imperial College London, IISc Bangalore, Stanford"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-hidden"
              />
            </div>

            {/* Student .edu or Institutional Email */}
            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                Institutional / University Email (.edu or campus domain)
              </label>
              <input
                type="email"
                required
                value={eduEmail}
                onChange={(e) => setEduEmail(e.target.value)}
                placeholder="yourname@university.ac.uk"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-hidden font-mono"
              />
            </div>

            {/* Government ID Type */}
            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                Government Photo ID (18+ Proof of Age)
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-hidden font-medium"
              >
                <option value="passport">International Passport</option>
                <option value="drivers_license">Driver&apos;s License / State ID</option>
                <option value="national_id">National Identity Card / Aadhaar</option>
              </select>
            </div>

            {/* Age Confirmation Pill */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-mono">Calculated Account Age:</span>
              <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                {user.age} Years Old (18+ Eligible ✓)
              </span>
            </div>

            {/* Simulated file upload area */}
            <div className="border border-dashed border-zinc-700 hover:border-amber-400 rounded-2xl p-4 text-center cursor-pointer bg-zinc-950/40 hover:bg-zinc-950/80 transition">
              <span className="text-xl block mb-1">📷</span>
              <p className="text-xs font-bold text-zinc-200">
                Student ID & Photo ID Mock Uploaded
              </p>
              <p className="text-[11px] text-zinc-500 font-mono">
                Encrypted with 256-bit automated OCR identity verification
              </p>
            </div>

            <div className="pt-2 flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isVerifying}
                className="w-1/3 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 text-xs font-semibold hover:bg-zinc-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isVerifying}
                className="w-2/3 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold shadow-glow-amber flex items-center justify-center space-x-2 transition disabled:opacity-60"
              >
                {isVerifying ? (
                  <>
                    <span className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm & Issue 18+ Certificate</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-xl font-black text-white font-display">Identity Verified!</h4>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto leading-relaxed">
                Congratulations, <strong>{user.name}</strong>! Your 18+ verified credential badge is now active.
              </p>
            </div>

            {/* Certificate badge card */}
            <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 border border-amber-500/40 rounded-2xl p-5 text-left space-y-3 shadow-glow-amber">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                  GSAP ACCREDITATION SEAL
                </span>
                <span className="text-xs text-emerald-400 font-mono font-bold">18+ CONFIRMED</span>
              </div>
              <div className="space-y-1 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Student Name:</span>
                  <span className="text-white font-bold">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Institution:</span>
                  <span className="text-zinc-300">{universityName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Certificate ID:</span>
                  <span className="text-amber-400 font-bold">{certId}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-xs transition shadow-glow-amber"
            >
              Continue to Marketplace
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
