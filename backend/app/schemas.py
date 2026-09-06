from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class HealthResponse(BaseModel):
    status: str
    service: str
    ai_mode: str


class ProjectCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    key: str = Field(min_length=2, max_length=120, pattern=r"^[a-z0-9-]+$")
    description: str = ""


class ProjectRead(ProjectCreate):
    id: int
    status: str
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class AgentRunCreate(BaseModel):
    project_key: str
    agent: str
    input_text: str = Field(min_length=1, max_length=10000)


class AgentRunRead(BaseModel):
    id: int
    project_key: str
    agent: str
    status: str
    input_text: str
    output_text: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
