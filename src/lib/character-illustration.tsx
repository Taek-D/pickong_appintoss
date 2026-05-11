// 캐릭터 일러스트 — Phase 2 SVG inline placeholder (8종 + 미니컷)
// Phase 3에서 디자이너 일러스트 교체 예정 (현재는 톤·정합성 확보용)
import type { CharacterType } from '@shared/types';

interface Props {
  type: CharacterType;
  size?: number;
}

const COLORS: Record<CharacterType, { bg: string; emoji: string }> = {
  goods_hamster:     { bg: '#FFC0CB', emoji: '🐹' },
  stationery_rabbit: { bg: '#FFE7A0', emoji: '🐰' },
  snack_cat:         { bg: '#FFD2A8', emoji: '🐱' },
  gift_bear:         { bg: '#FFB6D9', emoji: '🐻' },
  fan_squirrel:      { bg: '#C8B6E2', emoji: '🐿️' },
  pet_dog:           { bg: '#A8E6CF', emoji: '🐶' },
  taste_diverse:     { bg: '#B59CD9', emoji: '🧚' },
  sprout:            { bg: '#D6F0DA', emoji: '🌱' },
};

export function CharacterIllustration({ type, size = 180 }: Props): JSX.Element {
  const c = COLORS[type];
  return (
    <div
      className="relative flex items-center justify-center rounded-full"
      style={{ width: size, height: size, background: c.bg }}
      role="img"
      aria-label={type}
    >
      <span style={{ fontSize: size * 0.55 }} aria-hidden>
        {c.emoji}
      </span>
      {/* 라벤더 후광 */}
      <div
        className="pointer-events-none absolute -inset-2 -z-10 rounded-full opacity-40 blur-xl"
        style={{ background: '#B59CD9' }}
      />
    </div>
  );
}

// 도감 미니컷 (S-VIEWER-INTRO)
export function DiagramMiniCut({ size = 120 }: { size?: number }): JSX.Element {
  return (
    <div
      className="grid grid-cols-2 gap-1 rounded-2xl bg-[var(--color-card-chip)] p-3"
      style={{ width: size, height: size }}
      aria-hidden
    >
      {['🎁', '📒', '🍡', '💝'].map((e, i) => (
        <div
          key={i}
          className="flex items-center justify-center rounded-lg"
          style={{ background: ['#FFC0CB', '#FFE7A0', '#FFD2A8', '#FFB6D9'][i] }}
        >
          <span style={{ fontSize: size * 0.18 }}>{e}</span>
        </div>
      ))}
    </div>
  );
}
