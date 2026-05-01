// S-HOME — 풀구현은 01-05 plan에서
export function Home(): JSX.Element {
  return (
    <div className="safe-area flex h-full flex-col items-center justify-center p-6 text-center">
      <h1 className="text-[20px] font-semibold">메인 도감</h1>
      <p className="mt-2 text-[14px] text-[var(--color-text-muted)]">
        (S-HOME 풀구현은 01-05 plan)
      </p>
    </div>
  );
}
