// Storage 키 헬퍼 + JSON 자동 직렬화 — PRD §13.2 키 정의 준수
import { Storage } from './sdk';
import type { CuteItem, MonthlySummary } from '@shared/types';

const KEYS = {
  user_key: 'user_key:current',
  nickname: 'nickname:current',
  cute_items: (uk: string) => `cute_items:${uk}`,
  summary: (uk: string, ym: string) => `summary:${uk}:${ym}`,
  ad_card_shown: (uk: string, yyyymm: string) => `ad_card_shown:${uk}:${yyyymm}`,
  onboarding_completed: 'onboarding_completed',
  viewer_intro_seen: (uk: string) => `viewer_intro_seen:${uk}`,
} as const;

async function getJSON<T>(key: string): Promise<T | null> {
  const raw = await Storage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function setJSON(key: string, value: unknown): Promise<void> {
  await Storage.setItem(key, JSON.stringify(value));
}

export const session = {
  async getUserKey(): Promise<string | null> {
    return Storage.getItem(KEYS.user_key);
  },
  async setUserKey(uk: string): Promise<void> {
    await Storage.setItem(KEYS.user_key, uk);
  },
  async getNickname(): Promise<string | null> {
    return Storage.getItem(KEYS.nickname);
  },
  async setNickname(n: string): Promise<void> {
    await Storage.setItem(KEYS.nickname, n);
  },
  async clear(): Promise<void> {
    await Storage.removeItem(KEYS.user_key);
    await Storage.removeItem(KEYS.nickname);
  },
};

export const onboarding = {
  async isCompleted(): Promise<boolean> {
    return (await Storage.getItem(KEYS.onboarding_completed)) === 'true';
  },
  async markCompleted(): Promise<void> {
    await Storage.setItem(KEYS.onboarding_completed, 'true');
  },
};

export const items = {
  async load(uk: string): Promise<CuteItem[]> {
    return (await getJSON<CuteItem[]>(KEYS.cute_items(uk))) ?? [];
  },
  async save(uk: string, list: CuteItem[]): Promise<void> {
    await setJSON(KEYS.cute_items(uk), list);
  },
  async clear(uk: string): Promise<void> {
    await Storage.removeItem(KEYS.cute_items(uk));
  },
};

export const summaryCache = {
  async get(uk: string, ym: string): Promise<MonthlySummary | null> {
    return getJSON<MonthlySummary>(KEYS.summary(uk, ym));
  },
  async set(uk: string, ym: string, s: MonthlySummary): Promise<void> {
    await setJSON(KEYS.summary(uk, ym), s);
  },
  async invalidate(uk: string, ym: string): Promise<void> {
    await Storage.removeItem(KEYS.summary(uk, ym));
  },
};

export const adCap = {
  async wasShown(uk: string, yyyymm: string): Promise<boolean> {
    return (await Storage.getItem(KEYS.ad_card_shown(uk, yyyymm))) === 'true';
  },
  async markShown(uk: string, yyyymm: string): Promise<void> {
    await Storage.setItem(KEYS.ad_card_shown(uk, yyyymm), 'true');
  },
};

export const viewerIntro = {
  async wasSeen(uk: string): Promise<boolean> {
    return (await Storage.getItem(KEYS.viewer_intro_seen(uk))) === 'true';
  },
  async markSeen(uk: string): Promise<void> {
    await Storage.setItem(KEYS.viewer_intro_seen(uk), 'true');
  },
};

export const STORAGE_KEYS = KEYS;
