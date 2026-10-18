'use client';

import React from 'react';
import Link from 'next/link';
import { Job, User } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { calculateMatchScore } from '@/lib/mockAi';
import {
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Globe,
  Coins,
  CheckCircle2,
  Users,
} from 'lucide-react';

interface JobCardProps {
  job: Job;
  currentUser: User | null;
}

export default function JobCard({ job, currentUser }: JobCardProps) {
  const { formatCurrency } = useAuth();

  // If user is logged-in student, compute mocked AI Match Score
  const matchResult =
    currentUser && currentUser.role === 'student'
      ? calculateMatchScore(currentUser, job)
      : null;

  const getStatusBadge = () => {
    switch (job.status) {
      case 'open':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Open for Proposals
          </span>
        );
      case 'hired':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            In Progress (Escrow Held)
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <CheckCircle2 className="w-3 h-3 text-purple-600" />
            Completed & Paid
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-zinc-100 text-zinc-600 border border-zinc-200">
            Cancelled
          </span>
        );
    }
  };

  const getMatchScoreBadge = () => {
    if (!matchResult) return null;

    let colorStyles = 'bg-zinc-100 text-zinc-700 border-zinc-200';
    if (matchResult.score >= 85) {
      colorStyles = 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-400/20';
    } else if (matchResult.score >= 70) {
      colorStyles = 'bg-amber-50 text-amber-800 border-amber-200';
    } else if (matchResult.score >= 50) {
      colorStyles = 'bg-blue-50 text-blue-800 border-blue-200';
    }

    return (
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold border transition ${colorStyles}`}
        title={`Simulated AI Match based on your skills and rate.`}
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>AI Match: {matchResult.score}%</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 hover:border-amber-400 shadow-xs hover:shadow-card-hover transition-all duration-200 p-5 sm:p-6 flex flex-col justify-between group relative overflow-hidden">
      {/* Subtle top indicator for cross border */}
      {job.isCrossBorder && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600" />
      )}

      <div>
        {/* Top Header info */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                job.category === 'Family & Elderly Care'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-zinc-100 text-zinc-800 border-zinc-200'
              }`}
            >
              {job.category}
            </span>

            {/* Cross-border diaspora corridor indicator */}
            {job.isCrossBorder && job.crossBorderInfo && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <Globe className="w-3 h-3 text-indigo-600" />
                <span>
                  {job.crossBorderInfo.senderLocation.split(',')[0]} ➔ {job.crossBorderInfo.recipientLocation.split(',')[0]}
                </span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {getStatusBadge()}
            {getMatchScoreBadge()}
          </div>
        </div>

        {/* Job Title */}
        <Link href={`/jobs/${job.id}`}>
          <h3 className="text-base sm:text-lg font-bold text-zinc-900 group-hover:text-amber-600 transition-colors line-clamp-1">
            {job.title}
          </h3>
        </Link>

        {/* Cross Border Context Highlight */}
        {job.isCrossBorder && job.crossBorderInfo && (
          <div className="mt-2 text-xs bg-amber-50/70 border border-amber-200/80 rounded-xl p-2.5 text-amber-900 flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Diaspora Concierge • Escrow from {job.crossBorderInfo.senderLocation}</span>
            </span>
            {job.crossBorderInfo.languagePreference && (
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-white border border-amber-200 text-amber-800 font-bold">
                🗣️ {job.crossBorderInfo.languagePreference}
              </span>
            )}
          </div>
        )}

        {/* Job Description */}
        <p className="mt-2.5 text-xs sm:text-sm text-zinc-600 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Skills Tags */}
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {(job.requiredSkills || []).slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-zinc-100 text-zinc-700 border border-zinc-200"
            >
              {skill}
            </span>
          ))}
          {(job.requiredSkills || []).length > 4 && (
            <span className="px-1.5 py-0.5 text-[11px] font-mono text-zinc-400">
              +{job.requiredSkills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-5 pt-4 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span>~{job.estimatedHours} hrs</span>
          </div>
          <div className="flex items-center gap-1">
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-mono font-bold text-zinc-900 text-sm">
              {formatCurrency(job.hourlyRate)}
            </span>
            <span className="text-[11px] text-zinc-400">/hr</span>
          </div>
        </div>

        <Link
          href={`/jobs/${job.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-amber-500 text-white hover:text-zinc-950 text-xs font-bold transition shadow-xs group-hover:bg-amber-500 group-hover:text-zinc-950"
        >
          <span>View Task</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
