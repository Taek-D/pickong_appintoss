// 세션 cookie — HMAC-sealed (stateless), 7일 만료
import { createHmac, timingSafeEqual } from 'node:crypto';

const SECRET = process.env.SESSION_SECRET ?? 'dev_secret_change_me';
const COOKIE_NAME = 'pk_sess';
const MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7d

export interface SessionPayload {
  user_key: string;
  exp: number; // unix seconds
}

function b64url(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64url(s: string): Buffer {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
  return Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/') + pad, 'base64');
}

function sign(payload: string): string {
  return b64url(createHmac('sha256', SECRET).update(payload).digest());
}

export function seal(userKey: string): { value: string; maxAge: number } {
  const payload: SessionPayload = {
    user_key: userKey,
    exp: Math.floor(Date.now() / 1000) + MAX_AGE_SEC,
  };
  const body = b64url(Buffer.from(JSON.stringify(payload)));
  const sig = sign(body);
  return { value: `${body}.${sig}`, maxAge: MAX_AGE_SEC };
}

export function open(value: string | null | undefined): SessionPayload | null {
  if (!value) return null;
  const idx = value.lastIndexOf('.');
  if (idx < 0) return null;
  const body = value.slice(0, idx);
  const sig = value.slice(idx + 1);
  const expected = sign(body);
  try {
    const a = Buffer.from(sig, 'utf8');
    const b = Buffer.from(expected, 'utf8');
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    const payload = JSON.parse(fromB64url(body).toString('utf8')) as SessionPayload;
    if (payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function cookieName(): string {
  return COOKIE_NAME;
}

export function cookieOptions(): {
  path: string;
  httpOnly: boolean;
  sameSite: 'Lax';
  secure: boolean;
  maxAge: number;
} {
  return {
    path: '/',
    httpOnly: true,
    sameSite: 'Lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: MAX_AGE_SEC,
  };
}
