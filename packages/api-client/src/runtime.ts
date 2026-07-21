import type { HealthResponse } from "./generated/types.gen";

const defaultApiUrl = "http://localhost:8000";

export type AuthUser = {
  id: string;
  email: string;
  created_at: string;
};

export type AuthResponse = {
  user: AuthUser;
};

export type AuthCredentials = {
  email: string;
  password: string;
};

export type UpdateEmailRequest = {
  email: string;
  password: string;
};

export type UpdatePasswordRequest = {
  current_password: string;
  new_password: string;
};

function getApiBaseUrl(baseUrl?: string): string {
  return baseUrl ?? process.env.NEXT_PUBLIC_API_URL ?? defaultApiUrl;
}

export async function getVersionedHealth(
  baseUrl: string,
): Promise<HealthResponse> {
  const response = await fetch(`${baseUrl}/api/v1/health`);

  if (!response.ok) {
    throw new Error("Versioned health check failed");
  }

  return response.json() as Promise<HealthResponse>;
}

export async function signUp(
  credentials: AuthCredentials,
  baseUrl?: string,
): Promise<AuthResponse> {
  return authRequest("/api/v1/auth/sign-up", credentials, baseUrl);
}

export async function signIn(
  credentials: AuthCredentials,
  baseUrl?: string,
): Promise<AuthResponse> {
  return authRequest("/api/v1/auth/sign-in", credentials, baseUrl);
}

export async function signOut(baseUrl?: string): Promise<void> {
  const response = await fetch(
    `${getApiBaseUrl(baseUrl)}/api/v1/auth/sign-out`,
    {
      credentials: "include",
      method: "POST",
    },
  );

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, "Sign out failed"));
  }
}

export async function getCurrentUser(baseUrl?: string): Promise<AuthUser> {
  const response = await fetch(`${getApiBaseUrl(baseUrl)}/api/v1/auth/me`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(response, "Unable to load current user"),
    );
  }

  return response.json() as Promise<AuthUser>;
}

export async function updateEmail(
  payload: UpdateEmailRequest,
  baseUrl?: string,
): Promise<AuthUser> {
  const response = await fetch(`${getApiBaseUrl(baseUrl)}/api/v1/auth/email`, {
    body: JSON.stringify(payload),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, "Email update failed"));
  }

  return response.json() as Promise<AuthUser>;
}

export async function updatePassword(
  payload: UpdatePasswordRequest,
  baseUrl?: string,
): Promise<void> {
  const response = await fetch(
    `${getApiBaseUrl(baseUrl)}/api/v1/auth/password`,
    {
      body: JSON.stringify(payload),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
    },
  );

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(response, "Password update failed"),
    );
  }
}

async function authRequest(
  path: string,
  credentials: AuthCredentials,
  baseUrl?: string,
): Promise<AuthResponse> {
  const response = await fetch(`${getApiBaseUrl(baseUrl)}${path}`, {
    body: JSON.stringify(credentials),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(response, "Authentication failed"),
    );
  }

  return response.json() as Promise<AuthResponse>;
}

async function getApiErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const body = (await response.json()) as { detail?: unknown };

    if (typeof body.detail === "string") {
      return body.detail;
    }
  } catch {
    return fallback;
  }

  return fallback;
}
