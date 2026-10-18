'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getJobs } from '@/lib/storage';
import { Job, JobFilters as JobFiltersType } from '@/types';
import JobCard from '@/components/jobs/JobCard';
import JobFilters from '@/components/jobs/JobFilters';
import { Briefcase, PlusCircle, Sparkles, FilterX, Globe } from 'lucide-react';

function JobsContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [jobs, setJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState<JobFiltersType>({
    category: initialCategory,
    query: '',
    location: '',
    remoteOnly: false,
    crossBorderOnly: false,
    minRate: undefined,
    maxRate: undefined,
  });

  const loadJobs = () => {
    const fetched = getJobs();
    setJobs(fetched);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setFilters((prev) => ({ ...prev, category: cat }));
    }
  }, [searchParams]);

  const handleResetFilters = () => {
    setFilters({
      category: 'All',
      query: '',
      location: '',
      remoteOnly: false,
      crossBorderOnly: false,
      minRate: undefined,
      maxRate: undefined,
    });
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Query filter
      if (filters.query && filters.query.trim()) {
        const q = filters.query.toLowerCase().trim();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesDesc = job.description.toLowerCase().includes(q);
        const matchesClient = job.clientName.toLowerCase().includes(q);
        const matchesSkills = job.requiredSkills.some((s) => s.toLowerCase().includes(q));
        const matchesCorridor =
          job.crossBorderInfo &&
          (job.crossBorderInfo.senderLocation.toLowerCase().includes(q) ||
            job.crossBorderInfo.recipientLocation.toLowerCase().includes(q) ||
            job.crossBorderInfo.languagePreference.toLowerCase().includes(q));

        if (!matchesTitle && !matchesDesc && !matchesClient && !matchesSkills && !matchesCorridor) {
          return false;
        }
      }

      // Cross Border Only filter
      if (filters.crossBorderOnly && !job.isCrossBorder && job.category !== 'Family & Elderly Care') {
        return false;
      }

      // Category filter
      if (filters.category && filters.category !== 'All') {
        if (job.category !== filters.category) return false;
      }

      // Remote only
      if (filters.remoteOnly && !job.isRemote) {
        return false;
      }

      // Location
      if (filters.location && filters.location.trim()) {
        const loc = filters.location.toLowerCase().trim();
        const matchesLoc = job.location.toLowerCase().includes(loc);
        const matchesRemote = job.isRemote && loc.includes('remote');
        const matchesCorridor =
          job.crossBorderInfo &&
          (job.crossBorderInfo.senderLocation.toLowerCase().includes(loc) ||
            job.crossBorderInfo.recipientLocation.toLowerCase().includes(loc));
        if (!matchesLoc && !matchesRemote && !matchesCorridor) return false;
      }

      // Min Rate
      if (filters.minRate !== undefined && filters.minRate > 0) {
        if (job.hourlyRate < filters.minRate) return false;
      }

      // Max Rate
      if (filters.maxRate !== undefined && filters.maxRate > 0) {
        if (job.hourlyRate > filters.maxRate) return false;
      }

      return true;
    });
  }, [jobs, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight font-display">
              Marketplace Tasks & Jobs
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-800 border border-amber-500/20">
              {filteredJobs.length} Available
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500">
            Browse paid hourly tasks, cross-border diaspora care, and technical student gigs (18+ only)
          </p>
        </div>

        <div className="flex items-center gap-3">
          {user?.role === 'student' && (
            <div className="hidden lg:flex items-center gap-2 px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-300 font-mono">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                Personalized <strong className="text-white">AI Match Scores</strong> are calculated for your skills & rate.
              </span>
            </div>
          )}

          {user?.role === 'client' && (
            <Link
              href="/jobs/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-xl text-xs sm:text-sm font-bold shadow-glow-amber transition"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Post New Task</span>
            </Link>
          )}
        </div>
      </div>

      {/* Filter Component */}
      <JobFilters
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
        totalResults={filteredJobs.length}
      />

      {/* Job Cards Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} currentUser={user} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FilterX className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No matching jobs found</h3>
          <p className="text-xs sm:text-sm text-slate-500 mb-6">
            Try adjusting your search criteria, widening your hourly rate range, or selecting &quot;All
            Categories&quot;.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-slate-400">
          Loading marketplace tasks...
        </div>
      }
    >
      <JobsContent />
    </Suspense>
  );
}
