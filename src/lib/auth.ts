// 토스 로그인 훅 — appLogin → /auth/exchange → 세션 hydrate
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { appLogin } from './sdk';
import { api, APIError } from './api';
import { useSession } from '@/state/session';
import { track } from './analytics';
import { toast } from '@/components/Toast';
import { COPY } from '@shared/constants';
import type { AuthExchangeResponse, AuthMeResponse } from '@shared/types';

export function useTossLogin(): {
  start: () => Promise<void>;
  loading: boolean;
} {
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const [params] = useSearchParams();

  async function start(): Promise<void> {
    if (loading) return;
    setLoading(true);
    track('login_press_start', { entry_source: params.get('from') ?? 'direct' });
    try {
      const result = await appLogin();
      let exchangePayload: { code: string };
      if ('mock' in result && result.mock) {
        // 개발 mock: 백엔드도 mock mode일 때 임의 code 전달
        exchangePayload = { code: 'mock-code-' + Date.now() };
      } else if ('code' in result) {
        exchangePayload = { code: result.code };
      } else {
        throw new Error('appLogin returned unexpected payload');
      }

      const res = await api<AuthExchangeResponse>('/auth/exchange', {
        method: 'POST',
        body: JSON.stringify(exchangePayload),
      });

      await useSession.getState().setSession(res.user_key, res.nickname);
      track('login_success', {
        is_first_login: res.is_first_login,
        entry_source: params.get('from') ?? 'direct',
      });

      // 라우팅 분기 (PRD §6.2)
      const from = params.get('from');
      const next = params.get('next');
      if (!res.nickname) {
        nav('/nick' + (from === 'share' && next ? `?from=share&next=${encodeURIComponent(next)}` : ''));
      } else if (from === 'share' && next) {
        nav(decodeURIComponent(next));
      } else {
        nav('/');
      }
    } catch (err) {
      const code = err instanceof APIError ? err.errorCode : 'unknown';
      track('login_fail', { error_code: code });
      toast(COPY.toast_save_fail);
    } finally {
      setLoading(false);
    }
  }

  return { start, loading };
}

// 라우트 진입 시 cookie 세션 검증 + 401이면 자동 /login (바텀시트 금지, 토스트만)
export function useEnsureLoggedIn(): { checked: boolean } {
  const [checked, setChecked] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const me = await api<AuthMeResponse>('/auth/me');
        if (cancelled) return;
        await useSession.getState().setSession(me.user_key, me.nickname);
        setChecked(true);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof APIError && err.status === 401) {
          track('login_disconnect_detected', { screen: globalThis.location.pathname });
          toast(COPY.login_disconnect);
          nav('/login', { replace: true });
        } else {
          setChecked(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [nav]);

  return { checked };
}
