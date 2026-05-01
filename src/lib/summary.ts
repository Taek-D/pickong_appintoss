// 단말 cute_items 기반 monthly summary 계산
import type { CuteItem, MonthlySummary, CategoryId } from '@shared/types';
import { CATEGORIES, WEEKLY_TARGET, weekStart, ymOf } from '@shared/constants';

export function buildSummary(items: CuteItem[], ym: string): MonthlySummary {
  const filtered = items.filter((it) => ymOf(new Date(it.created_at)) === ym);
  const by_category: Partial<Record<CategoryId, number>> = {};
  let total_amount = 0;
  for (const it of filtered) {
    by_category[it.category] = (by_category[it.category] ?? 0) + 1;
    total_amount += it.amount;
  }
  const filledCategories = Object.keys(by_category).length;
  const collection_rate = filledCategories / CATEGORIES.length;

  // 이번 주 (KST 월요일 시작)
  const now = new Date();
  const wstart = weekStart(now);
  const this_week_count = filtered.filter(
    (it) => new Date(it.created_at).getTime() >= wstart.getTime(),
  ).length;

  return {
    ym,
    total_count: filtered.length,
    total_amount,
    by_category,
    collection_rate,
    this_week_count,
    weekly_target: WEEKLY_TARGET,
  };
}
