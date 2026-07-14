from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from models import JobResponse


router = APIRouter()

# In-memory job store — shared across routes
# { job_id: JobStatus }
jobs: dict = {}


@router.get("/jobs/{job_id}", response_model=JobResponse)
async def get_job_status(job_id: str):
    """
    Poll the status of a running agent job.
    Returns current step + result when done.
    """
    pass  # Phase 4 — will implement status polling here


@router.get("/jobs/{job_id}/download")
async def download_results(job_id: str):
    """
    Download the final .zip bundle containing all 3 outputs.
    Only available when job status is 'done'.
    """
    pass  # Phase 4 — will implement file download here