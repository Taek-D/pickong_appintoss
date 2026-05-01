// /account — 닉네임 등록·변경, 회원 탈퇴 (Phase 2 풀구현)
import { Hono } from 'hono';
import { deleteCookie } from 'hono/cookie';
import { z } from 'zod';
import { sql } from '../db';
import { requireAuth, getSession } from '../middleware/auth';
import { cookieName } from '../lib/session-cookie';
import { checkNickname } from '../lib/forbidden';
import { removeByUserKey } from '../lib/toss-client';

export const accountRoutes = new Hono();

const NICKNAME_REGEX = /^[가-힣A-Za-z0-9]{1,10}$/;
const JAMO_ONLY_REGEX = /^[ㄱ-ㅎㅏ-ㅣ]+$/;
const NicknameSchema = z.object({ nickname: z.string().min(1).max(10) });

// POST /account/nickname — 최초 등록
accountRoutes.post('/nickname', requireAuth(), async (c) => {
  const sess = getSession(c);
  let body: { nickname: string };
  try {
    body = NicknameSchema.parse(await c.req.json());
  } catch {
    return c.json({ ok: false, error_code: 'length' as const }, 400);
  }

  const validation = validateNickname(body.nickname);
  if (!validation.ok) {
    return c.json({ ok: false, error_code: validation.error_code }, 400);
  }

  if (sql) {
    await sql`
      UPDATE accounts
      SET nickname = ${body.nickname},
          nickname_updated_at = NOW()
      WHERE user_key = ${sess.user_key}
    `;
  }

  return c.json({ ok: true });
});

// PATCH /account/nickname — 변경 (현재 달 active 카드 nickname_snapshot 동기화) - Phase 2 풀구현
accountRoutes.patch('/nickname', requireAuth(), async (c) => {
  const sess = getSession(c);
  let body: { nickname: string };
  try {
    body = NicknameSchema.parse(await c.req.json());
  } catch {
    return c.json({ ok: false, error_code: 'length' as const }, 400);
  }

  const validation = validateNickname(body.nickname);
  if (!validation.ok) {
    return c.json({ ok: false, error_code: validation.error_code }, 400);
  }

  if (sql) {
    const ym = new Date().toISOString().slice(0, 7); // YYYY-MM
    await sql.begin(async (tx) => {
      await tx`
        UPDATE accounts
        SET nickname = ${body.nickname},
            nickname_updated_at = NOW()
        WHERE user_key = ${sess.user_key}
      `;
      await tx`
        UPDATE monthly_cards
        SET nickname_snapshot = ${body.nickname},
            updated_at = NOW()
        WHERE user_key = ${sess.user_key}
          AND month = ${ym}
          AND card_status = 'active'
      `;
    });
  }

  return c.json({ ok: true });
});

// DELETE /account — 회원 탈퇴 (Phase 2)
accountRoutes.delete('/', requireAuth(), async (c) => {
  const sess = getSession(c);
  try {
    await removeByUserKey(sess.user_key);
  } catch (err) {
    console.error('[account/delete] removeByUserKey failed', err);
    return c.json({ error_code: 'toss_unavailable' }, 502);
  }
  if (sql) {
    await sql.begin(async (tx) => {
      await tx`DELETE FROM monthly_cards WHERE user_key = ${sess.user_key}`;
      await tx`
        UPDATE accounts
        SET status = 'withdrawn', withdrawn_at = NOW(), nickname = NULL
        WHERE user_key = ${sess.user_key}
      `;
    });
  }
  deleteCookie(c, cookieName(), { path: '/' });
  return c.json({ ok: true });
});

function validateNickname(input: string):
  | { ok: true }
  | { ok: false; error_code: 'length' | 'blocked_char' | 'jamo_only' | 'forbidden' } {
  if (input.length < 1 || input.length > 10) return { ok: false, error_code: 'length' };
  if (JAMO_ONLY_REGEX.test(input)) return { ok: false, error_code: 'jamo_only' };
  if (!NICKNAME_REGEX.test(input)) return { ok: false, error_code: 'blocked_char' };
  const f = checkNickname(input);
  if (!f.ok) return { ok: false, error_code: 'forbidden' };
  return { ok: true };
}
