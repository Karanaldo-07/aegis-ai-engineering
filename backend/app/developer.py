from dataclasses import asdict, dataclass


@dataclass(frozen=True)
class DeveloperPlan:
    summary: str
    implementation_steps: list[str]
    files_to_change: list[str]
    tests: list[str]
    guardrails: list[str]


def build_developer_plan(requirement: str) -> DeveloperPlan:
    requirement = requirement.strip()
    return DeveloperPlan(
        summary=f"Prepare an incremental implementation plan for: {requirement}",
        implementation_steps=[
            "Clarify the acceptance criteria and affected system boundaries",
            "Identify the smallest safe set of source changes",
            "Implement the change behind typed interfaces and explicit error handling",
            "Run unit, integration, and security checks before proposing the patch",
            "Present the patch for human approval before repository writes",
        ],
        files_to_change=[
            "Relevant application modules identified from project context",
            "Automated tests covering the requested behavior",
            "Documentation or configuration only when required",
        ],
        tests=[
            "Happy-path behavior",
            "Validation and malformed-input cases",
            "Failure and timeout handling",
            "Authorization and tool-policy checks",
        ],
        guardrails=[
            "No direct shell or filesystem access",
            "No secret or credential exposure",
            "Repository writes require an approved patch",
            "Production deployment remains a separately gated action",
        ],
    )


def developer_plan_dict(requirement: str) -> dict:
    return asdict(build_developer_plan(requirement))
