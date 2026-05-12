// S-NICK — 닉네임 1회 입력 (PRD §5.8, §7.4, §16)
// - 한글 완성형 + 영문 + 숫자 1~10자
// - 자모 단독·이모지·특수문자·공백 입력 단계 자동 무시
// - 추천 칩 6개 고정 (1탭 입력)
// - 5종 에러 토스트
import { useEffect, useState, type ChangeEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BottomCTA } from '@/components/BottomCTA';
import { Top } from '@/components/Top';
import { toast } from '@/components/Toast';
import { invokePickkong } from '@/services/supabaseClient';
import { useSession } from '@/state/session';
import { clearAuthTokens } from '@/lib/authStorage';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/cn';
import {
  RECOMMENDED_NICKNAMES,
  NICKNAME_MAX_LEN,
  NICKNAME_REGEX,
  JAMO_ONLY_REGEX,
  COPY,
} from '@shared/constants';
import type { NicknameErrorCode } from '@shared/types';

// 입력 단계 자동 무시 — 한글 완성형(가-힣) + 영문 + 숫자만 keep
function sanitizeInput(raw: string): { cleaned: string; blockedReasons: Set<string> } {
  const reasons = new Set<string>();
  let cleaned = '';
  for (const ch of Array.from(raw)) {
    // Surrogate pair (이모지) 거른 후
    const code = ch.codePointAt(0) ?? 0;
    if (code > 0xffff) {
      reasons.add('emoji');
      continue;
    }
    if (/^[가-힣A-Za-z0-9]$/.test(ch)) {
      cleaned += ch;
    } else if (/\s/.test(ch)) {
      reasons.add('space');
    } else if (/[ㄱ-ㅎㅏ-ㅣ]/.test(ch)) {
      reasons.add('jamo_only');
    } else {
      reasons.add('special_char');
    }
  }
  return { cleaned, blockedReasons: reasons };
}

const TOAST_BY_CODE: Record<NicknameErrorCode, string> = {
  length: COPY.nick_toast_length,
  blocked_char: COPY.nick_toast_blocked_char,
  jamo_only: COPY.nick_toast_jamo,
  forbidden: COPY.nick_toast_forbidden,
  network: COPY.toast_network,
};

export function Nickname(): JSX.Element {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [value, setValue] = useState('');
  const [usedSuggestion, setUsedSuggestion] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    track('nick_view', { entry_source: params.get('from') ?? 'direct' });
  }, [params]);

  function onChange(e: ChangeEvent<HTMLInputElement>): void {
    // ⚠️ RN WebView 에서 composition 이벤트가 보장되지 않아 onChange 에서 sanitize 하면 한글 자모가
    // 매번 제거되어 IME 조합 자체가 깨짐. 차단은 onBlur / save() 시점의 NICKNAME_REGEX 로 위임.
    const raw = e.target.value;
    setValue(raw.slice(0, NICKNAME_MAX_LEN));
    setUsedSuggestion(false);
  }

  function onBlur(): void {
    // 포커스 해제 시점에 한 번 정제 (이모지/특수문자 제거, 자모는 그대로 두어 NICKNAME_REGEX 가 차단).
    const { cleaned, blockedReasons } = sanitizeInput(value);
    if (blockedReasons.size > 0) {
      for (const r of blockedReasons) track('nick_input_blocked_char', { reason: r });
    }
    if (cleaned !== value) setValue(cleaned.slice(0, NICKNAME_MAX_LEN));
  }

  function pickSuggestion(s: string): void {
    setValue(s);
    setUsedSuggestion(true);
    track('nick_press_suggest', { suggestion: s });
  }

  async function save(): Promise<void> {
    if (loading) return;
    track('nick_press_save', { length: value.length, used_suggestion: usedSuggestion });

    // 클라 1차 검증
    if (value.length === 0) {
      toast(TOAST_BY_CODE.length);
      track('nick_save_fail', { error_code: 'length' });
      return;
    }
    if (JAMO_ONLY_REGEX.test(value)) {
      toast(TOAST_BY_CODE.jamo_only);
      track('nick_save_fail', { error_code: 'jamo_only' });
      return;
    }
    if (!NICKNAME_REGEX.test(value)) {
      toast(TOAST_BY_CODE.blocked_char);
      track('nick_save_fail', { error_code: 'blocked_char' });
      return;
    }

    setLoading(true);
    try {
      const { error } = await invokePickkong<{ ok: true }>('pickkong-account', {
        action: 'set_nickname',
        nickname: value,
      });
      if (error) {
        console.warn('[set_nickname] failed', error);
        // 401 (토큰 만료/무효) — 토스 세션 끊김 안내 + 강제 재로그인
        if (error.status === 401 || error.error_code === 'unauthenticated') {
          await clearAuthTokens();
          toast(COPY.login_disconnect);
          track('nick_save_fail', { error_code: 'unauthenticated' });
          nav('/login', { replace: true });
          return;
        }
        const code: NicknameErrorCode =
          error.error_code in TOAST_BY_CODE ? (error.error_code as NicknameErrorCode) : 'network';
        toast(TOAST_BY_CODE[code]);
        track('nick_save_fail', { error_code: code });
        return;
      }
      await useSession.getState().setNickname(value);
      track('nick_save_success');

      // 라우팅 — 공유 링크 진입자라면 카드뷰로
      const from = params.get('from');
      const next = params.get('next');
      if (from === 'share' && next) {
        nav(decodeURIComponent(next), { replace: true });
      } else {
        nav('/', { replace: true });
      }
    } catch (err) {
      const code: NicknameErrorCode = 'network';
      toast(TOAST_BY_CODE[code]);
      track('nick_save_fail', { error_code: code, message: err instanceof Error ? err.message : 'unknown' });
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = value.length > 0 && !loading;

  return (
    <div className="flex h-full flex-col">
      <Top title="" />
      <div className="flex flex-1 flex-col gap-6 px-6 pt-4">
        <div>
          <h1 className="text-[24px] font-bold leading-snug">{COPY.nick_headline_first}</h1>
          <p className="mt-2 text-[14px] text-[var(--color-text-muted)]">
            {COPY.nick_sub_first}
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 focus-within:border-[var(--color-primary)]">
          <input
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            inputMode="text"
            maxLength={NICKNAME_MAX_LEN}
            placeholder="닉네임 입력"
            className="flex-1 bg-transparent text-[18px] outline-none placeholder:text-[var(--color-text-muted)]"
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
                onClick={() => pickSuggestion(s)}
                className={cn(
                  'rounded-full border px-4 py-2 text-[14px] transition active:scale-95',
                  value === s
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-text)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]',
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <BottomCTA onClick={save} loading={loading} disabled={!canSubmit}>
        {COPY.nick_cta_first}
      </BottomCTA>
    </div>
  );
}
