'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import {
  getUsers,
  deleteUser,
  updateUser,
  getJobs,
  deleteJob,
  getReviews,
  deleteReview,
  getDisputes,
  updateDisputeStatus,
  deleteDispute,
  getApplications,
  resetStorageToDemo,
} from '@/lib/storage';
import { User, Job, Review, Dispute, Application } from '@/types';
import VerificationBadge from '@/components/ai/VerificationBadge';
import {
  Shield,
  Users as UsersIcon,
  Briefcase,
  Star,
  AlertTriangle,
  Trash2,
  CheckCircle2,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  Search,
} from 'lucide-react';

export default function AdminPage() {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'jobs' | 'reviews' | 'disputes'>('users');

  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const loadAllData = useCallback(() => {
    setUsers(getUsers());
    setJobs(getJobs());
    setReviews(getReviews());
    setDisputes(getDisputes());
    setApplications(getApplications());
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Handlers
  const handleDeleteUser = (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"?`)) return;
    deleteUser(userId);
    loadAllData();
    refreshUser();
  };

  const handleDeleteJob = (jobId: string, jobTitle: string) => {
    if (!confirm(`Are you sure you want to delete job "${jobTitle}"?`)) return;
    deleteJob(jobId);
    loadAllData();
  };

  const handleDeleteReview = (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    deleteReview(reviewId);
    loadAllData();
  };

  const handleResolveDispute = (disputeId: string) => {
    updateDisputeStatus(disputeId, 'resolved', 'Resolved by administrative review.');
    loadAllData();
  };

  const handleDeleteDispute = (disputeId: string) => {
    if (!confirm('Delete this dispute record?')) return;
    deleteDispute(disputeId);
    loadAllData();
  };

  const handleResetDemoData = () => {
    if (!confirm('Reset all localStorage data back to original realistic seed data? Current alterations will be replaced.')) {
      return;
    }
    resetStorageToDemo();
    loadAllData();
    refreshUser();
    alert('Storage restored to initial seed state.');
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold tracking-tight">Admin Operations Center</h1>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
                  Full CRUD & Dispute Supervision
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Inspect, moderate, and delete platform users, task listings, reviews, and arbitration disputes.
              </p>
            </div>
          </div>

          <button
            onClick={handleResetDemoData}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 self-start md:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <p className="text-xs font-medium text-slate-500">Registered Users</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{users.length}</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">100% Verified 18+</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <p className="text-xs font-medium text-slate-500">Total Jobs</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{jobs.length}</p>
            <p className="text-[11px] text-slate-400 mt-1">
              {jobs.filter((j) => j.status === 'open').length} Open / {jobs.filter((j) => j.status === 'hired').length} Active
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <p className="text-xs font-medium text-slate-500">Reviews & Ratings</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{reviews.length}</p>
            <p className="text-[11px] text-amber-600 font-semibold mt-1">Reciprocal Verified</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <p className="text-xs font-medium text-slate-500">Disputes Logged</p>
            <p className="text-2xl font-extrabold text-rose-600 mt-1">{disputes.length}</p>
            <p className="text-[11px] text-slate-400 mt-1">
              {disputes.filter((d) => d.status === 'open').length} Open issues
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'users'
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <UsersIcon className="w-3.5 h-3.5" />
                <span>Users ({users.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('jobs')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'jobs'
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Jobs ({jobs.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'reviews'
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Star className="w-3.5 h-3.5" />
                <span>Reviews ({reviews.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('disputes')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'disputes'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Disputes ({disputes.length})</span>
              </button>
            </div>

            {/* Search filter for tables */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter table..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-brand-500 w-48"
              />
            </div>
          </div>

          {/* TAB 1: USERS */}
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">User</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Age (18+ Rule)</th>
                    <th className="pb-3">Verification</th>
                    <th className="pb-3">Rate / University</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users
                    .filter((u) =>
                      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      u.role.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 pr-4">
                          <Link
                            href={`/profile/${u.id}`}
                            className="font-bold text-slate-900 hover:text-brand-600 block text-xs"
                          >
                            {u.name}
                          </Link>
                          <span className="text-[11px] text-slate-400">{u.email}</span>
                        </td>
                        <td className="py-3.5">
                          <span className="capitalize font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 font-semibold text-emerald-700">
                          {u.age} yrs (DOB: {u.dateOfBirth})
                        </td>
                        <td className="py-3.5">
                          {u.role === 'student' ? (
                            <VerificationBadge
                              userId={u.id}
                              status={u.verificationStatus}
                              editable={true}
                              onStatusChange={() => loadAllData()}
                              size="sm"
                            />
                          ) : (
                            <span className="text-slate-400 text-[11px]">N/A</span>
                          )}
                        </td>
                        <td className="py-3.5 text-slate-600 text-[11px]">
                          {u.role === 'student'
                            ? `$${u.hourlyRate || 25}/hr • ${u.university?.split(' ')[0] || 'Student'}`
                            : u.location || 'Client'}
                        </td>
                        <td className="py-3.5 text-right space-x-2">
                          <Link
                            href={`/profile/${u.id}`}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-[11px] transition inline-flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" /> View
                          </Link>
                          {u.id !== user?.id && (
                            <button
                              onClick={() => handleDeleteUser(u.id, u.name)}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded text-[11px] transition inline-flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: JOBS */}
          {activeTab === 'jobs' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Title</th>
                    <th className="pb-3">Client</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Rate / Est.</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {jobs
                    .filter((j) =>
                      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      j.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      j.category.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((j) => (
                      <tr key={j.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 pr-4 font-semibold text-slate-900 max-w-xs truncate">
                          <Link href={`/jobs/${j.id}`} className="hover:text-brand-600">
                            {j.title}
                          </Link>
                        </td>
                        <td className="py-3.5 text-slate-700">{j.clientName}</td>
                        <td className="py-3.5 text-slate-600">{j.category}</td>
                        <td className="py-3.5 font-bold text-slate-800">
                          ${j.hourlyRate}/hr (~{j.estimatedHours}h)
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              j.status === 'open'
                                ? 'bg-emerald-50 text-emerald-700'
                                : j.status === 'hired'
                                ? 'bg-blue-50 text-blue-700'
                                : j.status === 'completed'
                                ? 'bg-purple-50 text-purple-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {j.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right space-x-2">
                          <Link
                            href={`/jobs/${j.id}`}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-[11px] transition inline-flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" /> Details
                          </Link>
                          <button
                            onClick={() => handleDeleteJob(j.id, j.title)}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded text-[11px] transition inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Job</th>
                    <th className="pb-3">Reviewer</th>
                    <th className="pb-3">Rating</th>
                    <th className="pb-3">Feedback</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reviews
                    .filter((r) =>
                      r.reviewerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      r.comment.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 font-semibold text-slate-800 max-w-xs truncate">
                          {r.jobTitle || r.jobId}
                        </td>
                        <td className="py-3.5">
                          <span className="font-bold text-slate-900">{r.reviewerName}</span>
                          <span className="text-[10px] text-slate-400 block capitalize">{r.reviewerRole}</span>
                        </td>
                        <td className="py-3.5">
                          <div className="flex items-center text-amber-500 font-bold">
                            <span>{r.rating}</span>
                            <Star className="w-3 h-3 fill-current ml-1" />
                          </div>
                        </td>
                        <td className="py-3.5 text-slate-600 max-w-sm truncate">&quot;{r.comment}&quot;</td>
                        <td className="py-3.5 text-slate-400 text-[11px]">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => handleDeleteReview(r.id)}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded text-[11px] transition inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 4: DISPUTES */}
          {activeTab === 'disputes' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Task</th>
                    <th className="pb-3">Raised By</th>
                    <th className="pb-3">Reason</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Details / Resolution</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {disputes
                    .filter((d) =>
                      d.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      d.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      d.raisedByName.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 font-semibold text-slate-900 max-w-xs truncate">
                          <Link href={`/jobs/${d.jobId}`} className="hover:text-brand-600">
                            {d.jobTitle}
                          </Link>
                        </td>
                        <td className="py-3.5">
                          <span className="font-bold text-slate-900">{d.raisedByName}</span>
                          <span className="text-[10px] text-slate-400 block capitalize">{d.raisedByRole}</span>
                        </td>
                        <td className="py-3.5 font-medium text-slate-800">{d.reason}</td>
                        <td className="py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              d.status === 'open'
                                ? 'bg-rose-100 text-rose-800 border border-rose-200 animate-pulse'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {d.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-slate-600 max-w-xs truncate">
                          {d.details}
                          {d.resolutionNotes && (
                            <span className="text-emerald-700 block text-[10px] font-medium mt-0.5">
                              Note: {d.resolutionNotes}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 text-right space-x-2">
                          {d.status === 'open' ? (
                            <button
                              onClick={() => handleResolveDispute(d.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded text-[11px] transition inline-flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Mark Resolved
                            </button>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Resolved</span>
                          )}
                          <button
                            onClick={() => handleDeleteDispute(d.id)}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded text-[11px] transition inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
