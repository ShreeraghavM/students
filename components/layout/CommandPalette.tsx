'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Currency } from '@/types';
import {
  Search,
  Command,
  Briefcase,
  Users,
  LayoutDashboard,
  Shield,
  PlusCircle,
  Globe,
  Sparkles,
  PieChart,
  ArrowRight,
  X,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenInvestorDeck: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  onOpenInvestorDeck,
}: CommandPaletteProps) {
  const router = useRouter();
  const { user, switchUser, setCurrency } = useAuth();
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or state
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navigateTo = (path: string) => {
    router.push(path);
    onClose();
  };

  const handleSwitchPersona = (id: string) => {
    switchUser(id);
    onClose();
  };

  const handleSetCurrency = (cur: Currency) => {
    setCurrency(cur);
    onClose();
  };

  const ACTIONS = [
    {
      label: 'View £8,000 Grant Proposal & Unit Economics Deck',
      category: 'Investor Pitch',
      icon: <PieChart className="w-4 h-4 text-amber-500" />,
      action: () => {
        onClose();
        onOpenInvestorDeck();
      },
    },
    {
      label: 'Browse All Open Student Tasks',
      category: 'Marketplace',
      icon: <Briefcase className="w-4 h-4 text-blue-500" />,
      action: () => navigateTo('/jobs'),
    },
    {
      label: 'Explore Cross-Border Diaspora Concierge Tasks',
      category: 'Marketplace',
      icon: <Globe className="w-4 h-4 text-rose-500" />,
      action: () => navigateTo('/jobs?category=Family%20%26%20Elderly%20Care'),
    },
    {
      label: 'Post a New Task with Escrow Milestone',
      category: 'Client',
      icon: <PlusCircle className="w-4 h-4 text-emerald-500" />,
      action: () => navigateTo('/jobs/new'),
    },
    {
      label: 'My Account Dashboard & Wallet',
      category: 'Navigation',
      icon: <LayoutDashboard className="w-4 h-4 text-purple-500" />,
      action: () => navigateTo('/dashboard'),
    },
    {
      label: 'Admin Control Center & Disputes',
      category: 'System',
      icon: <Shield className="w-4 h-4 text-zinc-400" />,
      action: () => navigateTo('/admin'),
    },
    // Personas
    {
      label: 'Switch to Expat Raj (London Client)',
      category: '1-Click Persona',
      icon: <Users className="w-4 h-4 text-blue-400" />,
      action: () => handleSwitchPersona('user_client_raj'),
    },
    {
      label: 'Switch to Student Priya (Bangalore Premed, 20)',
      category: '1-Click Persona',
      icon: <Users className="w-4 h-4 text-emerald-400" />,
      action: () => handleSwitchPersona('user_student_priya'),
    },
    {
      label: 'Switch to Student Alex (CS Senior, 21)',
      category: '1-Click Persona',
      icon: <Users className="w-4 h-4 text-amber-400" />,
      action: () => handleSwitchPersona('user_student_alex'),
    },
    {
      label: 'Switch to Founder Sarah (Tech Client)',
      category: '1-Click Persona',
      icon: <Users className="w-4 h-4 text-indigo-400" />,
      action: () => handleSwitchPersona('user_client_sarah'),
    },
    // Currencies
    {
      label: 'Switch Currency to GBP (£ British Pound)',
      category: 'Currency',
      icon: <span className="font-mono font-bold text-amber-400 text-xs">£</span>,
      action: () => handleSetCurrency('GBP'),
    },
    {
      label: 'Switch Currency to INR (₹ Indian Rupee)',
      category: 'Currency',
      icon: <span className="font-mono font-bold text-emerald-400 text-xs">₹</span>,
      action: () => handleSetCurrency('INR'),
    },
    {
      label: 'Switch Currency to USD ($ US Dollar)',
      category: 'Currency',
      icon: <span className="font-mono font-bold text-blue-400 text-xs">$</span>,
      action: () => handleSetCurrency('USD'),
    },
    {
      label: 'Switch Currency to EUR (€ Euro)',
      category: 'Currency',
      icon: <span className="font-mono font-bold text-purple-400 text-xs">€</span>,
      action: () => handleSetCurrency('EUR'),
    },
  ];

  const filtered = ACTIONS.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/70 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4 animate-fade-in">
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl max-w-xl w-full text-zinc-100 overflow-hidden">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-zinc-800 bg-zinc-950/60">
          <Search className="w-4 h-4 text-zinc-400 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search (e.g. 'Raj', 'GBP', 'Escrow', 'Grant')..."
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-hidden"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              No commands or actions matching &quot;{query}&quot;
            </div>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={idx}
                onClick={item.action}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-800/80 transition text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-zinc-800 group-hover:bg-zinc-700 flex items-center justify-center shrink-0 transition">
                    {item.icon}
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-medium text-zinc-200 group-hover:text-white block">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {item.category}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition" />
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-zinc-950/80 border-t border-zinc-800 text-[11px] text-zinc-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px]">esc</kbd> close
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px]">↵</kbd> select
            </span>
          </div>
          <span className="text-zinc-400 font-mono">GSAP Command 2.0</span>
        </div>
      </div>
    </div>
  );
}
