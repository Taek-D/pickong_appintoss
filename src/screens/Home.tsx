// S-HOME — 메인 도감 (PRD §7.6)
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Top } from '@/components/Top';
import { BottomCTA } from '@/components/BottomCTA';
import { useItems } from '@/state/items';
import { useSession } from '@/state/session';
import { track } from '@/lib/analytics';
import { adCap } from '@/lib/storage';
import { CATEGORIES, COPY, CARD_UNLOCK_THRESHOLD, ymOf } from '@shared/constants';
import { cn } from '@/lib/cn';

export function Home(): JSX.Element {
  const nav = useNavigate();
  const { items, loaded } = useItems();
  const { userKey, nickname } = useSession();
  const [adAlreadyShown, setAdAlreadyShown] = useState(false);

  const summary = useMemo(() => useItems.getState().summary(), [items]);
  const collection = Math.round(summary.collection_rate * 100);
  const weekLeft = Math.max(0, summary.weekly_target - summary.this_week_count);

  useEffect(() => {
    track('home_view', {
      is_first_visit: !loaded || items.length === 0,
      collected_count: summary.total_count,
      month: summary.ym,
    });
    if (userKey) {
      const yyyymm = ymOf(new Date()).replace('-', '');
      void adCap.wasShown(userKey, yyyymm).then(setAdAlreadyShown);
    }
  }, [loaded, items.length, summary.total_count, summary.ym, userKey]);

  const cardEligible = summary.total_count >= CARD_UNLOCK_THRESHOLD;

  function onAdd(): void {
    track('home_press_add');
    nav('/add');
  }
  function onCategory(catId: string): void {
    track('home_press_category', { category: catId });
    nav(`/cat/${catId}`);
  }
  function onCardUnlock(): void {
    track('home_press_card_unlock', {
      eligible: cardEligible,
      ad_eligible: cardEligible && !adAlreadyShown,
    });
    if (!cardEligible) return;
    if (adAlreadyShown) {
      nav('/card/own');
    } else {
      nav('/ad/card');
    }
  }

  return (
    <div className="safe-area flex h-full flex-col pb-32">
      <Top
        title=""
        left={
          <span className="text-[18px] font-bold text-[var(--color-text)]">픽콩</span>
        }
        right={
          <button
            onClick={() => nav('/set')}
            aria-label="설정"
            className="text-[20px] text-[var(--color-text-muted)]"
          >
            ⋯
          </button>
        }
      />

      <div className="px-6 pt-2">
        <p className="text-[14px] text-[var(--color-text-muted)]">
          {nickname ? `${nickname}님,` : '안녕하세요!'}
        </p>
        <h1 className="mt-1 text-[24px] font-bold">{COPY.collection_rate(collection)}</h1>

        {/* 진행 게이지 */}
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[var(--color-border)]">
          <div
            className="h-full rounded-full bg-[var(--color-primary)] transition-all"
            style={{ width: `${collection}%` }}
          />
        </div>

        {/* 주간 진행 */}
        <p className="mt-3 text-[13px] text-[var(--color-text-muted)]">
          {COPY.weekly_progress(weekLeft)}
        </p>
      </div>

      {/* 도감 그리드 8칸 */}
      <div className="px-6 pt-6">
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((cat) => {
            const count = summary.by_category[cat.id] ?? 0;
            const filled = count > 0;
            return (
              <button
                key={cat.id}
                onClick={() => onCategory(cat.id)}
                className={cn(
                  'flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border-2 p-3 text-center transition active:scale-[0.97]',
                  filled
                    ? 'border-transparent shadow-sm'
                    : 'border-dashed border-[var(--color-border)] bg-[var(--color-surface)]',
                )}
                style={filled ? { background: cat.color } : undefined}
              >
                <span className="text-[40px]" aria-hidden>
                  {filled ? cat.emoji : '·'}
                </span>
                <span className="text-[14px] font-semibold text-[var(--color-text)]">
                  {cat.label}
                </span>
                {filled && (
                  <span className="rounded-full bg-white/70 px-2 py-0.5 text-[12px] font-medium tabular-nums">
                    {count}콩
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 카드 보기 버튼 (조건부) */}
      <div className="px-6 pt-6">
        <button
          onClick={onCardUnlock}
          disabled={!cardEligible}
          className={cn(
            'w-full rounded-2xl px-4 py-4 text-left transition',
            cardEligible
              ? 'bg-[var(--color-primary-soft)] text-[var(--color-text)]'
              : 'bg-[var(--color-border)]/40 text-[var(--color-text-muted)]',
          )}
        >
          <div className="text-[14px] font-semibold">이번 달 카드 보기</div>
          <div className="mt-1 text-[12px]">
            {cardEligible ? '월간 캐릭터를 만나러 가요' : COPY.card_lock_hint}
          </div>
        </button>
      </div>

      <BottomCTA onClick={onAdd}>{COPY.main_cta}</BottomCTA>
    </div>
  );
}
