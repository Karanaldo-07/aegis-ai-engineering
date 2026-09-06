# AEGIS Backend

FastAPI service for the AEGIS AI Engineering OS.

## Local development

1. Start PostgreSQL + pgvector from the repository root:
   `docker compose up -d postgres`
2. Create `backend/.env` from `backend/.env.example`.
3. Install dependencies:
   `python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt`
4. Start the API:
   `uvicorn app.main:app --reload --app-dir backend`
5. Open `/docs` on the API host for the interactive OpenAPI contract.

The default `AI_MODE=mock` deliberately requires no provider credentials. Real model access will be enabled in the next integration phase after the provider key is supplied.
