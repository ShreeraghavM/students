'use client';

import React from 'react';
import Link from 'next/link';
import { Job, User } from '@/types';
import { calculateMatchScore } from '@/lib/mockAi';
import {
  MapPin,
  Clock,
  DollarSign,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Briefcase,
} from 'lucide-react';

interface JobCardProps {
  job: Job;
  currentUser: User | null;
}

export default function JobCard({ job, currentUser }: JobCardProps) {
  // If user is logged-in student, compute mocked AI Match Score
  const matchResult =
    currentUser && currentUser.role === 'student'
      ? calculateMatchScore(currentUser, job)
      : null;

  const getStatusBadge = () => {
    switch (job.status) {
      case 'open':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Open for Applications
          </span>
        );
      case 'hired':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            In Progress (Hired)
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            Cancelled
          </span>
        );
    }
  };

  const getMatchScoreBadge = () => {
    if (!matchResult) return null;

    let colorStyles = 'bg-slate-100 text-slate-700 border-slate-200';
    if (matchResult.score >= 85) {
      colorStyles = 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-400/20';
    } else if (matchResult.score >= 70) {
      colorStyles = 'bg-indigo-50 text-indigo-800 border-indigo-200';
    } else if (matchResult.score >= 50) {
      colorStyles = 'bg-amber-50 text-amber-800 border-amber-200';
    }

    return (
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition ${colorStyles}`}
        title={`Simulated AI Match based on your skills, $${currentUser?.hourlyRate}/hr rate, and location preference.`}
      >
        <Sparkles className="w-3.5 h-3.5 text-brand-600" />
        <span>AI Match: {matchResult.score}%</span>
        <span className="hidden sm:inline font-normal text-[11px] opacity-80">
          ({matchResult.verdict})
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-brand-300 shadow-xs hover:shadow-md transition-all duration-200 p-5 sm:p-6 flex flex-col justify-between group">
      <div>
        {/* Top Header info */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-100">
              {job.category}
            </span>
            {job.isRemote && (
              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600">
                Remote
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {getMatchScoreBadge()}
            {getStatusBadge()}
          </div>
        </div>

        {/* Title */}
        <Link href={`/jobs/${job.id}`}>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition leading-snug mb-2">
            {job.title}
          </h3>
        </Link>

        {/* Description Snippet */}
        <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 mb-4 leading-relaxed">
          {job.description}
        </p>

        {/* Skills Tag Chips */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {job.requiredSkills.map((skill, index) => {
            const isStudentSkill =
              currentUser?.skills?.some(
                (s) =>
                  s.toLowerCase().includes(skill.toLowerCase()) ||
                  skill.toLowerCase().includes(s.toLowerCase())
              );
            return (
              <span
                key={index}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-md transition ${
                  isStudentSkill
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold'
                    : 'bg-slate-100 text-slate-600 border border-slate-200/60'
                }`}
              >
                {skill}
                {isStudentSkill && ' ✓'}
              </span>
            );
          })}
        </div>
      </div>

      {/* Footer Info & Action */}
      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1 font-semibold text-slate-900 text-sm">
            <DollarSign className="w-4 h-4 text-emerald-600 -mr-1" />
            <span>${job.hourlyRate}</span>
            <span className="text-xs font-normal text-slate-500">/hr</span>
          </div>

          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>~{job.estimatedHours} hrs</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 truncate max-w-[140px]">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
        </div>

        <Link
          href={`/jobs/${job.id}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold shadow-xs transition group-hover:bg-brand-600"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
