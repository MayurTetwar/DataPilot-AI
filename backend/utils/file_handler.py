import pandas as pd
from fastapi import UploadFile, HTTPException


async def load_file_to_dataframe(file: UploadFile) -> pd.DataFrame:
    """
    Accept a CSV or Excel upload and return a pandas DataFrame.
    Raises HTTPException for unsupported file types.
    """
    pass  # Phase 2 — will implement file reading here


def save_dataframe_to_csv(df: pd.DataFrame, path: str) -> None:
    """Save a cleaned DataFrame to a CSV file at the given path."""
    pass  # Phase 2 — will implement CSV saving here