// S-ONB — 슬라이드 3장 + BottomCTA "시작하기"
// PRD §7.2 카피, 권한 0건, 진입 직후 인터럽트 없음
import { useState, useEffect, type TouchEvent, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomCTA } from '@/components/BottomCTA';
import { onboarding } from '@/lib/storage';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/cn';

const SLIDES = [
  { headline: '좋아한 것을 그냥 지나치기 아쉬울 때', emoji: '✨' },
  { headline: '문구·굿즈·간식을 도감 한 칸에 담아요', emoji: '📒' },
  { headline: '이번 달 내 취향이 캐릭터로 돌아와요', emoji: '🐰' },
];

export function Onboarding(): JSX.Element {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    track('onb_view_step', { step });
  }, [step]);

  const isLast = step === SLIDES.length - 1;

  function go(delta: number): void {
    setStep((s) => Math.max(0, Math.min(SLIDES.length - 1, s + delta)));
  }

  function onTouchStart(e: TouchEvent): void {
    setTouchStart(e.touches[0]?.clientX ?? null);
  }
  function onTouchEnd(e: TouchEvent): void {
    if (touchStart == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? touchStart) - touchStart;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    setTouchStart(null);
  }

  async function start(): Promise<void> {
    track('onb_press_start');
    await onboarding.markCompleted();
    nav('/login', { replace: true });
  }

  function next(_e: MouseEvent): void {
    if (isLast) {
      void start();
    } else {
      go(1);
    }
  }

  return (
    <div
      className="safe-area flex h-full flex-col"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
        <div className="text-[72px]" aria-hidden>
          {SLIDES[step]?.emoji}
        </div>
        <h1 className="text-[28px] font-bold leading-snug text-[var(--color-text)]">
          {SLIDES[step]?.headline}
        </h1>
        <p className="text-[14px] text-[var(--color-text-muted)]">
          오늘의 귀여움, 하나 픽
        </p>
      </div>

      <div className="flex justify-center gap-2 pb-6">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            aria-label={`슬라이드 ${i + 1}로 이동`}
            className={cn(
              'h-2 rounded-full transition-all',
              i === step
                ? 'w-8 bg-[var(--color-primary)]'
                : 'w-2 bg-[var(--color-border)]',
            )}
          />
        ))}
      </div>

      <BottomCTA onClick={next}>
        {isLast ? '시작하기' : '다음'}
      </BottomCTA>
    </div>
  );
}
