import pandas as pd
from fastapi import UploadFile, HTTPException
import io

from core.logger import get_logger

logger = get_logger(__name__)

async def load_file_to_dataframe(file: UploadFile) -> pd.DataFrame:
    """
    Accept a CSV or Excel upload and return a pandas DataFrame.
    Raises HTTPException for unsupported file types.
    """
    if not (file.filename.endswith('.csv') or file.filename.endswith('.xlsx')):
        logger.error("Unsupported file type")
        raise HTTPException(status_code=400, detail='Unsupported file type')

    file_bytes = await file.read()
    if file.filename.endswith('.csv'):
        df = pd.read_csv(io.BytesIO(file_bytes))
    else:
        df = pd.read_excel(io.BytesIO(file_bytes))

    logger.info("File loaded successfully")    
    return df


def save_dataframe_to_csv(df: pd.DataFrame, path: str) -> None:
    """Save a cleaned DataFrame to a CSV file at the given path."""
    logger.info("Saving DataFrame to CSV")
    df.to_csv(path, index=False)