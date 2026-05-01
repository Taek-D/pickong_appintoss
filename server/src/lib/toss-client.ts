// 토스 OAuth2 mTLS 클라이언트
// mTLS 인증서가 설정되지 않으면 mock mode (개발 환경)
import { Agent, fetch as undiciFetch } from 'undici';
import { readFileSync } from 'node:fs';

const TOSS_API_BASE = process.env.TOSS_API_BASE ?? 'https://oauth2.cert.toss.im';
const CLIENT_ID = process.env.TOSS_CLIENT_ID ?? '';
const CLIENT_SECRET = process.env.TOSS_CLIENT_SECRET ?? '';
const CERT_PATH = process.env.TOSS_MTLS_CERT_PATH ?? '';
const KEY_PATH = process.env.TOSS_MTLS_KEY_PATH ?? '';

let mtlsAgent: Agent | null = null;
let mockMode = false;

function getAgent(): Agent | null {
  if (mtlsAgent) return mtlsAgent;
  if (!CERT_PATH || !KEY_PATH || !CLIENT_ID || !CLIENT_SECRET) {
    if (!mockMode) {
      console.warn(
        '[toss-client] mTLS not configured (TOSS_MTLS_CERT_PATH / TOSS_MTLS_KEY_PATH / TOSS_CLIENT_ID / TOSS_CLIENT_SECRET). Using mock mode.',
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

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export async function generateOauth2Token(code: string): Promise<TokenResponse> {
  if (isMockMode()) {
    return {
      access_token: 'mock_access_' + Date.now(),
      refresh_token: 'mock_refresh_' + Date.now(),
      expires_in: 3600,
      token_type: 'Bearer',
    };
  }
  const agent = getAgent();
  if (!agent) throw new Error('toss-client: no agent');
  const res = await undiciFetch(`${TOSS_API_BASE}/oauth2/token`, {
    method: 'POST',
    dispatcher: agent,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`toss generateOauth2Token failed: ${res.status} ${text}`);
  }
  return (await res.json()) as TokenResponse;
}

export async function refreshOauth2Token(refreshToken: string): Promise<TokenResponse> {
  if (isMockMode()) {
    return {
      access_token: 'mock_access_' + Date.now(),
      refresh_token: refreshToken,
      expires_in: 3600,
      token_type: 'Bearer',
    };
  }
  const agent = getAgent();
  if (!agent) throw new Error('toss-client: no agent');
  const res = await undiciFetch(`${TOSS_API_BASE}/oauth2/token`, {
    method: 'POST',
    dispatcher: agent,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });
  if (!res.ok) throw new Error(`toss refreshOauth2Token failed: ${res.status}`);
  return (await res.json()) as TokenResponse;
}

export async function loginMe(accessToken: string): Promise<{ user_key: string }> {
  if (isMockMode()) {
    return { user_key: 'mock-user-' + accessToken.slice(-8) };
  }
  const agent = getAgent();
  if (!agent) throw new Error('toss-client: no agent');
  const res = await undiciFetch(`${TOSS_API_BASE}/oauth2/login/me`, {
    method: 'GET',
    dispatcher: agent,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`toss loginMe failed: ${res.status}`);
  return (await res.json()) as { user_key: string };
}

export async function removeByUserKey(userKey: string): Promise<void> {
  if (isMockMode()) {
    console.info('[mock removeByUserKey]', userKey);
    return;
  }
  const agent = getAgent();
  if (!agent) throw new Error('toss-client: no agent');
  const res = await undiciFetch(`${TOSS_API_BASE}/oauth2/account/remove`, {
    method: 'POST',
    dispatcher: agent,
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Id': CLIENT_ID,
      'X-Client-Secret': CLIENT_SECRET,
    },
    body: JSON.stringify({ user_key: userKey }),
  });
  if (!res.ok) throw new Error(`toss removeByUserKey failed: ${res.status}`);
}
