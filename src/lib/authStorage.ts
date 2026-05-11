// 픽콩 인증 토큰 영속 (Phase 2)
// sessionToken: pickkong-auth-login function 이 발급한 픽콩 자체 JWT (PICKKONG_SESSION_SECRET HS256)
import { Storage } from './sdk';

const KEY_USER = 'pickkong:auth:user_key';
const KEY_NICK = 'pickkong:auth:nickname';
const KEY_SESSION_TOKEN = 'pickkong:auth:session_token';
const KEY_TOSS_REFRESH = 'pickkong:auth:toss_refresh';
const KEY_EXPIRES_AT = 'pickkong:auth:expires_at';

export interface PickkongAuthTokens {
  userKey: string;
  nickname: string | null;
  sessionToken: string;
  tossRefreshToken: string;
  expiresAt: number;
}

export async function setAuthTokens(t: PickkongAuthTokens): Promise<void> {
  await Storage.setItem(KEY_USER, t.userKey);
  await Storage.setItem(KEY_NICK, t.nickname ?? '');
  await Storage.setItem(KEY_SESSION_TOKEN, t.sessionToken);
  await Storage.setItem(KEY_TOSS_REFRESH, t.tossRefreshToken);
  await Storage.setItem(KEY_EXPIRES_AT, String(t.expiresAt));
}

export async function getAuthTokens(): Promise<PickkongAuthTokens | null> {
  const userKey = await Storage.getItem(KEY_USER);
  const sessionToken = await Storage.getItem(KEY_SESSION_TOKEN);
  if (!userKey || !sessionToken) return null;
  const nick = await Storage.getItem(KEY_NICK);
  const tossRefresh = await Storage.getItem(KEY_TOSS_REFRESH);
  const expStr = await Storage.getItem(KEY_EXPIRES_AT);
  return {
    userKey,
    nickname: nick && nick.length > 0 ? nick : null,
    sessionToken,
    tossRefreshToken: tossRefresh ?? '',
    expiresAt: Number(expStr) || 0,
  };
}

export async function getSessionToken(): Promise<string | null> {
  return await Storage.getItem(KEY_SESSION_TOKEN);
}

export async function clearAuthTokens(): Promise<void> {
  await Storage.removeItem(KEY_USER);
  await Storage.removeItem(KEY_NICK);
  await Storage.removeItem(KEY_SESSION_TOKEN);
  await Storage.removeItem(KEY_TOSS_REFRESH);
  await Storage.removeItem(KEY_EXPIRES_AT);
}

export async function updateNicknameInStorage(nickname: string | null): Promise<void> {
  await Storage.setItem(KEY_NICK, nickname ?? '');
}
