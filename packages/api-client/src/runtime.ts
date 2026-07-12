import type { HealthResponse } from "./generated/types.gen";

export async function getVersionedHealth(
  baseUrl: string,
): Promise<HealthResponse> {
  const response = await fetch(`${baseUrl}/api/v1/health`);

  if (!response.ok) {
    throw new Error("Versioned health check failed");
  }

  return response.json() as Promise<HealthResponse>;
}
