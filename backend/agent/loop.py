from models import DataProfile, ExecutionResult, CleaningResult, JobStatus
from core.config import MAX_RETRIES


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
    pass  # Phase 3 — will implement the full loop here