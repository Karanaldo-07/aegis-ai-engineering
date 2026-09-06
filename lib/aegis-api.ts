export type ArchitecturePlan = {
  summary: string;
  architecture: string[];
  components: string[];
  risks: string[];
  next_steps: string[];
};

export type DeveloperPlan = {
  summary: string;
  implementation_steps: string[];
  files_to_change: string[];
  tests: string[];
  guardrails: string[];
};

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '');

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let detail = `AEGIS API returned ${response.status}`;
    try {
      const payload = await response.json();
      if (typeof payload?.detail === 'string') detail = payload.detail;
    } catch {
      // Keep the status-based error when the API does not return JSON.
    }
    throw new Error(detail);
  }

  return response.json() as Promise<T>;
}

export function generateArchitecture(requirement: string): Promise<ArchitecturePlan> {
  return postJson<ArchitecturePlan>('/api/v1/architect/plan', { requirement });
}

export function generateDeveloperPlan(requirement: string): Promise<DeveloperPlan> {
  return postJson<DeveloperPlan>('/api/v1/developer/plan', { requirement });
}
