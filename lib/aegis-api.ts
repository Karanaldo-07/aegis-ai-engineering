export type ArchitecturePlan = {
  summary: string;
  architecture: string[];
  components: string[];
  risks: string[];
  next_steps: string[];
};

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000').replace(/\/$/, '');

export async function generateArchitecture(requirement: string): Promise<ArchitecturePlan> {
  const response = await fetch(`${API_BASE_URL}/api/v1/architect/plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requirement }),
  });

  if (!response.ok) {
    let detail = `Architecture API returned ${response.status}`;
    try {
      const payload = await response.json();
      if (typeof payload?.detail === 'string') detail = payload.detail;
    } catch {
      // Keep the status-based error when the API does not return JSON.
    }
    throw new Error(detail);
  }

  return response.json() as Promise<ArchitecturePlan>;
}
