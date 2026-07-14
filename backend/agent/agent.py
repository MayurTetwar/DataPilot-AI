from pydantic_ai import Agent
from pydantic_ai.models.google import GoogleModel
from app.models import AgentOutput
from app.agent.prompts import SYSTEM_PROMPT
from app.config import GEMINI_API_KEY


# ─────────────────────────────────────────────
# Gemini model via Pydantic AI
# ─────────────────────────────────────────────

model = GoogleModel("gemini-2.5-flash", api_key=GEMINI_API_KEY)

data_agent = Agent(
    model=model,
    output_type=AgentOutput,
    system_prompt=SYSTEM_PROMPT
)


async def generate_cleaning_code(
    data_profile_text: str,
    user_goal: str,
    previous_code: str | None = None,
    error_message: str | None = None
) -> AgentOutput:
    """
    Ask the agent to generate or fix a data cleaning Python script.

    First call  : previous_code=None, error_message=None
    Retry calls : previous_code=last_attempt, error_message=what_went_wrong

    Returns AgentOutput with cleaning_code and explanation.
    """
    pass  # Phase 3 — will implement agent call here