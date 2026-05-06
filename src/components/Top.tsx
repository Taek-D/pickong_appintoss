// 페이지 제목 영역 — 토스 NavigationBar 하위에 위치하는 제목 wrapper
// 자체 백버튼/닫기/햄버거 금지 — Toss 기본 NavigationBar가 back/home 제공 (granite.config.ts)
// left slot은 브랜드 텍스트/스텝 인디케이터 등 비-네비게이션 용도로만 사용
import { type ReactNode } from 'react';

interface TopProps {
  title?: string;
  left?: ReactNode;
  right?: ReactNode;
}

export function Top({ title, left, right }: TopProps): JSX.Element {
  return (
    <div
      role="presentation"
      className="sticky top-0 z-30 flex h-14 items-center justify-between bg-[var(--color-background)] px-4"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="flex w-12 justify-start">{left}</div>
      <h1 className="flex-1 text-center text-[16px] font-semibold">{title}</h1>
      <div className="flex w-12 justify-end">{right}</div>
    </div>
  );
}
