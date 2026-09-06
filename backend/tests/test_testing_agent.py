from app.testing_agent import build_testing_plan, testing_plan_dict


def test_testing_plan_contains_layered_verification():
    plan = build_testing_plan("Add a protected API endpoint")
    assert "unit tests" in plan.strategy[0]
    assert any("API contract" in item for item in plan.strategy)
    assert any("regression" in item.lower() for item in plan.test_cases)
    assert any("Human approval" in item for item in plan.guardrails)


def test_testing_plan_is_structured_dict():
    plan = testing_plan_dict("Improve authentication")
    assert set(plan) == {"summary", "strategy", "test_cases", "quality_gates", "guardrails"}
    assert all(isinstance(value, list) for key, value in plan.items() if key != "summary")
