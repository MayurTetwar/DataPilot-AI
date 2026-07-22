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
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-dp-border/60" style={{ borderBottomColor: "rgba(124,58,237,0.25)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentPage("landing")}>
            <img src={logoImg} alt="DataPilot.ai logo" className="h-8 w-auto" />
            <span className="text-white font-bold text-lg tracking-tight">DataPilot.ai</span>
          </div>

          {/* Right: Nav + API Key Button */}
          <div className="flex items-center gap-3">
            {/* Pill toggle */}
            <div className="relative flex bg-dp-card rounded-full p-1 border border-dp-border/60">
              {/* Sliding bg */}
              <div
                className="absolute top-1 bottom-1 rounded-full bg-dp-purple transition-all duration-300 ease-out"
                style={{
                  width: "calc(50% - 4px)",
                  left: currentPage === "landing" ? "4px" : "calc(50%)",
                }}
              />
              <button
                onClick={() => setCurrentPage("landing")}
                className={`relative z-10 px-4 py-1 text-sm font-medium rounded-full transition-colors duration-200 cursor-pointer ${currentPage === "landing" ? "text-white" : "text-dp-text-secondary hover:text-white"}`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentPage("upload")}
                className={`relative z-10 px-4 py-1 text-sm font-medium rounded-full transition-colors duration-200 cursor-pointer ${currentPage === "upload" ? "text-white" : "text-dp-text-secondary hover:text-white"}`}
              >
                Upload
              </button>
            </div>

            {/* API Key Guide Button */}
            <button
              onClick={() => setShowApiGuide(true)}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-dp-purple/50 bg-dp-card text-dp-purple hover:bg-dp-purple/20 hover:text-white transition-all duration-200 cursor-pointer"
              title="How to get your API Key"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ── API Key Guide Modal ── */}
      {showApiGuide && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          onClick={() => setShowApiGuide(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal Card */}
          <div
            className="relative w-full max-w-lg rounded-2xl border border-dp-purple/30 bg-dp-card shadow-[0_0_60px_rgba(124,58,237,0.15)] animate-fadeInUp overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-dp-border/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-dp-purple/20 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                  </svg>
                </div>
                <h2 className="text-white font-bold text-lg">How to Get Your API Key</h2>
              </div>

              {/* Close button */}
              <button
                onClick={() => setShowApiGuide(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-dp-card-alt hover:bg-dp-red/20 text-dp-text-secondary hover:text-dp-red transition-all duration-200 cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Steps */}
            <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-dp-purple/20 border border-dp-purple/40 flex items-center justify-center text-dp-purple font-bold text-sm">1</div>
                <div>
                  <p className="text-white font-semibold text-sm">Visit Google AI Studio</p>
                  <p className="text-dp-text-secondary text-sm mt-1">
                    Go to{" "}
                    <a
                      href="https://aistudio.google.com/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-dp-purple-light hover:text-dp-purple underline underline-offset-2 transition-colors"
                    >
                      aistudio.google.com/apikey
                    </a>
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-dp-purple/20 border border-dp-purple/40 flex items-center justify-center text-dp-purple font-bold text-sm">2</div>
                <div>
                  <p className="text-white font-semibold text-sm">Sign in with Google</p>
                  <p className="text-dp-text-secondary text-sm mt-1">
                    Use your Google account to sign in. The API is free to use with generous limits.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-dp-purple/20 border border-dp-purple/40 flex items-center justify-center text-dp-purple font-bold text-sm">3</div>
                <div>
                  <p className="text-white font-semibold text-sm">Create an API Key</p>
                  <p className="text-dp-text-secondary text-sm mt-1">
                    Click the <strong className="text-white">"Create API Key"</strong> button. Select an existing Google Cloud project or create a new one.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-dp-purple/20 border border-dp-purple/40 flex items-center justify-center text-dp-purple font-bold text-sm">4</div>
                <div>
                  <p className="text-white font-semibold text-sm">Copy Your Key</p>
                  <p className="text-dp-text-secondary text-sm mt-1">
                    Your API key will be displayed. Click the copy icon to copy it to your clipboard.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-dp-green/20 border border-dp-green/40 flex items-center justify-center text-dp-green font-bold text-sm">✓</div>
                <div>
                  <p className="text-white font-semibold text-sm">Paste It Here</p>
                  <p className="text-dp-text-secondary text-sm mt-1">
                    Come back to DataPilot.ai, paste the key in the <strong className="text-white">"Gemini API Key"</strong> field on the Upload page, and start generating!
                  </p>
                </div>
              </div>

              {/* Info box */}
              <div className="mt-2 rounded-xl bg-dp-purple/5 border border-dp-purple/20 px-4 py-3">
                <p className="text-dp-text-secondary text-xs leading-relaxed">
                  <span className="text-dp-purple-light font-semibold">🔒 Privacy Note:</span> Your API key is sent directly to Google's servers and is never stored by DataPilot.ai. It is only used for the duration of your session.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-dp-border/60 flex justify-end">
              <button
                onClick={() => setShowApiGuide(false)}
                className="px-5 py-2 rounded-full bg-dp-purple text-white text-sm font-semibold hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all duration-200 cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
