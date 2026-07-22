import os
import pandas as pd
from models import DataProfile, CleaningResult
from core.config import MAX_RETRIES
from core.logger import get_logger
from utils.profiler import profile_to_text, profile_dataframe
from agent.agent import generate_code
from agent.critic_agent import review_code
from agent.executor import execute_cleaning_code
from utils.packager import write_narrative_report, bundle_outputs

logger = get_logger(__name__)

async def run_agent_loop(
    job_id: str,
    profile: DataProfile,
    user_goal: str,
    input_csv_path: str,
    output_dir: str,
    jobs: dict,
    api_key: str
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
        api_key       : User-provided Gemini API key for this session

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
        jobs[job_id].status = "generating"

        # Call the agent1
        agent_output = await generate_code(
            data_profile_text=profile_text,
            user_goal=user_goal,
            previous_code=last_code,
            error_message=last_error,
            api_key=api_key
        )

        jobs[job_id].status = "executing"
        
        # Run the code
        execution = execute_cleaning_code(
            code=agent_output.cleaning_code,
            input_csv_path=input_csv_path,
            output_csv_path=output_csv_path,
            attempt_number=attempt
        )

        if not execution.success:
            last_code = agent_output.cleaning_code
            last_error = execution.error
            continue
        
        jobs[job_id].status = "reviewing"

         # Profile the output data
        after_df = pd.read_csv(output_csv_path)
        profile_after = profile_to_text(
            profile_dataframe(after_df, "cleaned")
        )

        final_code = f"""
import pandas as pd
df = pd.read_csv(r"[input_file_path]")
{agent_output.cleaning_code}
df.to_csv(r'[output_file_path]', index=False)
        """

        # call the agent2
        result = await review_code(
            user_goal=user_goal,
            profile_before=profile_text,
            profile_after=profile_after,
            cleaning_code=final_code,
            api_key=api_key
        )
        
        if result.verdict == 'Pass':
            # break out — we are done
            break
        else:
            last_code = agent_output.cleaning_code
            last_error = f"CRITIC FEEDBACK: {result.feedback}"
    else:
        logger.error(f"Agent failed after {MAX_RETRIES} attempts")
        # This runs if loop completes without break (all retries failed)
        raise RuntimeError(f"Agent failed after {MAX_RETRIES} attempts")
    

    script_path = os.path.join(output_dir, "cleaning_script.py")
    with open(script_path, "w") as f:
        f.write(final_code)

    logger.info(f"Agent completed successfully after {attempt} attempts")
    
    report_path = os.path.join(output_dir, "report.txt")
    write_narrative_report(
        profile_text=profile_text,
        explanation=agent_output.explanation,
        output_path=report_path
    )

    zip_path = os.path.join(output_dir, "results.zip")
    bundle_outputs(
        csv_path=output_csv_path,
        script_path=script_path,
        report_path=report_path,
        zip_path=zip_path
    )
 
    return CleaningResult(
        cleaned_csv_path=output_csv_path,
        python_script_path=script_path,
        narrative_report_path=report_path,
        zip_path=zip_path,                
        attempts_taken=attempt,
        summary=agent_output.explanation
    )
    
