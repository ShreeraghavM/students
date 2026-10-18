'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import {
  getJobs,
  getApplications,
  getApplicationsByStudentId,
  getUserAverageRating,
  getReviewsByRevieweeId,
} from '@/lib/storage';
import { Job, Application, Review } from '@/types';
import { calculateMatchScore } from '@/lib/mockAi';
import VerificationBadge from '@/components/ai/VerificationBadge';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  DollarSign,
  Star,
  PlusCircle,
  ArrowRight,
  Sparkles,
  Shield,
  FileText,
  AlertCircle,
  Wallet,
  ShieldCheck,
  Globe,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, formatCurrency, currency } = useAuth();
  const [clientJobs, setClientJobs] = useState<Job[]>([]);
  const [clientApplications, setClientApplications] = useState<Application[]>([]);
  const [studentApplications, setStudentApplications] = useState<Application[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [ratingInfo, setRatingInfo] = useState({ average: 5.0, count: 0 });

  const loadDashboardData = useCallback(() => {
    if (!user) return;

    const jobs = getJobs();
    setAllJobs(jobs);

    if (user.role === 'client') {
      const myJobs = jobs.filter((j) => j.clientId === user.id);
      setClientJobs(myJobs);

      const jobIds = myJobs.map((j) => j.id);
      const allApps = getApplications();
      const myReceivedApps = allApps.filter((a) => jobIds.includes(a.jobId));
      setClientApplications(myReceivedApps);
    } else if (user.role === 'student') {
      const myApps = getApplicationsByStudentId(user.id);
      setStudentApplications(myApps);
      setRatingInfo(getUserAverageRating(user.id));
    }
  }, [user]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Welcome Header */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl border border-blue-200">
              {user.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                user.name[0]
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-slate-900">
                  Welcome back, {user.name}!
                </h1>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {user.role === 'client'
                  ? 'Manage your posted tasks, cross-border concierge care, and escrow milestones.'
                  : user.role === 'student'
                  ? `Track active task proposals, match scores, and verified wallet payouts (${formatCurrency(
                      user.walletBalance || 0
                    )} available).`
                  : 'Platform supervision and administrative arbitration.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'client' && (
              <Link
                href="/jobs/new"
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post New Task</span>
              </Link>
            )}

            {user.role === 'student' && (
              <div className="flex items-center gap-2">
                <VerificationBadge
                  userId={user.id}
                  status={user.verificationStatus}
                  editable={false}
                  size="md"
                />
              </div>
            )}

            {user.role === 'admin' && (
              <Link
                href="/admin"
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
              >
                <Shield className="w-4 h-4" />
                <span>Open Admin Portal</span>
              </Link>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* CLIENT DASHBOARD VIEW */}
        {/* ------------------------------------------------------------- */}
        {user.role === 'client' && (
          <div className="space-y-8">
            {/* Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <p className="text-xs font-medium text-slate-500">Total Tasks Posted</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{clientJobs.length}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <p className="text-xs font-medium text-slate-500">Applicants Received</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{clientApplications.length}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <p className="text-xs font-medium text-slate-500">Tasks In Progress</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {clientJobs.filter((j) => j.status === 'hired').length}
                </p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <p className="text-xs font-medium text-slate-500">Completed Tasks</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {clientJobs.filter((j) => j.status === 'completed').length}
                </p>
              </div>
            </div>

            {/* My Posted Jobs Table */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">My Posted Tasks</h2>
                  <p className="text-xs text-slate-500">
                    Manage your active, hired, and cross-border concierge tasks
                  </p>
                </div>
                <Link
                  href="/jobs/new"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Post Another Task
                </Link>
              </div>

              {clientJobs.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl">
                  <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-medium">You haven&apos;t posted any tasks yet.</p>
                  <Link
                    href="/jobs/new"
                    className="mt-3 inline-block px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl"
                  >
                    Post your first task
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                        <th className="pb-3">Task Title</th>
                        <th className="pb-3">Category</th>
                        <th className="pb-3">Budget Rate</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Applicants</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {clientJobs.map((job) => {
                        const count = clientApplications.filter((a) => a.jobId === job.id).length;
                        return (
                          <tr key={job.id} className="hover:bg-slate-50/80 transition">
                            <td className="py-4 pr-4 font-semibold text-slate-900 max-w-xs truncate">
                              <Link href={`/jobs/${job.id}`} className="hover:text-blue-600">
                                {job.title}
                              </Link>
                              {job.isCrossBorder && (
                                <span className="block text-[10px] text-indigo-600 font-normal">
                                  🌐 Cross-Border Diaspora Care
                                </span>
                              )}
                            </td>
                            <td className="py-4 text-slate-600">{job.category}</td>
                            <td className="py-4 font-medium text-slate-800">
                              {formatCurrency(job.hourlyRate)}/hr
                            </td>
                            <td className="py-4">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  job.status === 'open'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : job.status === 'hired'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : job.status === 'completed'
                                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {job.status}
                              </span>
                            </td>
                            <td className="py-4 font-semibold text-slate-700">
                              {count} {count === 1 ? 'applicant' : 'applicants'}
                            </td>
                            <td className="py-4 text-right">
                              <Link
                                href={`/jobs/${job.id}`}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-semibold rounded-lg text-xs transition"
                              >
                                Manage
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STUDENT DASHBOARD VIEW */}
        {/* ------------------------------------------------------------- */}
        {user.role === 'student' && (
          <div className="space-y-8">
            {/* Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <p className="text-xs font-medium text-slate-500">Applications Sent</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{studentApplications.length}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <p className="text-xs font-medium text-slate-500">Active Hired Jobs</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {studentApplications.filter((a) => a.status === 'hired').length}
                </p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <p className="text-xs font-medium text-slate-500">Wallet Available</p>
                <p className="text-2xl font-bold text-emerald-700 mt-1">
                  {formatCurrency(user.walletBalance || 0)}
                </p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <p className="text-xs font-medium text-slate-500">Average Rating</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <p className="text-2xl font-bold text-slate-900">{ratingInfo.average}</p>
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-xs text-slate-400">({ratingInfo.count})</span>
                </div>
              </div>
            </div>

            {/* My Applications Table */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">My Job Applications</h2>
                  <p className="text-xs text-slate-500">Track application status and escrow milestones</p>
                </div>
                <Link
                  href="/jobs"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Briefcase className="w-3.5 h-3.5" /> Browse More Tasks
                </Link>
              </div>

              {studentApplications.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-medium">
                    You haven&apos;t applied to any tasks yet.
                  </p>
                  <Link
                    href="/jobs"
                    className="mt-3 inline-block px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl"
                  >
                    Explore Open Opportunities
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                        <th className="pb-3">Task</th>
                        <th className="pb-3">Proposed Rate</th>
                        <th className="pb-3">Application Status</th>
                        <th className="pb-3">Applied On</th>
                        <th className="pb-3 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentApplications.map((app) => {
                        const job = allJobs.find((j) => j.id === app.jobId);
                        return (
                          <tr key={app.id} className="hover:bg-slate-50/80 transition">
                            <td className="py-4 pr-4">
                              <Link
                                href={`/jobs/${app.jobId}`}
                                className="font-semibold text-slate-900 hover:text-blue-600 block text-xs"
                              >
                                {job?.title || `Task #${app.jobId}`}
                              </Link>
                              <span className="text-[11px] text-slate-400">
                                Client: {job?.clientName || 'Client'}
                              </span>
                            </td>
                            <td className="py-4 font-bold text-slate-800">
                              {formatCurrency(app.proposedRate)}/hr
                            </td>
                            <td className="py-4">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  app.status === 'hired'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : app.status === 'rejected'
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                                }`}
                              >
                                {app.status === 'hired'
                                  ? '✓ Hired (Escrow Protected)'
                                  : app.status === 'rejected'
                                  ? '✕ Rejected'
                                  : 'Pending Review'}
                              </span>
                            </td>
                            <td className="py-4 text-slate-500">
                              {new Date(app.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-4 text-right">
                              <Link
                                href={`/jobs/${app.jobId}`}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-semibold rounded-lg text-xs transition"
                              >
                                View Job
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Recommended High-Match Jobs for this Student */}
            <div className="bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/50 border border-blue-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-slate-900">
                    Recommended Tasks (Simulated AI Match)
                  </h2>
                </div>
                <Link
                  href="/jobs"
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <span>See All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allJobs
                  .filter((j) => j.status === 'open')
                  .slice(0, 2)
                  .map((job) => {
                    const match = calculateMatchScore(user, job);
                    return (
                      <div
                        key={job.id}
                        className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-semibold text-blue-700 px-2 py-0.5 bg-blue-50 rounded">
                              {job.category}
                            </span>
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              {match.score}% Match
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-slate-900 mb-1">{job.title}</h4>
                          <p className="text-xs text-slate-500 line-clamp-2">{job.description}</p>
                        </div>
                        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-600">
                            {formatCurrency(job.hourlyRate)}/hr
                          </span>
                          <Link
                            href={`/jobs/${job.id}`}
                            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          >
                            <span>Apply</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
