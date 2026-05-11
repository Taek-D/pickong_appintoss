// /toss — 앱인토스 콘솔 연결 끊기 / 회원 탈퇴 콜백 (release-attachment.md §13)
// 토스 측에서 사용자가 [연결 끊기], [회원 탈퇴]를 누르면 등록한 URL로 POST 호출.
// referrer:
//   - UNLINK            : 토스 마이페이지에서 미니앱 연결 해제
//   - WITHDRAWAL_TERMS  : 미니앱 자체 탈퇴 약관 동의 후 탈퇴
//   - WITHDRAWAL_TOSS   : 토스 회원 탈퇴
// 인증: Basic Auth (TOSS_UNLINK_AUTH_USER / TOSS_UNLINK_AUTH_PASS)
import { Hono } from 'hono';
import { timingSafeEqual } from 'node:crypto';
import { z } from 'zod';
import { sql } from '../db';

export const tossCallbackRoutes = new Hono();

const PayloadSchema = z.object({
  userKey: z.string().min(1),
  referrer: z
    .enum(['UNLINK', 'WITHDRAWAL_TERMS', 'WITHDRAWAL_TOSS'])
    .optional(),
});

function verifyBasicAuth(header: string | undefined): boolean {
  const expectedUser = process.env.TOSS_UNLINK_AUTH_USER ?? '';
  const expectedPass = process.env.TOSS_UNLINK_AUTH_PASS ?? '';
  if (!expectedUser || !expectedPass) return false;
  if (!header || !header.startsWith('Basic ')) return false;
  let decoded: string;
  try {
    decoded = Buffer.from(header.slice(6), 'base64').toString('utf8');
  } catch {
    return false;
  }
  const idx = decoded.indexOf(':');
  if (idx < 0) return false;
  const user = decoded.slice(0, idx);
  const pass = decoded.slice(idx + 1);
  const a = Buffer.from(`${user}:${pass}`, 'utf8');
  const b = Buffer.from(`${expectedUser}:${expectedPass}`, 'utf8');
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

tossCallbackRoutes.post('/unlink', async (c) => {
  if (!verifyBasicAuth(c.req.header('authorization'))) {
    return c.json({ error_code: 'unauthorized' }, 401);
  }

  let body: { userKey: string; referrer?: 'UNLINK' | 'WITHDRAWAL_TERMS' | 'WITHDRAWAL_TOSS' };
  try {
    body = PayloadSchema.parse(await c.req.json());
  } catch {
    return c.json({ error_code: 'invalid_body' }, 400);
  }

  if (sql) {
    try {
      await sql.begin(async (tx) => {
        await tx`DELETE FROM monthly_cards WHERE user_key = ${body.userKey}`;
        await tx`
          UPDATE accounts
          SET status = 'withdrawn',
              withdrawn_at = COALESCE(withdrawn_at, NOW()),
              nickname = NULL
          WHERE user_key = ${body.userKey}
        `;
      });
    } catch (err) {
      console.error('[toss-callback/unlink] db transaction failed', err);
      return c.json({ error_code: 'internal' }, 500);
    }
  } else {
    console.warn('[toss-callback/unlink] sql disabled, no-op for', body.userKey, body.referrer);
  }

  return c.json({ ok: true });
});
