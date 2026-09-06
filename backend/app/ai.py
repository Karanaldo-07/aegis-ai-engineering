from .config import get_settings


class AIService:
    """Provider boundary. Mock mode keeps local development credential-free."""

    def __init__(self) -> None:
        self.settings = get_settings()

    async def run(self, agent: str, input_text: str) -> str:
        if self.settings.ai_mode.lower() == "mock":
            return (
                f"{agent} Agent simulation complete.\n\n"
                "Next action: review the proposed result before any production-impacting change."
            )
        if self.settings.ai_mode.lower() == "openai":
            if not self.settings.openai_api_key:
                raise RuntimeError("OPENAI_API_KEY is required when AI_MODE=openai")
            return "OpenAI provider wiring is enabled; model invocation will be added in the AI integration phase."
        raise RuntimeError(f"Unsupported AI_MODE: {self.settings.ai_mode}")
