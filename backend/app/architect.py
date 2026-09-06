from dataclasses import asdict, dataclass


@dataclass(frozen=True)
class ArchitecturePlan:
    summary: str
    architecture: list[str]
    components: list[str]
    risks: list[str]
    next_steps: list[str]


def build_architecture_plan(requirement: str) -> ArchitecturePlan:
    """Return a deterministic baseline plan; the LLM-backed planner will replace this in the AI phase."""
    requirement = requirement.strip()
    return ArchitecturePlan(
        summary=f"Design an incremental, testable system for: {requirement}",
        architecture=[
            "Next.js frontend for the operator experience",
            "FastAPI backend for APIs and orchestration",
            "PostgreSQL with pgvector for application and knowledge data",
            "Agent/tool boundary with least-privilege execution",
        ],
        components=[
            "API and authentication layer",
            "Agent orchestrator",
            "Tool registry and policy engine",
            "Persistent run and audit history",
            "Automated test and security gates",
        ],
        risks=[
            "Prompt or tool misuse",
            "Secrets exposure",
            "Unbounded agent execution",
            "Insufficient validation of generated changes",
        ],
        next_steps=[
            "Define typed agent contracts",
            "Add policy-controlled tool execution",
            "Connect the selected LLM provider",
            "Add evaluation and security test suites",
        ],
    )


def architecture_plan_dict(requirement: str) -> dict:
    return asdict(build_architecture_plan(requirement))
