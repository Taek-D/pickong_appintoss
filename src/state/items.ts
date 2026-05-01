// cute_items 단말 store — Zustand
import { create } from 'zustand';
import type { CuteItem, MonthlySummary, CategoryId } from '@shared/types';
import { items as itemsStorage, summaryCache } from '@/lib/storage';
import { buildSummary } from '@/lib/summary';
import { ymOf } from '@shared/constants';

interface ItemsState {
  items: CuteItem[];
  loaded: boolean;
  load: (userKey: string) => Promise<void>;
  add: (input: Omit<CuteItem, 'id' | 'created_at'>) => Promise<CuteItem>;
  update: (id: string, patch: Partial<Omit<CuteItem, 'id' | 'user_key' | 'created_at'>>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  clear: () => Promise<void>;
  summary: (ym?: string) => MonthlySummary;
  byCategory: (cat: CategoryId, ym?: string) => CuteItem[];
}

let currentUserKey: string | null = null;

async function persist(): Promise<void> {
  if (!currentUserKey) return;
  await itemsStorage.save(currentUserKey, useItems.getState().items);
  // 현재 달 summary 캐시 무효화 — UI는 reactive 계산 후 다시 set
  await summaryCache.invalidate(currentUserKey, ymOf(new Date()));
}

export const useItems = create<ItemsState>((set, get) => ({
  items: [],
  loaded: false,
  async load(userKey) {
    currentUserKey = userKey;
    const list = await itemsStorage.load(userKey);
    set({ items: list, loaded: true });
  },
  async add(input) {
    if (!currentUserKey) throw new Error('items.add: no user_key loaded');
    const item: CuteItem = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      ...input,
      user_key: currentUserKey,
    };
    set({ items: [item, ...get().items] });
    await persist();
    return item;
  },
  async update(id, patch) {
    set({
      items: get().items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    });
    await persist();
  },
  async remove(id) {
    set({ items: get().items.filter((it) => it.id !== id) });
    await persist();
  },
  async clear() {
    if (currentUserKey) await itemsStorage.clear(currentUserKey);
    currentUserKey = null;
    set({ items: [], loaded: false });
  },
  summary(ym = ymOf(new Date())) {
    return buildSummary(get().items, ym);
  },
  byCategory(cat, ym = ymOf(new Date())) {
    return get().items.filter(
      (it) => it.category === cat && ymOf(new Date(it.created_at)) === ym,
    );
  },
}));
