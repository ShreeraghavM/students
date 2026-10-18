'use client';

import React from 'react';
import { Search, Filter, RotateCcw, Globe, Sparkles, MapPin } from 'lucide-react';
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
    <div className="bg-white border border-zinc-200 rounded-3xl p-5 sm:p-6 shadow-xs mb-8 space-y-4">
      {/* Search Input and Category Selector */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search */}
        <div className="relative md:col-span-6">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.query || ''}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
            placeholder="Search by role, diaspora care, skills (e.g. Hospital escort, React), or client..."
            className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-zinc-900 transition"
          />
        </div>

        {/* Category Dropdown */}
        <div className="md:col-span-3">
          <select
            value={filters.category || 'All'}
            onChange={(e) => onChange({ ...filters, category: e.target.value })}
            className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-zinc-900 transition font-medium"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Task Disciplines' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Location Input */}
        <div className="relative md:col-span-3">
          <MapPin className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.location || ''}
            onChange={(e) => onChange({ ...filters, location: e.target.value })}
            placeholder="City (Bangalore, London, Remote)..."
            className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-zinc-900 transition"
          />
        </div>
      </div>

      {/* Second Row: Toggles, Rates, Reset */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-zinc-100">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-medium text-zinc-700">
          {/* Cross Border Only Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 hover:bg-amber-500/20 transition">
            <input
              type="checkbox"
              checked={!!filters.crossBorderOnly}
              onChange={(e) => onChange({ ...filters, crossBorderOnly: e.target.checked })}
              className="w-4 h-4 text-amber-600 rounded border-zinc-300 focus:ring-amber-500"
            />
            <span className="font-bold flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-600" />
              Diaspora Concierge Only
            </span>
          </label>

          {/* Remote Only Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none px-2.5 py-1.5 rounded-xl hover:bg-zinc-100 transition">
            <input
              type="checkbox"
              checked={!!filters.remoteOnly}
              onChange={(e) => onChange({ ...filters, remoteOnly: e.target.checked })}
              className="w-4 h-4 text-amber-600 rounded border-zinc-300 focus:ring-amber-500"
            />
            <span>Remote Tasks Only</span>
          </label>

          {/* Rate inputs */}
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-zinc-500">Rate:</span>
            <input
              type="number"
              min="0"
              max="500"
              value={filters.minRate || ''}
              onChange={(e) =>
                onChange({
                  ...filters,
                  minRate: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              placeholder="Min"
              className="w-14 px-2 py-1 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-mono"
            />
            <span className="text-zinc-400">-</span>
            <input
              type="number"
              min="0"
              max="500"
              value={filters.maxRate || ''}
              onChange={(e) =>
                onChange({
                  ...filters,
                  maxRate: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              placeholder="Max"
              className="w-14 px-2 py-1 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-mono"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500 font-mono">
            Showing <strong className="text-zinc-900 font-bold">{totalResults}</strong> tasks
          </span>
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:text-amber-600 hover:bg-zinc-100 rounded-lg transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
