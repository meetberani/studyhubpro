import React, { useState, useEffect, useCallback } from 'react';
import { ExternalLink, Download, X, FileText, RefreshCw, Maximize2, Minimize2, AlertTriangle } from 'lucide-react';

/**
 * PdfViewer — Robust multi-strategy PDF viewer component
 *
 * Strategy order:
 *   1. Google Docs Viewer (gview) — works for all public HTTPS URLs
 *   2. On error → show clear fallback UI with "Open in Browser" button
 *
 * For Cloudinary: URLs are always public HTTPS → gview works perfectly.
 * For local dev uploads: shows open-in-browser since gview can't reach localhost.
 */

// Fix Cloudinary raw URLs to be directly usable (ensure https)
const normalizeUrl = (fileUrl, serverUrl) => {
  if (!fileUrl || fileUrl === '#locked') return null;
  if (fileUrl.startsWith('http')) return fileUrl;
  if (fileUrl.startsWith('/uploads')) return `${serverUrl}${fileUrl}`;
  return fileUrl;
};

// Build the best viewer URL for the PDF
const buildViewerUrl = (pdfUrl, retryCount) => {
  const isLocal = pdfUrl.includes('localhost') || pdfUrl.startsWith('/uploads');
  if (isLocal) return pdfUrl; // Can't use gview for localhost

  // Add a cache-bust only on retries so gview re-fetches
  const cacheBust = retryCount > 0 ? `&_cb=${Date.now()}` : '';
  return `https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true${cacheBust}`;
};

export default function PdfViewer({
  activePdf,
  isPdfFullScreen,
  isPremium,
  isAdmin,
  onClose,
  onFullScreenToggle,
  onDownload,
  serverUrl,
}) {
  const [loadState, setLoadState] = useState('loading'); // 'loading' | 'loaded' | 'error'
  const [retryCount, setRetryCount] = useState(0);
  const [iframeSrc, setIframeSrc] = useState('');

  const pdfUrl = normalizeUrl(activePdf?.fileUrl, serverUrl);
  const isLocal = pdfUrl && (pdfUrl.includes('localhost') || pdfUrl.startsWith('/uploads'));

  // Rebuild iframe src whenever PDF changes or user retries
  useEffect(() => {
    if (!pdfUrl) return;
    setLoadState('loading');
    const src = buildViewerUrl(pdfUrl, retryCount);
    setIframeSrc(src);
  }, [pdfUrl, retryCount]);

  // Auto-timeout: if gview takes too long, switch to error state with fallback
  useEffect(() => {
    if (loadState !== 'loading') return;
    const timer = setTimeout(() => {
      // Only auto-error on first load; on retries keep waiting
      if (retryCount === 0) setLoadState('error');
    }, 12000); // 12 seconds timeout
    return () => clearTimeout(timer);
  }, [iframeSrc, loadState, retryCount]);

  const handleRetry = useCallback(() => {
    setRetryCount((c) => c + 1);
  }, []);

  const handleIframeLoad = useCallback(() => {
    setLoadState('loaded');
  }, []);

  const handleIframeError = useCallback(() => {
    setLoadState('error');
  }, []);

  // Locked content guard
  if (!activePdf?.fileUrl || activePdf.fileUrl === '#locked') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-slate-200 dark:border-slate-700">
          <div className="w-16 h-16 rounded-2xl bg-premium-100 dark:bg-premium-900/30 flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-premium-500" />
          </div>
          <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">Premium Content</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            This document requires a premium subscription.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              Close
            </button>
            <a
              href="/payment"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-premium-500 to-indigo-600 text-white text-sm font-bold shadow-md shadow-premium-500/30 hover:opacity-90 transition-opacity"
            >
              Upgrade Now
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        isPdfFullScreen
          ? 'fixed inset-0 z-50 bg-white dark:bg-slate-950 flex flex-col'
          : 'fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-2 sm:p-4'
      }
    >
      <div
        className={
          isPdfFullScreen
            ? 'w-full h-full flex flex-col bg-white dark:bg-slate-950'
            : 'relative w-full h-[90vh] max-w-5xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col'
        }
      >
        {/* ── Header ── */}
        <div className="flex-shrink-0 flex items-center justify-between px-3 sm:px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-10 gap-2">
          {/* Left: back + title */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={onClose}
              className="flex-shrink-0 flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-2 text-xs font-black text-slate-700 dark:text-slate-200 transition-all border border-slate-200 dark:border-slate-700 focus:outline-none active:scale-95 cursor-pointer"
            >
              <span className="text-sm leading-none">←</span>
              <span className="hidden xs:inline">Exit</span>
            </button>
            <div className="min-w-0 hidden sm:block">
              <p className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-white truncate max-w-xs md:max-w-md">
                {activePdf.title}
              </p>
              <span className="inline-block mt-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/40 px-1.5 py-0.5 text-[9px] font-bold text-indigo-600 dark:text-indigo-300">
                PDF Reader
              </span>
            </div>
          </div>

          {/* Right: action buttons */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Retry button — show when error or loading */}
            {(loadState === 'error' || loadState === 'loading') && !isLocal && (
              <button
                onClick={handleRetry}
                title="Retry loading PDF"
                className="flex items-center gap-1 rounded-xl bg-amber-500 hover:bg-amber-600 px-2.5 py-2 text-[10px] sm:text-xs font-bold text-white transition-all focus:outline-none"
              >
                <RefreshCw className="h-3 w-3" />
                <span className="hidden xs:inline">Retry</span>
              </button>
            )}

            {/* Open in new tab */}
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-2.5 py-2 text-[10px] sm:text-xs font-bold text-white transition-all focus:outline-none"
            >
              <ExternalLink className="h-3 w-3" />
              <span>Open</span>
            </a>

            {/* Fullscreen toggle */}
            <button
              onClick={onFullScreenToggle}
              className="flex items-center gap-1 rounded-xl bg-indigo-500 hover:bg-indigo-600 px-2.5 py-2 text-[10px] sm:text-xs font-bold text-white transition-all focus:outline-none"
            >
              {isPdfFullScreen ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
              <span className="hidden sm:inline">{isPdfFullScreen ? 'Exit Full' : 'Full Screen'}</span>
            </button>

            {/* Download — premium only */}
            {(isPremium || isAdmin) && (
              <button
                onClick={() => onDownload(activePdf)}
                className="flex items-center gap-1 rounded-xl bg-violet-500 hover:bg-violet-600 px-2.5 py-2 text-[10px] sm:text-xs font-bold text-white transition-all focus:outline-none"
              >
                <Download className="h-3 w-3" />
                <span className="hidden sm:inline">Download</span>
              </button>
            )}

            {/* Close X */}
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 transition-colors focus:outline-none cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── Viewer Body ── */}
        <div
          className="flex-1 relative bg-slate-100 dark:bg-slate-950 overflow-hidden"
          onContextMenu={(e) => e.preventDefault()}
        >
          {/* Loading Spinner */}
          {loadState === 'loading' && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-950 pointer-events-none">
              <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center mb-4 animate-pulse">
                <FileText className="h-7 w-7 text-indigo-500" />
              </div>
              <div className="flex gap-1.5 mb-3">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300">PDF લોડ થઈ રહ્યું છે...</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Loading document, please wait</p>
            </div>
          )}

          {/* Error / Fallback UI */}
          {loadState === 'error' && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-xl border border-slate-200 dark:border-slate-700">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-amber-500" />
                </div>
                <h3 className="text-base font-black text-slate-800 dark:text-white mb-2">
                  PDF Viewer Blocked
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
                  The in-app viewer could not load this PDF. This can happen due to browser security policies.
                  Please open it directly in your browser.
                </p>
                <div className="flex flex-col gap-2.5">
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-black shadow-md shadow-emerald-500/30 hover:opacity-90 transition-opacity"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Browser માં ખોલો (Open in Browser)
                  </a>
                  {!isLocal && (
                    <button
                      onClick={handleRetry}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-indigo-500 text-white text-sm font-bold hover:bg-indigo-600 transition-colors"
                    >
                      <RefreshCw className="h-4 w-4" />
                      ફરી પ્રયાસ (Retry)
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* The actual iframe — always rendered so load/error events fire */}
          {iframeSrc && (
            <iframe
              key={`pdf-${activePdf._id}-retry-${retryCount}`}
              src={iframeSrc}
              className={`w-full h-full border-none ${loadState === 'error' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              title={activePdf.title}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              style={{ transition: 'opacity 0.3s ease' }}
            />
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex-shrink-0 px-4 py-3 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs sm:max-w-xl">
            {activePdf.description || 'No description available.'}
          </p>
          <div className="flex items-center gap-2 flex-shrink-0">
            {loadState === 'loaded' && (
              <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Loaded
              </span>
            )}
            {loadState === 'loading' && (
              <span className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                Loading...
              </span>
            )}
            {loadState === 'error' && (
              <span className="flex items-center gap-1 text-[10px] text-red-500 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                Viewer Error
              </span>
            )}
            <span className="text-[10px] text-slate-300 dark:text-slate-600 font-mono hidden sm:inline">
              {isLocal ? 'LOCAL' : 'GVIEW'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
