'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, CURRENCY_RATES } from '@/context/AuthContext';
import { Currency } from '@/types';
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
  Bell,
  Wallet,
  Globe,
  Check,
} from 'lucide-react';

export default function Navbar() {
  const {
    user,
    logout,
    switchUser,
    allDemoUsers,
    currency,
    setCurrency,
    formatCurrency,
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
  } = useAuth();
  const pathname = usePathname();
  const [showDemoDropdown, setShowDemoDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-700 transition">
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
                    ? 'bg-blue-50 text-blue-700 font-semibold'
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
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-blue-600" />
                  Post a Job
                </Link>
              )}

              {user && (
                <Link
                  href="/dashboard"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                    isActive('/dashboard')
                      ? 'bg-blue-50 text-blue-700 font-semibold'
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
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowCurrencyDropdown(!showCurrencyDropdown);
                  setShowNotifDropdown(false);
                  setShowDemoDropdown(false);
                  setShowUserMenu(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition"
                title="Switch platform currency"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showCurrencyDropdown && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in"
                  onMouseLeave={() => setShowCurrencyDropdown(false)}
                >
                  <div className="px-3 py-1 border-b border-slate-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Select Currency
                    </p>
                  </div>
                  {(['USD', 'GBP', 'EUR', 'INR'] as Currency[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setCurrency(c);
                        setShowCurrencyDropdown(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-blue-50 transition ${
                        currency === c ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{CURRENCY_RATES[c].label}</span>
                      {currency === c && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            {user && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowNotifDropdown(!showNotifDropdown);
                    setShowCurrencyDropdown(false);
                    setShowDemoDropdown(false);
                    setShowUserMenu(false);
                  }}
                  className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition"
                  title="Notifications & Activity"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {showNotifDropdown && (
                  <div
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in"
                    onMouseLeave={() => setShowNotifDropdown(false)}
                  >
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-sm font-bold text-slate-800">Notifications</span>
                        {unreadNotificationsCount > 0 && (
                          <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            {unreadNotificationsCount} new
                          </span>
                        )}
                      </div>
                      {unreadNotificationsCount > 0 && (
                        <button
                          type="button"
                          onClick={markAllNotificationsRead}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-xs text-slate-400">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`p-3.5 hover:bg-slate-50 transition cursor-pointer ${
                              !n.read ? 'bg-blue-50/40' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                              <span className="text-[10px] text-slate-400 shrink-0">
                                {new Date(n.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-1 leading-snug">{n.message}</p>
                            {n.link && (
                              <Link
                                href={n.link}
                                onClick={() => setShowNotifDropdown(false)}
                                className="inline-block mt-1.5 text-[11px] font-semibold text-blue-600 hover:underline"
                              >
                                View Details →
                              </Link>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Student Wallet Pill */}
            {user?.role === 'student' && (
              <Link
                href={`/profile/${user.id}`}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-bold text-emerald-800 transition"
                title="Student Wallet Balance"
              >
                <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                <span>{formatCurrency(user.walletBalance || 0)}</span>
              </Link>
            )}

            {/* Quick Demo Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowDemoDropdown(!showDemoDropdown);
                  setShowCurrencyDropdown(false);
                  setShowNotifDropdown(false);
                  setShowUserMenu(false);
                }}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition"
                title="Switch between demo accounts instantaneously"
              >
                <Users className="w-3.5 h-3.5 text-blue-600" />
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
                        className={`w-full text-left px-3.5 py-2.5 flex items-center gap-3 hover:bg-blue-50/60 transition ${
                          user?.id === u.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                          {u.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-xs text-blue-600">
                              {u.name[0]}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900 truncate flex items-center gap-1.5">
                            {u.name}
                            {user?.id === u.id && (
                              <span className="text-[10px] text-blue-600 font-bold">(Current)</span>
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
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowCurrencyDropdown(false);
                    setShowNotifDropdown(false);
                    setShowDemoDropdown(false);
                  }}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition border border-transparent hover:border-slate-200"
                >
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs border border-blue-200">
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
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                    >
                      <UserIcon className="w-4 h-4" />
                      View & Edit Profile
                    </Link>

                    <Link
                      href="/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>

                    {user.role === 'student' && (
                      <div className="px-4 py-1.5 my-1 bg-blue-50/50 border-y border-blue-100/50 flex items-center justify-between text-[11px]">
                        <span className="text-slate-600">Wallet Available</span>
                        <span className="font-bold text-emerald-700">
                          {formatCurrency(user.walletBalance || 0)}
                        </span>
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
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition"
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
