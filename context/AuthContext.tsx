'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole, Currency, Notification } from '@/types';
import {
  getCurrentSessionUserId,
  setCurrentSessionUserId,
  clearCurrentSession,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  getUsers,
  getNotificationsByUserId,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  initStorage,
} from '@/lib/storage';

export const CURRENCY_RATES: Record<Currency, { rate: number; symbol: string; label: string }> = {
  USD: { rate: 1.0, symbol: '$', label: 'USD ($)' },
  GBP: { rate: 0.79, symbol: '£', label: 'GBP (£)' },
  EUR: { rate: 0.92, symbol: '€', label: 'EUR (€)' },
  INR: { rate: 86.5, symbol: '₹', label: 'INR (₹)' },
};

export function formatCurrencyAmount(usdAmount: number, currency: Currency = 'USD'): string {
  const conf = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
  const converted = usdAmount * conf.rate;
  if (currency === 'INR') {
    return `${conf.symbol}${Math.round(converted).toLocaleString('en-IN')}`;
  }
  return `${conf.symbol}${converted.toFixed(2)}`;
}

export function calculateAge(dobString: string): number {
  if (!dobString) return 0;
  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) return 0;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  role: 'client' | 'student';
  dateOfBirth: string;
  bio?: string;
  location?: string;
  skills?: string[];
  hourlyRate?: number;
  university?: string;
  degree?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (data: SignupData) => Promise<User>;
  logout: () => void;
  switchUser: (userId: string) => void;
  refreshUser: () => void;
  updateCurrentUserProfile: (partial: Partial<User>) => User;
  allDemoUsers: User[];
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatCurrency: (usdAmount: number, targetCurrency?: Currency) => string;
  convertFromUSD: (usdAmount: number, targetCurrency?: Currency) => number;
  notifications: Notification[];
  unreadNotificationsCount: number;
  refreshNotifications: () => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [demoUsers, setDemoUsers] = useState<User[]>([]);
  const [currency, setCurrencyState] = useState<Currency>('USD');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const refreshNotifications = useCallback(() => {
    if (user) {
      const list = getNotificationsByUserId(user.id);
      setNotifications(list);
    } else {
      setNotifications([]);
    }
  }, [user]);

  const loadSession = useCallback(() => {
    initStorage();
    const sessionUserId = getCurrentSessionUserId();
    if (sessionUserId) {
      const found = getUserById(sessionUserId);
      if (found) {
        setUser(found);
        setNotifications(getNotificationsByUserId(found.id));
      } else {
        clearCurrentSession();
        setUser(null);
        setNotifications([]);
      }
    } else {
      setUser(null);
      setNotifications([]);
    }
    setDemoUsers(getUsers());

    // Load saved currency preference if any
    if (typeof window !== 'undefined') {
      const savedCurr = localStorage.getItem('gsap_currency') as Currency;
      if (savedCurr && CURRENCY_RATES[savedCurr]) {
        setCurrencyState(savedCurr);
      }
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  useEffect(() => {
    refreshNotifications();
  }, [user, refreshNotifications]);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gsap_currency', c);
    }
  };

  const formatCurrency = (usdAmount: number, targetCurrency?: Currency): string => {
    return formatCurrencyAmount(usdAmount, targetCurrency || currency);
  };

  const convertFromUSD = (usdAmount: number, targetCurrency?: Currency): number => {
    const c = targetCurrency || currency;
    const rate = CURRENCY_RATES[c]?.rate || 1.0;
    return Math.round(usdAmount * rate * 100) / 100;
  };

  const markNotificationRead = (id: string) => {
    markNotificationAsRead(id);
    refreshNotifications();
  };

  const markAllNotificationsRead = () => {
    if (user) {
      markAllNotificationsAsRead(user.id);
      refreshNotifications();
    }
  };

  const login = async (email: string, password: string): Promise<User> => {
    const trimmedEmail = email.trim();
    const foundUser = getUserByEmail(trimmedEmail);

    if (!foundUser) {
      throw new Error('No account found with this email address.');
    }

    if (foundUser.password !== password) {
      throw new Error('Incorrect password. Please verify and try again.');
    }

    // Double check 18+ requirement
    if (foundUser.age < 18) {
      throw new Error('Access denied: All accounts must meet the 18+ eligibility requirement.');
    }

    setCurrentSessionUserId(foundUser.id);
    setUser(foundUser);
    setNotifications(getNotificationsByUserId(foundUser.id));
    return foundUser;
  };

  const signup = async (data: SignupData): Promise<User> => {
    const age = calculateAge(data.dateOfBirth);

    // Hard-enforce 18+ platform policy
    if (age < 18) {
      throw new Error(
        `Registration Rejected: You must be at least 18 years old to use Global Student Assistance Platform (Your calculated age is ${age}). Under-18 accounts are strictly prohibited.`
      );
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim(),
      password: data.password,
      role: data.role,
      dateOfBirth: data.dateOfBirth,
      age: age,
      avatar:
        data.role === 'student'
          ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      bio: data.bio || (data.role === 'student' ? 'Motivated student ready to help.' : 'Looking for talented students.'),
      location: data.location || 'Remote',
      skills: data.skills || (data.role === 'student' ? ['General Assistance'] : []),
      hourlyRate: data.hourlyRate || (data.role === 'student' ? 25 : undefined),
      university: data.university,
      degree: data.degree,
      verificationStatus: data.role === 'student' ? 'pending' : undefined,
      walletBalance: data.role === 'student' ? 0 : undefined,
      createdAt: new Date().toISOString(),
    };

    const created = createUser(newUser);
    setCurrentSessionUserId(created.id);
    setUser(created);
    setDemoUsers(getUsers());
    setNotifications(getNotificationsByUserId(created.id));
    return created;
  };

  const logout = () => {
    clearCurrentSession();
    setUser(null);
    setNotifications([]);
  };

  const switchUser = (userId: string) => {
    const target = getUserById(userId);
    if (target) {
      setCurrentSessionUserId(target.id);
      setUser(target);
      setNotifications(getNotificationsByUserId(target.id));
    }
  };

  const refreshUser = () => {
    if (user) {
      const refreshed = getUserById(user.id);
      if (refreshed) {
        setUser(refreshed);
        setNotifications(getNotificationsByUserId(refreshed.id));
      }
    }
    setDemoUsers(getUsers());
  };

  const updateCurrentUserProfile = (partial: Partial<User>): User => {
    if (!user) throw new Error('Not authenticated');
    const updated = updateUser(user.id, partial);
    setUser(updated);
    refreshUser();
    return updated;
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        switchUser,
        refreshUser,
        updateCurrentUserProfile,
        allDemoUsers: demoUsers,
        currency,
        setCurrency,
        formatCurrency,
        convertFromUSD,
        notifications,
        unreadNotificationsCount,
        refreshNotifications,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
