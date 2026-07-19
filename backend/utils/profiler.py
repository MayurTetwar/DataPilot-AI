import pandas as pd
from models import DataProfile, ColumnProfile
from core.logger import get_logger

logger = get_logger(__name__)


def profile_dataframe(df: pd.DataFrame, file_name: str) -> DataProfile:
    """
    Inspect a DataFrame and return a structured DataProfile.
    Captures: column names, types, null counts, unique counts, sample values.
    """
    logger.info(f"Profiling DataFrame: {file_name}")
    column = []
    for col in df.columns:
        column.append(
            ColumnProfile(
                name=col,
                dtype=str(df[col].dtype),
                null_count=df[col].isnull().sum(),
                null_percentage=round(df[col].isnull().mean() * 100, 2),
                unique_count=df[col].nunique(),
                sample_values=df[col].dropna().head(3).tolist()
            )
        )   

    return DataProfile(
        row_count=len(df),
        column_count=len(df.columns),
        columns=column,
        file_name=file_name
    )


def profile_to_text(profile: DataProfile) -> str:
    """
    Convert a DataProfile into a readable text block
    that the AI agent can understand in its prompt.
    """
    logger.info("Converting DataProfile to text")
    lines = []
    lines.append(f"Dataset: {profile.file_name}")
    lines.append(f"Rows: {profile.row_count} | Columns: {profile.column_count}")
    lines.append("")

    for col in profile.columns:
        lines.append(f"Column: {col.name} | Type: {col.dtype} | Nulls: {col.null_count} ({col.null_percentage}%) | Unique: {col.unique_count}")
        lines.append(f"Sample values: {', '.join(str(v) for v in col.sample_values)}")
        lines.append("")

    return "\n".join(lines)