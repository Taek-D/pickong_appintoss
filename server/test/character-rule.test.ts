// character-rule 단위 테스트 (PRD §12)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeCharacter, topCategory } from '../src/lib/character-rule';

test('새싹콩 — 기록 3개 미만', () => {
  assert.equal(computeCharacter({ goods: 1 }, 1), 'sprout');
  assert.equal(computeCharacter({ goods: 2 }, 2), 'sprout');
  assert.equal(computeCharacter({}, 0), 'sprout');
});

test('40% 이상 dominant 카테고리 → 해당 캐릭터', () => {
  assert.equal(computeCharacter({ goods: 4, stationery: 3, snack: 3 }, 10), 'goods_hamster');
  assert.equal(computeCharacter({ stationery: 5, snack: 5 }, 10), 'stationery_rabbit');
  assert.equal(computeCharacter({ snack: 4, goods: 3, gift: 3 }, 10), 'snack_cat');
  assert.equal(computeCharacter({ gift: 4, goods: 3, snack: 3 }, 10), 'gift_bear');
  assert.equal(computeCharacter({ fan: 4, goods: 3, snack: 3 }, 10), 'fan_squirrel');
  assert.equal(computeCharacter({ pet: 4, goods: 3, snack: 3 }, 10), 'pet_dog');
});

test('5종 이상 다양 → 취향부자 (dominant보다 우선)', () => {
  assert.equal(
    computeCharacter({ goods: 5, stationery: 1, snack: 1, gift: 1, fan: 1 }, 9),
    'taste_diverse',
  );
});

test('book/etc dominant → 다양 캐릭터로 fallback (전용 캐릭터 없음)', () => {
  assert.equal(computeCharacter({ book: 5, snack: 3 }, 8), 'taste_diverse');
  assert.equal(computeCharacter({ etc: 5 }, 5), 'taste_diverse');
});

test('topCategory — 가장 많은 카테고리 반환', () => {
  assert.equal(topCategory({ goods: 3, stationery: 5, snack: 1 }), 'stationery');
  assert.equal(topCategory({}), 'etc');
});

test('40% 미만 + 5종 미만 → 취향부자 fallback (dominance 미달)', () => {
  assert.equal(computeCharacter({ goods: 3, stationery: 3, snack: 3 }, 9), 'taste_diverse');
});
