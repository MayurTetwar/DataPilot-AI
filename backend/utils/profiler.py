import pandas as pd
from models import DataProfile, ColumnProfile


def profile_dataframe(df: pd.DataFrame, file_name: str) -> DataProfile:
    """
    Inspect a DataFrame and return a structured DataProfile.
    Captures: column names, types, null counts, unique counts, sample values.
    """
    pass  # Phase 2 — will implement profiling logic here


def profile_to_text(profile: DataProfile) -> str:
    """
    Convert a DataProfile into a readable text block
    that the AI agent can understand in its prompt.
    """
    pass  # Phase 2 — will implement text formatting here