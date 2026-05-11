// 토스 로그인 — Phase 1: Supabase Edge Function (pickkong-auth-login) 호출
// 흐름: appLogin → {authorizationCode, referrer} → supabase.functions.invoke → 토큰 영속 → 라우팅
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { appLogin } from './sdk';
import { useSession } from '@/state/session';
import { track } from './analytics';
import { toast } from '@/components/Toast';
import { COPY } from '@shared/constants';
import { supabase } from '@/services/supabaseClient';
import {
  setAuthTokens,
  getAuthTokens,
  clearAuthTokens,
} from './authStorage';

interface PickkongAuthLoginSuccess {
  sessionToken: string;
  tossRefreshToken: string;
  userKey: string;
  isFirstLogin: boolean;
  nickname: string | null;
  expiresIn: number;
}

interface PickkongAuthLoginFailure {
  error: string;
  message?: string;
}

type PickkongAuthLoginResponse = PickkongAuthLoginSuccess | PickkongAuthLoginFailure;

function isFailure(r: PickkongAuthLoginResponse): r is PickkongAuthLoginFailure {
  return 'error' in r;
}

export function useTossLogin(): {
  start: () => Promise<void>;
  loading: boolean;
} {
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const [params] = useSearchParams();

  function routeAfterLogin(nickname: string | null): void {
    const from = params.get('from');
    const next = params.get('next');
    if (!nickname) {
      nav('/nick' + (from === 'share' && next ? `?from=share&next=${encodeURIComponent(next)}` : ''));
    } else if (from === 'share' && next) {
      nav(decodeURIComponent(next));
    } else {
      nav('/');
    }
  }

  async function start(): Promise<void> {
    if (loading) return;
    setLoading(true);
    track('login_press_start', { entry_source: params.get('from') ?? 'direct' });
    try {
      const result = await appLogin();

      // dev mock — supabase function 호출 우회 (mock authorizationCode 는 토스가 거절함)
      if ('mock' in result && result.mock) {
        const userKey = 'mock-' + result.authorizationCode.slice(-12);
        await setAuthTokens({
          userKey,
          nickname: null,
          sessionToken: 'mock',
          tossRefreshToken: 'mock',
          expiresAt: Date.now() + 3600 * 1000,
        });
        await useSession.getState().setSession(userKey, null);
        track('login_success', { is_first_login: true, entry_source: params.get('from') ?? 'direct' });
        routeAfterLogin(null);
        return;
      }

      const { data, error } = await supabase.functions.invoke<PickkongAuthLoginResponse>(
        'pickkong-auth-login',
        {
          body: {
            authorizationCode: result.authorizationCode,
            referrer: result.referrer,
          },
        },
      );

      if (error || !data || isFailure(data)) {
        const code = data && isFailure(data) ? data.error : (error?.message ?? 'unknown');
        track('login_fail', { error_code: code });
        if (code === 'toss_unavailable') toast(COPY.login_toss_unavailable);
        else if (error) toast(COPY.login_network_fail);
        else toast(COPY.toast_save_fail);
        return;
      }

      await setAuthTokens({
        userKey: data.userKey,
        nickname: data.nickname,
        sessionToken: data.sessionToken,
        tossRefreshToken: data.tossRefreshToken,
        expiresAt: Date.now() + data.expiresIn * 1000,
      });
      await useSession.getState().setSession(data.userKey, data.nickname);
      track('login_success', {
        is_first_login: data.isFirstLogin,
        entry_source: params.get('from') ?? 'direct',
      });
      routeAfterLogin(data.nickname);
    } catch (err) {
      console.error('[useTossLogin] error', err);
      track('login_fail', { error_code: 'unknown' });
      toast(COPY.login_network_fail);
    } finally {
      setLoading(false);
    }
  }

  return { start, loading };
}

// Phase 1: Storage 토큰 기반 세션 검증 (cookie 기반 /auth/me 폐기)
// Phase 2 에서 supabase JWT 검증/refresh 흐름 추가 예정.
export function useEnsureLoggedIn(): { checked: boolean } {
  const [checked, setChecked] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const tokens = await getAuthTokens();
        if (cancelled) return;
        if (!tokens || tokens.expiresAt < Date.now()) {
          if (tokens) await clearAuthTokens();
          track('login_disconnect_detected', { screen: globalThis.location.pathname });
          toast(COPY.login_disconnect);
          nav('/login', { replace: true });
          return;
        }
        await useSession.getState().setSession(tokens.userKey, tokens.nickname);
        setChecked(true);
      } catch {
        if (cancelled) return;
        setChecked(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [nav]);

  return { checked };
}
