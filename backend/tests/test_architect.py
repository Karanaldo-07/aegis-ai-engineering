from app.architect import build_architecture_plan


def test_architecture_plan_contains_required_sections():
    plan = build_architecture_plan("Build a secure interview preparation platform")
    assert "interview preparation" in plan.summary.lower()
    assert plan.architecture
    assert plan.components
    assert plan.risks
    assert plan.next_steps


def test_architecture_plan_is_deterministic():
    first = build_architecture_plan("Create an AI code review service")
    second = build_architecture_plan("Create an AI code review service")
    assert first == second
