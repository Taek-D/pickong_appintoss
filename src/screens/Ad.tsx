// S-AD — 전면 광고 인터루드 (PRD §7.9)
// 위치 A: S-HOME 카드 버튼 → S-AD → S-CARD
// 1.5s 타임아웃 + silent skip → 즉시 S-CARD
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/state/session';
import { showCardAdOnce } from '@/lib/ad';

export function AdInterlude(): JSX.Element {
  const nav = useNavigate();
  const { userKey } = useSession();

  useEffect(() => {
    if (!userKey) {
      nav('/login', { replace: true });
      return;
    }
    let mounted = true;
    void (async () => {
      await showCardAdOnce(userKey);
      if (mounted) nav('/card/own', { replace: true });
    })();
    return () => {
      mounted = false;
    };
  }, [userKey, nav]);

  return (
    <div className="safe-area flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-[var(--color-text-muted)]">
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--color-primary-soft)] border-t-[var(--color-primary)]"
          aria-hidden
        />
        <p className="text-[14px]">잠시만요...</p>
      </div>
    </div>
  );
}
