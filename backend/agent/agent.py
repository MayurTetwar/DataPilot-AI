from pydantic_ai import Agent
from pydantic_ai.models.google import GoogleModel
from pydantic_ai.providers.google import GoogleProvider
from models import AgentOutput
from agent.prompts import SYSTEM_PROMPT, CODE_GENERATION_PROMPT, SELF_CORRECTION_PROMPT
from core.config import MODEL_NAME
from core.logger import get_logger

logger = get_logger(__name__)


def _build_agent(api_key: str) -> Agent:
    """Create a fresh Agent using the user-provided API key."""
    provider = GoogleProvider(api_key=api_key)
    model = GoogleModel(MODEL_NAME, provider=provider)
    return Agent(
        model=model,
        output_type=AgentOutput,
        system_prompt=SYSTEM_PROMPT
    )


async def generate_code(
    data_profile_text: str,
    user_goal: str,
    previous_code: str | None = None,
    error_message: str | None = None,
    api_key: str = ""
) -> AgentOutput:
    """
    Ask the agent to generate or fix a data cleaning Python script.

    First call  : previous_code=None, error_message=None
    Retry calls : previous_code=last_attempt, error_message=what_went_wrong

    Returns AgentOutput with cleaning_code and explanation.
    """ 

    logger.info("[agent1] Generating code")
    
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
        agent = _build_agent(api_key)
        result = await agent.run(prompt)
        logger.info("[agent] ✓ Code generation step completed")
        return result.output
    except Exception as e:
        logger.error(f"[agent] Code generation failed: {e}")
        raise ValueError(f"Failed to generate code: {str(e)}")