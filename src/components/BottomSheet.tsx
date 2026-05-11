// BottomSheet — 다크패턴 회피 모달 (사용자 의도 액션에만 사용)
import { type ReactNode, useEffect } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function BottomSheet({ open, onClose, title, children }: Props): JSX.Element | null {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent): void {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-[var(--color-scrim)]" onClick={onClose} />
      <div
        className="relative z-10 w-full max-w-md rounded-t-3xl bg-[var(--color-surface)] pb-[max(env(safe-area-inset-bottom),16px)] shadow-2xl"
        style={{ animation: 'slideUp 0.2s ease-out' }}
      >
        <div className="flex justify-center pt-3">
          <div className="h-1 w-10 rounded-full bg-[var(--color-border)]" />
        </div>
        {title && (
          <h2 className="px-6 pt-2 text-[16px] font-semibold text-[var(--color-text)]">
            {title}
          </h2>
        )}
        <div className="px-6 pt-2">{children}</div>
      </div>
      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </div>
  );
}
