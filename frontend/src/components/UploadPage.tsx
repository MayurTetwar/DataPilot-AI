import React, { useState, useCallback, useRef } from "react";
import type { JobStatusResponse, JobStatusValue } from "../types";

/* ── Step order for progress ── */
const STEPS: JobStatusValue[] = ["queued", "profiling", "generating", "executing", "reviewing", "packaging", "done"];

const stepIndex = (s: JobStatusValue) => STEPS.indexOf(s);

/* ── Icons ── */
const UploadArrow = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M24 32V16M16 22l8-8 8 8" />
    <rect x="8" y="8" width="32" height="32" rx="6" />
  </svg>
);

const FileIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <rect x="8" y="4" width="24" height="32" rx="3" stroke="#22c55e" strokeWidth="2" />
    <path d="M14 16h12M14 22h8" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 3v9M5 9l4 4 4-4M3 14h12" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="3" y="7" width="10" height="7" rx="2" />
    <path d="M5 7V5a3 3 0 016 0v2" />
  </svg>
);

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1.5 9s3-5.5 7.5-5.5S16.5 9 16.5 9s-3 5.5-7.5 5.5S1.5 9 1.5 9z" />
    <circle cx="9" cy="9" r="2.5" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
    <div className="page-enter pt-24 pb-8 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Error toast ── */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-dp-red/10 border border-dp-red/30 text-dp-red text-sm flex items-center gap-3 animate-fadeIn">
            <span className="font-bold">✗</span> {error}
            <button onClick={() => setError(null)} className="ml-auto text-dp-red/60 hover:text-dp-red cursor-pointer">✕</button>
          </div>
        )}

        {/* ── API KEY CARD ── */}
        <div className="glass rounded-2xl p-5 mb-6 border border-dp-border/60 transition-all duration-300 focus-within:border-dp-purple/60 focus-within:shadow-[0_0_20px_rgba(124,58,237,0.15)]">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-lg">🔑</span>
            <label htmlFor="api-key-input" className="text-white font-semibold text-sm">Gemini API Key</label>
          </div>
          <div className="relative">
            <input
              id="api-key-input"
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy................................"
              className="w-full bg-dp-bg/60 text-white text-sm px-4 py-3 pr-12 rounded-xl border border-dp-border/40 focus:outline-none focus:border-dp-purple/60 placeholder:text-dp-text-secondary/40 transition-colors duration-200"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dp-text-secondary hover:text-white transition-colors duration-200 cursor-pointer"
              aria-label={showKey ? "Hide API key" : "Show API key"}
            >
              {showKey ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          <p className="text-dp-text-secondary text-xs mt-2.5 leading-relaxed">
            Your key is never stored. Used only for this session to power the AI agents.
          </p>
          <p className="text-dp-text-secondary text-xs mt-2.5 leading-relaxed">
            Don't have an API key? Click the <span className="text-dp-purple-light font-semibold">?</span> button in the top-right corner to learn how to get one for free.
          </p>
        </div>

        {/* ── TOP INPUT SECTION ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* LEFT — File Upload */}
          <div
            className={`glass rounded-2xl p-8 flex flex-col items-center justify-center min-h-[220px] border-2 border-dashed border-dp-border/60 transition-all duration-300 cursor-pointer ${dragOver ? "drag-over" : "hover:border-dp-purple/40"}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
          >
            <input ref={fileRef} type="file" accept=".csv,.xlsx" className="hidden" onChange={onFileChange} />
            {uploadedFile ? (
              <div className="text-center animate-fadeIn">
                <FileIcon />
                <p className="text-dp-green font-semibold mt-3 text-sm flex items-center gap-2 justify-center">
                  <span>✓</span> {uploadedFile.name}
                </p>
                <p className="text-dp-text-secondary text-xs mt-1">{formatSize(uploadedFile.size)}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}
                  className="mt-3 text-xs text-dp-text-secondary hover:text-dp-red transition-colors cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <UploadArrow />
                <p className="text-white font-medium mt-4">Drop your CSV or Excel file here</p>
                <p className="text-dp-text-secondary text-xs mt-1">Supports .csv and .xlsx</p>
              </>
            )}
          </div>

          {/* RIGHT — Goal Input */}
          <div className="glass rounded-2xl p-1 flex flex-col min-h-[220px]">
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder={`Describe your goal in plain English...\n\nExamples:\n• Clean missing values and fix data types\n• Prepare dataset for a Random Forest classifier\n• Analyze sales trends by region and month\n• Train a regression model to predict house prices`}
              className="flex-1 bg-transparent text-white text-sm p-5 resize-none focus:outline-none placeholder:text-dp-text-secondary/60 leading-relaxed"
            />
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-dp-border/30">
              <button className="w-8 h-8 rounded-lg bg-dp-card border border-dp-border/60 flex items-center justify-center text-dp-text-secondary hover:text-white transition-colors cursor-pointer text-lg">
                +
              </button>
              <button
                onClick={handleGenerate}
                disabled={!canGenerate || isGenerating}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${canGenerate && !isGenerating ? "bg-dp-purple text-white hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]" : "bg-dp-border/40 text-dp-text-secondary/40 cursor-not-allowed"}`}
              >
                {isGenerating ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 12V4M5 7l3-3 3 3" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── GENERATE BUTTON (centered) ── */}
        {canGenerate && !jobId && (
          <div className="flex justify-center mb-12 animate-fadeIn">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-10 py-3.5 rounded-full bg-gradient-to-r from-dp-purple to-dp-purple-light text-white font-semibold text-base transition-all duration-300 hover:shadow-[0_0_40px_rgba(124,58,237,0.4)] flex items-center gap-2.5 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
                  Processing…
                </>
              ) : (
                <>
                  <span className="text-lg">+</span>
                  Generate
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 12V4M5 7l3-3 3 3" /></svg>
                </>
              )}
            </button>
          </div>
        )}

        {/* ── GENERATED CONTEXT SECTION ── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-white">Generated Context</h2>
            <div className="flex-1 h-px bg-dp-purple/30" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT — Agent Status */}
            <div className="glass rounded-2xl p-6 min-h-[300px]">
              {!jobId && !isGenerating && (
                <div className="flex flex-col items-center justify-center h-full text-dp-text-secondary">
                  <p className="text-sm">Waiting for file and goal<span className="animate-blink">...</span></p>
                </div>
              )}

              {(isGenerating || jobStatus) && !isDone && !isFailed && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="flex items-center gap-2 text-dp-purple-light">
                    <div className="w-5 h-5 border-2 border-dp-purple/30 border-t-dp-purple rounded-full animate-spin-slow" />
                    <span className="font-semibold text-sm">Agent Processing…</span>
                  </div>

                  {/* Attempt count */}
                  <p className="text-xs text-dp-text-secondary">
                    Attempt {jobStatus?.result?.attempts_taken || 1} of 5
                  </p>

                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full bg-dp-border/50 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-dp-purple to-dp-purple-light transition-all duration-700 animate-progressPulse"
                      style={{ width: `${Math.max(10, ((currentStepIdx + 1) / STEPS.length) * 100)}%` }}
                    />
                  </div>

                  {/* Current step */}
                  <div>
                    <p className="text-xs text-dp-text-secondary mb-1">Current Step:</p>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-dp-purple animate-pulse-dot" />
                      <span className="text-white text-sm font-medium">{jobStatus?.status || "queued"}</span>
                    </div>
                  </div>

                  {/* Step history */}
                  <div>
                    <p className="text-xs text-dp-text-secondary mb-2">Step History:</p>
                    <div className="space-y-1.5">
                      {STEPS.map((s, i) => {
                        const done = i < currentStepIdx;
                        const current = i === currentStepIdx;
                        const pending = i > currentStepIdx;
                        return (
                          <div key={s} className="flex items-center gap-2.5 text-sm">
                            {done && <span className="text-dp-green">✓</span>}
                            {current && <span className="w-2.5 h-2.5 rounded-full bg-dp-purple animate-pulse-dot inline-block" />}
                            {pending && <span className="w-2.5 h-2.5 rounded-full bg-dp-border inline-block" />}
                            <span className={done ? "text-dp-green" : current ? "text-dp-purple-light" : "text-dp-text-secondary/50"}>
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
                  <div className="p-3 rounded-xl bg-dp-green/10 border border-dp-green/30 text-dp-green text-sm font-semibold flex items-center gap-2">
                    ✓ Completed in {jobStatus?.result?.attempts_taken || 1} attempt{(jobStatus?.result?.attempts_taken || 1) > 1 ? "s" : ""}
                  </div>
                  {jobStatus?.result?.summary && (
                    <p className="text-dp-text-secondary text-sm leading-relaxed">{jobStatus.result.summary}</p>
                  )}
                </div>
              )}

              {isFailed && (
                <div className="animate-fadeIn space-y-4">
                  <div className="p-3 rounded-xl bg-dp-red/10 border border-dp-red/30 text-dp-red text-sm font-semibold flex items-center gap-2">
                    ✗ Failed after 5 attempts
                  </div>
                  {jobStatus?.error && (
                    <p className="text-dp-text-secondary text-sm leading-relaxed">{jobStatus.error}</p>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT — Download Panel */}
            <div className="glass rounded-2xl p-6 min-h-[300px]">
              <h3 className="text-white font-semibold mb-5">Your Results</h3>
              <div className="space-y-3">
                {[
                  { type: "csv", label: "Download CSV File", solid: false },
                  { type: "script", label: "Download Python Script", solid: false },
                  { type: "report", label: "Download Summary Report", solid: false },
                  { type: "zip", label: "Download All (ZIP)", solid: true },
                ].map(({ type, label, solid }) => (
                  <button
                    key={type}
                    onClick={() => isDone && downloadFile(type)}
                    disabled={!isDone}
                    className={`w-full flex items-center justify-center gap-2.5 py-3 rounded-xl font-medium text-sm transition-all duration-500 cursor-pointer
                      ${isDone
                        ? solid
                          ? "bg-gradient-to-r from-dp-purple to-dp-purple-light text-white hover:shadow-[0_0_25px_rgba(124,58,237,0.4)]"
                          : "bg-transparent border border-dp-purple/50 text-dp-purple-light hover:bg-dp-purple/10 hover:shadow-[0_0_20px_rgba(124,58,237,0.25)]"
                        : "opacity-40 blur-[1px] cursor-not-allowed bg-dp-border/20 text-dp-text-secondary border border-dp-border/30"
                      }`}
                  >
                    {isDone ? <DownloadIcon /> : <LockIcon />}
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UploadPage;
