// S-ONB — 풀구현은 01-02 plan에서, 여기는 라우터 동작 확인용 스켈레톤
import { useNavigate } from 'react-router-dom';
import { BottomCTA } from '@/components/BottomCTA';
import { onboarding } from '@/lib/storage';

export function Onboarding(): JSX.Element {
  const nav = useNavigate();
  const start = async (): Promise<void> => {
    await onboarding.markCompleted();
    nav('/login');
  };
  return (
    <div className="safe-area flex h-full flex-col items-center justify-center p-6 text-center">
      <h1 className="text-[28px] font-bold text-[var(--color-text)]">픽콩</h1>
      <p className="mt-2 text-[var(--color-text-muted)]">오늘의 귀여움, 하나 픽</p>
      <p className="mt-8 text-[14px] text-[var(--color-text-muted)]">
        (Onboarding 슬라이드 3장은 01-02 plan에서 풀구현)
      </p>
      <BottomCTA onClick={start}>시작하기</BottomCTA>
    </div>
  );
}
