import React, { useState } from "react";
import type { PageType } from "../types";
import logoImg from "../assets/logo.png";

interface HeaderProps {
  currentPage: PageType;
  setCurrentPage: (p: PageType) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
  const [showApiGuide, setShowApiGuide] = useState(false);

  return (
    <>
      {/* ── Floating Island Nav ── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
        <nav className="glass-strong rounded-full px-2 py-1.5 flex items-center gap-2 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
          {/* Logo */}
          <div
            className="flex items-center gap-2 pl-3 pr-4 cursor-pointer"
            onClick={() => setCurrentPage("landing")}
          >
            <img src={logoImg} alt="DataPilot.ai logo" className="h-7 w-auto" />
            <span className="text-dp-text font-semibold text-sm tracking-tight hidden sm:inline">
              DataPilot
            </span>
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-dp-border/60" />

          {/* Pill toggle */}
          <div className="relative flex bg-dp-bg/50 rounded-full p-1">
            {/* Sliding indicator */}
            <div
              className="absolute top-1 bottom-1 rounded-full bg-dp-accent/90 transition-all duration-500"
              style={{
                width: "calc(50% - 4px)",
                left: currentPage === "landing" ? "4px" : "calc(50%)",
                transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
              }}
            />
            <button
              onClick={() => setCurrentPage("landing")}
              className={`relative z-10 px-4 py-1.5 text-sm font-medium rounded-full cursor-pointer transition-colors duration-300 ${currentPage === "landing" ? "text-white" : "text-dp-text-secondary hover:text-dp-text"}`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentPage("upload")}
              className={`relative z-10 px-4 py-1.5 text-sm font-medium rounded-full cursor-pointer transition-colors duration-300 ${currentPage === "upload" ? "text-white" : "text-dp-text-secondary hover:text-dp-text"}`}
            >
              Upload
            </button>
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-dp-border/60" />

          {/* API Key Guide Button */}
          <button
            onClick={() => setShowApiGuide(true)}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-dp-border bg-dp-surface text-dp-text-secondary hover:text-dp-accent hover:border-dp-accent/40 btn-physics cursor-pointer mr-1"
            title="How to get your API Key"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </button>
        </nav>
      </header>

      {/* ── API Key Guide Modal ── */}
      {showApiGuide && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          onClick={() => setShowApiGuide(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal Card — Double-Bezel */}
          <div
            className="relative w-full max-w-lg animate-fadeInUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-shell">
              <div className="card-core overflow-hidden">
                {/* Header bar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-dp-border/40">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-dp-accent/10 border border-dp-accent/20 flex items-center justify-center">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                      </svg>
                    </div>
                    <h2 className="text-dp-text font-bold text-lg tracking-tight">How to get your API key</h2>
                  </div>

                  {/* Close button */}
                  <button
                    onClick={() => setShowApiGuide(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-dp-card-alt hover:bg-dp-red/15 text-dp-text-secondary hover:text-dp-red btn-physics cursor-pointer"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Steps */}
                <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
                  {/* Step 1 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-dp-accent/10 border border-dp-accent/30 flex items-center justify-center text-dp-accent font-bold text-sm">1</div>
                    <div>
                      <p className="text-dp-text font-semibold text-sm">Visit Google AI Studio</p>
                      <p className="text-dp-text-secondary text-sm mt-1">
                        Go to{" "}
                        <a
                          href="https://aistudio.google.com/apikey"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-dp-accent-light hover:text-dp-accent underline underline-offset-2 transition-colors"
                        >
                          aistudio.google.com/apikey
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-dp-accent/10 border border-dp-accent/30 flex items-center justify-center text-dp-accent font-bold text-sm">2</div>
                    <div>
                      <p className="text-dp-text font-semibold text-sm">Sign in with Google</p>
                      <p className="text-dp-text-secondary text-sm mt-1">
                        Use your Google account to sign in. The API is free to use with generous limits.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-dp-accent/10 border border-dp-accent/30 flex items-center justify-center text-dp-accent font-bold text-sm">3</div>
                    <div>
                      <p className="text-dp-text font-semibold text-sm">Create an API key</p>
                      <p className="text-dp-text-secondary text-sm mt-1">
                        Click the <strong className="text-dp-text">Create API Key</strong> button. Select an existing Google Cloud project or create a new one.
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-dp-accent/10 border border-dp-accent/30 flex items-center justify-center text-dp-accent font-bold text-sm">4</div>
                    <div>
                      <p className="text-dp-text font-semibold text-sm">Copy your key</p>
                      <p className="text-dp-text-secondary text-sm mt-1">
                        Your API key will be displayed. Click the copy icon to copy it to your clipboard.
                      </p>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-dp-green/15 border border-dp-green/30 flex items-center justify-center text-dp-green font-bold text-sm">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <div>
                      <p className="text-dp-text font-semibold text-sm">Paste it here</p>
                      <p className="text-dp-text-secondary text-sm mt-1">
                        Come back to DataPilot, paste the key in the <strong className="text-dp-text">Gemini API Key</strong> field on the Upload page, and start generating.
                      </p>
                    </div>
                  </div>

                  {/* Info box */}
                  <div className="mt-2 rounded-xl bg-dp-accent/5 border border-dp-accent/15 px-4 py-3">
                    <p className="text-dp-text-secondary text-xs leading-relaxed">
                      <span className="text-dp-accent font-semibold">Privacy:</span> Your API key is sent directly to Google's servers and is never stored by DataPilot. It is only used for the duration of your session.
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-dp-border/40 flex justify-end">
                  <button
                    onClick={() => setShowApiGuide(false)}
                    className="px-6 py-2 rounded-full bg-dp-accent text-white text-sm font-semibold btn-physics cursor-pointer"
                  >
                    Got it
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
