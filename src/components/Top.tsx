// 상단 타이틀바 — 토스 NavigationBar 컨셉 (TDS Top 컴포넌트 wrapper)
// 자체 백버튼 금지 — Toss 기본 NavigationBar가 백버튼/홈버튼 제공 (granite.config.ts)
import { type ReactNode } from 'react';

interface TopProps {
  title?: string;
  left?: ReactNode;
  right?: ReactNode;
}

export function Top({ title, left, right }: TopProps): JSX.Element {
  return (
    <header
      className="sticky top-0 z-30 flex h-14 items-center justify-between bg-[var(--color-background)] px-4"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="flex w-12 justify-start">{left}</div>
      <h1 className="flex-1 text-center text-[16px] font-semibold">{title}</h1>
      <div className="flex w-12 justify-end">{right}</div>
    </header>
  );
}
