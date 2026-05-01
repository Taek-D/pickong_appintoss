// 8자 [a-z0-9] hash card_id 발급 — 충돌 시 5회 재시도
import { randomBytes } from 'node:crypto';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';

export function newCardId(): string {
  const bytes = randomBytes(8);
  let s = '';
  for (let i = 0; i < 8; i++) {
    s += ALPHABET[bytes[i]! % ALPHABET.length];
  }
  return s;
}

// upsert 헬퍼: callback이 false 반환하면 새 ID로 재시도 (max 5회)
export async function withUniqueCardId<T>(
  attempt: (id: string) => Promise<T | null>,
): Promise<T> {
  for (let i = 0; i < 5; i++) {
    const id = newCardId();
    const r = await attempt(id);
    if (r !== null) return r;
  }
  throw new Error('card_id_collision');
}
