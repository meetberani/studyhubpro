import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, X, Megaphone, BookOpen, GraduationCap, Trophy, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

// Premium-grade curated educational native advertisements
const NATIVE_SPONSORS = [
  {
    id: 'tat_tet_exam',
    badge: 'TAT / TET 2026 Special',
    title: 'TAT & TET પરીક્ષામાં મેળવો 90+ સ્કોર!',
    description: 'નિષ્ણાત શિક્ષકો દ્વારા તૈયાર કરેલ ટેસ્ટ સિરીઝ, ઓનલાઇન મોક ટેસ્ટ અને લાઈવ ડેઈલી પ્રેક્ટિસ ક્લાસ શરૂ.',
    cta: 'તૈયારી શરૂ કરો',
    link: '/dashboard',
    icon: GraduationCap,
    gradient: 'from-purple-500/10 via-indigo-500/5 to-pink-500/10',
    border: 'border-purple-200 dark:border-purple-900/30',
    badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
  },
  {
    id: 'class3_recruitment',
    badge: 'Class-3 GPSC Target',
    title: 'GPSC & વર્ગ-૩ પરીક્ષાની સંપૂર્ણ તૈયારી',
    description: 'નવી ભરતી માટેના લેટેસ્ટ મોડેલ પેપર્સ, કરંટ અફેર્સની પીડીએફ અને જનરલ નોલેજ પ્રશ્નોતરી એક જ જગ્યાએ.',
    cta: 'મોક ટેસ્ટ આપો',
    link: '/dashboard',
    icon: Trophy,
    gradient: 'from-amber-500/10 via-orange-500/5 to-yellow-500/10',
    border: 'border-amber-200 dark:border-amber-900/30',
    badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
  },
  {
    id: 'english_mastery',
    badge: 'English Grammar Pro',
    title: 'તમામ સ્પર્ધાત્મક પરીક્ષાઓ માટે અંગ્રેજી ગ્રામર',
    description: 'ટોપ રૂલ્સ, કાળ (Tenses) ચાર્ટ્સ અને વોકેબ્યુલરી શીટ્સ મેળવો. પરીક્ષામાં ૧૦૦% પરિણામ મેળવો.',
    cta: 'અત્યારે ડાઉનલોડ કરો',
    link: '/dashboard',
    icon: BookOpen,
    gradient: 'from-emerald-500/10 via-teal-500/5 to-cyan-500/10',
    border: 'border-emerald-200 dark:border-emerald-900/30',
    badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
  }
];

export default function AdBanner({ position = 'top' }) {
  const { isPremium, isAdmin } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [activeSponsor, setActiveSponsor] = useState(() => {
    const randomIndex = Math.floor(Math.random() * NATIVE_SPONSORS.length);
    return NATIVE_SPONSORS[randomIndex];
  });

  // Pick a random sponsor advertisement on load (resilient fallback)
  useEffect(() => {
    if (!activeSponsor) {
      const randomIndex = Math.floor(Math.random() * NATIVE_SPONSORS.length);
      setActiveSponsor(NATIVE_SPONSORS[randomIndex]);
    }

    // Optional: Start.io Dynamic Tag binding hook
    // When deploying on native Android wrapper, if Start.io JS SDK is integrated:
    if (window.startio && typeof window.startio.loadAd === 'function') {
      window.startio.loadAd({
        appId: '204789628',
        placement: position === 'sidebar' ? 'sidebar_banner' : 'top_banner',
        onAdLoaded: () => console.log('[Start.io] Ad loaded successfully.'),
        onAdFailed: (err) => console.warn('[Start.io] Ad load failed:', err)
      });
    }
  }, [position]);

  // Premium users and administrators do NOT see advertisements
  if (isPremium || isAdmin || dismissed || !activeSponsor) {
    return null;
  }

  const IconComponent = activeSponsor.icon;

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden border ${activeSponsor.border} bg-gradient-to-r ${activeSponsor.gradient} p-4 sm:p-5 shadow-sm transition-all hover:shadow-md duration-300 ${
        position === 'sidebar' ? 'my-4' : 'my-6'
      }`}
    >
      {/* Start.io SDK native ad injection target — must NOT be hidden */}
      <div id={`startio-ad-${position}`} data-app-id="204789628" style={{ display: 'none', width: '100%', minHeight: '50px' }}></div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Ad Left Section: Content */}
        <div className="flex items-start gap-3.5 w-full md:w-auto">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
            <IconComponent className="h-5.5 w-5.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className={`inline-block rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${activeSponsor.badgeColor}`}>
                {activeSponsor.badge}
              </span>
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                Sponsored Ad
              </span>
            </div>
            <h4 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-slate-200 mt-1.5 leading-snug">
              {activeSponsor.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {activeSponsor.description}
            </p>
          </div>
        </div>

        {/* Ad Right Section: Call to Actions */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end shrink-0 border-t border-slate-100 dark:border-slate-800/60 pt-3 md:pt-0 md:border-t-0">
          <Link
            to="/payment"
            className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Sparkles className="h-3.5 w-3.5 fill-white" />
            જાહેરાત બંધ કરો (₹99 Only)
          </Link>

          <button
            onClick={() => setDismissed(true)}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 transition-colors focus:outline-none"
            title="Dismiss sponsored ad"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
