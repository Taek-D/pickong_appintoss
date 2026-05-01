// Toast — 다크패턴 회피 (모달/바텀시트 아닌 가벼운 안내)
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { create } from 'zustand';

interface ToastState {
  message: string | null;
  show: (msg: string, ms?: number) => void;
  hide: () => void;
}

export const useToast = create<ToastState>((set) => ({
  message: null,
  show(msg) {
    set({ message: msg });
  },
  hide() {
    set({ message: null });
  },
}));

export function ToastHost(): JSX.Element | null {
  const { message, hide } = useToast();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        setVisible(false);
        setTimeout(hide, 200);
      }, 2400);
    } else {
      setVisible(false);
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [message, hide]);

  if (!message) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed left-1/2 top-[64px] z-50 -translate-x-1/2 rounded-xl bg-[var(--color-text)] px-4 py-3 text-[14px] text-white shadow-lg transition ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
      style={{ maxWidth: 'min(92vw, 480px)' }}
    >
      {message}
    </div>
  );
}

// 헬퍼
export function toast(message: string): void {
  useToast.getState().show(message);
}

export function ToastChild({ children }: { children: ReactNode }): JSX.Element {
  return <>{children}</>;
}
