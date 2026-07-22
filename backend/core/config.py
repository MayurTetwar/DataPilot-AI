import os

# ─────────────────────────────────────────────
# All environment variables loaded in one place.
# ─────────────────────────────────────────────

MODEL_NAME: str = "gemini-3.6-flash"

# Folders 
TEMP_DIR: str = os.path.join(os.path.dirname(__file__), "..", "temp")
OUTPUT_DIR: str = os.path.join(os.path.dirname(__file__), "..", "outputs")

# Agent settings
MAX_RETRIES: int = 5
EXECUTION_TIMEOUT: int = 30