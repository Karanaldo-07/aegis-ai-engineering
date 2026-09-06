# AEGIS — AI Engineering OS

AEGIS is an AI-native engineering control plane designed to take software from requirements through architecture, implementation, testing, security review and delivery with controlled agent autonomy.

## Current release

**v1.0 — complete interactive product shell**

- Command Center dashboard
- Projects workspace
- AI Agent control plane
- Security Center and policy gates
- Knowledge Base and retrieval telemetry
- GitHub integration workspace
- Activity / audit log
- Workspace settings and agent guardrails
- Responsive desktop/mobile UI
- Mock data and simulation interactions
- CI workflow for TypeScript validation and production builds

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verify

```bash
npm run typecheck
npm run build
```

## Architecture roadmap

The current release intentionally has no external AI credentials or production integrations. The next integration layers are planned as:

1. Next.js UI + authenticated workspace
2. FastAPI service layer
3. PostgreSQL + pgvector
4. LLM structured outputs, tool calling and streaming
5. Architect / Developer / Testing / Security / Knowledge agents
6. GitHub scoped tool access and pull-request workflows
7. Dockerized workers and CI/CD
8. Evaluation, observability, audit logs and production guardrails

AEGIS follows least privilege and human approval for production-impacting operations.
