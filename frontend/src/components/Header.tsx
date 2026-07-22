import React from "react";
import type { PageType } from "../types";

/* ── SVG data icon ── */
const DataIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="2" y="4" width="10" height="10" rx="2" fill="#7c3aed" opacity="0.9" />
    <rect x="16" y="4" width="10" height="10" rx="2" fill="#a855f7" opacity="0.6" />
    <rect x="2" y="18" width="10" height="6" rx="2" fill="#a855f7" opacity="0.6" />
    <rect x="16" y="18" width="10" height="6" rx="2" fill="#7c3aed" opacity="0.9" />
  </svg>
);

interface HeaderProps {
  currentPage: PageType;
  setCurrentPage: (p: PageType) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => (
  <header className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-dp-border/60" style={{ borderBottomColor: "rgba(124,58,237,0.25)" }}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      {/* Left: Logo */}
      <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentPage("landing")}>
        <DataIcon />
        <span className="text-white font-bold text-lg tracking-tight">DataPilot.ai</span>
      </div>

      {/* Right: Nav */}
      <div className="flex items-center gap-4">
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
      </div>
    </div>
  </header>
);

export default Header;
