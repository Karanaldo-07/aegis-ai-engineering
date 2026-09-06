import json

import pytest

from app.llm import OpenAIResponsesClient


def test_extract_output_text_from_responses_payload():
    payload = {
        "output": [
            {
                "type": "message",
                "content": [
                    {"type": "output_text", "text": json.dumps({"summary": "ok"})}
                ],
            }
        ]
    }
    assert OpenAIResponsesClient._extract_output_text(payload) == '{"summary": "ok"}'


def test_missing_output_text_is_rejected():
    with pytest.raises(RuntimeError, match="structured output"):
        OpenAIResponsesClient._extract_output_text({"output": []})
