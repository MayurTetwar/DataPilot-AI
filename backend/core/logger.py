import logging
import sys
from datetime import datetime


# ─────────────────────────────────────────────
# LOG FORMAT
# ─────────────────────────────────────────────
# Every log line will look like this:
# 2025-01-14 10:32:01 | INFO     | profiler.py  | Profiling started for sales_data.csv
# ─────────────────────────────────────────────

LOG_FORMAT = "{asctime} | {levelname:<8} | {filename:<20} | {message}"


def get_logger(name: str) -> logging.Logger:
    """
    Returns a configured logger for any module.

    Usage in any file:
        from app.logger import get_logger
        logger = get_logger(__name__)
        logger.info("Starting data profile for sales.csv")
        logger.warning("Attempt 2 of 5 — retrying after error")
        logger.error("Execution failed: KeyError on column 'age'")
        logger.debug("DataFrame shape: (1000, 12)")

    Args:
        name: Pass __name__ — Python fills in the module name automatically.

    Returns:
        A configured Logger instance.
    """

    logger = logging.getLogger(name)

    # Avoid adding duplicate handlers if logger is called multiple times
    if logger.handlers:
        return logger

    logger.setLevel(logging.DEBUG)


    # ─────────────────────────────────────────
    # HANDLER : File (persistent log file)
    # ─────────────────────────────────────────
    # Creates a new log file each day: logs/2025-01-14.log
    # So you can always go back and check what happened on a specific day
    import os
    log_dir = os.path.join(os.path.dirname(__file__), "..", "logs")
    os.makedirs(log_dir, exist_ok=True)

    log_filename = os.path.join(log_dir, f"{datetime.now().strftime('%Y-%m-%d')}.log")
    file_handler = logging.FileHandler(log_filename, encoding="utf-8")
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(
        logging.Formatter(LOG_FORMAT, style="{", datefmt="%Y-%m-%d %H:%M:%S")
    )

    logger.addHandler(console_handler)
    logger.addHandler(file_handler)

    return logger


# ─────────────────────────────────────────────
# CONVENIENCE: One shared app-level logger
# ─────────────────────────────────────────────
# Import this directly when you don't need a module-specific logger:
#   from app.logger import logger
#   logger.info("Server started")

logger = get_logger("app")