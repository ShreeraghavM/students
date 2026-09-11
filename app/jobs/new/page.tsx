'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { createJob } from '@/lib/storage';
import { Job, JobCategory } from '@/types';
import { Briefcase, DollarSign, Clock, MapPin, Sparkles, Plus, X } from 'lucide-react';

const CATEGORIES: JobCategory[] = [
  'Web Development',
  'Graphic Design',
  'Tutoring',
  'Content Writing',
  'Data Entry',
  'Translation',
  'Research',
  'Administrative',
];

export default function NewJobPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<JobCategory>('Web Development');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Remote');
  const [isRemote, setIsRemote] = useState(true);
  const [hourlyRate, setHourlyRate] = useState<number>(30);
  const [estimatedHours, setEstimatedHours] = useState<number>(15);

  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(['React', 'Tailwind CSS']);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim()) {
      setError('Please provide a title and detailed job description.');
      return;
    }

    if (skills.length === 0) {
      setError('Please specify at least one required skill.');
      return;
    }

    if (!user) {
      setError('You must be logged in to post a job.');
      return;
    }

    try {
      setIsSubmitting(true);
      const newJob: Job = {
        id: `job_${Date.now()}`,
        clientId: user.id,
        clientName: user.name,
        clientEmail: user.email,
        title: title.trim(),
        description: description.trim(),
        category,
        location: location.trim() || (isRemote ? 'Remote' : 'On-Site'),
        isRemote,
        hourlyRate: Number(hourlyRate),
        estimatedHours: Number(estimatedHours),
        requiredSkills: skills,
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const created = createJob(newJob);
      router.push(`/jobs/${created.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create job.');
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['client', 'admin']}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 sm:p-10">
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Post a Student Task</h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Connect with verified 18+ university students for paid hourly assistance
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Task / Project Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Build Interactive Landing Page with React & Tailwind"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-slate-900"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Primary Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as JobCategory)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-slate-900"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Detailed Scope of Work & Deliverables
              </label>
              <textarea
                rows={5}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the objectives, expected deliverables, timeline, and any tools or guidelines the student should follow..."
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-slate-900"
              />
            </div>

            {/* Compensation & Hours */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Hourly Rate ($/hr)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs sm:text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    min="15"
                    max="150"
                    required
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Estimated Total Hours
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="500"
                    required
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-slate-900"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                    Hours (~${hourlyRate * estimatedHours} est. budget)
                  </span>
                </div>
              </div>
            </div>

            {/* Location & Remote */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Austin, TX or Remote"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-slate-900"
                />
              </div>

              <div className="sm:pt-6">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isRemote}
                    onChange={(e) => {
                      setIsRemote(e.target.checked);
                      if (e.target.checked && !location) setLocation('Remote');
                    }}
                    className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                  />
                  <span className="text-xs sm:text-sm font-medium text-slate-700">
                    This task can be done 100% remotely
                  </span>
                </label>
              </div>
            </div>

            {/* Required Skills (Tag Input) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Required Skills & Tags
              </label>
              <div className="flex gap-2 mb-2.5">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="Type a skill and press Enter or click Add (e.g. Figma, Python, Next.js)"
                  className="flex-1 text-xs sm:text-sm px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-slate-900"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 border border-brand-200"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-brand-400 hover:text-brand-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-sm transition"
              >
                {isSubmitting ? 'Publishing Task...' : 'Publish Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
