// S-CARD-VIEW — 공유 카드 열람 (PRD §7.13) — 4분기
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Top } from '@/components/Top';
import { BottomCTA } from '@/components/BottomCTA';
import { CharacterIllustration } from '@/lib/character-illustration';
import { api, APIError } from '@/lib/api';
import { track } from '@/lib/analytics';
import { COPY, CATEGORIES, CHARACTER_LABELS } from '@shared/constants';
import type { MonthlyCard } from '@shared/types';

type ViewState =
  | { kind: 'loading' }
  | { kind: 'owner_active'; card: MonthlyCard }
  | { kind: 'other_active'; card: MonthlyCard }
  | { kind: 'expired'; reason: 'expired' | 'past_month' | 'withdrawn' }
  | { kind: 'not_found' };

interface Resp {
  status: 'owner_active' | 'other_active' | 'expired' | 'not_found';
  is_owner: boolean;
  card?: MonthlyCard;
  reason?: 'expired' | 'past_month' | 'withdrawn';
}

export function CardView(): JSX.Element {
  const nav = useNavigate();
  const { hash } = useParams<{ hash: string }>();
  const [state, setState] = useState<ViewState>({ kind: 'loading' });

  useEffect(() => {
    if (!hash) {
      setState({ kind: 'not_found' });
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const r = await api<Resp>(`/cards/${encodeURIComponent(hash)}`);
        if (cancelled) return;
        if (r.status === 'owner_active' && r.card) {
          setState({ kind: 'owner_active', card: r.card });
          track('cardview_view', { card_id: hash, is_owner: true, card_month: r.card.month });
        } else if (r.status === 'other_active' && r.card) {
          setState({ kind: 'other_active', card: r.card });
          track('cardview_view', { card_id: hash, is_owner: false, card_month: r.card.month });
        } else if (r.status === 'expired') {
          setState({ kind: 'expired', reason: r.reason ?? 'expired' });
          track('cardview_expired_view', { card_id: hash, reason: r.reason ?? 'expired' });
        } else {
          setState({ kind: 'not_found' });
          track('cardview_load_fail', { error_code: 'not_found' });
        }
      } catch (err) {
        if (cancelled) return;
        const code = err instanceof APIError ? err.errorCode : 'unknown';
        if (code === 'not_found') {
          setState({ kind: 'not_found' });
        } else {
          setState({ kind: 'expired', reason: 'expired' });
        }
        track('cardview_load_fail', { error_code: code });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hash]);

  if (state.kind === 'loading') {
    return (
      <div className="safe-area flex h-full items-center justify-center text-[var(--color-text-muted)]">
        카드를 불러오는 중이에요...
      </div>
    );
  }

  // not_found
  if (state.kind === 'not_found') {
    return (
      <ExpiredOrMissing
        headline={COPY.card_not_found_headline}
        sub={COPY.card_expired_sub}
        cta={COPY.card_expired_cta}
        onCta={() => nav('/', { replace: true })}
      />
    );
  }

  // expired
  if (state.kind === 'expired') {
    return (
      <ExpiredOrMissing
        headline={COPY.card_expired_headline}
        sub={COPY.card_expired_sub}
        cta={COPY.card_expired_cta}
        onCta={() => nav('/', { replace: true })}
      />
    );
  }

  const { card } = state;
  const isOwner = state.kind === 'owner_active';
  const characterLabel = CHARACTER_LABELS[card.character_type] ?? '새싹콩 수집가';
  const topMeta = CATEGORIES.find((c) => c.id === card.top_category) ?? CATEGORIES[7]!;

  return (
    <div className="safe-area flex h-full flex-col pb-32">
      <Top
        title=""
        left={
          <button onClick={() => nav('/', { replace: true })} aria-label="닫기" className="text-[18px]">
            ✕
          </button>
        }
      />
      <div className="flex flex-1 flex-col items-center px-6">
        <p className="mt-2 text-[14px] text-[var(--color-text-muted)]">
          {card.nickname_snapshot}
        </p>
        <div className="mt-6">
          <CharacterIllustration type={card.character_type} size={180} />
        </div>
        <h1 className="mt-6 text-[20px] font-bold">
          {isOwner ? COPY.card_owner_header(characterLabel) : COPY.card_other_header(card.nickname_snapshot)}
        </h1>
        <p className="mt-3 text-[14px] text-[var(--color-text-muted)]">
          이번 달 {card.total_count}콩 · 최애 {topMeta.label}
        </p>
      </div>
      <BottomCTA
        onClick={() => {
          track('cardview_press_start_my_diagram', { card_id: hash });
          nav('/', { replace: true });
        }}
      >
        {isOwner ? COPY.card_owner_cta : COPY.card_other_cta}
      </BottomCTA>
    </div>
  );
}

function ExpiredOrMissing({
  headline,
  sub,
  cta,
  onCta,
}: {
  headline: string;
  sub: string;
  cta: string;
  onCta: () => void;
}): JSX.Element {
  return (
    <div className="safe-area flex h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="text-[72px]" aria-hidden>📅</div>
        <h1 className="text-[20px] font-bold">{headline}</h1>
        <p className="text-[14px] text-[var(--color-text-muted)]">{sub}</p>
      </div>
      <BottomCTA onClick={onCta}>{cta}</BottomCTA>
    </div>
  );
}
