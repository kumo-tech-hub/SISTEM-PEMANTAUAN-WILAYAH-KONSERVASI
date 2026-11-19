export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export interface HealthResponse {
  status: "ok" | "degraded";
  service: string;
  database: "connected" | "disconnected";
  timestamp: string;
}

export async function fetchApiHealth(signal?: AbortSignal): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`, { signal });
  if (!response.ok) {
    throw new Error(`API health check failed (${response.status})`);
  }
  return response.json() as Promise<HealthResponse>;
}

