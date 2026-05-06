// S-LIST — 기록 목록 + 카테고리 필터 + 수정/삭제 시트 (PRD §7.15)
import { useEffect, useState } from 'react';
import { Top } from '@/components/Top';
import { BottomSheet } from '@/components/BottomSheet';
import { useItems } from '@/state/items';
import { track } from '@/lib/analytics';
import { toast } from '@/components/Toast';
import { CATEGORIES, COPY } from '@shared/constants';
import { cn } from '@/lib/cn';
import type { CategoryId, CuteItem } from '@shared/types';

export function List(): JSX.Element {
  const { items, remove } = useItems();
  const [filter, setFilter] = useState<CategoryId | 'all'>('all');
  const [actionTarget, setActionTarget] = useState<CuteItem | null>(null);

  useEffect(() => {
    track('list_view');
  }, []);

  const filtered = filter === 'all' ? items : items.filter((it) => it.category === filter);

  async function onDelete(): Promise<void> {
    if (!actionTarget) return;
    track('list_press_delete');
    try {
      await remove(actionTarget.id);
      track('list_delete_success');
      toast('지웠어요');
    } catch {
      toast(COPY.toast_save_fail);
    }
    setActionTarget(null);
  }

  return (
    <div className="safe-area flex h-full flex-col">
      <Top title="내 기록" />

      {/* 카테고리 필터 (가로 스크롤) */}
      <div className="overflow-x-auto px-4 py-3">
        <div className="flex gap-2">
          <FilterChip
            label={COPY.list_filter_all}
            active={filter === 'all'}
            onClick={() => setFilter('all')}
          />
          {CATEGORIES.map((cat) => (
            <FilterChip
              key={cat.id}
              label={`${cat.emoji} ${cat.label}`}
              active={filter === cat.id}
              onClick={() => setFilter(cat.id)}
            />
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          <p className="text-[14px] text-[var(--color-text-muted)]">아직 등록한 기록이 없어요.</p>
        </div>
      ) : (
        <ul className="flex-1 divide-y divide-[var(--color-border)] overflow-y-auto px-6">
          {filtered.map((it) => {
            const cat = CATEGORIES.find((c) => c.id === it.category);
            return (
              <li key={it.id} className="flex items-center gap-4 py-4">
                <span className="text-[28px]" aria-hidden>{it.emoji}</span>
                <div className="flex-1">
                  <p className="text-[14px]">{it.memo || `(${cat?.label} 메모 없음)`}</p>
                  <p className="mt-1 text-[12px] text-[var(--color-text-muted)]">
                    {new Date(it.created_at).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                    {it.amount > 0 && ` · ${it.amount.toLocaleString()}원`}
                  </p>
                </div>
                <button
                  onClick={() => setActionTarget(it)}
                  aria-label="더보기"
                  className="text-[20px] text-[var(--color-text-muted)]"
                >
                  ⋯
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <BottomSheet
        open={actionTarget !== null}
        onClose={() => setActionTarget(null)}
        title="이 콩을 어떻게 할까요?"
      >
        <p className="text-[14px] text-[var(--color-text-muted)]">{COPY.list_delete_confirm}</p>
        <div className="mt-4 flex flex-col gap-2 pb-4">
          <button
            onClick={onDelete}
            className="h-12 w-full rounded-2xl bg-[var(--color-error)] text-[16px] font-semibold text-white"
          >
            {COPY.list_delete}
          </button>
          <button
            onClick={() => setActionTarget(null)}
            className="h-12 w-full rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] text-[16px] font-semibold"
          >
            취소
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }): JSX.Element {
  return (
    <button
      onClick={onClick}
      className={cn(
        'shrink-0 rounded-full border px-3 py-2 text-[13px] transition',
        active
          ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-text)]'
          : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)]',
      )}
    >
      {label}
    </button>
  );
}
