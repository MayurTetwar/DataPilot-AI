import os
from models import DataProfile, CleaningResult, JobStatus
from core.config import MAX_RETRIES
from core.logger import get_logger
from utils.profiler import profile_to_text
from agent.agent import generate_cleaning_code
from agent.executor import execute_cleaning_code

logger = get_logger(__name__)

async def run_agent_loop(
    job_id: str,
    profile: DataProfile,
    user_goal: str,
    input_csv_path: str,
    output_dir: str,
    jobs: dict
) -> CleaningResult:
    """
    The core ReAct loop — the heart of the entire project.

    Flow:
    1. Profile text → agent generates code
    2. Executor runs the code
    3. If success → package and return
    4. If error   → feed error back to agent, retry
    5. After MAX_RETRIES → raise failure

    Args:
        job_id        : Unique job identifier for status updates
        profile       : DataProfile from profiler.py
        user_goal     : The user's natural language cleaning instruction
        input_csv_path: Path to the raw uploaded file
        output_dir    : Where to save all output files
        jobs          : Shared dict to update live job status

    Returns:
        CleaningResult with paths to all 3 output files + zip
    """

    last_code = None
    last_error = None
    profile_text = profile_to_text(profile)
    output_csv_path = os.path.join(output_dir, "cleaned_data.csv")

    logger.info(f"Starting ReAct loop for job {job_id}")

    for attempt in range(1, MAX_RETRIES + 1):
        # Update job status so frontend knows which attempt we are on
        jobs[job_id].message = f"Attempt {attempt} of {MAX_RETRIES}"

        # Call the agent
        agent_output = await generate_cleaning_code(
            data_profile_text=profile_text,
            user_goal=user_goal,
            previous_code=last_code,
            error_message=last_error
        )

        # Run the code
        execution = execute_cleaning_code(
            code=agent_output.cleaning_code,
            input_csv_path=input_csv_path,
            output_csv_path=output_csv_path,
            attempt_number=attempt
        )

        if execution.success:
            # break out — we are done
            break
        else:
            # store for next iteration
            last_code = agent_output.cleaning_code
            last_error = execution.error
    else:
        logger.error(f"Agent failed after {MAX_RETRIES} attempts")
        # This runs if loop completes without break (all retries failed)
        raise RuntimeError(f"Agent failed after {MAX_RETRIES} attempts")

    script_path = os.path.join(output_dir, "cleaning_script.py")
    with open(script_path, "w") as f:
        f.write(agent_output.cleaning_code)

    logger.info(f"Agent completed successfully after {attempt} attempts")
    
    return CleaningResult(
        cleaned_csv_path=output_csv_path,
        python_script_path=script_path,
        narrative_report_path="",   # packager.py fills this later
        zip_path="",                # packager.py fills this later
        attempts_taken=attempt,
        summary=agent_output.explanation
    )
    
