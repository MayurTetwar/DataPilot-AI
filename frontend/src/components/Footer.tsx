import React from "react";
import type { PageType } from "../types";

interface FooterProps {
  setCurrentPage: (p: PageType) => void;
}

const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => (
  <footer className="relative mt-auto pt-16 pb-10">
    {/* Top border — emerald gradient */}
    <div
      className="w-full h-px mb-12"
      style={{ background: "linear-gradient(90deg, transparent, #10b981, transparent)" }}
    />

    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
        {/* Left — Brand */}
        <div>
          <p className="text-dp-text font-semibold text-base tracking-tight mb-2">DataPilot</p>
          <p className="text-dp-text-tertiary text-sm leading-relaxed max-w-[280px]">
            Autonomous data engineering agent. Upload a dataset, describe your goal, get results.
          </p>
        </div>

        {/* Center — Quick Links */}
        <div className="flex flex-col gap-2">
          <p className="text-dp-text-secondary text-xs font-medium tracking-wide mb-1">Navigation</p>
          <span
            className="text-dp-text-tertiary text-sm hover:text-white transition-colors duration-300 cursor-pointer"
            onClick={() => { setCurrentPage("landing"); window.scrollTo(0, 0); }}
          >
            Home
          </span>
          <span
            className="text-dp-text-tertiary text-sm hover:text-white transition-colors duration-300 cursor-pointer"
            onClick={() => { setCurrentPage("upload"); window.scrollTo(0, 0); }}
          >
            Upload
          </span>
          <span
            className="text-dp-text-tertiary text-sm hover:text-white transition-colors duration-300 cursor-pointer"
            onClick={() => window.open("https://github.com/MayurTetwar/DataPilot-AI", "_blank")}
          >
            GitHub
          </span>
        </div>

        {/* Right — Status */}
        <div className="flex flex-col gap-3">
          <p className="text-dp-text-secondary text-xs font-medium tracking-wide mb-1">Status</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-dp-green animate-pulse-dot" />
            <span className="text-dp-text-tertiary text-sm">All systems operational</span>
          </div>
          <p className="text-dp-text-tertiary text-xs leading-relaxed">
            Clean, preprocess, analyze, model
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-12 pt-6 border-t border-dp-border/30 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-dp-text-tertiary text-xs">
          &copy; DataPilot 2026
        </p>
        <div className="flex items-center gap-4">
          <span className="text-dp-text-tertiary text-xs hover:text-dp-text-secondary transition-colors duration-300 cursor-default">Privacy</span>
          <span className="text-dp-text-tertiary text-xs hover:text-dp-text-secondary transition-colors duration-300 cursor-default">Terms</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
