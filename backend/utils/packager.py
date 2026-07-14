import zipfile
import os
from models import CleaningResult


def write_narrative_report(
    profile_text: str,
    explanation: str,
    output_path: str
) -> str:
    """
    Write a human-readable narrative report explaining
    what problems were found and what decisions were made.
    Returns the path to the written report file.
    """
    pass  # Phase 4 — will implement report writing here


def bundle_outputs(
    csv_path: str,
    script_path: str,
    report_path: str,
    zip_path: str
) -> str:
    """
    Bundle all 3 output files into a single downloadable .zip.
    Returns the path to the zip file.
    """
    pass  # Phase 4 — will implement zip bundling here