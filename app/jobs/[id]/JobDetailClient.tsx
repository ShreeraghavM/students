'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  getJobById,
  updateJob,
  deleteJob,
  getApplicationsByJobId,
  createApplication,
  hireApplicant,
  getReviewsByJobId,
  getUserById,
} from '@/lib/storage';
import { Job, Application, Review, JobCategory, User } from '@/types';
import { calculateMatchScore } from '@/lib/mockAi';
import VerificationBadge from '@/components/ai/VerificationBadge';
import ReviewModal from '@/components/reviews/ReviewModal';
import DisputeModal from '@/components/disputes/DisputeModal';
import {
  Briefcase,
  DollarSign,
  Clock,
  MapPin,
  Sparkles,
  UserCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Star,
  Edit3,
  Trash2,
  Send,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';

interface JobDetailClientProps {
  id?: string;
}

export default function JobDetailClient({ id }: JobDetailClientProps) {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const jobId = id || (params?.id as string);

  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [hiredStudent, setHiredStudent] = useState<User | null>(null);

  // Modals & States
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);

  // Application form state
  const [coverLetter, setCoverLetter] = useState('');
  const [proposedRate, setProposedRate] = useState<number>(30);
  const [appError, setAppError] = useState<string | null>(null);
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editRate, setEditRate] = useState(30);
  const [editHours, setEditHours] = useState(15);
  const [editStatus, setEditStatus] = useState<Job['status']>('open');

  const loadData = useCallback(() => {
    if (!jobId) return;
    const foundJob = getJobById(jobId);
    if (foundJob) {
      setJob(foundJob);
      setEditTitle(foundJob.title);
      setEditDesc(foundJob.description);
      setEditRate(foundJob.hourlyRate);
      setEditHours(foundJob.estimatedHours);
      setEditStatus(foundJob.status);

      if (foundJob.hiredStudentId) {
        const student = getUserById(foundJob.hiredStudentId);
        setHiredStudent(student || null);
      }
    }
    setApplications(getApplicationsByJobId(jobId));
    setReviews(getReviewsByJobId(jobId));
  }, [jobId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Job Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">The requested task could not be located or has been removed.</p>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </Link>
      </div>
    );
  }

  const isClientOwner = user && (user.id === job.clientId || user.role === 'admin');
  const isStudent = user?.role === 'student';
  const myApplication = applications.find((a) => a.studentId === user?.id);
  const hasApplied = !!myApplication;

  // Mock AI Match score
  const matchResult = isStudent && user ? calculateMatchScore(user, job) : null;

  // Have I reviewed already?
  const hasReviewed = reviews.some((r) => r.reviewerId === user?.id);

  // Handle student apply
  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setAppError(null);

    if (!user || user.role !== 'student') {
      setAppError('Only verified students can apply to jobs.');
      return;
    }

    if (!coverLetter.trim()) {
      setAppError('Please write a brief cover note.');
      return;
    }

    setIsSubmittingApp(true);
    try {
      createApplication({
        id: `app_${Date.now()}`,
        jobId: job.id,
        studentId: user.id,
        studentName: user.name,
        studentEmail: user.email,
        studentHourlyRate: user.hourlyRate,
        studentSkills: user.skills,
        studentVerificationStatus: user.verificationStatus,
        coverLetter: coverLetter.trim(),
        proposedRate: Number(proposedRate || job.hourlyRate),
        status: 'applied',
        createdAt: new Date().toISOString(),
      });

      setIsApplyModalOpen(false);
      loadData();
    } catch (err: any) {
      setAppError(err.message || 'Failed to submit application.');
    } finally {
      setIsSubmittingApp(false);
    }
  };

  // Handle client hire student
  const handleHireStudent = (app: Application) => {
    if (!confirm(`Are you sure you want to hire ${app.studentName} for this task? Other applicants will be marked rejected.`)) {
      return;
    }
    hireApplicant(job.id, app.id, app.studentId);
    loadData();
  };

  // Handle client mark completed
  const handleMarkCompleted = () => {
    if (!confirm('Mark this task as completed? This will finalize the project and unlock ratings & reviews for both parties.')) {
      return;
    }
    updateJob(job.id, { status: 'completed' });
    loadData();
  };

  // Handle delete job
  const handleDeleteJob = () => {
    if (!confirm('Are you sure you want to delete this job listing? This action cannot be undone.')) {
      return;
    }
    deleteJob(job.id);
    router.push('/jobs');
  };

  // Handle update job
  const handleUpdateJob = (e: React.FormEvent) => {
    e.preventDefault();
    updateJob(job.id, {
      title: editTitle.trim(),
      description: editDesc.trim(),
      hourlyRate: Number(editRate),
      estimatedHours: Number(editHours),
      status: editStatus,
    });
    setIsEditModalOpen(false);
    loadData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all tasks</span>
        </Link>
      </div>

      {/* Main Grid: Job details on left, Actions & AI Match on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Details & Applicants */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
                  {job.category}
                </span>
                {job.isRemote && (
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                    Remote
                  </span>
                )}
              </div>

              {/* Status Badge */}
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  job.status === 'open'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : job.status === 'hired'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : job.status === 'completed'
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {job.status === 'open' ? 'Open for Applications' : job.status}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-4">
              {job.title}
            </h1>

            {/* Client Info Bar */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Posted by:</span>
                <Link
                  href={`/profile/${job.clientId}`}
                  className="font-bold text-slate-800 hover:text-brand-600 transition"
                >
                  {job.clientName}
                </Link>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{job.location}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Description */}
            <div className="py-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Task Description & Scope
              </h3>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {job.description}
              </div>
            </div>

            {/* Required Skills */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Required Student Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Client Admin Controls (Edit / Delete) */}
            {isClientOwner && (
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Task
                  </button>
                  <button
                    onClick={handleDeleteJob}
                    className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>

                {job.status === 'hired' && (
                  <button
                    onClick={handleMarkCompleted}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mark Task Completed
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Applicants Section (Visible to Client Owner & Admin) */}
          {isClientOwner && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Applicants ({applications.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Review candidate proposals and hire a verified university student
                  </p>
                </div>
              </div>

              {applications.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No students have applied for this task yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className={`p-5 rounded-2xl border transition ${
                        app.status === 'hired'
                          ? 'border-emerald-300 bg-emerald-50/40'
                          : app.status === 'rejected'
                          ? 'border-slate-200 bg-slate-50/60 opacity-60'
                          : 'border-slate-200 bg-white hover:border-brand-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-sm">
                            {app.studentName[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/profile/${app.studentId}`}
                                className="font-bold text-slate-900 text-sm hover:text-brand-600 transition"
                              >
                                {app.studentName}
                              </Link>
                              <VerificationBadge
                                userId={app.studentId}
                                status={app.studentVerificationStatus || 'verified'}
                                size="sm"
                              />
                            </div>
                            <span className="text-xs text-slate-500">
                              Proposed Rate: <strong>${app.proposedRate}/hr</strong> • Applied{' '}
                              {new Date(app.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Status & Hire Action */}
                        <div>
                          {app.status === 'hired' ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Hired
                            </span>
                          ) : app.status === 'rejected' ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-600">
                              <XCircle className="w-3.5 h-3.5" /> Rejected
                            </span>
                          ) : (
                            job.status === 'open' && (
                              <button
                                onClick={() => handleHireStudent(app)}
                                className="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>Hire Student</span>
                              </button>
                            )
                          )}
                        </div>
                      </div>

                      {/* Cover letter */}
                      <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                        &quot;{app.coverLetter}&quot;
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Reciprocal Reviews Section (Available if completed) */}
          {job.status === 'completed' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Task Reviews & Ratings</h3>
                  <p className="text-xs text-slate-500">
                    Reciprocal verified reviews left by client and student
                  </p>
                </div>
                {user && !hasReviewed && (user.id === job.clientId || user.id === job.hiredStudentId) && (
                  <button
                    onClick={() => setIsReviewModalOpen(true)}
                    className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1"
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>Leave a Review</span>
                  </button>
                )}
              </div>

              {reviews.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  No reviews submitted yet for this completed task.
                </p>
              ) : (
                <div className="space-y-3">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{rev.reviewerName}</span>
                          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full">
                            {rev.reviewerRole}
                          </span>
                        </div>
                        <div className="flex items-center text-amber-500 text-xs">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">&quot;{rev.comment}&quot;</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right 1 Col: Budget, AI Match Score, and Application CTA */}
        <div className="space-y-6">
          {/* Compensation Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Compensation & Hours
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-slate-900">${job.hourlyRate}</span>
              <span className="text-sm font-medium text-slate-500">/ hour</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Estimated Workload:</span>
                <span className="font-semibold text-slate-900">~{job.estimatedHours} Hours</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Budget:</span>
                <span className="font-bold text-brand-600">
                  ~${job.hourlyRate * job.estimatedHours}
                </span>
              </div>
            </div>

            {/* Student Application Status / CTA */}
            {isStudent && (
              <div className="pt-2">
                {hasApplied ? (
                  <div className="p-3.5 bg-brand-50 border border-brand-200 rounded-2xl text-center space-y-1">
                    <span className="text-xs font-bold text-brand-800 block">
                      Application Submitted
                    </span>
                    <span className="text-[11px] text-brand-600 block">
                      Status: <strong className="uppercase">{myApplication?.status}</strong>
                    </span>
                  </div>
                ) : job.status === 'open' ? (
                  <button
                    onClick={() => {
                      setProposedRate(user?.hourlyRate || job.hourlyRate);
                      setIsApplyModalOpen(true);
                    }}
                    className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Apply for this Task</span>
                  </button>
                ) : (
                  <div className="p-3 bg-slate-100 rounded-xl text-center text-xs text-slate-500">
                    This task is no longer accepting applications.
                  </div>
                )}
              </div>
            )}

            {/* Raise Dispute button (for completed jobs) */}
            {job.status === 'completed' && user && (user.id === job.clientId || user.id === job.hiredStudentId) && (
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => setIsDisputeModalOpen(true)}
                  className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Raise a Dispute</span>
                </button>
              </div>
            )}
          </div>

          {/* AI Match Score Breakdown (for Students) */}
          {matchResult && (
            <div className="bg-gradient-to-br from-indigo-50/90 to-purple-50/70 border border-indigo-200/90 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-brand-700 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-brand-600" />
                  <span>AI Match Score (Simulated)</span>
                </div>
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-brand-600 text-white">
                  {matchResult.score}%
                </span>
              </div>

              <p className="text-xs text-indigo-950 font-medium">
                Overall Compatibility: <strong>{matchResult.verdict}</strong>
              </p>

              {/* Progress bar */}
              <div className="w-full h-2.5 bg-indigo-200/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-600 rounded-full transition-all duration-500"
                  style={{ width: `${matchResult.score}%` }}
                />
              </div>

              {/* Match Factors */}
              <div className="space-y-2 pt-2 border-t border-indigo-100 text-[11px] text-indigo-900">
                <div className="flex justify-between">
                  <span>Skills Alignment ({matchResult.matchedSkills.length}/{job.requiredSkills.length})</span>
                  <span className="font-semibold">{matchResult.breakdown.skillsMatch} / 50 pts</span>
                </div>
                <div className="flex justify-between">
                  <span>Rate Compatibility</span>
                  <span className="font-semibold">{matchResult.breakdown.rateMatch} / 25 pts</span>
                </div>
                <div className="flex justify-between">
                  <span>Location / Remote</span>
                  <span className="font-semibold">{matchResult.breakdown.locationMatch} / 20 pts</span>
                </div>
                <div className="flex justify-between">
                  <span>18+ Verification Bonus</span>
                  <span className="font-semibold">+{matchResult.breakdown.verificationBonus} pts</span>
                </div>
              </div>

              {matchResult.matchedSkills.length > 0 && (
                <div className="pt-2 text-[11px]">
                  <span className="text-slate-500 font-medium block mb-1">Matching Skills:</span>
                  <div className="flex flex-wrap gap-1">
                    {matchResult.matchedSkills.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white text-emerald-700 font-medium rounded border border-emerald-200">
                        {s} ✓
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Safety & 18+ Guarantee */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Platform Safety Assured</span>
            </div>
            <p className="leading-relaxed">
              Every student and client has been verified 18+ upon registration. Funds and tasks are
              protected by platform dispute arbitrations.
            </p>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Apply for Task</h3>
            <p className="text-xs text-slate-500 mb-4">
              Submit your proposal for <span className="font-semibold text-slate-700">{job.title}</span>
            </p>

            {appError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600">
                {appError}
              </div>
            )}

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Proposed Hourly Rate ($/hr)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                    $
                  </span>
                  <input
                    type="number"
                    min="15"
                    max="150"
                    required
                    value={proposedRate}
                    onChange={(e) => setProposedRate(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-slate-900"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Client budget: ${job.hourlyRate}/hr</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cover Note / Pitch
                </label>
                <textarea
                  rows={4}
                  required
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Introduce yourself, mention relevant coursework or past projects, and share your availability..."
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingApp}
                  className="px-5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-xs transition"
                >
                  {isSubmittingApp ? 'Submitting...' : 'Send Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Job Modal (Client) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Edit Task Details</h3>
            <form onSubmit={handleUpdateJob} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={4}
                  required
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rate ($/hr)</label>
                  <input
                    type="number"
                    required
                    value={editRate}
                    onChange={(e) => setEditRate(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Est. Hours</label>
                  <input
                    type="number"
                    required
                    value={editHours}
                    onChange={(e) => setEditHours(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as Job['status'])}
                  className="w-full text-xs sm:text-sm px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="open">Open</option>
                  <option value="hired">Hired</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {user && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          jobId={job.id}
          jobTitle={job.title}
          reviewerId={user.id}
          reviewerName={user.name}
          reviewerRole={user.role}
          revieweeId={user.id === job.clientId ? job.hiredStudentId || '' : job.clientId}
          revieweeName={user.id === job.clientId ? hiredStudent?.name || 'Student' : job.clientName}
          onReviewSubmitted={() => loadData()}
        />
      )}

      {/* Dispute Modal */}
      {user && (
        <DisputeModal
          isOpen={isDisputeModalOpen}
          onClose={() => setIsDisputeModalOpen(false)}
          jobId={job.id}
          jobTitle={job.title}
          raisedById={user.id}
          raisedByName={user.name}
          raisedByRole={user.role}
          againstId={user.id === job.clientId ? job.hiredStudentId || '' : job.clientId}
          againstName={user.id === job.clientId ? hiredStudent?.name || 'Student' : job.clientName}
          onDisputeRaised={() => {
            alert('Dispute recorded. An administrator will inspect this record in the Admin Panel.');
          }}
        />
      )}
    </div>
  );
}
