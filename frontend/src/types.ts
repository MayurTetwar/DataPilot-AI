export type PageType = "landing" | "upload";

export type JobStatusValue =
  | "queued"
  | "profiling"
  | "generating"
  | "executing"
  | "reviewing"
  | "packaging"
  | "done"
  | "failed";

export interface JobResult {
  cleaned_csv_path: string;
  python_script_path: string;
  narrative_report_path: string;
  zip_path: string;
  attempts_taken: number;
  summary: string;
}

export interface JobStatusResponse {
  job_id: string;
  status: JobStatusValue;
  message: string;
  result: JobResult | null;
  error: string | null;
}
