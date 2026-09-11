'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { GraduationCap, LogIn, AlertCircle, Sparkles, Loader2 } from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      router.push(redirectPath);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    login(userEmail, userPass)
      .then(() => router.push(redirectPath))
      .catch((e) => setError(e.message));
  };

  return (
    <div className="bg-white py-8 px-6 sm:px-10 shadow-lg border border-slate-200/90 rounded-3xl">
      {error && (
        <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-slate-900 transition"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-700">
              Password
            </label>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-slate-900 transition"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
        </button>
      </form>

      {/* 1-Click Demo Accounts Preset Bar */}
      <div className="mt-6 pt-6 border-t border-slate-100">
        <p className="text-xs font-bold text-slate-700 flex items-center gap-1 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          1-Click Demo Credentials:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleDemoLogin('sarah.client@example.com', 'client123')}
            className="text-left p-2 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/50 transition text-[11px]"
          >
            <span className="font-bold text-slate-800 block">Client (Sarah)</span>
            <span className="text-slate-500">sarah.client@example.com</span>
          </button>

          <button
            type="button"
            onClick={() => handleDemoLogin('alex.dev@mit.edu', 'student123')}
            className="text-left p-2 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/50 transition text-[11px]"
          >
            <span className="font-bold text-slate-800 block">Student (Alex, Dev)</span>
            <span className="text-slate-500">alex.dev@mit.edu</span>
          </button>

          <button
            type="button"
            onClick={() => handleDemoLogin('maya.design@risd.edu', 'student123')}
            className="text-left p-2 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/50 transition text-[11px]"
          >
            <span className="font-bold text-slate-800 block">Student (Maya, Design)</span>
            <span className="text-slate-500">maya.design@risd.edu</span>
          </button>

          <button
            type="button"
            onClick={() => handleDemoLogin('admin@gsap.com', 'admin123')}
            className="text-left p-2 rounded-xl border border-purple-200 hover:border-purple-300 hover:bg-purple-50/50 transition text-[11px]"
          >
            <span className="font-bold text-purple-900 block">Administrator</span>
            <span className="text-purple-600">admin@gsap.com</span>
          </button>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-slate-500">
        Don&apos;t have an account yet?{' '}
        <Link href="/signup" className="font-semibold text-brand-600 hover:underline">
          Create an account (18+ only)
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-brand-600 items-center justify-center text-white shadow-md mb-3">
          <GraduationCap className="w-7 h-7" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome back to GSAP
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          Sign in to your verified student or client account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense
          fallback={
            <div className="bg-white py-12 px-6 rounded-3xl shadow-lg border border-slate-200 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
              <p className="text-xs text-slate-400">Loading sign in...</p>
            </div>
          }
        >
          <LoginFormContent />
        </Suspense>
      </div>
    </div>
  );
}
