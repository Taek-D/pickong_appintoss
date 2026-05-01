// 세션 상태 (user_key, nickname) — Zustand
import { create } from 'zustand';
import { session as sessionStorage } from '@/lib/storage';

interface SessionState {
  userKey: string | null;
  nickname: string | null;
  hydrated: boolean;
  setSession: (userKey: string, nickname: string | null) => Promise<void>;
  setNickname: (nickname: string) => Promise<void>;
  hydrate: () => Promise<void>;
  clear: () => Promise<void>;
}

export const useSession = create<SessionState>((set) => ({
  userKey: null,
  nickname: null,
  hydrated: false,
  async hydrate() {
    const userKey = await sessionStorage.getUserKey();
    const nickname = await sessionStorage.getNickname();
    set({ userKey, nickname, hydrated: true });
  },
  async setSession(userKey, nickname) {
    await sessionStorage.setUserKey(userKey);
    if (nickname) await sessionStorage.setNickname(nickname);
    set({ userKey, nickname });
  },
  async setNickname(nickname) {
    await sessionStorage.setNickname(nickname);
    set({ nickname });
  },
  async clear() {
    await sessionStorage.clear();
    set({ userKey: null, nickname: null });
  },
}));
