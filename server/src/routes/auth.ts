// /auth — 토스 로그인 강제 (PRD §5.7, §7.3)
import { Hono } from 'hono';
import { setCookie, deleteCookie } from 'hono/cookie';
import { z } from 'zod';
import { sql } from '../db';
import { generateOauth2Token, loginMe } from '../lib/toss-client';
import { seal, cookieName, cookieOptions } from '../lib/session-cookie';
import { requireAuth, getSession } from '../middleware/auth';

export const authRoutes = new Hono();

const ExchangeSchema = z.object({ code: z.string().min(1) });

authRoutes.post('/exchange', async (c) => {
  let body: { code: string };
  try {
    const json = await c.req.json();
    body = ExchangeSchema.parse(json);
  } catch {
    return c.json({ error_code: 'invalid_body' }, 400);
  }

  // 1. 토스 OAuth2 token 교환
  let token;
  try {
    token = await generateOauth2Token(body.code);
  } catch (err) {
    console.error('[auth/exchange] generateOauth2Token failed', err);
    return c.json({ error_code: 'toss_unavailable' }, 502);
  }

  // 2. user_key 조회
  let userInfo;
  try {
    userInfo = await loginMe(token.access_token);
  } catch (err) {
    console.error('[auth/exchange] loginMe failed', err);
    return c.json({ error_code: 'toss_unavailable' }, 502);
  }

  const user_key = userInfo.user_key;

  // 3. accounts upsert
  let nickname: string | null = null;
  let is_first_login = false;
  if (sql) {
    const rows = await sql<
      { nickname: string | null; created_at: Date; last_login_at: Date }[]
    >`
      INSERT INTO accounts (user_key, last_login_at, status)
      VALUES (${user_key}, NOW(), 'active')
      ON CONFLICT (user_key) DO UPDATE
        SET last_login_at = NOW(),
            status = CASE WHEN accounts.status = 'withdrawn' THEN 'active' ELSE accounts.status END
      RETURNING nickname, created_at, last_login_at
    `;
    const row = rows[0];
    if (row) {
      nickname = row.nickname;
      // is_first_login: created_at == last_login_at (10 ms 오차 허용)
      is_first_login = Math.abs(row.created_at.getTime() - row.last_login_at.getTime()) < 1000;
    }
  } else {
    // DB 없으면 mock: 항상 신규 처리
    is_first_login = true;
  }

  // 4. 세션 cookie 발급
  const sealed = seal(user_key);
  setCookie(c, cookieName(), sealed.value, cookieOptions());

  return c.json({ user_key, is_first_login, nickname });
});

authRoutes.get('/me', requireAuth(), async (c) => {
  const sess = getSession(c);
  let nickname: string | null = null;
  if (sql) {
    const rows = await sql<{ nickname: string | null; status: string }[]>`
      SELECT nickname, status FROM accounts WHERE user_key = ${sess.user_key}
    `;
    const row = rows[0];
    if (!row || row.status === 'withdrawn') {
      deleteCookie(c, cookieName(), { path: '/' });
      return c.json({ error_code: 'unauthenticated' }, 401);
    }
    nickname = row.nickname;
  }
  return c.json({ user_key: sess.user_key, nickname });
});

authRoutes.post('/logout', (c) => {
  deleteCookie(c, cookieName(), { path: '/' });
  return c.json({ ok: true });
});
