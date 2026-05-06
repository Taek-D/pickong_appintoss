// S-NICK-EDIT — 닉네임 변경 (PRD §7.5)
// Nickname.tsx 패턴 재사용 (PATCH 사용 + 현재 달 active 카드 nickname_snapshot 동기화)
import { useEffect, useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Top } from '@/components/Top';
import { BottomCTAStack } from '@/components/BottomCTA';
import { toast } from '@/components/Toast';
import { api, APIError } from '@/lib/api';
import { useSession } from '@/state/session';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/cn';
import {
  RECOMMENDED_NICKNAMES,
  NICKNAME_MAX_LEN,
  NICKNAME_REGEX,
  JAMO_ONLY_REGEX,
  COPY,
} from '@shared/constants';
import type { NicknameSuccess, NicknameFailure, NicknameErrorCode } from '@shared/types';

const TOAST_BY_CODE: Record<NicknameErrorCode, string> = {
  length: COPY.nick_toast_length,
  blocked_char: COPY.nick_toast_blocked_char,
  jamo_only: COPY.nick_toast_jamo,
  forbidden: COPY.nick_toast_forbidden,
  network: COPY.toast_network,
};

function sanitize(raw: string): { cleaned: string; reasons: Set<string> } {
  const reasons = new Set<string>();
  let cleaned = '';
  for (const ch of Array.from(raw)) {
    const code = ch.codePointAt(0) ?? 0;
    if (code > 0xffff) { reasons.add('emoji'); continue; }
    if (/^[가-힣A-Za-z0-9]$/.test(ch)) cleaned += ch;
    else if (/\s/.test(ch)) reasons.add('space');
    else if (/[ㄱ-ㅎㅏ-ㅣ]/.test(ch)) reasons.add('jamo_only');
    else reasons.add('special_char');
  }
  return { cleaned, reasons };
}

export function NickEdit(): JSX.Element {
  const nav = useNavigate();
  const { nickname, setNickname } = useSession();
  const [value, setValue] = useState(nickname ?? '');
  const [usedSuggestion, setUsedSuggestion] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    track('nickedit_view');
  }, []);

  function onChange(e: ChangeEvent<HTMLInputElement>): void {
    const raw = e.target.value;
    const { cleaned, reasons } = sanitize(raw);
    if (reasons.size > 0) for (const r of reasons) track('nickedit_input_blocked_char', { reason: r });
    if (cleaned.length > NICKNAME_MAX_LEN) {
      track('nickedit_input_blocked_char', { reason: 'length' });
      setValue(cleaned.slice(0, NICKNAME_MAX_LEN));
      return;
    }
    setValue(cleaned);
    setUsedSuggestion(false);
  }

  function pick(s: string): void {
    setValue(s);
    setUsedSuggestion(true);
    track('nickedit_press_suggest', { suggestion: s });
  }

  async function save(): Promise<void> {
    if (loading) return;
    track('nickedit_press_save', { length: value.length, used_suggestion: usedSuggestion });
    if (value.length === 0) { toast(TOAST_BY_CODE.length); return; }
    if (JAMO_ONLY_REGEX.test(value)) { toast(TOAST_BY_CODE.jamo_only); return; }
    if (!NICKNAME_REGEX.test(value)) { toast(TOAST_BY_CODE.blocked_char); return; }

    setLoading(true);
    try {
      const res = await api<NicknameSuccess | NicknameFailure>('/account/nickname', {
        method: 'PATCH',
        body: JSON.stringify({ nickname: value }),
      });
      if (res.ok === false) {
        toast(TOAST_BY_CODE[res.error_code] ?? COPY.toast_save_fail);
        track('set_change_nickname_fail', { error_code: res.error_code });
        return;
      }
      await setNickname(value);
      track('set_change_nickname_success');
      toast(COPY.nick_changed_toast);
      nav(-1);
    } catch (err) {
      const code: NicknameErrorCode =
        err instanceof APIError && err.errorCode in TOAST_BY_CODE
          ? (err.errorCode as NicknameErrorCode)
          : 'network';
      toast(TOAST_BY_CODE[code]);
      track('set_change_nickname_fail', { error_code: code });
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = value.length > 0 && value !== nickname && !loading;

  return (
    <div className="safe-area flex h-full flex-col">
      <Top title="" />
      <div className="flex flex-1 flex-col gap-6 px-6 pt-4">
        <div>
          <h1 className="text-[24px] font-bold">{COPY.nick_headline_edit}</h1>
          <p className="mt-2 text-[14px] text-[var(--color-text-muted)]">{COPY.nick_sub_edit}</p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 focus-within:border-[var(--color-primary)]">
          <input
            value={value}
            onChange={onChange}
            inputMode="text"
            maxLength={NICKNAME_MAX_LEN}
            className="flex-1 bg-transparent text-[18px] outline-none"
          />
          <span className="text-[12px] text-[var(--color-text-muted)] tabular-nums">
            {value.length}/{NICKNAME_MAX_LEN}
          </span>
        </div>
        <div>
          <p className="mb-3 text-[12px] text-[var(--color-text-muted)]">추천</p>
          <div className="flex flex-wrap gap-2">
            {RECOMMENDED_NICKNAMES.map((s) => (
              <button
                key={s}
                onClick={() => pick(s)}
                className={cn(
                  'rounded-full border px-4 py-2 text-[14px] transition active:scale-95',
                  value === s
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)]',
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
      <BottomCTAStack>
        <button
          onClick={() => nav(-1)}
          className="h-14 w-full rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] text-[16px] font-semibold text-[var(--color-text)]"
        >
          {COPY.nick_cta_cancel}
        </button>
        <button
          onClick={save}
          disabled={!canSubmit}
          className="h-14 w-full rounded-2xl bg-[var(--color-primary)] text-[16px] font-semibold text-white disabled:opacity-50"
        >
          {loading ? '...' : COPY.nick_cta_edit}
        </button>
      </BottomCTAStack>
    </div>
  );
}
