import React from "react";
import type { PageType } from "../types";
import Agent1 from "../assets/Agent1.png";
import Agent2 from "../assets/Agent2.png";

/* ── Tag chip component ── */
const TagChip: React.FC<{ label: string }> = ({ label }) => (
  <span className="inline-block px-2.5 py-1 rounded-md bg-dp-bg/80 border border-dp-border/50 text-dp-text-tertiary text-[11px] font-medium">
    {label}
  </span>
);

/* ── Critic check item ── */
const CriticCheck: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center gap-2 py-1">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
    <span className="text-dp-text-tertiary text-xs">{text}</span>
  </div>
);

/* ── Agent Loop Step ── */
const LOOP_STEPS = [
  { label: "Raw Dataset", icon: "doc" },
  { label: "Data Profiler", icon: "search" },
  { label: "Engineer Agent", icon: "brain" },
  { label: "Sandbox Executor", icon: "gear" },
  { label: "Critic Agent", icon: "shield" },
];

const AgentLoopVisualizer: React.FC = () => (
  <div className="card-shell h-full animate-fadeInUp">
    <div className="card-core p-6 h-full flex flex-col" style={{ background: "linear-gradient(180deg, rgba(16,185,129,0.04), transparent)" }}>
      <p className="text-dp-text font-semibold text-sm tracking-tight mb-6">Agent loop visualizer</p>

      {/* Steps chain */}
      <div className="flex-1 flex flex-col items-center gap-0">
        {LOOP_STEPS.map((step, i) => (
          <React.Fragment key={i}>
            {/* Step pill */}
            <div
              className="loop-step w-full max-w-[200px] flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-dp-surface border border-dp-border/50"
              style={{ animationDelay: `${i * 1}s` }}
            >
              <div className="w-7 h-7 rounded-lg bg-dp-accent/10 border border-dp-accent/15 flex items-center justify-center flex-shrink-0">
                {step.icon === "doc" && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round"><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M9 10h6M9 14h4" /></svg>}
                {step.icon === "search" && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>}
                {step.icon === "brain" && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" /><path d="M10 22h4" /></svg>}
                {step.icon === "gear" && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" /></svg>}
                {step.icon === "shield" && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
              </div>
              <span className="text-dp-text-secondary text-xs font-medium">{step.label}</span>
            </div>
            {/* Connector line */}
            {i < LOOP_STEPS.length - 1 && (
              <div className="w-px h-4 bg-dp-border/50" />
            )}
          </React.Fragment>
        ))}

        {/* Branch: Fail / Pass */}
        <div className="w-px h-4 bg-dp-border/50" />
        <div className="flex items-start gap-6">
          {/* Fail branch */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dp-red/8 border border-dp-red/20">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              <span className="text-dp-red text-[11px] font-medium">Fail</span>
            </div>
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round">
              <path d="M8 0v8M8 8C8 16 2 16 2 8" />
            </svg>
            <span className="text-dp-text-tertiary text-[10px]">Loop back</span>
          </div>
          {/* Pass branch */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dp-green/8 border border-dp-green/20">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
              <span className="text-dp-green text-[11px] font-medium">Pass</span>
            </div>
            <div className="w-px h-4 bg-dp-border/50" />
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-dp-surface border border-dp-border/50">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>
              <span className="text-dp-text-secondary text-[11px] font-medium">Output</span>
            </div>
          </div>
        </div>
      </div>
    </div>
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
    <div className="page-enter noise-overlay">
      {/* ── HERO — Asymmetric Split ── */}
      <section className="relative min-h-[100dvh] flex items-center px-4 sm:px-6 lg:px-8 pt-20 pb-16 overflow-hidden">
        {/* Ambient glow orbs */}
        <div className="hero-glow w-[500px] h-[500px] bg-emerald-500 top-[-10%] left-[-5%]" />
        <div className="hero-glow w-[400px] h-[400px] bg-violet-600 bottom-[5%] right-[-5%] opacity-10" />

        {/* Grid dots */}
        <div className="absolute inset-0 bg-grid opacity-40" />

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left — Copy */}
          <div className="max-w-xl">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dp-surface border border-dp-border text-xs font-medium text-dp-text-secondary mb-8 animate-fadeInUp">
              <span className="w-1.5 h-1.5 rounded-full bg-dp-accent animate-pulse-dot" />
              Autonomous data engineering
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-6xl font-extrabold leading-[1.05] tracking-tight animate-fadeInUp delay-100">
              <span className="block text-dp-text">Clean. Engineer.</span>
              <span className="block text-gradient-brand mt-1">Model. Analyze.</span>
            </h1>

            {/* Subtext — 18 words */}
            <p className="text-dp-text-secondary text-base sm:text-lg leading-relaxed mt-6 max-w-[50ch] animate-fadeInUp delay-300">
              Upload your dataset, describe your goal in plain English. AI agents handle the entire pipeline automatically.
            </p>

            {/* CTA — Button-in-Button pattern */}
            <button
              onClick={() => setCurrentPage("upload")}
              className="mt-10 group inline-flex items-center gap-3 pl-7 pr-2 py-2 rounded-full bg-dp-accent text-white font-semibold text-sm btn-physics animate-fadeInUp delay-400 cursor-pointer"
            >
              Start building
              <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center transition-transform duration-500 group-hover:translate-x-0.5" style={{ transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)" }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </span>
            </button>
          </div>

          {/* Right — Agent images */}
          <div className="flex items-center justify-center lg:justify-end gap-6 animate-fadeInUp delay-300">
            <div className="flex flex-col items-center animate-floatA">
              <div className="relative group">
                <div className="absolute -inset-4 rounded-full bg-dp-accent/8 blur-3xl transition-all duration-700 group-hover:bg-dp-accent/12" />
                <img src={Agent1} alt="Generator Agent" className="relative w-40 sm:w-48 lg:w-56 xl:w-64 drop-shadow-[0_0_30px_rgba(16,185,129,0.2)]" />
              </div>
              <div className="mt-4 glass rounded-full px-4 py-1.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-dp-accent animate-pulse-dot" />
                <span className="text-xs font-medium text-dp-text tracking-wide">Generator</span>
              </div>
            </div>
            <div className="flex flex-col items-center animate-floatB">
              <div className="relative group">
                <div className="absolute -inset-4 rounded-full bg-dp-indigo/8 blur-3xl transition-all duration-700 group-hover:bg-dp-indigo/12" />
                <img src={Agent2} alt="Reviewer Agent" className="relative w-40 sm:w-48 lg:w-56 xl:w-64 drop-shadow-[0_0_30px_rgba(79,70,229,0.2)]" />
              </div>
              <div className="mt-4 glass rounded-full px-4 py-1.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-dp-green animate-pulse-dot" />
                <span className="text-xs font-medium text-dp-text tracking-wide">Reviewer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MAIN CONTENT ─── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section 2: Problem — Left-aligned with stat cards ── */}
        <section className="section-gap">
          <div className="max-w-2xl mb-12 animate-fadeInUp">
            <h2 className="text-3xl sm:text-4xl font-bold text-dp-text tracking-tight leading-tight mb-5">
              Data work shouldn't be this painful
            </h2>
            <p className="text-dp-text-secondary text-base leading-relaxed max-w-[55ch]">
              Every project starts with hours of cleaning before any real analysis begins. Scripts break on the next file. Nothing is reusable.
            </p>
          </div>

          {/* Pain points */}
          <div className="space-y-3 mb-14">
            {[
              "Hours of manual cleaning before any real work begins",
              "One dataset, one script. It breaks on the next file",
              "No audit trail. No explanation. No confidence in results",
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-3 animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="w-1.5 h-1.5 rounded-full bg-dp-accent mt-2.5 flex-shrink-0" />
                <p className="text-dp-text-secondary text-sm sm:text-base leading-relaxed">{t}</p>
              </div>
            ))}
          </div>

          {/* Stat cards — Double-Bezel */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { value: "80%", label: "Data scientist time spent on data prep" },
              { value: "5x", label: "Faster than manual scripting" },
              { value: "4", label: "Pipeline stages automated" },
              { value: "0", label: "Lines of code required from you" },
            ].map((s, i) => (
              <div
                key={i}
                className="card-shell hover-lift animate-fadeInUp"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="card-core p-5 sm:p-6 text-center">
                  <p className="text-3xl sm:text-4xl font-extrabold text-gradient-accent mb-2">{s.value}</p>
                  <p className="text-dp-text-tertiary text-xs sm:text-sm leading-snug">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 3: 4 Pillars — Asymmetric Bento Grid ── */}
        <section className="section-gap">
          <div className="max-w-xl mb-12 animate-fadeInUp">
            <h2 className="text-3xl sm:text-4xl font-bold text-dp-text tracking-tight leading-tight">
              Four pillars, one interface
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Card 01 — Data Cleaning */}
            <div className="card-shell hover-lift animate-fadeInUp">
              <div className="card-core p-6 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-dp-accent/10 border border-dp-accent/20 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M3 12h12M3 18h18" /></svg>
                  </div>
                  <span className="text-[11px] font-semibold text-dp-accent tracking-wide">01</span>
                </div>
                <h3 className="text-dp-text font-semibold text-lg tracking-tight mb-2">Data cleaning</h3>
                <p className="text-dp-text-secondary text-sm leading-relaxed mb-4">
                  Fix missing values, correct data types, remove duplicates, standardize formats. Your data leaves pristine.
                </p>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {["Missing Values", "Data Types", "Duplicates", "Date Formats", "Text Casing", "Outliers"].map((tag) => (
                    <TagChip key={tag} label={tag} />
                  ))}
                </div>
              </div>
            </div>

            {/* Card 02 — ML Preprocessing */}
            <div className="card-shell hover-lift animate-fadeInUp delay-100">
              <div className="card-core p-6 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-dp-blue/10 border border-dp-blue/20 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" /></svg>
                  </div>
                  <span className="text-[11px] font-semibold text-dp-blue tracking-wide">02</span>
                </div>
                <h3 className="text-dp-text font-semibold text-lg tracking-tight mb-2">ML preprocessing</h3>
                <p className="text-dp-text-secondary text-sm leading-relaxed mb-4">
                  OneHot encoding, label encoding, feature scaling, outlier handling. Data enters your model correctly.
                </p>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {["OneHot Encoding", "Label Encoding", "StandardScaler", "MinMaxScaler", "PCA Ready"].map((tag) => (
                    <TagChip key={tag} label={tag} />
                  ))}
                </div>
              </div>
            </div>

            {/* Card 03 — Analytics */}
            <div className="card-shell hover-lift animate-fadeInUp delay-200">
              <div className="card-core p-6 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-dp-green/10 border border-dp-green/20 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10M12 20V4M6 20v-6" /></svg>
                  </div>
                  <span className="text-[11px] font-semibold text-dp-green tracking-wide">03</span>
                </div>
                <h3 className="text-dp-text font-semibold text-lg tracking-tight mb-2">Analytics</h3>
                <p className="text-dp-text-secondary text-sm leading-relaxed mb-4">
                  Groupby aggregations, correlations, statistical summaries. Insights captured automatically.
                </p>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {["Groupby", "Correlations", "Describe", "Value Counts", "Trend Analysis"].map((tag) => (
                    <TagChip key={tag} label={tag} />
                  ))}
                </div>
              </div>
            </div>

            {/* Card 04 — ML Training */}
            <div className="card-shell hover-lift animate-fadeInUp delay-300">
              <div className="card-core p-6 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-dp-orange/10 border border-dp-orange/20 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
                  </div>
                  <span className="text-[11px] font-semibold text-dp-orange tracking-wide">04</span>
                </div>
                <h3 className="text-dp-text font-semibold text-lg tracking-tight mb-2">ML training</h3>
                <p className="text-dp-text-secondary text-sm leading-relaxed mb-4">
                  Train classification or regression models. Predictions appended. Metrics evaluated.
                </p>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {["Random Forest", "Regression", "Classification", "Train/Test Split", "Metrics Evaluated"].map((tag) => (
                    <TagChip key={tag} label={tag} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 4: How It Works — 2-col: Loop Visualizer + Timeline ── */}
        <section className="section-gap">
          <div className="max-w-xl mb-14 animate-fadeInUp">
            <h2 className="text-3xl sm:text-4xl font-bold text-dp-text tracking-tight leading-tight">
              How the agent works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* LEFT — Agent Loop Visualizer */}
            <AgentLoopVisualizer />

            {/* RIGHT — Steps Timeline */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-dp-accent/40 via-dp-border to-transparent hidden sm:block" />

              <div className="space-y-10 sm:space-y-14">
                {[
                  {
                    num: "01",
                    title: "Upload and describe",
                    desc: "Drop your CSV or Excel file. Type your goal in plain English.",
                    color: "#10b981",
                  },
                  {
                    num: "02",
                    title: "Agent loop runs",
                    desc: "Engineer Agent writes code. Sandbox executes it. Critic Agent audits the result. Failed? Loop retries automatically.",
                    color: "#3b82f6",
                  },
                  {
                    num: "03",
                    title: "Download results",
                    desc: "Receive cleaned CSV, Python script, and full narrative report. Every decision explained.",
                    color: "#22c55e",
                  },
                ].map((step, i) => (
                  <div key={i} className="flex gap-6 sm:gap-8 animate-fadeInUp" style={{ animationDelay: `${i * 0.12}s` }}>
                    {/* Timeline dot */}
                    <div className="flex-shrink-0 relative">
                      <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold z-10 relative bg-dp-bg" style={{ borderColor: step.color, color: step.color }}>
                        {step.num}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="pb-2 pt-1">
                      <h3 className="text-dp-text font-semibold text-lg tracking-tight mb-2">{step.title}</h3>
                      <p className="text-dp-text-secondary text-sm leading-relaxed max-w-[45ch]">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 5: Quality Control — Asymmetric 2-col split ── */}
        <section className="section-gap">
          <div className="max-w-xl mb-12 animate-fadeInUp">
            <h2 className="text-3xl sm:text-4xl font-bold text-dp-text tracking-tight leading-tight">
              Quality control built in
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
            {/* Large highlight card — Critic Agent */}
            <div className="md:col-span-7 card-shell hover-lift animate-fadeInUp">
              <div className="card-core p-6 sm:p-8 h-full flex flex-col justify-center" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.06), transparent)" }}>
                <div className="w-12 h-12 rounded-2xl bg-dp-accent/10 border border-dp-accent/20 flex items-center justify-center mb-5">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                </div>
                <h3 className="text-dp-text font-bold text-xl tracking-tight mb-3">Critic agent gate</h3>
                <p className="text-dp-text-secondary text-sm leading-relaxed max-w-[45ch] mb-5">
                  A second AI agent audits every result before delivery. Flags greater than 20% row loss, ML data leakage, and incomplete goals.
                </p>
                {/* Critic checklist */}
                <div className="border-t border-dp-border/30 pt-4">
                  <CriticCheck text="Goal fully achieved" />
                  <CriticCheck text="Less than 20% row loss" />
                  <CriticCheck text="No ML data leakage" />
                  <CriticCheck text="Data types correct" />
                  <CriticCheck text="Model evaluated properly" />
                </div>
              </div>
            </div>

            {/* Right column — two stacked cards */}
            <div className="md:col-span-5 flex flex-col gap-3 sm:gap-4">
              <div className="card-shell hover-lift animate-fadeInUp delay-100">
                <div className="card-core p-6">
                  <div className="w-10 h-10 rounded-xl bg-dp-blue/10 border border-dp-blue/20 flex items-center justify-center mb-4">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
                  </div>
                  <h3 className="text-dp-text font-semibold text-base tracking-tight mb-2">Self-correcting loop</h3>
                  <p className="text-dp-text-secondary text-sm leading-relaxed">
                    Code crashes or Critic rejects? Error is fed back automatically. Up to 5 autonomous fix attempts.
                  </p>
                </div>
              </div>

              <div className="card-shell hover-lift animate-fadeInUp delay-200">
                <div className="card-core p-6">
                  <div className="w-10 h-10 rounded-xl bg-dp-orange/10 border border-dp-orange/20 flex items-center justify-center mb-4">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
                  </div>
                  <h3 className="text-dp-text font-semibold text-base tracking-tight mb-2">3-part delivery</h3>
                  <p className="text-dp-text-secondary text-sm leading-relaxed">
                    Cleaned CSV, exact Python script used, and narrative report explaining every decision. Fully auditable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
