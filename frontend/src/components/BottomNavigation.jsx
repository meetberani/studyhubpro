import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, BookOpen, CreditCard, Shield, User } from 'lucide-react';

export default function BottomNavigation({ onOpenProfile }) {
  const { user, isPremium, isAdmin } = useAuth();

  if (!user) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-45 mx-auto max-w-md rounded-2xl border border-slate-200/50 bg-white/80 p-2 shadow-xl backdrop-blur-md dark:border-slate-800/50 dark:bg-darkbg-200/80 lg:hidden glass transition-all select-none">
      <nav className="flex items-center justify-around">
        {/* 1. Dashboard */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center rounded-xl p-2 text-[10px] font-bold transition-all ${
              isActive
                ? 'text-premium-500 scale-105'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-250'
            }`
          }
        >
          <LayoutDashboard className="h-5 w-5 mb-0.5" />
          Home
        </NavLink>

        {/* 2. Study Library */}
        <NavLink
          to="/materials"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center rounded-xl p-2 text-[10px] font-bold transition-all ${
              isActive
                ? 'text-premium-500 scale-105'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-250'
            }`
          }
        >
          <BookOpen className="h-5 w-5 mb-0.5" />
          Study
        </NavLink>

        {/* 3. Dynamic Center Button: Premium or Admin Panel */}
        {isAdmin ? (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center rounded-xl p-2 text-[10px] font-bold transition-all ${
                isActive
                  ? 'text-premium-500 scale-105'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-250'
              }`
            }
          >
            <Shield className="h-5 w-5 mb-0.5" />
            Admin
          </NavLink>
        ) : !isPremium ? (
          <NavLink
            to="/payment"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center rounded-xl p-2 text-[10px] font-bold transition-all ${
                isActive
                  ? 'text-amber-500 scale-105 premium-glow'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-250'
              }`
            }
          >
            <CreditCard className="h-5 w-5 mb-0.5 text-amber-500" />
            Premium
          </NavLink>
        ) : (
          <div className="flex flex-col items-center justify-center p-2 text-[10px] font-bold text-amber-500 shrink-0 select-none">
            <CreditCard className="h-5 w-5 mb-0.5 text-amber-500" />
            Unlocked
          </div>
        )}

        {/* 4. Profile Modal Trigger */}
        <button
          onClick={onOpenProfile}
          className="flex flex-col items-center justify-center rounded-xl p-2 text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-250 transition-all focus:outline-none"
        >
          <User className="h-5 w-5 mb-0.5" />
          Profile
        </button>
      </nav>
    </div>
  );
}
