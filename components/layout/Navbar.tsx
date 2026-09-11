'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  GraduationCap,
  Briefcase,
  LayoutDashboard,
  Shield,
  PlusCircle,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Users,
  Sparkles,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, switchUser, allDemoUsers } = useAuth();
  const pathname = usePathname();
  const [showDemoDropdown, setShowDemoDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-sm group-hover:bg-brand-700 transition">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-lg tracking-tight flex items-center gap-1.5">
                  GSAP
                  <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    18+ Verified
                  </span>
                </span>
                <span className="hidden md:block text-[11px] font-medium text-slate-500 leading-tight">
                  Global Student Assistance Platform
                </span>
              </div>
            </Link>

            {/* Main Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/jobs"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                  isActive('/jobs')
                    ? 'bg-brand-50 text-brand-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                Browse Jobs
              </Link>

              {user?.role === 'client' && (
                <Link
                  href="/jobs/new"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                    isActive('/jobs/new')
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-brand-600" />
                  Post a Job
                </Link>
              )}

              {user && (
                <Link
                  href="/dashboard"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                    isActive('/dashboard')
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              )}

              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                    isActive('/admin')
                      ? 'bg-purple-50 text-purple-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Shield className="w-4 h-4 text-purple-600" />
                  Admin Panel
                </Link>
              )}
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDemoDropdown(!showDemoDropdown)}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition"
                title="Switch between demo accounts instantaneously"
              >
                <Users className="w-3.5 h-3.5 text-brand-600" />
                <span>Demo Switcher</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showDemoDropdown && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setShowDemoDropdown(false)}
                >
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Switch Demo Account (1-Click)
                    </p>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                    {allDemoUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setShowDemoDropdown(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 flex items-center gap-3 hover:bg-brand-50/60 transition ${
                          user?.id === u.id ? 'bg-brand-50 border-l-4 border-brand-600' : ''
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                          {u.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-xs text-brand-600">
                              {u.name[0]}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900 truncate flex items-center gap-1.5">
                            {u.name}
                            {user?.id === u.id && (
                              <span className="text-[10px] text-brand-600 font-bold">(Current)</span>
                            )}
                          </p>
                          <p className="text-[11px] text-slate-500 capitalize">
                            {u.role} • {u.role === 'student' ? u.university?.split(' ')[0] || '18+ Student' : `${u.age} yrs`}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Authenticated user menu or Login/Signup */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition border border-transparent hover:border-slate-200"
                >
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xs border border-brand-200">
                    {user.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-[120px]">
                      {user.name}
                    </p>
                    <span className="text-[10px] font-medium uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showUserMenu && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50"
                    onMouseLeave={() => setShowUserMenu(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-medium text-slate-400">Signed in as</p>
                      <p className="text-xs font-bold text-slate-800 truncate">{user.email}</p>
                    </div>

                    <Link
                      href={`/profile/${user.id}`}
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition"
                    >
                      <UserIcon className="w-4 h-4" />
                      View & Edit Profile
                    </Link>

                    <Link
                      href="/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>

                    {user.role === 'student' && (
                      <div className="px-4 py-1.5 my-1 bg-brand-50/50 border-y border-brand-100/50 flex items-center justify-between text-[11px]">
                        <span className="text-slate-600">Hourly Rate</span>
                        <span className="font-bold text-brand-700">${user.hourlyRate || 25}/hr</span>
                      </div>
                    )}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition"
                >
                  Join (18+)
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
