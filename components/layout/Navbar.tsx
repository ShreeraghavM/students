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
  Sparkles,
  Search,
  PieChart,
  Command,
} from 'lucide-react';
import InvestorDeckModal from '@/components/investor/InvestorDeckModal';
import CommandPalette from '@/components/layout/CommandPalette';

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
  const [showInvestorModal, setShowInvestorModal] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800/90 text-zinc-100 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center gap-6 lg:gap-8">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center text-zinc-950 shadow-glow-amber group-hover:scale-105 transition-transform duration-200 font-black">
                  <GraduationCap className="w-6 h-6 text-zinc-950 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white text-lg tracking-tight font-display">
                      GSAP
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      18+ Verified
                    </span>
                  </div>
                  <span className="hidden sm:block text-[10px] font-mono uppercase tracking-wider text-zinc-400 leading-none">
                    Student Marketplace & Escrow
                  </span>
                </div>
              </Link>

              {/* Main Navigation */}
              <nav className="hidden md:flex items-center gap-1.5">
                <Link
                  href="/jobs"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                    isActive('/jobs')
                      ? 'bg-zinc-800 text-white font-bold'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Browse Tasks</span>
                </Link>

                {user?.role === 'client' && (
                  <Link
                    href="/jobs/new"
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                      isActive('/jobs/new')
                        ? 'bg-zinc-800 text-amber-400 font-bold'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Post Task</span>
                  </Link>
                )}

                {user && (
                  <Link
                    href="/dashboard"
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                      isActive('/dashboard')
                        ? 'bg-zinc-800 text-white font-bold'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                  </Link>
                )}

                {user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                      isActive('/admin')
                        ? 'bg-purple-900/40 text-purple-300 border border-purple-500/30'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5 text-purple-400" />
                    <span>Admin</span>
                  </Link>
                )}
              </nav>
            </div>

            {/* Right Header Actions */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* £8,000 Pitch Deck Pill for Grant Committees */}
              <button
                type="button"
                onClick={() => setShowInvestorModal(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition shadow-xs group"
                title="View £8,000 GBP Grant Allocation, 3-6 Month Roadmap & Unit Economics"
              >
                <PieChart className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
                <span>£8,000 Grant Pitch</span>
              </button>

              {/* Quick Command Palette Button */}
              <button
                type="button"
                onClick={() => setShowCommandPalette(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-400 hover:text-zinc-200 transition"
                title="Quick Search (Cmd+K)"
              >
                <Search className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden xl:inline text-[11px] font-mono text-zinc-400">Search</span>
                <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1 py-0.2 rounded bg-zinc-800 text-[10px] font-mono text-zinc-400 border border-zinc-700">
                  ⌘K
                </kbd>
              </button>

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
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-xs font-mono font-bold text-zinc-200 transition"
                  title="Switch platform currency"
                >
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  <span>{currency}</span>
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                </button>

                {showCurrencyDropdown && (
                  <div
                    className="absolute right-0 mt-2 w-52 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in"
                    onMouseLeave={() => setShowCurrencyDropdown(false)}
                  >
                    <div className="px-3 py-1.5 border-b border-zinc-800">
                      <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                        Select Billing Currency
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
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-zinc-800 transition ${
                          currency === c ? 'text-amber-400 font-bold bg-amber-500/10' : 'text-zinc-300'
                        }`}
                      >
                        <span className="font-mono">{CURRENCY_RATES[c].label}</span>
                        {currency === c && <Check className="w-3.5 h-3.5 text-amber-400" />}
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
                    className="relative p-2 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition"
                    title="Notifications & Activity"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-amber-500 text-zinc-950 text-[10px] font-mono font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </button>

                  {showNotifDropdown && (
                    <div
                      className="absolute right-0 mt-2 w-80 sm:w-96 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in text-zinc-100"
                      onMouseLeave={() => setShowNotifDropdown(false)}
                    >
                      <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                            Task Stream & Activity
                          </span>
                          {unreadNotificationsCount > 0 && (
                            <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">
                              {unreadNotificationsCount} new
                            </span>
                          )}
                        </div>
                        {unreadNotificationsCount > 0 && (
                          <button
                            type="button"
                            onClick={markAllNotificationsRead}
                            className="text-xs text-amber-400 hover:text-amber-300 font-medium"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-zinc-800/80">
                        {notifications.length === 0 ? (
                          <div className="py-8 text-center text-xs text-zinc-500">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => markNotificationRead(n.id)}
                              className={`p-3.5 hover:bg-zinc-800/50 transition cursor-pointer ${
                                !n.read ? 'bg-amber-500/5' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-xs font-semibold text-zinc-200">{n.title}</p>
                                <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                                  {new Date(n.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                              <p className="text-xs text-zinc-400 mt-1 leading-snug">{n.message}</p>
                              {n.link && (
                                <Link
                                  href={n.link}
                                  onClick={() => setShowNotifDropdown(false)}
                                  className="inline-block mt-1.5 text-[11px] font-bold text-amber-400 hover:underline"
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
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-xs font-mono font-bold text-emerald-400 transition"
                  title="Student Wallet Balance"
                >
                  <Wallet className="w-3.5 h-3.5 text-emerald-400" />
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
                  className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-xs font-semibold text-zinc-200 transition"
                  title="Switch between demo accounts instantaneously"
                >
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>Demo Switcher</span>
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                </button>

                {showDemoDropdown && (
                  <div
                    className="absolute right-0 mt-2 w-72 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 text-zinc-100"
                    onMouseLeave={() => setShowDemoDropdown(false)}
                  >
                    <div className="px-3.5 py-2 border-b border-zinc-800">
                      <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                        1-Click Persona Simulator
                      </p>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-zinc-800/60">
                      {allDemoUsers.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            switchUser(u.id);
                            setShowDemoDropdown(false);
                          }}
                          className={`w-full text-left px-3.5 py-2.5 flex items-center gap-3 hover:bg-zinc-800 transition ${
                            user?.id === u.id ? 'bg-amber-500/10 border-l-4 border-amber-500' : ''
                          }`}
                        >
                          <div className="w-8 h-8 rounded-full bg-zinc-800 overflow-hidden flex-shrink-0 border border-zinc-700">
                            {u.avatar ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-xs text-amber-400">
                                {u.name[0]}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
                              {u.name}
                              {user?.id === u.id && (
                                <span className="text-[10px] text-amber-400 font-mono font-bold">(Active)</span>
                              )}
                            </p>
                            <p className="text-[11px] text-zinc-400 capitalize font-mono">
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
                    className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-zinc-800/80 transition border border-transparent hover:border-zinc-700"
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs border border-amber-500/30">
                      {user.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.name.charAt(0)
                      )}
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-xs font-semibold text-white leading-tight truncate max-w-[110px]">
                        {user.name}
                      </p>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                        {user.role}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                  </button>

                  {showUserMenu && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl py-1.5 z-50 text-zinc-200"
                      onMouseLeave={() => setShowUserMenu(false)}
                    >
                      <div className="px-4 py-2.5 border-b border-zinc-800">
                        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Signed in as</p>
                        <p className="text-xs font-bold text-white truncate">{user.email}</p>
                      </div>

                      <Link
                        href={`/profile/${user.id}`}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
                      >
                        <UserIcon className="w-3.5 h-3.5" />
                        <span>Profile & Verification</span>
                      </Link>

                      <Link
                        href="/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span>Dashboard</span>
                      </Link>

                      {user.role === 'student' && (
                        <div className="px-4 py-2 my-1 bg-emerald-500/10 border-y border-emerald-500/20 flex items-center justify-between text-xs">
                          <span className="text-zinc-400">Wallet Balance</span>
                          <span className="font-mono font-bold text-emerald-400">
                            {formatCurrency(user.walletBalance || 0)}
                          </span>
                        </div>
                      )}

                      <div className="border-t border-zinc-800 mt-1 pt-1">
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white rounded-lg hover:bg-zinc-900 transition"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-3.5 py-1.5 text-xs font-bold text-zinc-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-glow-amber transition"
                  >
                    Join (18+)
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Grant Investor Pitch Deck Modal */}
      <InvestorDeckModal
        isOpen={showInvestorModal}
        onClose={() => setShowInvestorModal(false)}
      />

      {/* Quick Command Palette */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onOpenInvestorDeck={() => setShowInvestorModal(true)}
      />
    </>
  );
}
