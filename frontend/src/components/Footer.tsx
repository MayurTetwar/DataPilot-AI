import React from "react";

const Footer: React.FC = () => (
  <footer className="relative mt-auto pt-12 pb-8">
    {/* Purple glow line */}
    <div className="w-full h-px mb-8" style={{ background: "linear-gradient(90deg, transparent, #7c3aed, transparent)" }} />
    <div className="text-center">
      <p className="text-dp-text-secondary text-sm">© DataPilot.ai 2026 — Autonomous Data Engineering Agent</p>
      <p className="text-dp-purple text-xs mt-1.5 tracking-wide">Clean · Preprocess · Analyze · Model</p>
    </div>
  </footer>
);

export default Footer;
