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
""" 


CODE_GENERATION_PROMPT = """
DATA PROFILE:
{data_profile}

USER GOAL:
{user_goal}

Write a Python script to clean this dataset according to the user's goal.
The DataFrame is already loaded and available as the variable: df
Write all cleaning and preprocessing code then saved to file.
"""  


SELF_CORRECTION_PROMPT = """
The cleaning script you wrote produced an error.

PREVIOUS CODE:
{previous_code}

ERROR MESSAGE:
{error_message}

Understand the error and fix the code.
Return a corrected, complete Python script.
"""  