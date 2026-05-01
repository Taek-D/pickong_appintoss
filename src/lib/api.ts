// 백엔드 API 클라이언트 — fetch wrapper, 401 자동 핸들링
const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? '/api';

export class APIError extends Error {
  constructor(
    public status: number,
    public errorCode: string,
    public detail?: unknown,
  ) {
    super(`API ${status}: ${errorCode}`);
  }
}

let onUnauthenticated: (() => void) | null = null;

export function setUnauthenticatedHandler(fn: () => void): void {
  onUnauthenticated = fn;
}

export async function api<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });

  if (res.status === 401) {
    if (onUnauthenticated) onUnauthenticated();
    throw new APIError(401, 'unauthenticated');
  }

  if (!res.ok) {
    let body: unknown = null;
    try { body = await res.json(); } catch { /* noop */ }
    const errorCode =
      body && typeof body === 'object' && 'error_code' in body
        ? String((body as { error_code: unknown }).error_code)
        : 'unknown';
    throw new APIError(res.status, errorCode, body);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
