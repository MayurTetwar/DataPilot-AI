import subprocess
import tempfile
import os
from models import ExecutionResult
from core.config import EXECUTION_TIMEOUT


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
    pass  # Phase 3 — will implement sandboxed execution here