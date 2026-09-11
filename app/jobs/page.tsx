'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getJobs } from '@/lib/storage';
import { Job, JobFilters as JobFiltersType } from '@/types';
import JobCard from '@/components/jobs/JobCard';
import JobFilters from '@/components/jobs/JobFilters';
import { Briefcase, PlusCircle, Sparkles, FilterX } from 'lucide-react';

export default function JobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState<JobFiltersType>({
    category: 'All',
    query: '',
    location: '',
    remoteOnly: false,
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

  const handleResetFilters = () => {
    setFilters({
      category: 'All',
      query: '',
      location: '',
      remoteOnly: false,
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
        if (!matchesTitle && !matchesDesc && !matchesClient && !matchesSkills) {
          return false;
        }
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
        if (!matchesLoc && !matchesRemote) return false;
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
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Marketplace Tasks & Jobs
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
              {filteredJobs.length} Available
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Browse paid hourly tasks posted by clients for verified university students (18+ only)
          </p>
        </div>

        <div className="flex items-center gap-3">
          {user?.role === 'student' && (
            <div className="hidden lg:flex items-center gap-2 px-3.5 py-2 bg-indigo-50/80 border border-indigo-200 rounded-xl text-xs text-indigo-800">
              <Sparkles className="w-4 h-4 text-brand-600 flex-shrink-0" />
              <span>
                Personalized <strong>AI Match Scores</strong> are calculated for your skills & rate.
              </span>
            </div>
          )}

          {user?.role === 'client' && (
            <Link
              href="/jobs/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition"
            >
              <PlusCircle className="w-4 h-4" />
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
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl transition"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
