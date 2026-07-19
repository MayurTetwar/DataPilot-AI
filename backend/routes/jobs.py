from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from models import JobResponse
from routes.upload import jobs
from core.logger import get_logger

logger = get_logger(__name__)

router = APIRouter()

@router.get("/jobs/{job_id}", response_model=JobResponse)
async def get_job_status(job_id: str):
    """
    Poll the status of a running agent job.
    Returns current step + result when done.
    """
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
async def download_results(job_id: str):
    """
    Download the final .zip bundle containing all 3 outputs.
    Only available when job status is 'done'.
    """
    print(jobs)
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = jobs[job_id]
    if job.status != "done":
        raise HTTPException(status_code=400, detail="Job is not done yet")

    return FileResponse(
        path=job.result.zip_path,
        media_type="application/zip",
        filename="results.zip"
    )