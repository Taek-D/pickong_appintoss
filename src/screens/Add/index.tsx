// S-ADD — 콩 등록 3단계 (PRD §7.7)
// step 1: 카테고리, step 2: 금액(선택), step 3: 이모지+메모
import { useEffect, useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Top } from '@/components/Top';
import { BottomCTA } from '@/components/BottomCTA';
import { useItems } from '@/state/items';
import { track } from '@/lib/analytics';
import { toast } from '@/components/Toast';
import {
  CATEGORIES,
  RECOMMENDED_EMOJIS,
  MEMO_MAX_LEN,
  MEMO_RECOMMENDED_LEN,
  COPY,
  amountBand,
} from '@shared/constants';
import { cn } from '@/lib/cn';
import type { CategoryId } from '@shared/types';

interface Draft {
  category: CategoryId | null;
  amount: number;
  emoji: string;
  memo: string;
}

const INITIAL: Draft = { category: null, amount: 0, emoji: '', memo: '' };

export function AddFlow(): JSX.Element {
  const nav = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [draft, setDraft] = useState<Draft>(INITIAL);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    track('add_step_view', { step });
  }, [step]);

  async function save(): Promise<void> {
    if (saving) return;
    if (!draft.category || !draft.emoji) return;
    setSaving(true);
    track('add_press_save');
    try {
      const it = await useItems.getState().add({
        user_key: '', // store가 currentUserKey 주입
        category: draft.category,
        amount: draft.amount,
        emoji: draft.emoji,
        memo: draft.memo.trim(),
      });
      track('add_save_success', {
        category: it.category,
        amount_band: amountBand(it.amount),
      });
      nav('/done', { state: { category: draft.category, total: useItems.getState().summary().total_count } });
    } catch (err) {
      console.error(err);
      track('add_save_fail', { error_code: 'storage' });
      toast(COPY.toast_save_fail);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="safe-area flex h-full flex-col">
      <Top
        title={`${step}/3`}
        left={
          <button
            onClick={() => (step === 1 ? nav(-1) : setStep((s) => (s - 1) as 1 | 2 | 3))}
            className="text-[18px] text-[var(--color-text)]"
            aria-label="뒤로"
          >
            ←
          </button>
        }
      />

      {step === 1 && (
        <Step1
          value={draft.category}
          onSelect={(c) => {
            setDraft((d) => ({ ...d, category: c }));
            track('add_select_category', { category: c });
            setStep(2);
          }}
        />
      )}
      {step === 2 && (
        <Step2
          value={draft.amount}
          onChange={(amount) => setDraft((d) => ({ ...d, amount }))}
          onNext={() => {
            track('add_input_amount', { amount_band: amountBand(draft.amount) });
            setStep(3);
          }}
        />
      )}
      {step === 3 && (
        <Step3
          emoji={draft.emoji}
          memo={draft.memo}
          onChangeEmoji={(emoji) => setDraft((d) => ({ ...d, emoji }))}
          onChangeMemo={(memo) => setDraft((d) => ({ ...d, memo }))}
          onSave={save}
          saving={saving}
        />
      )}
    </div>
  );
}

function Step1({
  value,
  onSelect,
}: {
  value: CategoryId | null;
  onSelect: (c: CategoryId) => void;
}): JSX.Element {
  return (
    <div className="flex flex-1 flex-col px-6 pt-2 pb-32">
      <h1 className="text-[24px] font-bold">{COPY.add_step1}</h1>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={cn(
              'flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border-2 p-3 text-center transition active:scale-95',
              value === cat.id
                ? 'border-[var(--color-primary)] shadow-sm'
                : 'border-transparent',
            )}
            style={{ background: cat.color }}
          >
            <span className="text-[40px]" aria-hidden>{cat.emoji}</span>
            <span className="text-[14px] font-semibold">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step2({
  value,
  onChange,
  onNext,
}: {
  value: number;
  onChange: (v: number) => void;
  onNext: () => void;
}): JSX.Element {
  function onInput(e: ChangeEvent<HTMLInputElement>): void {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const n = raw === '' ? 0 : Math.min(Number.parseInt(raw, 10), 99_999_999);
    onChange(Number.isFinite(n) ? n : 0);
  }

  return (
    <div className="flex flex-1 flex-col px-6 pt-2 pb-32">
      <h1 className="text-[24px] font-bold">{COPY.add_step2}</h1>
      <div className="mt-6 flex items-baseline gap-2 rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 focus-within:border-[var(--color-primary)]">
        <input
          inputMode="numeric"
          value={value === 0 ? '' : value.toString()}
          onChange={onInput}
          placeholder="0"
          className="flex-1 bg-transparent text-right text-[24px] tabular-nums outline-none"
        />
        <span className="text-[16px] text-[var(--color-text-muted)]">원</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {[1000, 3000, 5000, 10000, 30000].map((q) => (
          <button
            key={q}
            onClick={() => onChange(value + q)}
            className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[12px] tabular-nums"
          >
            +{q.toLocaleString()}
          </button>
        ))}
        <button
          onClick={() => onChange(0)}
          className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[12px] text-[var(--color-text-muted)]"
        >
          지우기
        </button>
      </div>
      <BottomCTA onClick={onNext}>다음</BottomCTA>
    </div>
  );
}

function Step3({
  emoji,
  memo,
  onChangeEmoji,
  onChangeMemo,
  onSave,
  saving,
}: {
  emoji: string;
  memo: string;
  onChangeEmoji: (s: string) => void;
  onChangeMemo: (s: string) => void;
  onSave: () => void;
  saving: boolean;
}): JSX.Element {
  function handleEmojiInput(e: ChangeEvent<HTMLInputElement>): void {
    const raw = e.target.value;
    const ch = Array.from(raw)[0] ?? '';
    onChangeEmoji(ch);
  }
  function handleMemoInput(e: ChangeEvent<HTMLTextAreaElement>): void {
    const raw = e.target.value.slice(0, MEMO_MAX_LEN);
    onChangeMemo(raw);
  }
  const memoOver = memo.length > MEMO_RECOMMENDED_LEN;
  const canSave = emoji.length > 0 && !saving;

  return (
    <div className="flex flex-1 flex-col px-6 pt-2 pb-40">
      <h1 className="text-[24px] font-bold">{COPY.add_step3}</h1>

      <div className="mt-6">
        <div className="flex items-center gap-3 rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4">
          <span className="text-[40px]" aria-hidden>{emoji || '?'}</span>
          <input
            value={emoji}
            onChange={handleEmojiInput}
            placeholder="이모지 1자"
            className="flex-1 bg-transparent text-[18px] outline-none placeholder:text-[var(--color-text-muted)]"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {RECOMMENDED_EMOJIS.map((e) => (
            <button
              key={e}
              onClick={() => onChangeEmoji(e)}
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-full border-2 text-[24px] transition active:scale-90',
                emoji === e
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)]'
                  : 'border-[var(--color-border)] bg-[var(--color-surface)]',
              )}
              aria-label={`이모지 ${e}`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <textarea
          value={memo}
          onChange={handleMemoInput}
          placeholder="간단한 메모 (선택)"
          className="h-24 w-full resize-none rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[16px] outline-none focus:border-[var(--color-primary)]"
        />
        <div className={cn('mt-1 text-right text-[12px]', memoOver ? 'text-[var(--color-error)]' : 'text-[var(--color-text-muted)]')}>
          {memo.length}/{MEMO_MAX_LEN}
        </div>
      </div>

      <BottomCTA onClick={onSave} loading={saving} disabled={!canSave}>
        {COPY.add_save_cta}
      </BottomCTA>
    </div>
  );
}
