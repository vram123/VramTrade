const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:8000/api";

export interface AuthResponse {
  token: string;
  username: string;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      const firstError = Object.values(body).flat()[0];
      if (typeof firstError === "string") message = firstError;
    } catch {
      // response had no JSON body; fall back to the generic message
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export function register(username: string, password: string, email?: string): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/register/", {
    method: "POST",
    body: JSON.stringify({ username, password, email }),
  });
}

export function login(username: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/login/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function logout(token: string): Promise<void> {
  return request<void>("/auth/logout/", {
    method: "POST",
    headers: { Authorization: `Token ${token}` },
  });
}

export function deleteAccount(token: string): Promise<void> {
  return request<void>("/auth/delete/", {
    method: "DELETE",
    headers: { Authorization: `Token ${token}` },
  });
}
