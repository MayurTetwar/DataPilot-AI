import subprocess
import tempfile
import os
from models import ExecutionResult
from core.config import EXECUTION_TIMEOUT
from core.logger import get_logger

logger = get_logger(__name__)

def execute_cleaning_code(
    code: str,
    input_csv_path: str,
    output_csv_path: str,
    attempt_number: int = 1
) -> ExecutionResult:
    """
    Safely execute AI-generated cleaning code in an isolated subprocess.

    Args:
        code             : The Python code string to execute
        input_csv_path   : Path to the raw uploaded CSV
        output_csv_path  : Path where cleaned CSV should be saved
        attempt_number   : Which retry attempt this is

    Returns:
        ExecutionResult with success=True or error message
    """
        
    full_code = f"""
import pandas as pd
df = pd.read_csv(r'{input_csv_path}')
{code}
df.to_csv(r'{output_csv_path}', index=False)
        """

    try:
        logger.info(f"[execution] Attempt {attempt_number} — running Python subprocess")
        with tempfile.NamedTemporaryFile(
            mode="w",
            suffix=".py",
            delete=False
        ) as tmp:
            tmp.write(full_code)
            tmp_path = tmp.name

        result = subprocess.run(
            ["python", tmp_path],
            capture_output=True,
            text=True,
            timeout=EXECUTION_TIMEOUT
        )
        # Clean up the temp file after running
        os.remove(tmp_path)
    except Exception as e:
        logger.error(f"[execution] Python subprocess failed: {e}")
        return ExecutionResult(
            success=False,
            error=f"Execution timeout after {EXECUTION_TIMEOUT}s or system error",
            attempt_number=attempt_number
        )

    if result.returncode == 0:
        logger.info(f"Attempt {attempt_number} succeeded")
        return ExecutionResult(
            success=True,
            output=result.stdout,
            attempt_number=attempt_number
        )
    else:
        logger.warning(f"Attempt {attempt_number} failed")
        return ExecutionResult(
            success=False,
            error=result.stderr,
            attempt_number=attempt_number
        )