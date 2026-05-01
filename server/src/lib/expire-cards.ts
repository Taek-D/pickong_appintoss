// 공유 카드 월 만료 (PRD §10.8) — 매월 1일 0시 KST
// share_status='expired' 처리 (이전 달까지)
// 본인 card_status는 'active' 유지 (영구 보존)
import { sql } from '../db';

export interface ExpireResult {
  expired_count: number;
  current_month: string;
  ran_at: string;
}

export async function expireOldShareCards(): Promise<ExpireResult> {
  const ranAt = new Date().toISOString();
  // 현재 월 (KST 기준)
  const now = new Date();
  const kstOffset = 9 * 60; // 분
  const kstNow = new Date(now.getTime() + (kstOffset - now.getTimezoneOffset()) * 60_000);
  const currentMonth = kstNow.toISOString().slice(0, 7);

  if (!sql) {
    console.warn('[expire-cards] DATABASE_URL not set — skipping');
    return { expired_count: 0, current_month: currentMonth, ran_at: ranAt };
  }

  const result = await sql<{ count: string }[]>`
    UPDATE monthly_cards
    SET share_status = 'expired', updated_at = NOW()
    WHERE month < ${currentMonth}
      AND share_status = 'active'
    RETURNING 1 AS count
  `;

  const expired = result.length;
  console.log(`[expire-cards] expired ${expired} cards (current_month=${currentMonth})`);
  return { expired_count: expired, current_month: currentMonth, ran_at: ranAt };
}
