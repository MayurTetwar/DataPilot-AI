# ─────────────────────────────────────────────
# All prompt templates live here in one place.
# Nothing is hardcoded inside agent.py or loop.py.
# ─────────────────────────────────────────────

SYSTEM_PROMPT = """
You are an expert data engineer and Python programmer.
Your job is to write clean, correct Python code to clean datasets.

RULES:
- Always use pandas for data manipulation.
- The input DataFrame is always available as the variable: df
- Save the cleaned result back to the same variable: df
- Write complete, runnable code — no placeholders, no pseudo-code.
- Handle edge cases: columns may not always exist, types may vary.
- Never import libraries that are not standard data science libraries.
"""  # Phase 3 — will expand this prompt


CODE_GENERATION_PROMPT = """
DATA PROFILE:
{data_profile}

USER GOAL:
{user_goal}

Write a Python script to clean this dataset according to the user's goal.
The DataFrame is already loaded and available as the variable: df
"""  # Phase 3 — will refine this prompt


SELF_CORRECTION_PROMPT = """
The cleaning script you wrote produced an error.

PREVIOUS CODE:
{previous_code}

ERROR MESSAGE:
{error_message}

Fix the code. Return a corrected, complete Python script.
"""  # Phase 3 — will refine this prompt