// S-LOGIN — 토스 로그인 강제 (PRD §7.3, §16)
import { useEffect } from 'react';
import { BottomCTA } from '@/components/BottomCTA';
import { useTossLogin } from '@/lib/auth';
import { track } from '@/lib/analytics';
import { COPY } from '@shared/constants';

export function Login(): JSX.Element {
  const { start, loading } = useTossLogin();

  useEffect(() => {
    track('login_view');
  }, []);

  return (
    <div className="safe-area flex h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
        <div
          className="flex h-24 w-24 items-center justify-center rounded-3xl text-[56px]"
          style={{ background: 'var(--color-primary-soft)' }}
          aria-hidden
        >
          🌿
        </div>
        <h1 className="text-[24px] font-bold leading-snug">
          {COPY.login_headline}
        </h1>
        <p className="text-[14px] text-[var(--color-text-muted)]">
          {COPY.login_sub}
        </p>
      </div>

      <BottomCTA onClick={start} loading={loading} disabled={loading}>
        {COPY.login_cta}
      </BottomCTA>
    </div>
  );
}
