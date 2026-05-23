import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut, Bell, User, Star, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';

export default function Navbar({ onToggleSidebar }) {
  const { user, logout, isPremium, token } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [notices, setNotices] = useState([]);
  const [showBellDropdown, setShowBellDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActiveNotices = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${API_URL}/notices`);
        if (res.data && res.data.success) {
          setNotices(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load notices for navbar:', err.message);
      }
    };
    fetchActiveNotices();
  }, [token, user?.premium]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-md dark:border-slate-800/50 dark:bg-darkbg-100/80 transition-colors">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left Section: Branding & Mobile Sidebar Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 focus:outline-none dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Toggle Sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-premium-500 to-indigo-600 shadow-md text-white font-bold text-xl">
              A
            </div>
            <span className="hidden font-sans font-bold text-lg sm:block bg-gradient-to-r from-premium-600 to-indigo-600 dark:from-premium-400 dark:to-indigo-400 bg-clip-text text-transparent">
              StudyPro
            </span>
          </Link>
        </div>

        {/* Right Section: Interactions & Authenticated user indicators */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Light/Dark Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            title="Toggle light/dark mode"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
          </button>

          {user && (
            <>
              {/* Notification / Notices Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowBellDropdown(!showBellDropdown)}
                  className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors relative"
                  title="Announcements"
                >
                  <Bell className="h-5 w-5" />
                  {notices.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-rose-500" />
                  )}
                </button>

                {/* Notices Dropdown */}
                {showBellDropdown && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200/60 bg-white p-4 shadow-xl dark:border-slate-800/60 dark:bg-darkbg-200 glass transition-all duration-300 animate-scale-in">
                    <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-200">Announcements</span>
                      <span className="rounded-full bg-premium-100 dark:bg-premium-900/40 px-2 py-0.5 text-xs text-premium-600 dark:text-premium-300">
                        {notices.length} Active
                      </span>
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-3">
                      {notices.length === 0 ? (
                        <p className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">
                          No recent announcements.
                        </p>
                      ) : (
                        notices.map((notice) => (
                          <div
                            key={notice._id}
                            className="rounded-xl border border-slate-100 dark:border-slate-800 p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                          >
                            <h4 className="font-semibold text-xs text-slate-700 dark:text-slate-300">
                              {notice.title}
                            </h4>
                            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                              {notice.content}
                            </p>
                            <span className="mt-2 block text-[9px] text-slate-400">
                              {new Date(notice.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Premium Status Badge */}
              {isPremium ? (
                <div className="hidden sm:flex items-center gap-1 rounded-full bg-amber-400/10 dark:bg-amber-400/20 border border-amber-400/30 px-3 py-1 text-xs font-bold text-amber-500 premium-glow">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  Premium
                </div>
              ) : (
                <Link
                  to="/payment"
                  className="hidden sm:flex items-center gap-1 rounded-full bg-premium-500 px-3 py-1 text-xs font-bold text-white hover:bg-premium-600 transition-all shadow-md shadow-premium-500/20"
                >
                  Go Premium
                </Link>
              )}

              {/* User Avatar Summary & Logout */}
              <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-3">
                <div className="hidden md:block text-right">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{user.name}</p>
                  <p className="text-[10px] text-slate-400">{user.email}</p>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="rounded-xl p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
