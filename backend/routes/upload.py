from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional
from models import UploadResponse


router = APIRouter()


@router.post("/upload", response_model=UploadResponse)
async def upload_file(
    file: UploadFile = File(..., description="CSV or Excel file to clean"),
    goal: str = Form(..., description="Natural language cleaning instruction")
):
    """
    Accept a raw dataset + user goal.
    Starts the agent job in the background.
    Returns a job_id immediately for polling.
    """
    pass  # Phase 4 — will implement upload + job kickoff here