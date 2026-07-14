import uuid
import os
from core.config import TEMP_DIR, OUTPUT_DIR


def create_session() -> str:
    """Create a unique session ID and its temp/output folders."""
    session_id = str(uuid.uuid4())
    os.makedirs(os.path.join(TEMP_DIR, session_id), exist_ok=True)
    os.makedirs(os.path.join(OUTPUT_DIR, session_id), exist_ok=True)
    return session_id


def get_session_temp_dir(session_id: str) -> str:
    """Return the temp directory path for a session."""
    return os.path.join(TEMP_DIR, session_id)


def get_session_output_dir(session_id: str) -> str:
    """Return the output directory path for a session."""
    return os.path.join(OUTPUT_DIR, session_id)


def cleanup_session(session_id: str) -> None:
    """Delete temp files for a session after job is done."""
    pass  # Phase 2 — will implement cleanup logic here