from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import FileResponse
from models import JobResponse
from routes.upload import jobs
from core.logger import get_logger
import os

logger = get_logger(__name__)
router = APIRouter()


@router.get("/jobs/{job_id}", response_model=JobResponse)
async def get_job_status(job_id: str):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")

    job = jobs[job_id]
    return JobResponse(
        job_id=job.job_id,
        status=job.status,
        message=job.message,
        result=job.result,
        error=job.error
    )


@router.get("/jobs/{job_id}/download")
async def download_results(
    job_id: str,
    type: str = Query(default="zip", description="File type: csv, script, report, zip")
):
    """
    Download output files.
    type=csv     → cleaned_data.csv
    type=script  → cleaning_script.py
    type=report  → report.txt
    type=zip     → results.zip (all in one)
    """

    # ── Validate job exists ──────────────────
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")

    job = jobs[job_id]

    # ── Validate job is done ─────────────────
    if job.status != "done":
        raise HTTPException(status_code=400, detail="Job is not done yet")

    # ── Map type to file path + filename ─────
    file_map = {
        "csv": (job.result.cleaned_csv_path,        "cleaned_data.csv",      "text/csv"),
        "script": (job.result.python_script_path,   "cleaning_script.py",    "text/plain"),
        "report": (job.result.narrative_report_path,"report.txt",            "text/plain"),
        "zip":    (job.result.zip_path,             "results.zip",           "application/zip"),
    }

    # ── Validate type parameter ───────────────
    if type not in file_map:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid type '{type}'. Choose from: csv, script, report, zip"
        )

    file_path, filename, media_type = file_map[type]

    # ── Validate file exists on disk ─────────
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail=f"File not found on server. Job may have expired."
        )

    logger.info(f"Downloading {type} for job {job_id}")

    return FileResponse(
        path=file_path,
        media_type=media_type,
        filename=filename
    )