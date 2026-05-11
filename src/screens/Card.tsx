// S-CARD — 본인 월간 결과 카드 (PRD §7.11)
import { useEffect, useMemo, useState } from 'react';
import { Top } from '@/components/Top';
import { BottomCTAStack } from '@/components/BottomCTA';
import { CharacterIllustration } from '@/lib/character-illustration';
import { useItems } from '@/state/items';
import { useSession } from '@/state/session';
import { invokePickkong } from '@/services/supabaseClient';
import { track } from '@/lib/analytics';
import { toast } from '@/components/Toast';
import { Share } from './Share';
import {
  CATEGORIES,
  COPY,
  CHARACTER_LABELS,
  ymOf,
  amountBand,
} from '@shared/constants';
import type { CharacterType, CategoryId } from '@shared/types';

interface CardUpsertResponse {
  card_id: string;
  character_type: CharacterType;
  top_category: CategoryId;
}

export function Card(): JSX.Element {
  const { userKey, nickname } = useSession();
  const { items } = useItems();
  const summary = useMemo(() => useItems.getState().summary(), [items]);

  const [cardId, setCardId] = useState<string | null>(null);
  const [character, setCharacter] = useState<CharacterType>('sprout');
  const [topCat, setTopCat] = useState<CategoryId>('etc');
  const [shareOpen, setShareOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const ym = ymOf(new Date());
  const characterLabel = CHARACTER_LABELS[character] ?? '새싹콩 수집가';
  const topMeta = CATEGORIES.find((c) => c.id === topCat) ?? CATEGORIES[7]!;

  useEffect(() => {
    if (!userKey || !nickname) return;
    let cancelled = false;
    void (async () => {
      try {
        const { data: res, error } = await invokePickkong<CardUpsertResponse>('pickkong-cards', {
          action: 'upsert',
          user_key: userKey,
          yyyymm: ym,
          total_count: summary.total_count,
          total_amount: summary.total_amount,
          category_breakdown: summary.by_category,
          nickname_snapshot: nickname,
        });
        if (cancelled) return;
        if (error || !res || !res.card_id) {
          throw new Error(error?.message ?? 'card upsert failed');
        }
        setCardId(res.card_id);
        setCharacter(res.character_type);
        setTopCat(res.top_category);
        track('card_upsert_success', { card_id: res.card_id });
        track('card_view', {
          card_id: res.card_id,
          month: ym,
          top_category: res.top_category,
          character_type: res.character_type,
          count: summary.total_count,
          total_amount_band: amountBand(summary.total_amount),
        });
        track('card_view_expiry_notice_view', {
          card_id: res.card_id,
          copy_variant: 'owner',
        });
      } catch (err) {
        if (cancelled) return;
        const code = err instanceof Error ? err.message : 'unknown';
        track('card_upsert_fail', { error_code: code });
        toast(COPY.card_save_fail);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userKey, nickname, ym, summary.total_count, summary.total_amount, summary.by_category]);

  return (
    <div className="safe-area flex h-full flex-col pb-40">
      <Top title="" />

      <div className="flex flex-1 flex-col items-center px-6">
        <p className="mt-2 text-[14px] text-[var(--color-text-muted)]">
          {nickname}
        </p>

        <div className="mt-6">
          <CharacterIllustration type={character} size={180} />
        </div>

        <h1 className="mt-6 text-[24px] font-bold">{characterLabel}</h1>

        <div className="mt-4 flex flex-col items-center gap-1 text-[14px] text-[var(--color-text-muted)]">
          <span>이번 달 {summary.total_count}콩 · 최애 {topMeta.label}</span>
          {summary.total_amount > 0 && (
            <span>{summary.total_amount.toLocaleString()}원의 행복</span>
          )}
        </div>

        {/* 8칸 미리보기 */}
        <div className="mt-6 grid w-full max-w-[280px] grid-cols-4 gap-2">
          {CATEGORIES.map((cat) => {
            const c = (summary.by_category[cat.id] ?? 0) > 0;
            return (
              <div
                key={cat.id}
                className="flex aspect-square items-center justify-center rounded-xl text-[20px]"
                style={{
                  background: c ? cat.color : 'transparent',
                  border: c ? 'none' : '2px dashed var(--color-border)',
                  opacity: c ? 1 : 0.5,
                }}
                aria-hidden
              >
                {c ? cat.emoji : '·'}
              </div>
            );
          })}
        </div>

        {/* 본인 카피 — 매번 노출 */}
        <p className="mt-8 text-[12px] text-[var(--color-text-muted)]">
          {COPY.card_expiry_owner}
        </p>
      </div>

      <BottomCTAStack>
        <button
          onClick={() => setShareOpen(true)}
          disabled={loading || !cardId}
          className="h-14 w-full rounded-2xl border-2 border-[var(--color-primary)] bg-[var(--color-surface)] text-[16px] font-semibold text-[var(--color-primary)] disabled:opacity-50"
        >
          {COPY.card_save_image}
        </button>
        <button
          onClick={() => {
            track('card_press_share', { card_id: cardId });
            setShareOpen(true);
          }}
          disabled={loading || !cardId}
          className="h-14 w-full rounded-2xl bg-[var(--color-primary)] text-[16px] font-semibold text-[var(--color-on-primary)] disabled:opacity-50"
        >
          {COPY.card_share_button}
        </button>
      </BottomCTAStack>

      {cardId && nickname && (
        <Share
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          cardId={cardId}
          nickname={nickname}
          character={character}
          characterLabel={characterLabel}
          topCategoryLabel={topMeta.label}
          totalCount={summary.total_count}
          totalAmount={summary.total_amount}
        />
      )}
    </div>
  );
}
