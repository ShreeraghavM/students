'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  getUserById,
  updateUser,
  getReviewsByRevieweeId,
  getUserAverageRating,
  getJobs,
} from '@/lib/storage';
import { User, Review, Job, VerificationStatus } from '@/types';
import VerificationBadge from '@/components/ai/VerificationBadge';
import VerificationModal from '@/components/verification/VerificationModal';
import {
  GraduationCap,
  Briefcase,
  MapPin,
  Calendar,
  Star,
  Edit3,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Wallet,
  ArrowUpRight,
  Award,
} from 'lucide-react';

interface ProfileClientProps {
  id?: string;
}

export default function ProfileClient({ id }: ProfileClientProps) {
  const params = useParams();
  const userId = id || (params?.id as string);
  const { user: currentUser, updateCurrentUserProfile, refreshUser, formatCurrency } = useAuth();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingStats, setRatingStats] = useState({ average: 5.0, count: 0 });
  const [userJobs, setUserJobs] = useState<Job[]>([]);

  // Modals
  const [isVerifModalOpen, setIsVerifModalOpen] = useState(false);
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState<string | null>(null);

  // Edit Mode
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [hourlyRate, setHourlyRate] = useState<number>(25);
  const [skillsInput, setSkillsInput] = useState('');
  const [university, setUniversity] = useState('');
  const [degree, setDegree] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadProfile = useCallback(() => {
    if (!userId) return;
    const found = getUserById(userId);
    if (found) {
      setProfileUser(found);
      setName(found.name);
      setBio(found.bio || '');
      setLocation(found.location || '');
      setHourlyRate(found.hourlyRate || 25);
      setSkillsInput((found.skills || []).join(', '));
      setUniversity(found.university || '');
      setDegree(found.degree || '');

      setReviews(getReviewsByRevieweeId(userId));
      setRatingStats(getUserAverageRating(userId));

      if (found.role === 'client') {
        const jobs = getJobs().filter((j) => j.clientId === userId);
        setUserJobs(jobs);
      }
    }
  }, [userId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (!profileUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">User Profile Not Found</h2>
        <p className="text-slate-500 text-sm">The user could not be found or has been deleted.</p>
      </div>
    );
  }

  const isOwner = currentUser?.id === profileUser.id || currentUser?.role === 'admin';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const updated = updateUser(profileUser.id, {
      name: name.trim(),
      bio: bio.trim(),
      location: location.trim(),
      hourlyRate: profileUser.role === 'student' ? Number(hourlyRate) : undefined,
      skills: profileUser.role === 'student' ? skills : undefined,
      university: profileUser.role === 'student' ? university.trim() : undefined,
      degree: profileUser.role === 'student' ? degree.trim() : undefined,
    });

    setProfileUser(updated);
    if (currentUser?.id === profileUser.id) {
      updateCurrentUserProfile(updated);
    }
    refreshUser();
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleWithdrawWallet = () => {
    const balance = profileUser.walletBalance || 0;
    if (balance <= 0) {
      alert('Wallet balance is currently $0. Complete tasks with escrow to earn payouts.');
      return;
    }

    if (
      confirm(
        `Withdraw ${formatCurrency(balance)} to your linked local bank account or digital wallet?`
      )
    ) {
      const updated = updateUser(profileUser.id, { walletBalance: 0 });
      setProfileUser(updated);
      if (currentUser?.id === profileUser.id) {
        updateCurrentUserProfile(updated);
      }
      refreshUser();
      setPayoutSuccessMsg(
        `Withdrawal of ${formatCurrency(balance)} successfully processed to bank account!`
      );
      setTimeout(() => setPayoutSuccessMsg(null), 5000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-semibold text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {payoutSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-semibold text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{payoutSuccessMsg}</span>
        </div>
      )}

      {/* Main Profile Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-2xl border-2 border-blue-200 overflow-hidden flex-shrink-0 shadow-sm">
              {profileUser.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profileUser.avatar}
                  alt={profileUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                profileUser.name[0]
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {profileUser.name}
                </h1>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {profileUser.role}
                </span>

                {profileUser.role === 'student' && (
                  <VerificationBadge
                    userId={profileUser.id}
                    status={profileUser.verificationStatus}
                    editable={false}
                    size="md"
                  />
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-1 font-semibold text-emerald-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified 18+ ({profileUser.age} yrs)</span>
                </div>
                {profileUser.location && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{profileUser.location}</span>
                    </div>
                  </>
                )}
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Joined {new Date(profileUser.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons: Verification & Edit */}
          <div className="flex items-center gap-2 flex-wrap">
            {isOwner && profileUser.role === 'student' && (
              <button
                onClick={() => setIsVerifModalOpen(true)}
                className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs"
              >
                <Award className="w-4 h-4 text-emerald-600" />
                <span>
                  {profileUser.verificationStatus === 'verified'
                    ? 'View 18+ Certificate'
                    : 'Verify 18+ Student ID'}
                </span>
              </button>
            )}

            {isOwner && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 flex-shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Edit Form */}
        {isEditing ? (
          <form onSubmit={handleSave} className="mt-6 space-y-4 max-w-2xl animate-in fade-in">
            <h3 className="text-sm font-bold text-slate-900">Update Profile Details</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            {profileUser.role === 'student' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      University / Institution
                    </label>
                    <input
                      type="text"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Degree / Major
                    </label>
                    <input
                      type="text"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Hourly Rate ($/hr)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(Number(e.target.value))}
                      className="w-full text-xs sm:text-sm px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Skills (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={skillsInput}
                      onChange={(e) => setSkillsInput(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          /* Profile Details Content */
          <div className="mt-6 space-y-6">
            {profileUser.bio && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  About
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed max-w-3xl">
                  {profileUser.bio}
                </p>
              </div>
            )}

            {/* Student Stats & Wallet Grid */}
            {profileUser.role === 'student' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                {/* University Info */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    Education
                  </h4>
                  <p className="text-sm font-bold text-slate-800 truncate">
                    {profileUser.university || 'University Student'}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {profileUser.degree || 'Undergraduate'}
                  </p>
                </div>

                {/* Hourly Rate */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                    <span className="text-emerald-600 font-bold">$</span>
                    Hourly Rate
                  </h4>
                  <p className="text-xl font-extrabold text-slate-900">
                    {formatCurrency(profileUser.hourlyRate || 25)}
                    <span className="text-xs font-normal text-slate-500"> / hour</span>
                  </p>
                </div>

                {/* Client Rating */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    Rating
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-extrabold text-slate-900">
                      {ratingStats.average}
                    </span>
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.round(ratingStats.average)
                              ? 'fill-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Wallet Balance */}
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                      <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                      Wallet
                    </h4>
                    {isOwner && (profileUser.walletBalance || 0) > 0 && (
                      <button
                        onClick={handleWithdrawWallet}
                        className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-0.5"
                      >
                        Payout <ArrowUpRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <p className="text-xl font-extrabold text-emerald-900">
                    {formatCurrency(profileUser.walletBalance || 0)}
                  </p>
                  <p className="text-[10px] text-emerald-700">Released from completed escrow</p>
                </div>
              </div>
            )}

            {/* Skills Pills for Student */}
            {profileUser.role === 'student' &&
              profileUser.skills &&
              profileUser.skills.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Verified Competencies & Specialties
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {profileUser.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </div>

      {/* Reviews & Testimonials Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Reviews & Feedback</h2>
            <p className="text-xs text-slate-500">
              Verified testimonials from completed tasks on GSAP
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-amber-500 font-bold text-sm">
            <Star className="w-4 h-4 fill-amber-400" />
            <span>{ratingStats.average} out of 5.0</span>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No reviews published yet for this account.
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{rev.reviewerName}</span>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full">
                      {rev.reviewerRole}
                    </span>
                    {rev.jobTitle && (
                      <span className="text-xs text-slate-400 hidden sm:inline">
                        on &quot;{rev.jobTitle}&quot;
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-amber-500">
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

      {/* Verification Modal */}
      <VerificationModal
        user={profileUser}
        isOpen={isVerifModalOpen}
        onClose={() => setIsVerifModalOpen(false)}
        onSuccess={() => {
          loadProfile();
        }}
      />
    </div>
  );
}
