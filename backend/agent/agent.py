from pydantic_ai import Agent
from pydantic_ai.models.google import GoogleModel
from pydantic_ai.providers.google import GoogleProvider
from models import AgentOutput
from agent.prompts import SYSTEM_PROMPT, CODE_GENERATION_PROMPT, SELF_CORRECTION_PROMPT
from core.config import MODEL_NAME, GEMINI_API_KEY
from core.logger import get_logger

logger = get_logger(__name__)

# ─────────────────────────────────────────────
# Gemini model via Pydantic AI
# ─────────────────────────────────────────────

provider = GoogleProvider(api_key=GEMINI_API_KEY)
model = GoogleModel(MODEL_NAME, provider=provider)

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

    logger.info("[agent] Generating cleaning code")
    
    if previous_code is None:
        prompt = CODE_GENERATION_PROMPT.format(
            data_profile=data_profile_text,
            user_goal=user_goal
        )
    else:
        prompt = SELF_CORRECTION_PROMPT.format(
            data_profile=data_profile_text,
            previous_code=previous_code,
            error_message=error_message
        )

    try:
        result = await data_agent.run(prompt)
        logger.info("[agent] ✓ Code generation step completed")
        return result.output
    except Exception as e:
        logger.error(f"[agent] Code generation failed: {e}")
        raise ValueError(f"Failed to generate cleaning code: {str(e)}")