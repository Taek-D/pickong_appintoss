// 월간 캐릭터 룰 (PRD §12) — 서버·클라 동일 로직
// 서버는 monthly_cards.character_type 발급 시 호출, 클라는 미리보기에 사용 가능
import type { CategoryId, CharacterType } from '../../../shared/types';

export interface CategoryBreakdown {
  goods?: number;
  stationery?: number;
  snack?: number;
  gift?: number;
  fan?: number;
  pet?: number;
  book?: number;
  etc?: number;
}

const DOMINANCE_THRESHOLD = 0.4; // 40%
const DIVERSITY_THRESHOLD = 5;   // 5종 이상
const SPROUT_THRESHOLD = 3;       // 기록 3개 미만은 새싹

const CATEGORY_TO_CHARACTER: Record<string, CharacterType> = {
  goods: 'goods_hamster',
  stationery: 'stationery_rabbit',
  snack: 'snack_cat',
  gift: 'gift_bear',
  fan: 'fan_squirrel',
  pet: 'pet_dog',
};

export function computeCharacter(breakdown: CategoryBreakdown, totalCount: number): CharacterType {
  if (totalCount < SPROUT_THRESHOLD) return 'sprout';

  const filledCategories = Object.values(breakdown).filter((v) => (v ?? 0) > 0).length;
  if (filledCategories >= DIVERSITY_THRESHOLD) return 'taste_diverse';

  // dominance 분기 (40% 이상)
  let topCat: CategoryId | null = null;
  let topRatio = 0;
  for (const [cat, count] of Object.entries(breakdown) as [CategoryId, number | undefined][]) {
    if (!count) continue;
    const ratio = count / totalCount;
    if (ratio > topRatio) {
      topRatio = ratio;
      topCat = cat;
    }
  }

  if (topCat && topRatio >= DOMINANCE_THRESHOLD) {
    return CATEGORY_TO_CHARACTER[topCat] ?? 'taste_diverse';
  }

  // 다양성 미달 + 어떤 카테고리도 dominant 아님 → 다양 캐릭터로 fallback
  return 'taste_diverse';
}

export function topCategory(breakdown: CategoryBreakdown): CategoryId {
  let top: CategoryId = 'etc';
  let topCount = -1;
  for (const [cat, count] of Object.entries(breakdown) as [CategoryId, number | undefined][]) {
    if ((count ?? 0) > topCount) {
      top = cat;
      topCount = count ?? 0;
    }
  }
  return top;
}
