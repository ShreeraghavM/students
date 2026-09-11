'use client';

import React, { useState, useId } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, calculateAge } from '@/context/AuthContext';
import { GraduationCap, Briefcase, ShieldAlert, CheckCircle, AlertCircle } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [role, setRole] = useState<'client' | 'student'>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');

  // Student specific
  const [university, setUniversity] = useState('');
  const [degree, setDegree] = useState('');
  const [skillsInput, setSkillsInput] = useState('React, TypeScript, Tailwind');
  const [hourlyRate, setHourlyRate] = useState(25);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculatedAge = dateOfBirth ? calculateAge(dateOfBirth) : null;
  const isUnderage = calculatedAge !== null && calculatedAge < 18;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!dateOfBirth) {
      setError('Date of birth is required to verify age eligibility.');
      return;
    }

    const age = calculateAge(dateOfBirth);
    if (age < 18) {
      setError(
        `Strict Platform Rule: You must be 18 years or older to register on GSAP (Your calculated age is ${age}). No task category or account type is available for minors.`
      );
      return;
    }

    setIsLoading(true);
    try {
      const skills =
        role === 'student'
          ? skillsInput
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined;

      await signup({
        name,
        email,
        password,
        role,
        dateOfBirth,
        location,
        bio,
        skills,
        hourlyRate: role === 'student' ? Number(hourlyRate) : undefined,
        university: role === 'student' ? university : undefined,
        degree: role === 'student' ? degree : undefined,
      });

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-brand-600 items-center justify-center text-white shadow-md mb-3">
          <GraduationCap className="w-7 h-7" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Join the Global Student Assistance Platform
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          Strictly 18+ marketplace for clients and university students
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-lg border border-slate-200/90 rounded-3xl">
          {/* Hard 18+ Rule Reminder Banner */}
          <div className="mb-6 p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs text-emerald-800">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">18+ Eligibility Hard Enforcement</span>
              <span>
                To maintain regulatory compliance and safety, all platform members must be 18 years
                or older. Age is verified against your birthdate upon registration.
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-700">
              <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-rose-800">Registration Error</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Picker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                I want to join as a:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 ${
                    role === 'student'
                      ? 'border-brand-600 bg-brand-50/60 ring-2 ring-brand-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      role === 'student' ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-slate-900 block">Student (18+)</span>
                    <span className="text-[11px] text-slate-500 leading-snug block mt-0.5">
                      Apply to jobs & earn hourly
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('client')}
                  className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 ${
                    role === 'client'
                      ? 'border-brand-600 bg-brand-50/60 ring-2 ring-brand-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      role === 'client' ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-slate-900 block">Client (18+)</span>
                    <span className="text-[11px] text-slate-500 leading-snug block mt-0.5">
                      Post tasks & hire talent
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === 'student' ? 'e.g. Jordan Miller' : 'e.g. Elena Rostova'}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'student' ? 'student@university.edu' : 'client@company.com'}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-slate-900"
                />
              </div>

              {/* Date of Birth / 18+ Hard Enforcement */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Date of Birth (18+ Required)
                  </label>
                  {calculatedAge !== null && (
                    <span
                      className={`text-[11px] font-bold ${
                        calculatedAge >= 18 ? 'text-emerald-600' : 'text-rose-600 animate-pulse'
                      }`}
                    >
                      Age: {calculatedAge} {calculatedAge >= 18 ? '✓ Eligible' : '✕ Under 18'}
                    </span>
                  )}
                </div>
                <input
                  type="date"
                  required
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className={`w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 text-slate-900 ${
                    isUnderage
                      ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/50'
                      : 'border-slate-200 focus:ring-brand-500'
                  }`}
                />
                {isUnderage && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1">
                    Warning: You must be at least 18 years old to join.
                  </p>
                )}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                City / Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Boston, MA or Remote"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-slate-900"
              />
            </div>

            {/* Student Specific Fields */}
            {role === 'student' && (
              <div className="space-y-4 pt-3 border-t border-slate-100 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      University / College
                    </label>
                    <input
                      type="text"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      placeholder="e.g. University of Michigan"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Target Hourly Rate ($/hr)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs sm:text-sm">
                        $
                      </span>
                      <input
                        type="number"
                        min="15"
                        max="150"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(Number(e.target.value))}
                        className="w-full text-xs sm:text-sm pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    placeholder="e.g. React, Python, UI/UX, Calculus"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-slate-900"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Used by the AI Match Score engine to recommend relevant jobs.
                  </p>
                </div>
              </div>
            )}

            {/* Bio */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bio / Summary
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={
                  role === 'student'
                    ? 'Highlight your academic focus, project experience, and availability...'
                    : 'Describe your business or projects you need assistance with...'
                }
                className="w-full text-xs sm:text-sm px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || isUnderage}
              className={`w-full py-3.5 px-4 font-semibold rounded-xl text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2 ${
                isUnderage
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-brand-600 hover:bg-brand-700 text-white'
              }`}
            >
              {isUnderage
                ? 'Under 18 — Registration Prohibited'
                : isLoading
                ? 'Creating Account...'
                : `Join GSAP as ${role === 'student' ? 'Student' : 'Client'}`}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-brand-600 hover:underline">
              Log in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
