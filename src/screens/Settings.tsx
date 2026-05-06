// S-SET — 설정·정보 (PRD §7.16)
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Top } from '@/components/Top';
import { BottomSheet } from '@/components/BottomSheet';
import { api, APIError } from '@/lib/api';
import { useSession } from '@/state/session';
import { useItems } from '@/state/items';
import { track } from '@/lib/analytics';
import { toast } from '@/components/Toast';
import { COPY } from '@shared/constants';

export function Settings(): JSX.Element {
  const nav = useNavigate();
  const { nickname, clear } = useSession();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    track('set_view');
  }, []);

  async function onDelete(): Promise<void> {
    if (deleting) return;
    setDeleting(true);
    track('set_account_delete_confirm');
    try {
      await api('/account', { method: 'DELETE' });
      await useItems.getState().clear();
      await clear();
      track('set_account_delete_success');
      nav('/onb', { replace: true });
    } catch (err) {
      const code = err instanceof APIError ? err.errorCode : 'unknown';
      track('set_account_delete_fail', { error_code: code });
      toast(COPY.set_account_delete_fail);
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  }

  function row(label: string, onClick: () => void, danger = false): JSX.Element {
    return (
      <button
        onClick={onClick}
        className={`flex w-full items-center justify-between border-b border-[var(--color-border)] px-6 py-5 text-left active:bg-[var(--color-primary-soft)]/40 ${
          danger ? 'text-[var(--color-error)]' : 'text-[var(--color-text)]'
        }`}
      >
        <span className="text-[16px]">{label}</span>
        <span className="text-[14px] text-[var(--color-text-muted)]">›</span>
      </button>
    );
  }

  return (
    <div className="safe-area flex h-full flex-col">
      <Top title="설정" />
      <div className="px-6 pt-4">
        <p className="text-[14px] text-[var(--color-text-muted)]">
          {nickname ? `${nickname}님` : ''}
        </p>
      </div>

      <div className="mt-2 flex-1">
        {row(COPY.set_change_nickname, () => {
          track('set_press_change_nickname' as never);
          nav('/set/nickname');
        })}
        {row('내 기록 보기', () => nav('/list'))}
        {row(COPY.set_account_delete, () => {
          track('set_press_account_delete');
          setConfirmOpen(true);
        }, true)}
      </div>

      <div className="px-6 pb-8 text-[12px] text-[var(--color-text-muted)]">
        <p>{COPY.set_version}: 0.1.0 (Phase 2 dev)</p>
        <p className="mt-1">{COPY.set_about}: 픽콩 팀</p>
      </div>

      <BottomSheet open={confirmOpen} onClose={() => setConfirmOpen(false)} title="잠시만요">
        <p className="text-[14px] text-[var(--color-text)]">{COPY.set_account_delete_confirm}</p>
        <div className="mt-4 flex flex-col gap-2 pb-4">
          <button
            onClick={onDelete}
            disabled={deleting}
            className="h-12 w-full rounded-2xl bg-[var(--color-error)] text-[16px] font-semibold text-white disabled:opacity-50"
          >
            {deleting ? '처리 중...' : '데이터 삭제'}
          </button>
          <button
            onClick={() => setConfirmOpen(false)}
            disabled={deleting}
            className="h-12 w-full rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] text-[16px] font-semibold text-[var(--color-text)]"
          >
            취소
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}
