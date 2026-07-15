import os
from dotenv import load_dotenv

load_dotenv()

# ─────────────────────────────────────────────
# All environment variables loaded in one place.
# ─────────────────────────────────────────────

GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
MODEL_NAME: str = "gemini-2.5-flash"

# Folders
TEMP_DIR: str = os.path.join(os.path.dirname(__file__), "..", "temp")
OUTPUT_DIR: str = os.path.join(os.path.dirname(__file__), "..", "outputs")

# Agent settings
MAX_RETRIES: int = 5
EXECUTION_TIMEOUT: int = 30

# Validate on startup
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is missing. Add it to your .env file.")