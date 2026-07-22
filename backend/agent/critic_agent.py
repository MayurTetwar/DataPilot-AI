from pydantic_ai import Agent
from pydantic_ai.models.google import GoogleModel
from pydantic_ai.providers.google import GoogleProvider
from models import CriticOutput
from agent.prompts import CRITIC_SYSTEM_PROMPT, CRITIC_REVIEW_PROMPT
from core.config import MODEL_NAME
from core.logger import get_logger

logger = get_logger(__name__)


def _build_critic_agent(api_key: str) -> Agent:
    """Create a fresh critic Agent using the user-provided API key."""
    provider = GoogleProvider(api_key=api_key)
    model = GoogleModel(MODEL_NAME, provider=provider)
    return Agent(
        model=model,
        output_type=CriticOutput,
        system_prompt=CRITIC_SYSTEM_PROMPT
    )


async def review_code(
    user_goal: str,
    profile_before: str,
    profile_after: str,
    cleaning_code: str,
    api_key: str = ""
) -> CriticOutput:
    
    logger.info("[agent2] Reviewing code")

    prompt = CRITIC_REVIEW_PROMPT.format(
        user_goal=user_goal,
        profile_before=profile_before,
        profile_after=profile_after,
        cleaning_code=cleaning_code
    )
    
    try:
        agent = _build_critic_agent(api_key)
        result = await agent.run(prompt)
        logger.info("[agent2] ✓ Code reviewing step completed")
        return result.output
    except Exception as e:
        logger.error(f"[agent2] Code reviewing failed: {e}")
        raise ValueError(f"Failed to review code: {str(e)}")