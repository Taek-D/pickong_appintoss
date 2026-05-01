// /cards — 월간 카드 upsert + 단건 조회 (PRD §7.11, §7.13, §10.5)
import { Hono } from 'hono';
import { z } from 'zod';
import { sql } from '../db';
import { requireAuth, getSession } from '../middleware/auth';
import { computeCharacter, topCategory, type CategoryBreakdown } from '../lib/character-rule';
import { withUniqueCardId } from '../lib/card-id';
import type { MonthlyCard } from '../../../shared/types';

export const cardsRoutes = new Hono();

// ─── POST /cards/:user_key/:yyyymm ───────────────────────
// 본인 카드 upsert (자신의 cute_items 단말 기반 집계 페이로드 수신)
const UpsertSchema = z.object({
  total_count: z.number().int().min(0),
  total_amount: z.number().int().min(0),
  category_breakdown: z.record(z.string(), z.number().int().min(0)),
  nickname_snapshot: z.string().min(1).max(10),
});

cardsRoutes.post('/:user_key/:yyyymm', requireAuth(), async (c) => {
  const sess = getSession(c);
  const userKey = c.req.param('user_key');
  const yyyymm = c.req.param('yyyymm');

  if (sess.user_key !== userKey) {
    return c.json({ error_code: 'forbidden' }, 403);
  }
  if (!/^\d{4}-\d{2}$/.test(yyyymm)) {
    return c.json({ error_code: 'invalid_month' }, 400);
  }

  let body: z.infer<typeof UpsertSchema>;
  try {
    body = UpsertSchema.parse(await c.req.json());
  } catch {
    return c.json({ error_code: 'invalid_body' }, 400);
  }

  const breakdown = body.category_breakdown as CategoryBreakdown;
  const character = computeCharacter(breakdown, body.total_count);
  const top = topCategory(breakdown);

  if (!sql) {
    // mock — id만 발급
    return c.json({
      card_id: 'mock' + Math.random().toString(36).slice(2, 6),
      character_type: character,
      top_category: top,
    });
  }

  // 1. 기존 카드 있으면 그 card_id 사용 (UNIQUE user_key+month)
  const existing = await sql<{ card_id: string }[]>`
    SELECT card_id FROM monthly_cards
    WHERE user_key = ${userKey} AND month = ${yyyymm}
  `;

  let cardId: string;
  if (existing.length > 0 && existing[0]) {
    cardId = existing[0].card_id;
    await sql`
      UPDATE monthly_cards SET
        total_count = ${body.total_count},
        total_amount = ${body.total_amount},
        top_category = ${top},
        category_breakdown = ${sql.json(breakdown)},
        character_type = ${character},
        nickname_snapshot = ${body.nickname_snapshot},
        card_status = 'active',
        share_status = CASE WHEN month = TO_CHAR(CURRENT_DATE AT TIME ZONE 'Asia/Seoul', 'YYYY-MM') THEN 'active' ELSE share_status END,
        updated_at = NOW()
      WHERE card_id = ${cardId}
    `;
  } else {
    cardId = await withUniqueCardId<string>(async (id) => {
      try {
        await sql`
          INSERT INTO monthly_cards (
            card_id, user_key, month, total_count, total_amount,
            top_category, category_breakdown, character_type, nickname_snapshot
          )
          VALUES (
            ${id}, ${userKey}, ${yyyymm}, ${body.total_count}, ${body.total_amount},
            ${top}, ${sql.json(breakdown)}, ${character}, ${body.nickname_snapshot}
          )
        `;
        return id;
      } catch (err) {
        // 충돌이면 null 반환 → 재시도
        if (String(err).includes('duplicate key') || String(err).includes('unique')) return null;
        throw err;
      }
    });
  }

  return c.json({
    card_id: cardId,
    character_type: character,
    top_category: top,
  });
});

// ─── GET /cards/:card_id ─────────────────────────────────
// 공유 카드 열람 (인증 필수, 4분기 응답)
cardsRoutes.get('/:card_id', requireAuth(), async (c) => {
  const sess = getSession(c);
  const cardId = c.req.param('card_id');

  if (!/^[a-z0-9]{4,16}$/.test(cardId)) {
    return c.json({ error_code: 'not_found' }, 404);
  }

  if (!sql) {
    return c.json({ error_code: 'not_found' }, 404);
  }

  const rows = await sql<MonthlyCard[]>`
    SELECT card_id, user_key, month, total_count, total_amount,
           top_category, category_breakdown, character_type,
           nickname_snapshot, card_status, share_status,
           created_at, updated_at
    FROM monthly_cards
    WHERE card_id = ${cardId}
  `;

  const card = rows[0];
  if (!card) return c.json({ error_code: 'not_found' }, 404);

  const isOwner = card.user_key === sess.user_key;
  const currentMonth = new Date().toISOString().slice(0, 7);

  // 본인 + active
  if (isOwner && card.card_status === 'active') {
    return c.json({ status: 'owner_active', is_owner: true, card });
  }

  // 타인 + 만료/withdrawn
  if (card.share_status === 'expired' || card.card_status === 'withdrawn') {
    return c.json({
      status: 'expired',
      is_owner: false,
      reason: card.card_status === 'withdrawn' ? 'withdrawn' : 'expired',
    });
  }

  // 타인 + active + 같은 달
  if (card.month === currentMonth && card.share_status === 'active') {
    return c.json({ status: 'other_active', is_owner: false, card });
  }

  // 타인 + 다른 달 + 어쨌든 expired
  return c.json({ status: 'expired', is_owner: false, reason: 'past_month' });
});
