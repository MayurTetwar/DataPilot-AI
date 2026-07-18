import os
from fastapi import APIRouter, UploadFile, File, Form, BackgroundTasks
from models import UploadResponse, JobStatus
from utils.session import create_session, get_session_temp_dir, get_session_output_dir
from utils.file_handler import load_file_to_dataframe, save_dataframe_to_csv
from utils.profiler import profile_dataframe
from agent.loop import run_agent_loop
from core.logger import get_logger
import uuid6

logger = get_logger(__name__)
router = APIRouter()
jobs: dict = {}

async def process_job(job_id, profile, user_goal, input_csv_path, output_dir):
    try:
        result = await run_agent_loop(
            job_id=job_id,
            profile=profile,
            user_goal=user_goal,
            input_csv_path=input_csv_path,
            output_dir=output_dir,
            jobs=jobs
        )
        logger.info("[Runner] Job completed successfully")
        jobs[job_id].status = "done"
        jobs[job_id].result = result
    except Exception as e:
        logger.info("[Runner] Job failed")
        jobs[job_id].status = "failed"
        jobs[job_id].error = str(e)


@router.post("/upload", response_model=UploadResponse)
async def upload_file(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(..., description="CSV or Excel file to clean"),
    goal: str = Form(..., description="Natural language cleaning instruction")
):
    """
    Accept a raw dataset + user goal.
    Starts the agent job in the background.
    Returns a job_id immediately for polling.
    """

    df = await load_file_to_dataframe(file)
    job_id = str(uuid6.uuid7())
    session_id = create_session()

    temp_dir = get_session_temp_dir(session_id)
    output_dir = get_session_output_dir(session_id)
    input_csv_path = os.path.join(temp_dir, file.filename)
    save_dataframe_to_csv(df, input_csv_path)

    profile = profile_dataframe(df,file.filename)

    jobs[job_id] = JobStatus(
        job_id=job_id,
        status="queued",
        message="Job received, starting..."
    )
    
    background_tasks.add_task(
        process_job,
        job_id, profile, goal, input_csv_path, output_dir
    )

    return UploadResponse(
        job_id=job_id,
        message="Job started. Poll /jobs/{job_id} for status."
    )    
    