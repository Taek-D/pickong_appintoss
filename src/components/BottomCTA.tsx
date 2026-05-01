// BottomCTA — TDS-스타일 하단 고정 CTA
// PRD §10.12: 키보드 위 표시 (KeyboardAboveView 효과)
import { type ReactNode, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface BottomCTAProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  children: ReactNode;
}

export function BottomCTA({
  variant = 'primary',
  loading = false,
  disabled,
  className,
  children,
  ...rest
}: BottomCTAProps): JSX.Element {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 bg-[var(--color-background)] px-4 pb-[max(env(safe-area-inset-bottom),16px)] pt-3"
      style={{
        boxShadow: '0 -1px 0 var(--color-border)',
      }}
    >
      <button
        type="button"
        disabled={disabled || loading}
        className={cn(
          'h-14 w-full rounded-2xl text-[16px] font-semibold transition active:scale-[0.98]',
          variant === 'primary' &&
            'bg-[var(--color-primary)] text-white hover:opacity-95',
          variant === 'secondary' &&
            'bg-[var(--color-surface)] text-[var(--color-primary)] border-2 border-[var(--color-primary)]',
          (disabled || loading) && 'opacity-50',
          className,
        )}
        {...rest}
      >
        {loading ? '...' : children}
      </button>
    </div>
  );
}

// 두 개 CTA를 위 outline + 아래 primary로 쌓는 헬퍼
export function BottomCTAStack({ children }: { children: ReactNode }): JSX.Element {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex flex-col gap-2 bg-[var(--color-background)] px-4 pb-[max(env(safe-area-inset-bottom),16px)] pt-3"
      style={{ boxShadow: '0 -1px 0 var(--color-border)' }}
    >
      {children}
    </div>
  );
}
