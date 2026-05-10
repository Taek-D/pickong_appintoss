// Toss SDK 어댑터 — dynamic import + isSupported() 패턴
// (apps-in-toss-examples-robin/CLAUDE.md 규칙: SDK 정적 import 금지)
// 웹 환경(개발/SDK 미지원)에서는 mock 동작 제공

let sdkUnavailable = false;

async function tryImportSdk(): Promise<typeof import('@apps-in-toss/web-framework') | null> {
  if (sdkUnavailable) return null;
  try {
    const mod = await import('@apps-in-toss/web-framework');
    return mod;
  } catch {
    sdkUnavailable = true;
    return null;
  }
}

// ─── appLogin ─────────────────────────────────────────────
export async function appLogin(): Promise<{ code: string } | { mock: true; user_key: string }> {
  const sdk = await tryImportSdk();
  if (sdk?.appLogin && typeof sdk.appLogin === 'function') {
    const isSupported = (sdk.appLogin as { isSupported?: () => boolean }).isSupported;
    if (typeof isSupported === 'function' && isSupported() === true) {
      const result = await (sdk.appLogin as unknown as () => Promise<{ code: string }>)();
      return result;
    }
  }
  // mock fallback (web dev)
  return { mock: true, user_key: 'mock-' + crypto.randomUUID() };
}

// ─── Storage ──────────────────────────────────────────────
export const Storage = {
  async setItem(key: string, value: string): Promise<void> {
    const sdk = await tryImportSdk();
    if (sdk?.Storage?.setItem && typeof sdk.Storage.setItem === 'function') {
      try {
        await (sdk.Storage.setItem as (k: string, v: string) => Promise<void>)(key, value);
        return;
      } catch {
        /* fall through to localStorage */
      }
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    }
  },
  async getItem(key: string): Promise<string | null> {
    const sdk = await tryImportSdk();
    if (sdk?.Storage?.getItem && typeof sdk.Storage.getItem === 'function') {
      try {
        const v = await (sdk.Storage.getItem as (k: string) => Promise<string | null>)(key);
        return v;
      } catch {
        /* fall through */
      }
    }
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  },
  async removeItem(key: string): Promise<void> {
    const sdk = await tryImportSdk();
    if (sdk?.Storage?.removeItem && typeof sdk.Storage.removeItem === 'function') {
      try {
        await (sdk.Storage.removeItem as (k: string) => Promise<void>)(key);
        return;
      } catch {
        /* fall through */
      }
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    }
  },
  async clear(): Promise<void> {
    const sdk = await tryImportSdk();
    if (sdk?.Storage?.clearItems && typeof sdk.Storage.clearItems === 'function') {
      try {
        await (sdk.Storage.clearItems as () => Promise<void>)();
        return;
      } catch {
        /* fall through */
      }
    }
    if (typeof localStorage !== 'undefined') localStorage.clear();
  },
};

// ─── Toss share (Phase 2 use, 미리 정의) ──────────────────
export async function getTossShareLink(scheme: string): Promise<string> {
  const sdk = await tryImportSdk();
  if (sdk?.getTossShareLink && typeof sdk.getTossShareLink === 'function') {
    const isSupported = (sdk.getTossShareLink as { isSupported?: () => boolean }).isSupported;
    if (typeof isSupported === 'function' && isSupported() === true) {
      return await (sdk.getTossShareLink as (s: string) => Promise<string>)(scheme);
    }
  }
  return scheme;
}

export async function share(payload: { message: string; url: string }): Promise<void> {
  const sdk = await tryImportSdk();
  if (sdk?.share && typeof sdk.share === 'function') {
    const isSupported = (sdk.share as { isSupported?: () => boolean }).isSupported;
    if (typeof isSupported === 'function' && isSupported() === true) {
      await (sdk.share as (p: typeof payload) => Promise<void>)(payload);
      return;
    }
  }
  // mock — clipboard fallback
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    await navigator.clipboard.writeText(`${payload.message}\n${payload.url}`);
  }
  console.info('[mock share]', payload);
}

export async function saveBase64Data(payload: { base64: string; filename: string }): Promise<void> {
  const sdk = await tryImportSdk();
  if (sdk?.saveBase64Data && typeof sdk.saveBase64Data === 'function') {
    const isSupported = (sdk.saveBase64Data as { isSupported?: () => boolean }).isSupported;
    if (typeof isSupported === 'function' && isSupported() === true) {
      await (sdk.saveBase64Data as unknown as (p: { data: string; fileName: string; mimeType: string }) => Promise<void>)({ data: payload.base64, fileName: payload.filename, mimeType: 'image/png' });
      return;
    }
  }
  // mock — download via anchor
  if (typeof document !== 'undefined') {
    const a = document.createElement('a');
    a.href = `data:image/png;base64,${payload.base64}`;
    a.download = payload.filename;
    a.click();
  }
}

// ─── getSchemeUri (공유 링크 진입 시 카드 ID 파싱, Phase 2) ───
export async function getSchemeUri(): Promise<string | null> {
  const sdk = await tryImportSdk();
  if (sdk?.getSchemeUri && typeof sdk.getSchemeUri === 'function') {
    const isSupported = (sdk.getSchemeUri as { isSupported?: () => boolean }).isSupported;
    if (typeof isSupported === 'function' && isSupported() === true) {
      try {
        return await (sdk.getSchemeUri as unknown as () => Promise<string | null>)();
      } catch {
        return null;
      }
    }
  }
  // mock — URL search ?card=xxxxxxxx
  if (typeof window !== 'undefined') {
    const card = new URLSearchParams(globalThis.location.search).get('card');
    if (card) return `/card/${card}`;
  }
  return null;
}

export function isSdkAvailable(): boolean {
  return !sdkUnavailable;
}
