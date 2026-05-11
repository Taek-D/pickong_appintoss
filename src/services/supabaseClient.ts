// 픽콩 Supabase 클라이언트 (Phase 2)
// - 모든 백엔드 호출은 Edge Function 통과 (직결 from() 사용 안 함)
// - X-Pickkong-Token 헤더로 PICKKONG_SESSION_SECRET 기반 자체 JWT 첨부
// - 4xx/5xx 응답 body 의 error_code 까지 그대로 반환 (supabase-js invoke 는 body 를 잃어서 직접 fetch)
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getSessionToken } from '@/lib/authStorage';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? '';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 미설정. supabase 호출이 모두 실패합니다.',
  );
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export interface InvokeError {
  message: string;
  status: number;
  error_code: string;
}

export async function invokePickkong<T>(
  name: string,
  body: unknown,
): Promise<{ data: T | null; error: InvokeError | null }> {
  const token = (await getSessionToken()) ?? '';
  const url = `${supabaseUrl}/functions/v1/${name}`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${supabaseAnonKey}`,
        apikey: supabaseAnonKey,
        ...(token ? { 'x-pickkong-token': token } : {}),
      },
      body: JSON.stringify(body),
    });
  } catch (e) {
    return { data: null, error: { message: (e as Error).message, status: 0, error_code: 'network' } };
  }
  let payload: unknown = null;
  try { payload = await res.json(); } catch { /* noop */ }
  if (!res.ok) {
    const error_code =
      payload && typeof payload === 'object' && 'error_code' in payload
        ? String((payload as { error_code: unknown }).error_code)
        : 'http_error';
    return { data: null, error: { message: error_code, status: res.status, error_code } };
  }
  return { data: payload as T, error: null };
}
