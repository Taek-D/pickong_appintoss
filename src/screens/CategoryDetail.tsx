// S-CAT — 카테고리 상세 (PRD §7.10)
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Top } from '@/components/Top';
import { BottomCTA } from '@/components/BottomCTA';
import { useItems } from '@/state/items';
import { track } from '@/lib/analytics';
import { CATEGORIES, COPY } from '@shared/constants';
import type { CategoryId } from '@shared/types';

export function CategoryDetail(): JSX.Element {
  const nav = useNavigate();
  const { id } = useParams<{ id: string }>();
  const cat = CATEGORIES.find((c) => c.id === (id as CategoryId));
  const list = id ? useItems((s) => s.byCategory(id as CategoryId)) : [];

  useEffect(() => {
    if (cat) track('cat_view', { category: cat.id });
  }, [cat]);

  if (!cat) {
    return (
      <div className="safe-area flex h-full flex-col items-center justify-center p-6 text-center">
        <p>알 수 없는 카테고리예요.</p>
      </div>
    );
  }

  return (
    <div className="safe-area flex h-full flex-col pb-32">
      <Top
        title={cat.label}
        left={
          <button
            onClick={() => nav(-1)}
            aria-label="뒤로"
            className="text-[18px]"
          >
            ←
          </button>
        }
      />

      {list.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="text-[64px]" aria-hidden>{cat.emoji}</div>
          <p className="text-[16px] text-[var(--color-text-muted)]">
            {COPY.cat_empty}
          </p>
        </div>
      ) : (
        <ul className="flex-1 divide-y divide-[var(--color-border)] px-6">
          {list.map((it) => (
            <li key={it.id} className="flex items-center gap-4 py-4">
              <span className="text-[28px]" aria-hidden>{it.emoji}</span>
              <div className="flex-1">
                <p className="text-[14px] text-[var(--color-text)]">
                  {it.memo || '(메모 없음)'}
                </p>
                <p className="mt-1 text-[12px] text-[var(--color-text-muted)]">
                  {new Date(it.created_at).toLocaleDateString('ko-KR', {
                    month: 'long',
                    day: 'numeric',
                  })}
                  {it.amount > 0 && ` · ${it.amount.toLocaleString()}원`}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <BottomCTA
        onClick={() => {
          track('cat_press_add');
          nav('/add');
        }}
      >
        {COPY.main_cta}
      </BottomCTA>
    </div>
  );
}
