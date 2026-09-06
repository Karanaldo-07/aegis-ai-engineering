from app.developer import build_developer_plan
from app.tools import ToolDefinition, ToolRegistry


def test_developer_plan_is_deterministic_and_guarded():
    plan = build_developer_plan("Add repository-aware code review")
    assert plan.summary.startswith("Prepare an incremental")
    assert "human approval" in " ".join(plan.guardrails).lower()
    assert plan.tests


def test_tool_registry_enforces_maximum_risk():
    registry = ToolRegistry()
    registry.register(ToolDefinition("read", "Read-only context", "low"))
    registry.register(ToolDefinition("write", "Mutating action", "high"))

    assert registry.allowed("read", "low") is True
    assert registry.allowed("write", "low") is False
    assert registry.allowed("write", "high") is True


def test_unknown_tool_is_rejected():
    registry = ToolRegistry()
    try:
        registry.get("missing")
    except KeyError as exc:
        assert "Unknown tool" in str(exc.value)
    else:
        raise AssertionError("Unknown tool should be rejected")
