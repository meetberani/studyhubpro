import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import AdBanner from '../components/AdBanner';
import { NoticeSkeleton, TableRowSkeleton } from '../components/SkeletonLoader';
import { ShieldCheck, User, Star, Megaphone, Clock, Sparkles, BookOpen, ChevronRight, AlertTriangle, XCircle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UserDashboard() {
  const { user, isPremium, refreshUser } = useAuth();
  const [notices, setNotices] = useState([]);
  const [recentMaterials, setRecentMaterials] = useState([]);
  const [stats, setStats] = useState({ totalMaterials: 0 });
  const [loadingNotices, setLoadingNotices] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);

  useEffect(() => {
    refreshUser(); // Keep active profile status synced on load
    
    const fetchDashboardData = async () => {
      // 1. Fetch notices
      try {
        const noticeRes = await axios.get(`${API_URL}/notices`);
        if (noticeRes.data && noticeRes.data.success) {
          setNotices(noticeRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load notices:', err.message);
      } finally {
        setLoadingNotices(false);
      }

      // 2. Fetch latest materials
      try {
        const materialRes = await axios.get(`${API_URL}/materials`);
        if (materialRes.data && materialRes.data.success) {
          setStats({ totalMaterials: materialRes.data.count });
          // Take the first 3 recent additions
          setRecentMaterials(materialRes.data.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load recent materials:', err.message);
      } finally {
        setLoadingRecent(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusBanner = () => {
    if (isPremium) {
      return (
        <div className="rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-600 p-6 text-white shadow-lg shadow-amber-500/15 border border-amber-400/20 premium-glow animate-scale-in">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="inline-block rounded-full bg-white/25 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-yellow-100">
                Lifetime Premium
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-sans">You have Full Vault Access</h2>
              <p className="text-xs text-amber-50 font-medium">
                Ad-free streaming, direct PDF downloads, and complete category coverage unlocked.
              </p>
            </div>
            <div className="h-16 w-16 shrink-0 flex items-center justify-center rounded-2xl bg-white/20 text-white animate-pulse">
              <Sparkles className="h-10 w-10 fill-white" />
            </div>
          </div>
        </div>
      );
    }

    if (user?.paymentStatus === 'pending') {
      return (
        <div className="rounded-3xl bg-gradient-to-tr from-amber-400/90 to-amber-500 p-6 text-white shadow-lg border border-amber-300/30 animate-scale-in">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white">
              <Clock className="h-6 w-6 animate-spin" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-extrabold">Payment Verification Pending</h2>
              <p className="text-xs text-amber-50 leading-relaxed">
                We have received your ₹50 transaction screenshot receipt. An administrator is currently validating your payment. Your premium membership will activate automatically once approved (typically within 1-2 hours).
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (user?.paymentStatus === 'rejected') {
      // Find the last payment rejection explanation if relevant or show default prompt
      return (
        <div className="rounded-3xl bg-gradient-to-tr from-rose-500 to-rose-600 p-6 text-white shadow-lg border border-rose-400/20 animate-scale-in">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white">
              <XCircle className="h-6 w-6" />
            </div>
            <div className="space-y-2 flex-1">
              <h2 className="text-base sm:text-lg font-extrabold">Payment Claim Rejected</h2>
              <p className="text-xs text-rose-50 leading-relaxed">
                Your previous payment upload request was rejected by an administrator. Please check that you uploaded the correct UPI transfer receipt showing the Transaction Reference ID (UTR).
              </p>
              <div className="mt-2 pt-2 border-t border-white/10">
                <Link
                  to="/payment"
                  className="inline-flex items-center gap-1 text-xs font-black underline hover:text-white"
                >
                  Upload New Receipt screenshot
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-3xl bg-gradient-to-tr from-premium-500 to-indigo-600 p-6 text-white shadow-lg border border-premium-400/20 animate-scale-in">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="inline-block rounded-full bg-white/25 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-purple-100">
              Basic Membership
            </span>
            <h2 className="text-xl sm:text-2xl font-black">Unlock All Syllabus Materials</h2>
            <p className="text-xs text-purple-50">
              Pay ₹50 once using UPI methods to download premium templates and disable advertisements.
            </p>
          </div>
          <Link
            to="/payment"
            className="flex items-center gap-1 rounded-2xl bg-white px-5 py-3 text-xs font-black text-premium-600 shadow-md hover:bg-slate-50 hover:-translate-y-0.5 transition-all w-full sm:w-auto justify-center shrink-0"
          >
            Unlock Now (₹50)
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 px-4 py-8 max-w-7xl mx-auto space-y-6">
      {/* Welcome Title */}
      <div className="border-b border-slate-100 dark:border-slate-800/60 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white font-sans tracking-tight">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-xs text-slate-400 mt-1 dark:text-slate-500">
          Monitor your premium state, check active alerts, or jump back into studying
        </p>
      </div>

      {/* Conditionally displays payment status banner */}
      {getStatusBanner()}

      {/* Analytics KPI metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Study Vault Count"
          value={stats.totalMaterials}
          icon={BookOpen}
          colorClass="bg-gradient-to-tr from-premium-500 to-indigo-600 shadow-premium-500/10"
        />
        <StatCard
          title="Account Membership Status"
          value={isPremium ? 'Premium (Active)' : user?.paymentStatus === 'pending' ? 'Pending Review' : 'Free Account'}
          icon={isPremium ? Sparkles : User}
          colorClass={isPremium ? 'bg-gradient-to-tr from-amber-500 to-orange-600 shadow-amber-500/10' : 'bg-gradient-to-tr from-slate-400 to-slate-500'}
        />
      </div>

      {/* Advertisements for free members */}
      <AdBanner position="top" />

      {/* Core double column details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Notices Bulletin */}
        <div className="glass rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50 lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-premium-100 dark:bg-premium-900/40 text-premium-600 dark:text-premium-300">
              <Megaphone className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">Active Announcements</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">Global alerts and targeted guides</p>
            </div>
          </div>

          <div className="space-y-4">
            {loadingNotices ? (
              <>
                <NoticeSkeleton />
                <NoticeSkeleton />
              </>
            ) : notices.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No active announcements for your subscription tier.
              </div>
            ) : (
              notices.map((n) => (
                <div
                  key={n._id}
                  className="rounded-2xl border border-slate-100 dark:border-slate-800/60 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-300">{n.title}</h4>
                    <span className="text-[10px] text-slate-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {n.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Profile details & Recent study files */}
        <div className="space-y-6">
          {/* User Profile details block */}
          <div className="glass rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300">
                <User className="h-4.5 w-4.5" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">Profile Details</h3>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-400 pl-1">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Account Name</p>
                <p className="font-bold text-slate-700 dark:text-slate-300 mt-0.5">{user?.name}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Email Address</p>
                <p className="font-bold text-slate-700 dark:text-slate-300 mt-0.5">{user?.email}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Mobile Number</p>
                <p className="font-bold text-slate-700 dark:text-slate-300 mt-0.5">{user?.mobile}</p>
              </div>
            </div>
          </div>

          {/* Quick Recent uploads section */}
          <div className="glass rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300">
                  <BookOpen className="h-4.5 w-4.5" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">Recent Additions</h3>
              </div>
              <Link
                to="/materials"
                className="text-[10px] font-bold text-premium-600 dark:text-premium-400 hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {loadingRecent ? (
                <>
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                </>
              ) : recentMaterials.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No recent uploads available.</p>
              ) : (
                recentMaterials.map((m) => (
                  <div
                    key={m._id}
                    className="flex items-center justify-between gap-3 text-xs py-2 border-b border-slate-100 dark:border-slate-800/40 last:border-0"
                  >
                    <div className="flex items-center gap-2.5 truncate w-2/3">
                      <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-xl bg-slate-50 dark:bg-darkbg-100 text-slate-500">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="truncate">
                        <h4 className="font-bold text-slate-700 dark:text-slate-300 truncate">{m.title}</h4>
                        <span className="text-[9px] text-slate-400 font-medium uppercase">{m.category}</span>
                      </div>
                    </div>
                    {m.accessType === 'premium' ? (
                      <span className="rounded-md bg-amber-400/10 dark:bg-amber-400/20 px-1.5 py-0.5 text-[9px] font-extrabold text-amber-500 uppercase">
                        Premium
                      </span>
                    ) : (
                      <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-extrabold text-emerald-500 uppercase">
                        Free
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
