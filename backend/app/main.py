from contextlib import asynccontextmanager
import httpx
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, text
from sqlalchemy.orm import Session
from .ai import AIService
from .architect import architecture_plan_dict
from .config import get_settings
from .database import Base, engine, get_db
from .developer import developer_plan_dict
from .llm import OpenAIResponsesClient
from .models import AgentRun, Project
from .schemas import (
    AgentRunCreate,
    AgentRunRead,
    ArchitecturePlanRead,
    ArchitectureRequest,
    DeveloperPlanRead,
    DeveloperRequest,
    HealthResponse,
    ProjectCreate,
    ProjectRead,
    ToolRead,
)
from .tools import registry

settings = get_settings()
ai = AIService()
llm = OpenAIResponsesClient()


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title=settings.app_name, version="0.4.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok", service=settings.app_name, ai_mode=settings.ai_mode)


@app.get(f"{settings.api_prefix}/health/db")
def database_health(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"status": "ok", "database": "reachable"}


@app.get(f"{settings.api_prefix}/projects", response_model=list[ProjectRead])
def list_projects(db: Session = Depends(get_db)):
    return list(db.scalars(select(Project).order_by(Project.updated_at.desc())).all())


@app.post(f"{settings.api_prefix}/projects", response_model=ProjectRead, status_code=201)
def create_project(payload: ProjectCreate, db: Session = Depends(get_db)):
    existing = db.scalar(select(Project).where(Project.key == payload.key))
    if existing:
        raise HTTPException(status_code=409, detail="Project key already exists")
    project = Project(**payload.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@app.post(f"{settings.api_prefix}/architect/plan", response_model=ArchitecturePlanRead)
async def create_architecture_plan(payload: ArchitectureRequest):
    if settings.ai_mode.lower() == "openai":
        try:
            return await llm.architecture_plan(payload.requirement)
        except (httpx.HTTPStatusError, httpx.HTTPError, RuntimeError, ValueError) as exc:
            raise HTTPException(status_code=502, detail=f"AI provider error: {exc}") from exc
    return architecture_plan_dict(payload.requirement)


@app.post(f"{settings.api_prefix}/developer/plan", response_model=DeveloperPlanRead)
def create_developer_plan(payload: DeveloperRequest):
    """Create a safe implementation proposal; it never writes to a repository."""
    return developer_plan_dict(payload.requirement)


@app.get(f"{settings.api_prefix}/tools", response_model=list[ToolRead])
def list_tools():
    return [ToolRead(name=t.name, description=t.description, risk=t.risk) for t in registry.list()]


@app.post(f"{settings.api_prefix}/agent-runs", response_model=AgentRunRead, status_code=201)
async def create_agent_run(payload: AgentRunCreate, db: Session = Depends(get_db)):
    project = db.scalar(select(Project).where(Project.key == payload.project_key))
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    run = AgentRun(**payload.model_dump(), status="running")
    db.add(run)
    db.commit()
    db.refresh(run)
    try:
        run.output_text = await ai.run(payload.agent, payload.input_text)
        run.status = "completed"
    except RuntimeError as exc:
        run.output_text = str(exc)
        run.status = "blocked"
    db.commit()
    db.refresh(run)
    return run


@app.get(f"{settings.api_prefix}/agent-runs", response_model=list[AgentRunRead])
def list_agent_runs(db: Session = Depends(get_db)):
    return list(db.scalars(select(AgentRun).order_by(AgentRun.created_at.desc()).limit(50)).all())
