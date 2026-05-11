// 앱인토스 토스 로그인 mTLS 클라이언트
// 공식 명세: https://developers-apps-in-toss.toss.im/login/develop.md
// 인증 방식: mTLS 클라이언트 인증서만. client_id/secret 사용하지 않음.
// mTLS 인증서가 설정되지 않으면 mock mode (개발 환경 only)
import { Agent, fetch as undiciFetch } from 'undici';
import { readFileSync } from 'node:fs';

const TOSS_API_BASE = process.env.TOSS_API_BASE ?? 'https://apps-in-toss-api.toss.im';
const CERT_PATH = process.env.TOSS_MTLS_CERT_PATH ?? '';
const KEY_PATH = process.env.TOSS_MTLS_KEY_PATH ?? '';

let mtlsAgent: Agent | null = null;
let mockMode = false;

function getAgent(): Agent | null {
  if (mtlsAgent) return mtlsAgent;
  if (!CERT_PATH || !KEY_PATH) {
    if (!mockMode) {
      console.warn(
        '[toss-client] mTLS not configured (TOSS_MTLS_CERT_PATH / TOSS_MTLS_KEY_PATH). Using mock mode — 운영 빌드에서는 반드시 mTLS 인증서를 설정해야 합니다.',
      );
      mockMode = true;
    }
    return null;
  }
  try {
    const cert = readFileSync(CERT_PATH);
    const key = readFileSync(KEY_PATH);
    mtlsAgent = new Agent({
      connect: { cert, key, rejectUnauthorized: true },
    });
    return mtlsAgent;
  } catch (err) {
    console.error('[toss-client] failed to load mTLS cert/key:', err);
    mockMode = true;
    return null;
  }
}

export function isMockMode(): boolean {
  if (!mtlsAgent && !mockMode) getAgent();
  return mockMode;
}

// 공식 응답 wrapper
interface TossResultEnvelope<T> {
  resultType: 'SUCCESS' | 'FAIL';
  success?: T;
  error?: { errorCode: string; reason?: string } | string;
}

export interface TossTokenSuccess {
  tokenType: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  scope: string;
}

interface TossLoginMeSuccess {
  userKey: number;
  scope: string;
  agreedTerms: string[];
}

function unwrap<T>(payload: TossResultEnvelope<T>, opName: string): T {
  if (payload.resultType === 'SUCCESS' && payload.success) {
    return payload.success;
  }
  const err = payload.error;
  const errorCode =
    typeof err === 'string'
      ? err
      : err && typeof err === 'object'
      ? err.errorCode
      : 'unknown';
  throw new Error(`toss ${opName} failed: ${errorCode}`);
}

export async function generateOauth2Token(
  authorizationCode: string,
  referrer: string,
): Promise<TossTokenSuccess> {
  if (isMockMode()) {
    return {
      tokenType: 'Bearer',
      accessToken: 'mock_access_' + Date.now(),
      refreshToken: 'mock_refresh_' + Date.now(),
      expiresIn: 3600,
      scope: 'mock',
    };
  }
  const agent = getAgent();
  if (!agent) throw new Error('toss-client: no agent');
  const res = await undiciFetch(
    `${TOSS_API_BASE}/api-partner/v1/apps-in-toss/user/oauth2/generate-token`,
    {
      method: 'POST',
      dispatcher: agent,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authorizationCode, referrer }),
    },
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`toss generateOauth2Token http ${res.status}: ${text}`);
  }
  const json = (await res.json()) as TossResultEnvelope<TossTokenSuccess>;
  return unwrap(json, 'generateOauth2Token');
}

export async function refreshOauth2Token(refreshToken: string): Promise<TossTokenSuccess> {
  if (isMockMode()) {
    return {
      tokenType: 'Bearer',
      accessToken: 'mock_access_' + Date.now(),
      refreshToken,
      expiresIn: 3600,
      scope: 'mock',
    };
  }
  const agent = getAgent();
  if (!agent) throw new Error('toss-client: no agent');
  const res = await undiciFetch(
    `${TOSS_API_BASE}/api-partner/v1/apps-in-toss/user/oauth2/refresh-token`,
    {
      method: 'POST',
      dispatcher: agent,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    },
  );
  if (!res.ok) throw new Error(`toss refreshOauth2Token http ${res.status}`);
  const json = (await res.json()) as TossResultEnvelope<TossTokenSuccess>;
  return unwrap(json, 'refreshOauth2Token');
}

export async function loginMe(accessToken: string): Promise<{ user_key: string }> {
  if (isMockMode()) {
    return { user_key: 'mock-user-' + accessToken.slice(-8) };
  }
  const agent = getAgent();
  if (!agent) throw new Error('toss-client: no agent');
  const res = await undiciFetch(
    `${TOSS_API_BASE}/api-partner/v1/apps-in-toss/user/oauth2/login-me`,
    {
      method: 'GET',
      dispatcher: agent,
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  if (!res.ok) throw new Error(`toss loginMe http ${res.status}`);
  const json = (await res.json()) as TossResultEnvelope<TossLoginMeSuccess>;
  const success = unwrap(json, 'loginMe');
  return { user_key: String(success.userKey) };
}

export async function removeByUserKey(userKey: string): Promise<void> {
  if (isMockMode()) {
    console.info('[mock removeByUserKey]', userKey);
    return;
  }
  const agent = getAgent();
  if (!agent) throw new Error('toss-client: no agent');
  const numericUserKey = Number(userKey);
  if (!Number.isFinite(numericUserKey)) {
    throw new Error(`toss removeByUserKey: userKey is not numeric: ${userKey}`);
  }
  const res = await undiciFetch(
    `${TOSS_API_BASE}/api-partner/v1/apps-in-toss/user/oauth2/access/remove-by-user-key`,
    {
      method: 'POST',
      dispatcher: agent,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userKey: numericUserKey }),
    },
  );
  if (!res.ok) throw new Error(`toss removeByUserKey http ${res.status}`);
}
