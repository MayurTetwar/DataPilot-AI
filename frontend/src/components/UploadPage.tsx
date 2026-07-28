import React, { useState, useCallback, useRef } from "react";
import type { JobStatusResponse, JobStatusValue } from "../types";

/* ── Step order for progress ── */
const STEPS: JobStatusValue[] = ["queued", "profiling", "generating", "executing", "reviewing", "packaging", "done"];

const stepIndex = (s: JobStatusValue) => STEPS.indexOf(s);

/* ── Icons ── */
const UploadArrow = () => (
  <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="#a1a1aa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M24 32V16M16 22l8-8 8 8" />
    <rect x="8" y="8" width="32" height="32" rx="8" />
  </svg>
);

const FileIcon = () => (
  <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
    <rect x="8" y="4" width="24" height="32" rx="4" stroke="#22c55e" strokeWidth="1.5" />
    <path d="M14 16h12M14 22h8" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 3v9M5 9l4 4 4-4M3 14h12" />
  </svg>
);

const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="3" y="7" width="10" height="7" rx="2" />
    <path d="M5 7V5a3 3 0 016 0v2" />
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1.5 9s3-5.5 7.5-5.5S16.5 9 16.5 9s-3 5.5-7.5 5.5S1.5 9 1.5 9z" />
    <circle cx="9" cy="9" r="2.5" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 2l14 14M7.6 7.6a2.5 2.5 0 003.3 3.3" />
    <path d="M5.1 5.1C3.2 6.5 1.5 9 1.5 9s3 5.5 7.5 5.5c1.4 0 2.7-.5 3.8-1.2M14.4 12.4C15.8 11.2 16.5 9 16.5 9s-3-5.5-7.5-5.5c-.7 0-1.4.1-2 .3" />
  </svg>
);

/* ═════════════════════════════ */
/*  UPLOAD PAGE                 */
/* ═════════════════════════════ */
interface UploadPageProps {
  backendUrl: string;
  apiKey: string;
  setApiKey: (k: string) => void;
  uploadedFile: File | null;
  setUploadedFile: (f: File | null) => void;
  goal: string;
  setGoal: (g: string) => void;
  jobId: string | null;
  setJobId: (id: string | null) => void;
  jobStatus: JobStatusResponse | null;
  setJobStatus: (s: JobStatusResponse | null) => void;
  isGenerating: boolean;
  setIsGenerating: (b: boolean) => void;
}

const UploadPage: React.FC<UploadPageProps> = ({
  backendUrl, apiKey, setApiKey, uploadedFile, setUploadedFile, goal, setGoal,
  jobId, setJobId, jobStatus, setJobStatus, isGenerating, setIsGenerating,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── File handlers ── */
  const handleFile = useCallback((file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "csv" || ext === "xlsx") {
      setUploadedFile(file);
      setError(null);
    } else {
      setError("Only .csv and .xlsx files are supported.");
    }
  }, [setUploadedFile]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  }, [handleFile]);

  /* ── Polling ── */
  const startPolling = useCallback((jid: string) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${backendUrl}/jobs/${jid}`);
        if (!res.ok) throw new Error("Poll failed");
        const data: JobStatusResponse = await res.json();
        setJobStatus(data);
        if (data.status === "done" || data.status === "failed") {
          clearInterval(pollRef.current!);
          pollRef.current = null;
          setIsGenerating(false);
        }
      } catch {
        // keep polling on transient errors
      }
    }, 2000);
  }, [backendUrl, setJobStatus, setIsGenerating]);

  /* ── Upload ── */
  const handleGenerate = useCallback(async () => {
    if (!uploadedFile || !goal.trim() || !apiKey.trim()) return;
    setIsGenerating(true);
    setError(null);
    setJobStatus(null);
    try {
      const fd = new FormData();
      fd.append("file", uploadedFile);
      fd.append("goal", goal);
      fd.append("api_key", apiKey);
      const res = await fetch(`${backendUrl}/upload`, { method: "POST", body: fd });
      if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
      const data = await res.json();
      setJobId(data.job_id);
      startPolling(data.job_id);
    } catch (err: unknown) {
      setIsGenerating(false);
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  }, [uploadedFile, goal, apiKey, backendUrl, setIsGenerating, setJobStatus, setJobId, startPolling]);

  /* ── Download ── */
  const downloadFile = useCallback(async (type: string) => {
    if (!jobId) return;
    try {
      const res = await fetch(`${backendUrl}/jobs/${jobId}/download?type=${type}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const names: Record<string, string> = { csv: "cleaned_data.csv", script: "pipeline.py", report: "report.md", zip: "datapilot_results.zip" };
      a.download = names[type] || "download";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Download failed");
    }
  }, [jobId, backendUrl]);

  const isDone = jobStatus?.status === "done";
  const isFailed = jobStatus?.status === "failed";
  const canGenerate = !!uploadedFile && goal.trim().length > 0 && apiKey.trim().length > 0;
  const currentStepIdx = jobStatus ? stepIndex(jobStatus.status) : -1;

  const formatSize = (b: number) => b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`;

  return (
    <div className="page-enter pt-24 pb-12 min-h-[100dvh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Page title ── */}
        <div className="mb-8 animate-fadeInUp">
          <h1 className="text-2xl sm:text-3xl font-bold text-dp-text tracking-tight">Upload and analyze</h1>
          <p className="text-dp-text-secondary text-sm mt-2 max-w-[50ch]">Drop your dataset, describe your goal, and let the agents work.</p>
        </div>

        {/* ── Error toast ── */}
        {error && (
          <div className="mb-6 card-shell animate-fadeIn">
            <div className="card-core p-4 flex items-center gap-3 border-l-2 border-dp-red">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
              <span className="text-dp-red text-sm flex-1">{error}</span>
              <button onClick={() => setError(null)} className="text-dp-text-tertiary hover:text-dp-red btn-physics cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
          </div>
        )}

        {/* ── API KEY CARD — Double-Bezel ── */}
        <div className="card-shell mb-6 animate-fadeInUp delay-100">
          <div className="card-core p-5 transition-all duration-500 focus-within:shadow-[0_0_0_1px_rgba(16,185,129,0.3),0_0_20px_rgba(16,185,129,0.08)]" style={{ transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)" }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-dp-accent/10 border border-dp-accent/20 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" /></svg>
              </div>
              <label htmlFor="api-key-input" className="text-dp-text font-semibold text-sm">Gemini API Key</label>
            </div>
            <div className="relative">
              <input
                id="api-key-input"
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy................................"
                className="w-full bg-dp-bg/80 text-dp-text text-sm px-4 py-3 pr-12 rounded-xl border border-dp-border/50 focus:outline-none focus:border-dp-accent/50 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.08)] placeholder:text-dp-text-tertiary/60 transition-all duration-300"
                style={{ transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)" }}
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dp-text-tertiary hover:text-dp-text transition-colors duration-300 cursor-pointer"
                aria-label={showKey ? "Hide API key" : "Show API key"}
              >
                {showKey ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            <p className="text-dp-text-tertiary text-xs mt-2.5 leading-relaxed">
              Your key is never stored. Used only for this session to power the AI agents.
            </p>
            <p className="text-dp-text-tertiary text-xs mt-1.5 leading-relaxed">
              Need a key? Click the <span className="text-dp-accent font-medium">?</span> button in the navigation bar.
            </p>
          </div>
        </div>

        {/* ── TOP INPUT SECTION ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-10 animate-fadeInUp delay-200">
          {/* LEFT — File Upload */}
          <div
            className={`card-shell cursor-pointer transition-all duration-500 ${dragOver ? "drag-over" : ""}`}
            style={{ transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)" }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
          >
            <div className="card-core p-8 flex flex-col items-center justify-center min-h-[220px] border border-dashed border-dp-border/50 rounded-[16px] hover:border-dp-accent/30 transition-colors duration-500" style={{ transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)" }}>
              <input ref={fileRef} type="file" accept=".csv,.xlsx" className="hidden" onChange={onFileChange} />
              {uploadedFile ? (
                <div className="text-center animate-fadeIn">
                  <FileIcon />
                  <p className="text-dp-green font-semibold mt-3 text-sm flex items-center gap-2 justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                    {uploadedFile.name}
                  </p>
                  <p className="text-dp-text-tertiary text-xs mt-1">{formatSize(uploadedFile.size)}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}
                    className="mt-3 text-xs text-dp-text-tertiary hover:text-dp-red transition-colors duration-300 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <UploadArrow />
                  <p className="text-dp-text font-medium mt-4 text-sm">Drop your CSV or Excel file here</p>
                  <p className="text-dp-text-tertiary text-xs mt-1.5">Supports .csv and .xlsx</p>
                </>
              )}
            </div>
          </div>

          {/* RIGHT — Goal Input */}
          <div className="card-shell">
            <div className="card-core flex flex-col min-h-[220px] overflow-hidden">
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder={`Describe your goal in plain English...\n\nExamples:\n• Clean missing values and fix data types\n• Prepare dataset for a Random Forest classifier\n• Analyze sales trends by region and month\n• Train a regression model to predict house prices`}
                className="flex-1 bg-transparent text-dp-text text-sm p-5 resize-none focus:outline-none placeholder:text-dp-text-tertiary/50 leading-relaxed"
              />
              <div className="flex items-center justify-between px-4 py-3 border-t border-dp-border/30">
                <button className="w-8 h-8 rounded-lg bg-dp-surface border border-dp-border/50 flex items-center justify-center text-dp-text-tertiary hover:text-dp-text btn-physics cursor-pointer text-lg">
                  +
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={!canGenerate || isGenerating}
                  className={`w-9 h-9 rounded-full flex items-center justify-center btn-physics cursor-pointer ${canGenerate && !isGenerating ? "bg-dp-accent text-white" : "bg-dp-border/30 text-dp-text-tertiary/40 cursor-not-allowed"}`}
                >
                  {isGenerating ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M8 12V4M5 7l3-3 3 3" /></svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── GENERATE BUTTON (centered) ── */}
        {canGenerate && !jobId && (
          <div className="flex justify-center mb-14 animate-fadeIn">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="group px-10 py-3.5 rounded-full bg-dp-accent text-white font-semibold text-sm btn-physics flex items-center gap-3 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
                  Processing
                </>
              ) : (
                <>
                  Generate
                  <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center transition-transform duration-500 group-hover:translate-x-0.5" style={{ transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)" }}>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
                  </span>
                </>
              )}
            </button>
          </div>
        )}

        {/* ── GENERATED CONTEXT SECTION ── */}
        <section className="animate-fadeInUp delay-300">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xl font-bold text-dp-text tracking-tight">Generated context</h2>
            <div className="flex-1 h-px bg-dp-border/30" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {/* LEFT — Agent Status */}
            <div className="card-shell">
              <div className="card-core p-6 min-h-[300px]">
                {!jobId && !isGenerating && (
                  <div className="flex flex-col items-center justify-center h-full text-dp-text-tertiary">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="mb-3 opacity-40">
                      <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                    </svg>
                    <p className="text-sm">Waiting for file and goal<span className="animate-blink">...</span></p>
                  </div>
                )}

                {(isGenerating || jobStatus) && !isDone && !isFailed && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="flex items-center gap-2.5 text-dp-accent">
                      <div className="w-5 h-5 border-2 border-dp-accent/30 border-t-dp-accent rounded-full animate-spin-slow" />
                      <span className="font-semibold text-sm">Agent processing</span>
                    </div>

                    {/* Attempt count */}
                    <p className="text-xs text-dp-text-tertiary">
                      Attempt {jobStatus?.result?.attempts_taken || 1} of 5
                    </p>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 rounded-full bg-dp-border/40 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-dp-accent to-dp-accent-light transition-all duration-700 animate-progressPulse"
                        style={{
                          width: `${Math.max(10, ((currentStepIdx + 1) / STEPS.length) * 100)}%`,
                          transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
                        }}
                      />
                    </div>

                    {/* Current step */}
                    <div>
                      <p className="text-xs text-dp-text-tertiary mb-1.5">Current step</p>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-dp-accent animate-pulse-dot" />
                        <span className="text-dp-text text-sm font-medium">{jobStatus?.status || "queued"}</span>
                      </div>
                    </div>

                    {/* Step history */}
                    <div>
                      <p className="text-xs text-dp-text-tertiary mb-2.5">Step history</p>
                      <div className="space-y-2">
                        {STEPS.map((s, i) => {
                          const done = i < currentStepIdx;
                          const current = i === currentStepIdx;
                          const pending = i > currentStepIdx;
                          return (
                            <div key={s} className="flex items-center gap-3 text-sm">
                              {done && (
                                <span className="text-dp-green">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                                </span>
                              )}
                              {current && <span className="w-2.5 h-2.5 rounded-full bg-dp-accent animate-pulse-dot inline-block" />}
                              {pending && <span className="w-2.5 h-2.5 rounded-full bg-dp-border inline-block" />}
                              <span className={done ? "text-dp-green" : current ? "text-dp-accent" : "text-dp-text-tertiary/50"}>
                                {s}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {isDone && (
                  <div className="animate-fadeIn space-y-4">
                    <div className="p-3.5 rounded-xl bg-dp-green/8 border border-dp-green/20 text-dp-green text-sm font-semibold flex items-center gap-2.5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                      Completed in {jobStatus?.result?.attempts_taken || 1} attempt{(jobStatus?.result?.attempts_taken || 1) > 1 ? "s" : ""}
                    </div>
                    {jobStatus?.result?.summary && (
                      <p className="text-dp-text-secondary text-sm leading-relaxed">{jobStatus.result.summary}</p>
                    )}
                  </div>
                )}

                {isFailed && (
                  <div className="animate-fadeIn space-y-4">
                    <div className="p-3.5 rounded-xl bg-dp-red/8 border border-dp-red/20 text-dp-red text-sm font-semibold flex items-center gap-2.5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                      Failed after 5 attempts
                    </div>
                    {jobStatus?.error && (
                      <p className="text-dp-text-secondary text-sm leading-relaxed">{jobStatus.error}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT — Download Panel */}
            <div className="card-shell">
              <div className="card-core p-6 min-h-[300px]">
                <h3 className="text-dp-text font-semibold text-base tracking-tight mb-6">Your results</h3>
                <div className="space-y-3">
                  {[
                    { type: "csv", label: "Download CSV", solid: false },
                    { type: "script", label: "Download Python script", solid: false },
                    { type: "report", label: "Download report", solid: false },
                    { type: "zip", label: "Download all (ZIP)", solid: true },
                  ].map(({ type, label, solid }) => (
                    <button
                      key={type}
                      onClick={() => isDone && downloadFile(type)}
                      disabled={!isDone}
                      className={`w-full flex items-center justify-center gap-2.5 py-3 rounded-xl font-medium text-sm btn-physics cursor-pointer
                        ${isDone
                          ? solid
                            ? "bg-dp-accent text-white"
                            : "bg-transparent border border-dp-accent/40 text-dp-accent-light hover:bg-dp-accent/8"
                          : "opacity-35 cursor-not-allowed bg-dp-surface text-dp-text-tertiary border border-dp-border/30"
                        }`}
                    >
                      {isDone ? <DownloadIcon /> : <LockIcon />}
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UploadPage;
