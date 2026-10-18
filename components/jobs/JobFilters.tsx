'use client';

import React from 'react';
import { Search, Filter, RotateCcw, Globe } from 'lucide-react';
import { JobCategory, JobFilters as JobFiltersType } from '@/types';
import { useAuth } from '@/context/AuthContext';

const CATEGORIES: ('All' | JobCategory)[] = [
  'All',
  'Family & Elderly Care',
  'Web Development',
  'Graphic Design',
  'Tutoring',
  'Content Writing',
  'Data Entry',
  'Translation',
  'Research',
  'Administrative',
];

interface JobFiltersProps {
  filters: JobFiltersType;
  onChange: (newFilters: JobFiltersType) => void;
  onReset: () => void;
  totalResults: number;
}

export default function JobFilters({
  filters,
  onChange,
  onReset,
  totalResults,
}: JobFiltersProps) {
  const { currency } = useAuth();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs mb-8 space-y-4">
      {/* Search Input and Category Selector */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search */}
        <div className="relative md:col-span-6">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.query || ''}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
            placeholder="Search by role, diaspora care, skills (e.g. Hospital escort, React), or client..."
            className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 transition"
          />
        </div>

        {/* Category Dropdown */}
        <div className="md:col-span-3">
          <select
            value={filters.category || 'All'}
            onChange={(e) => onChange({ ...filters, category: e.target.value })}
            className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 transition"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Location Input */}
        <div className="md:col-span-3">
          <input
            type="text"
            value={filters.location || ''}
            onChange={(e) => onChange({ ...filters, location: e.target.value })}
            placeholder="City (e.g. Bangalore, London, Remote)..."
            className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 transition"
          />
        </div>
      </div>

      {/* Second Row: Toggles, Rates, Reset */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-700">
          {/* Cross Border Only Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none px-2.5 py-1 rounded-lg bg-blue-50/70 border border-blue-200 text-blue-900">
            <input
              type="checkbox"
              checked={!!filters.crossBorderOnly}
              onChange={(e) => onChange({ ...filters, crossBorderOnly: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span className="font-semibold flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              Cross-Border Concierge Only
            </span>
          </label>

          {/* Remote Only Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!!filters.remoteOnly}
              onChange={(e) => onChange({ ...filters, remoteOnly: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span>Remote Tasks Only</span>
          </label>

          {/* Min Hourly Rate */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Min Rate:</span>
            <input
              type="number"
              min="0"
              max="1000"
              value={filters.minRate || ''}
              onChange={(e) =>
                onChange({
                  ...filters,
                  minRate: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              placeholder="0"
              className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          {/* Max Hourly Rate */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Max Rate:</span>
            <input
              type="number"
              min="0"
              max="5000"
              value={filters.maxRate || ''}
              onChange={(e) =>
                onChange({
                  ...filters,
                  maxRate: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              placeholder="200"
              className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{totalResults}</strong> jobs
          </span>
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
