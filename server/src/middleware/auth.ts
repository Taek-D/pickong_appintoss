// 세션 cookie 파싱 + require-auth 미들웨어
import type { Context, MiddlewareHandler } from 'hono';
import { getCookie } from 'hono/cookie';
import { open, cookieName, type SessionPayload } from '../lib/session-cookie';

declare module 'hono' {
  interface ContextVariableMap {
    session: SessionPayload | null;
  }
}

export function sessionMiddleware(): MiddlewareHandler {
  return async (c, next) => {
    const raw = getCookie(c, cookieName());
    const sess = open(raw ?? null);
    c.set('session', sess);
    await next();
  };
}

export function requireAuth(): MiddlewareHandler {
  return async (c, next) => {
    const sess = c.get('session');
    if (!sess) {
      return c.json({ error_code: 'unauthenticated' }, 401);
    }
    await next();
  };
}

export function getSession(c: Context): SessionPayload {
  const sess = c.get('session');
  if (!sess) throw new Error('getSession: no session (use after requireAuth)');
  return sess;
}
