import React from "react";
import type { PageType } from "../types";
import Agent1 from "../assets/Agent1.png";
import Agent2 from "../assets/Agent2.png";

/* ── Divider ── */
const Divider = () => (
  <div className="my-16 sm:my-20 h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #7c3aed44, transparent)" }} />
);

/* ── Pillar Card ── */
const PillarCard: React.FC<{
  num: string;
  emoji: string;
  title: string;
  desc: string;
  color: string;
  borderColor: string;
  delay: string;
}> = ({ num, emoji, title, desc, color, borderColor, delay }) => (
  <div
    className={`glass rounded-2xl p-6 text-left transition-all duration-300 hover:border-dp-purple/60 group animate-fadeInUp`}
    style={{ animationDelay: delay, borderColor }}
  >
    <div className="flex items-center gap-3 mb-3">
      <span className="text-xs font-bold px-2 py-0.5 rounded-md" style={{ background: color + "22", color }}>{num}</span>
      <span className="text-2xl">{emoji}</span>
    </div>
    <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
    <p className="text-dp-text-secondary text-sm leading-relaxed">{desc}</p>
  </div>
);

/* ── Step Card ── */
const StepCard: React.FC<{ icon: string; color: string; title: string; desc: string; delay: string }> = ({ icon, color, title, desc, delay }) => (
  <div className="flex-1 text-center animate-fadeInUp" style={{ animationDelay: delay }}>
    <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl" style={{ background: color + "18", border: `1px solid ${color}44` }}>
      {icon}
    </div>
    <h3 className="text-white font-semibold mb-2">{title}</h3>
    <p className="text-dp-text-secondary text-sm leading-relaxed">{desc}</p>
  </div>
);

/* ── Feature Card ── */
const FeatureCard: React.FC<{ emoji: string; title: string; desc: string; delay: string }> = ({ emoji, title, desc, delay }) => (
  <div className="glass rounded-2xl p-6 text-left transition-all duration-300 hover:border-dp-purple/50 animate-fadeInUp" style={{ animationDelay: delay }}>
    <span className="text-2xl mb-3 block">{emoji}</span>
    <h3 className="text-white font-semibold mb-2">{title}</h3>
    <p className="text-dp-text-secondary text-sm leading-relaxed">{desc}</p>
  </div>
);

/* ═══════════════════════════════════════ */
/*  LANDING PAGE                          */
/* ═══════════════════════════════════════ */
interface LandingPageProps {
  setCurrentPage: (p: PageType) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ setCurrentPage }) => {
  return (
    <div className="page-enter">
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-grid">
        {/* Floating Agent — LEFT (Generator) */}
        <div className="hidden lg:flex flex-col items-center absolute left-6 xl:left-20 top-1/2 -translate-y-1/2 animate-floatA">
          <div className="relative group">
            <div className="absolute -inset-3 rounded-full bg-dp-purple/10 blur-2xl group-hover:bg-dp-purple/20 transition-all duration-500" />
            <img src={Agent1} alt="Generator Agent" className="relative w-56 xl:w-64 drop-shadow-[0_0_25px_rgba(124,58,237,0.35)]" />
          </div>
          <div className="mt-4 glass rounded-full px-4 py-1.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-dp-purple animate-pulse-dot" />
            <span className="text-xs font-semibold text-white tracking-wide">Generator Agent</span>
          </div>
        </div>

        {/* Floating Agent — RIGHT (Reviewer) */}
        <div className="hidden lg:flex flex-col items-center absolute right-6 xl:right-20 top-1/2 -translate-y-1/2 animate-floatB">
          <div className="relative group">
            <div className="absolute -inset-3 rounded-full bg-dp-indigo/10 blur-2xl group-hover:bg-dp-indigo/20 transition-all duration-500" />
            <img src={Agent2} alt="Reviewer Agent" className="relative w-56 xl:w-64 drop-shadow-[0_0_25px_rgba(79,70,229,0.35)]" />
          </div>
          <div className="mt-4 glass rounded-full px-4 py-1.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-dp-green animate-pulse-dot" />
            <span className="text-xs font-semibold text-white tracking-wide">Reviewer Agent</span>
          </div>
        </div>

        {/* Center content */}
        <div className="text-center max-w-3xl mx-auto z-10">
          {/* Pill badge */}
          <div className="inline-block px-4 py-1.5 rounded-full bg-dp-card border border-dp-purple/40 text-sm text-white mb-8 animate-fadeInUp">
            ✦ 4-in-1 Autonomous Data Agent
          </div>

          {/* Headlines */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
            <span className="block text-white animate-fadeInUp delay-100">Clean. Engineer.</span>
            <span className="block text-gradient-purple animate-fadeInUp delay-300">Model. Analyze.</span>
          </h1>

          {/* Subtagline */}
          <p className="text-dp-text-secondary text-base sm:text-lg max-w-xl mx-auto mt-6 leading-relaxed animate-fadeInUp delay-400">
            Autonomous AI Agent that handles your entire data pipeline — from raw messy files to trained ML models — in plain English.
          </p>

          {/* CTA */}
          <button
            onClick={() => setCurrentPage("upload")}
            className="mt-10 group inline-flex items-center gap-2 px-8 py-3 rounded-full bg-transparent border border-dp-purple text-white font-semibold transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:bg-dp-purple/10 animate-fadeInUp delay-500 cursor-pointer"
          >
            Generate
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
              <path d="M4 9h10M10 5l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </section>

      {/* ─── MAIN CONTENT ─── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Divider />

        {/* ── Section 2: Problem ── */}
        <section>
          <div className="w-12 h-1 bg-dp-purple rounded mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-left mb-8">What Problem Are We Solving?</h2>

          <div className="space-y-4 mb-10 text-left">
            {[
              "Every data project starts the same way — hours of manual cleaning before any real work begins",
              "One dataset, one script. It breaks on the next file. Nothing is reusable, nothing is automated",
              "You hand the data to a model and hope it works. No audit trail. No explanation. No confidence.",
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-3 animate-fadeInUp" style={{ animationDelay: `${i * 0.15}s` }}>
                <span className="text-dp-purple font-bold mt-0.5">→</span>
                <p className="text-dp-text-secondary text-sm sm:text-base leading-relaxed">{t}</p>
              </div>
            ))}
          </div>

          {/* Stat row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: "80%", label: "of DS time spent on data prep" },
              { value: "5x", label: "faster than manual scripting" },
              { value: "4", label: "pipeline stages automated" },
              { value: "0", label: "lines of code required from you" },
            ].map((s, i) => (
              <div
                key={i}
                className="glass rounded-xl p-5 text-center border border-dp-purple/20 transition-all duration-300 hover:border-dp-purple/50 animate-fadeInUp"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <p className="text-3xl sm:text-4xl font-extrabold text-gradient-purple mb-1.5">{s.value}</p>
                <p className="text-dp-text-secondary text-xs sm:text-sm leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* ── Section 3: 4 Pillars ── */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">What We Do — 4 Pillars</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <PillarCard num="01" emoji="🧹" title="Data Cleaning" desc="Fix missing values, correct data types, remove duplicates, standardize formats. Your data leaves pristine." color="#7c3aed" borderColor="#7c3aed22" delay="0s" />
            <PillarCard num="02" emoji="⚙️" title="ML Preprocessing" desc="OneHot encoding, label encoding, feature scaling, outlier handling. Data enters your model correctly." color="#3b82f6" borderColor="#3b82f622" delay="0.1s" />
            <PillarCard num="03" emoji="📊" title="Analytics & EDA" desc="Groupby aggregations, correlations, statistical summaries. Insights printed and captured automatically." color="#22c55e" borderColor="#22c55e22" delay="0.2s" />
            <PillarCard num="04" emoji="🤖" title="ML Model Training" desc="Train classification or regression models with scikit-learn. Predictions appended. Metrics evaluated." color="#f97316" borderColor="#f9731622" delay="0.3s" />
          </div>

          <div className="glass rounded-2xl p-6 mt-8 text-center">
            <p className="text-dp-purple italic text-sm sm:text-base">
              All four pillars share one interface — just describe your goal in plain English. The agent decides what to do.
            </p>
          </div>
        </section>

        <Divider />

        {/* ── Section 4: How It Works ── */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">How The Agent Works</h2>
          <div className="flex flex-col md:flex-row items-stretch gap-6">
            <StepCard icon="📤" color="#7c3aed" title="Upload & Describe" desc="Drop your CSV or Excel file. Type your goal in plain English." delay="0s" />
            {/* Arrow */}
            <div className="hidden md:flex items-center text-dp-border text-3xl">→</div>
            <StepCard icon="🔄" color="#3b82f6" title="Agent Loop Runs" desc="Engineer Agent writes code. Sandbox executes it. Critic Agent audits the result. Failed? Loop retries automatically." delay="0.15s" />
            <div className="hidden md:flex items-center text-dp-border text-3xl">→</div>
            <StepCard icon="📦" color="#22c55e" title="Download Results" desc="Receive cleaned CSV + Python script + full narrative report. Every decision explained." delay="0.3s" />
          </div>
        </section>

        <Divider />

        {/* ── Section 5: Quality Control ── */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">Quality Control Built In</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <FeatureCard emoji="🛡️" title="Critic Agent Gate" desc="A second AI agent audits every result before delivery. Flags >20% row loss, ML data leakage, incomplete goals." delay="0s" />
            <FeatureCard emoji="🔄" title="Self-Correcting Loop" desc="Code crashes or Critic rejects? Error is fed back automatically. Up to 5 autonomous fix attempts." delay="0.1s" />
            <FeatureCard emoji="📦" title="3-Part Delivery" desc="Cleaned CSV + exact Python script used + narrative report explaining every decision. Fully auditable." delay="0.2s" />
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
