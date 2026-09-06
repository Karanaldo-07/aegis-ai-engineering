import os

os.environ["AI_MODE"] = "mock"

from app.ai import AIService


def test_mock_ai_service_returns_review_gate():
    service = AIService()
    result = __import__("asyncio").run(service.run("Architect", "Design a secure API"))

    assert "Architect Agent simulation complete" in result
    assert "review the proposed result" in result
