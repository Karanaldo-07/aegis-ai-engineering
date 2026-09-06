from dataclasses import dataclass
from typing import Callable, Any


@dataclass(frozen=True)
class ToolDefinition:
    name: str
    description: str
    risk: str
    handler: Callable[..., Any] | None = None


class ToolRegistry:
    """Explicit allow-list for agent capabilities.

    Tools are registered with a risk class so future agents can request
    capabilities without receiving ambient access to the host, filesystem,
    GitHub, or deployment credentials.
    """

    def __init__(self) -> None:
        self._tools: dict[str, ToolDefinition] = {}

    def register(self, tool: ToolDefinition) -> None:
        if tool.name in self._tools:
            raise ValueError(f"Tool already registered: {tool.name}")
        self._tools[tool.name] = tool

    def get(self, name: str) -> ToolDefinition:
        try:
            return self._tools[name]
        except KeyError as exc:
            raise KeyError(f"Unknown tool: {name}") from exc

    def list(self) -> list[ToolDefinition]:
        return list(self._tools.values())

    def allowed(self, name: str, maximum_risk: str = "low") -> bool:
        order = {"low": 0, "medium": 1, "high": 2, "critical": 3}
        tool = self.get(name)
        return order[tool.risk] <= order[maximum_risk]


registry = ToolRegistry()
registry.register(ToolDefinition("read_project", "Read project metadata and source context.", "low"))
registry.register(ToolDefinition("run_tests", "Run the project's automated tests in an isolated worker.", "medium"))
registry.register(ToolDefinition("create_patch", "Prepare a proposed source-code patch without applying it.", "medium"))
registry.register(ToolDefinition("github_write", "Create or update repository files after approval.", "high"))
registry.register(ToolDefinition("deploy", "Start a production deployment.", "critical"))
