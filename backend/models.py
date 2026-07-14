from pydantic import BaseModel, Field
from typing import Any, Literal
from datetime import datetime


# ─────────────────────────────────────────────
# DATA PROFILE — what the profiler returns
# ─────────────────────────────────────────────

class ColumnProfile(BaseModel):
    """Profile of a single column in the dataset."""
    name: str
    dtype: str
    null_count: int
    null_percentage: float
    unique_count: int
    sample_values: list[Any]


class DataProfile(BaseModel):
    """Full profile of the uploaded dataset."""
    row_count: int
    column_count: int
    columns: list[ColumnProfile]
    file_name: str


# ─────────────────────────────────────────────
# AGENT OUTPUT — what the AI agent returns
# ─────────────────────────────────────────────

class AgentOutput(BaseModel):
    """Structured output the Pydantic AI agent must return."""
    cleaning_code: str = Field(
        description="Complete, runnable Python script to clean the dataset"
    )
    explanation: str = Field(
        description="Brief explanation of what this code does and why"
    )


# ─────────────────────────────────────────────
# EXECUTION RESULT — what the sandbox returns
# ─────────────────────────────────────────────

class ExecutionResult(BaseModel):
    """Result of running the AI-generated code in the sandbox."""
    success: bool
    output: str = ""       # stdout from the script
    error: str = ""        # stderr / exception if failed
    attempt_number: int = 1


# ─────────────────────────────────────────────
# CLEANING RESULT — final packaged result
# ─────────────────────────────────────────────

class CleaningResult(BaseModel):
    """The complete result after a successful agent loop."""
    cleaned_csv_path: str        # Path to the cleaned CSV file
    python_script_path: str      # Path to the cleaning script
    narrative_report_path: str   # Path to the text report
    zip_path: str                # Path to the bundled .zip
    attempts_taken: int          # How many retries the agent needed
    summary: str                 # One-line human summary


# ─────────────────────────────────────────────
# JOB STATUS — for the polling API
# ─────────────────────────────────────────────

class JobStatus(BaseModel):
    """Tracks the state of a running agent job."""
    job_id: str
    status: Literal["queued", "profiling", "generating", "executing", "retrying", "packaging", "done", "failed"]
    message: str = ""            # Human readable current step
    created_at: datetime = Field(default_factory=datetime.utcnow)
    result: CleaningResult | None = None
    error: str | None = None


# ─────────────────────────────────────────────
# API REQUEST/RESPONSE MODELS
# ─────────────────────────────────────────────

class UploadResponse(BaseModel):
    """Returned immediately after file upload."""
    job_id: str
    message: str


class JobResponse(BaseModel):
    """Returned when polling job status."""
    job_id: str
    status: str
    message: str
    result: CleaningResult | None = None
    error: str | None = None