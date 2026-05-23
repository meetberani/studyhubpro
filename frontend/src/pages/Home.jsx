import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Sparkles, Shield, Compass, BookMarked, Video, FileDown, Layers, ArrowRight } from 'lucide-react';

export default function Home() {
  const { isAuthenticated } = useAuth();

  const categories = [
    { name: 'SSC Prep', icon: BookMarked, color: 'from-blue-500 to-indigo-600', desc: 'CGL, CHSL, MTS study cards' },
    { name: 'UPSC IAS', icon: Compass, color: 'from-amber-500 to-orange-600', desc: 'Civil Services daily notes' },
    { name: 'Programming', icon: Layers, color: 'from-emerald-500 to-teal-600', desc: 'Web & App full frameworks' },
    { name: 'NEET / JEE', icon: Sparkles, color: 'from-purple-500 to-pink-600', desc: 'Physics, Chemistry, Maths manuals' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-darkbg-100 transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-premium-500/10 to-indigo-500/10 blur-3xl opacity-50 rounded-full" />
        
        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-premium-500/10 px-4 py-1.5 text-xs font-bold text-premium-600 dark:text-premium-300">
            <Sparkles className="h-4 w-4 text-premium-500 fill-premium-500" />
            Empower Your Learning Journey
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-800 dark:text-white font-sans">
            Premium Study Materials <br />
            <span className="bg-gradient-to-r from-premium-500 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
              Unlocked at ₹50 Only
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Gain immediate unlimited access to organized high-fidelity mock tests, PDFs, video tutorials, and ZIP files. Tailored specifically for SSC, UPSC, Programming, Government Jobs, Spoken English, and NEET/JEE.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 rounded-2xl bg-premium-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-premium-500/25 hover:bg-premium-600 hover:-translate-y-0.5 transition-all w-full sm:w-auto"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-premium-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-premium-500/25 hover:bg-premium-600 hover:-translate-y-0.5 transition-all w-full sm:w-auto"
                >
                  Start Learning Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/login"
                  className="flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 px-6 py-3.5 text-sm font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 hover:-translate-y-0.5 transition-all w-full sm:w-auto shadow-sm"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
            Targeted Syllabus Coverage
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500">
            Browse through curated materials prepared by platform subject experts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="glass premium-card rounded-3xl p-5 border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between h-48"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl text-white bg-gradient-to-tr shadow-md shadow-slate-900/5 dark:shadow-none">
                <div className={`flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-tr ${cat.color}`}>
                  <cat.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">{cat.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{cat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="border-t border-slate-200/50 dark:border-slate-800/50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-500">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">Premium Vault</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
              Unlock PDFs, code archives, ZIP templates, and detailed solution booklets instantly.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-400/10 border border-purple-400/20 text-purple-500">
              <Video className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">Video Tutorials</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
              Stream clear chapter videos directly inside your dashboard browser window.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 border border-emerald-400/20 text-emerald-500">
              <FileDown className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">Direct Downloads</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
              Download assets directly to your device. Full support for Android offline reading.
            </p>
          </div>
        </div>
      </section>

      {/* Premium Banner */}
      <section className="bg-gradient-to-tr from-premium-600 to-indigo-700 py-16 px-4 text-center text-white">
        <div className="max-w-2xl mx-auto space-y-6">
          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider">
            Limited Time Offer
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold">All-Access Premium Access PASS</h2>
          <p className="text-sm text-purple-100 max-w-lg mx-auto">
            Pay ₹50 only. No recurring subscriptions, no processing fees. Remove ads, enable all downloads, and view premium mock papers.
          </p>
          <div className="pt-2">
            <Link
              to={isAuthenticated ? '/payment' : '/register'}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-extrabold text-premium-600 shadow-xl shadow-slate-900/10 hover:bg-slate-50 hover:-translate-y-0.5 transition-all"
            >
              Get Premium Access Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
