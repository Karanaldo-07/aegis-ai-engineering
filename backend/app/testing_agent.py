from dataclasses import asdict, dataclass


@dataclass(frozen=True)
class TestingPlan:
    summary: str
    strategy: list[str]
    test_cases: list[str]
    quality_gates: list[str]
    guardrails: list[str]


def build_testing_plan(requirement: str) -> TestingPlan:
    requirement = requirement.strip()
    return TestingPlan(
        summary=f"Build a layered verification plan for: {requirement}",
        strategy=[
            "Start with deterministic unit tests for business logic and validation",
            "Add API contract tests for success, validation, authorization, and failure paths",
            "Add integration coverage for persistence and agent/tool boundaries",
            "Run regression and security checks before an approved change can proceed",
        ],
        test_cases=[
            "Happy path produces the expected structured result",
            "Malformed or incomplete input is rejected with a stable error",
            "Unauthorized or disallowed tool access is blocked",
            "External-provider failures are surfaced without leaking secrets",
            "Existing regression tests remain green after the change",
        ],
        quality_gates=[
            "Python compilation succeeds",
            "Backend test suite passes",
            "Frontend typecheck and production build pass",
            "No new high-risk capability bypasses the policy engine",
        ],
        guardrails=[
            "Testing is read-only by default and cannot deploy or write to GitHub",
            "Test execution must use an isolated worker with time and resource limits",
            "Secrets and provider credentials must never be included in test output",
            "Human approval remains required before production-impacting actions",
        ],
    )


def testing_plan_dict(requirement: str) -> dict:
    return asdict(build_testing_plan(requirement))
