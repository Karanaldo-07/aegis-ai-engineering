import json

import httpx

from .config import get_settings


ARCHITECTURE_SCHEMA = {
    "type": "object",
    "properties": {
        "summary": {"type": "string"},
        "architecture": {"type": "array", "items": {"type": "string"}},
        "components": {"type": "array", "items": {"type": "string"}},
        "risks": {"type": "array", "items": {"type": "string"}},
        "next_steps": {"type": "array", "items": {"type": "string"}},
    },
    "required": ["summary", "architecture", "components", "risks", "next_steps"],
    "additionalProperties": False,
}


class OpenAIResponsesClient:
    """Small provider adapter using the OpenAI Responses API over HTTPS."""

    def __init__(self) -> None:
        settings = get_settings()
        self.api_key = settings.openai_api_key
        self.model = settings.openai_model
        self.url = "https://api.openai.com/v1/responses"

    async def architecture_plan(self, requirement: str) -> dict:
        if not self.api_key:
            raise RuntimeError("OPENAI_API_KEY is required when AI_MODE=openai")

        payload = {
            "model": self.model,
            "input": [
                {
                    "role": "system",
                    "content": [
                        {
                            "type": "input_text",
                            "text": (
                                "You are the AEGIS Architect Agent. Design secure, practical, "
                                "incremental software architectures. Prefer least privilege, "
                                "clear boundaries, testability, observability, and human approval "
                                "for production-impacting actions. Return only the requested schema."
                            ),
                        }
                    ],
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "input_text",
                            "text": f"Create an architecture plan for this requirement:\n{requirement}",
                        }
                    ],
                },
            ],
            "text": {
                "format": {
                    "type": "json_schema",
                    "name": "architecture_plan",
                    "strict": True,
                    "schema": ARCHITECTURE_SCHEMA,
                }
            },
        }

        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                self.url,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json=payload,
            )
        response.raise_for_status()
        data = response.json()
        text = self._extract_output_text(data)
        result = json.loads(text)
        return result

    @staticmethod
    def _extract_output_text(data: dict) -> str:
        for item in data.get("output", []):
            for content in item.get("content", []):
                if content.get("type") in {"output_text", "text"} and content.get("text"):
                    return content["text"]
        raise RuntimeError("OpenAI response did not contain structured output")
