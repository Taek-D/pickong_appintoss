// S-DONE — 기록 완료 (PRD §7.8, §16)
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Top } from '@/components/Top';
import { BottomCTAStack } from '@/components/BottomCTA';
import { useItems } from '@/state/items';
import { track } from '@/lib/analytics';
import { CATEGORIES, COPY } from '@shared/constants';
import type { CategoryId } from '@shared/types';

interface DoneState {
  category: CategoryId | null;
  total: number;
}

export function Done(): JSX.Element {
  const nav = useNavigate();
  const loc = useLocation();
  const state = (loc.state ?? {}) as Partial<DoneState>;
  const { items } = useItems();

  const summary = useItems.getState().summary();
  const total = state.total ?? summary.total_count;
  const cat = CATEGORIES.find((c) => c.id === state.category) ?? CATEGORIES[0]!;
  const ratePct = Math.round(summary.collection_rate * 100);

  useEffect(() => {
    track('done_view', {
      category: cat.id,
      total_in_month: total,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-full flex-col">
      <Top title="" />
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <div
          className="flex h-32 w-32 items-center justify-center rounded-3xl text-[72px]"
          style={{ background: cat.color }}
          aria-hidden
        >
          {cat.emoji}
        </div>
        <h1 className="text-[24px] font-bold leading-snug">
          {COPY.done_headline(cat.label)}
        </h1>
        <p className="text-[14px] text-[var(--color-text-muted)]">
          {COPY.done_sub(total, ratePct)}
        </p>
        <p className="text-[12px] text-[var(--color-text-muted)]">
          이번 달 등록한 콩 {items.length}개
        </p>
      </div>

      <BottomCTAStack>
        <button
          type="button"
          onClick={() => {
            track('done_press_more');
            nav('/add', { replace: true });
          }}
          className="h-14 w-full rounded-2xl border-2 border-[var(--color-primary)] bg-[var(--color-surface)] text-[16px] font-semibold text-[var(--color-primary)]"
        >
          {COPY.done_cta_more}
        </button>
        <button
          type="button"
          onClick={() => {
            track('done_press_home');
            nav('/', { replace: true });
          }}
          className="h-14 w-full rounded-2xl bg-[var(--color-primary)] text-[16px] font-semibold text-[var(--color-on-primary)]"
        >
          {COPY.done_cta_home}
        </button>
      </BottomCTAStack>
    </div>
  );
}
