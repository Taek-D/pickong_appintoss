// /toss/unlink 콜백 통합 테스트 (Node 22 native test runner)
// DATABASE_URL 미설정 환경에서 sql=null no-op로 검증.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Hono } from 'hono';

// 환경변수는 라우트 모듈 import 전에 세팅 (verifyBasicAuth가 process.env 직접 참조)
process.env.TOSS_UNLINK_AUTH_USER = 'unlink_user';
process.env.TOSS_UNLINK_AUTH_PASS = 'unlink_pass';

const { tossCallbackRoutes } = await import('../src/routes/toss-callback');

const app = new Hono();
app.route('/toss', tossCallbackRoutes);

function basicAuthHeader(user: string, pass: string): string {
  return 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64');
}

async function callUnlink(opts: {
  auth?: string;
  body?: unknown;
}): Promise<{ status: number; json: unknown }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (opts.auth !== undefined) headers['Authorization'] = opts.auth;
  const res = await app.fetch(
    new Request('http://test/toss/unlink', {
      method: 'POST',
      headers,
      body: JSON.stringify(opts.body ?? {}),
    }),
  );
  let json: unknown = null;
  try { json = await res.json(); } catch { /* ignore */ }
  return { status: res.status, json };
}

test('unauthenticated request returns 401', async () => {
  const r = await callUnlink({ body: { userKey: 'u_1', referrer: 'UNLINK' } });
  assert.equal(r.status, 401);
  assert.deepEqual(r.json, { error_code: 'unauthorized' });
});

test('wrong password returns 401', async () => {
  const r = await callUnlink({
    auth: basicAuthHeader('unlink_user', 'wrong'),
    body: { userKey: 'u_1', referrer: 'UNLINK' },
  });
  assert.equal(r.status, 401);
});

test('non-Basic scheme returns 401', async () => {
  const r = await callUnlink({
    auth: 'Bearer abc',
    body: { userKey: 'u_1' },
  });
  assert.equal(r.status, 401);
});

test('missing userKey returns 400', async () => {
  const r = await callUnlink({
    auth: basicAuthHeader('unlink_user', 'unlink_pass'),
    body: { referrer: 'UNLINK' },
  });
  assert.equal(r.status, 400);
  assert.deepEqual(r.json, { error_code: 'invalid_body' });
});

test('invalid referrer returns 400', async () => {
  const r = await callUnlink({
    auth: basicAuthHeader('unlink_user', 'unlink_pass'),
    body: { userKey: 'u_1', referrer: 'NOT_VALID' },
  });
  assert.equal(r.status, 400);
});

test('valid UNLINK with correct auth returns 200', async () => {
  const r = await callUnlink({
    auth: basicAuthHeader('unlink_user', 'unlink_pass'),
    body: { userKey: 'user_abc', referrer: 'UNLINK' },
  });
  assert.equal(r.status, 200);
  assert.deepEqual(r.json, { ok: true });
});

test('WITHDRAWAL_TERMS referrer accepted', async () => {
  const r = await callUnlink({
    auth: basicAuthHeader('unlink_user', 'unlink_pass'),
    body: { userKey: 'user_abc', referrer: 'WITHDRAWAL_TERMS' },
  });
  assert.equal(r.status, 200);
});

test('WITHDRAWAL_TOSS referrer accepted', async () => {
  const r = await callUnlink({
    auth: basicAuthHeader('unlink_user', 'unlink_pass'),
    body: { userKey: 'user_abc', referrer: 'WITHDRAWAL_TOSS' },
  });
  assert.equal(r.status, 200);
});

test('referrer is optional (omitted accepted)', async () => {
  const r = await callUnlink({
    auth: basicAuthHeader('unlink_user', 'unlink_pass'),
    body: { userKey: 'user_abc' },
  });
  assert.equal(r.status, 200);
});

test('env not configured rejects even valid Basic header', async () => {
  // 임시로 env 비우고 fresh import
  const orig = {
    user: process.env.TOSS_UNLINK_AUTH_USER,
    pass: process.env.TOSS_UNLINK_AUTH_PASS,
  };
  process.env.TOSS_UNLINK_AUTH_USER = '';
  process.env.TOSS_UNLINK_AUTH_PASS = '';
  try {
    const r = await callUnlink({
      auth: basicAuthHeader('unlink_user', 'unlink_pass'),
      body: { userKey: 'user_abc' },
    });
    assert.equal(r.status, 401);
  } finally {
    process.env.TOSS_UNLINK_AUTH_USER = orig.user;
    process.env.TOSS_UNLINK_AUTH_PASS = orig.pass;
  }
});
