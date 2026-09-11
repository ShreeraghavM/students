'use client';

import React, { useState } from 'react';
import { AlertTriangle, X, ShieldAlert } from 'lucide-react';
import { createDispute } from '@/lib/storage';
import { Dispute, UserRole } from '@/types';

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  raisedById: string;
  raisedByName: string;
  raisedByRole: UserRole;
  againstId: string;
  againstName: string;
  onDisputeRaised: (dispute: Dispute) => void;
}

const DISPUTE_REASONS = [
  'Work deliverables incomplete or unsatisfactory',
  'Communication breakdown or unresponsive party',
  'Disagreement regarding hours or hourly rate',
  'Scope creep beyond original job description',
  'Intellectual property or licensing inquiry',
  'Other administrative concern',
];

export default function DisputeModal({
  isOpen,
  onClose,
  jobId,
  jobTitle,
  raisedById,
  raisedByName,
  raisedByRole,
  againstId,
  againstName,
  onDisputeRaised,
}: DisputeModalProps) {
  const [reason, setReason] = useState(DISPUTE_REASONS[0]);
  const [details, setDetails] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!details.trim()) {
      setError('Please provide specific details regarding this issue.');
      return;
    }

    try {
      setIsSubmitting(true);
      const newDispute: Dispute = {
        id: `disp_${Date.now()}`,
        jobId,
        jobTitle,
        raisedById,
        raisedByName,
        raisedByRole,
        againstId,
        againstName,
        reason,
        details: details.trim(),
        status: 'open',
        createdAt: new Date().toISOString(),
      };

      const created = createDispute(newDispute);
      onDisputeRaised(created);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to file dispute.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Raise a Dispute</h3>
              <p className="text-xs text-slate-500">
                Filing issue regarding <span className="font-semibold text-slate-700">{jobTitle}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <span>
            Disputes are immediately recorded in the Platform Admin Portal (`/admin`) for review and
            administrative arbitration.
          </span>
        </div>

        {error && (
          <div className="my-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Primary Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500 text-slate-900"
            >
              {DISPUTE_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Detailed Description & Evidence
            </label>
            <textarea
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Explain clearly what occurred and what resolution you are seeking..."
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500 text-slate-900"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              Submit Dispute to Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
