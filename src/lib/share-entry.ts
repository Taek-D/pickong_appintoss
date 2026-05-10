// 공유 링크 진입 감지 — getSchemeUri (`/card/{8-hash}`) 파싱
import { create } from 'zustand';
import { getSchemeUri } from './sdk';

interface ShareEntryState {
  cardId: string | null;
  detected: boolean;
  detect: () => Promise<void>;
  consume: () => string | null;
}

export const useShareEntry = create<ShareEntryState>((set, get) => ({
  cardId: null,
  detected: false,
  async detect() {
    if (get().detected) return;
    const scheme = await getSchemeUri();
    if (scheme) {
      const m = scheme.match(/^\/card\/([a-z0-9]{4,16})$/i);
      if (m && m[1]) {
        set({ cardId: m[1], detected: true });
        return;
      }
    }
    // URL fallback (browser dev): /card/:hash
    if (typeof window !== 'undefined') {
      const m = globalThis.location.pathname.match(/^\/card\/([a-z0-9]{4,16})$/i);
      if (m && m[1]) {
        set({ cardId: m[1], detected: true });
        return;
      }
    }
    set({ detected: true });
  },
  consume() {
    const id = get().cardId;
    set({ cardId: null });
    return id;
  },
}));
