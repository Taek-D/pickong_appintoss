// Granite Analytics + Sentry 어댑터 — wrapper로 추상화, mock fallback
import type { EventName } from '@shared/types';

interface GraniteAnalyticsLike {
  track?: (event: string, props?: Record<string, unknown>) => void;
}

let analyticsInstance: GraniteAnalyticsLike | null = null;
let initialized = false;

async function initOnce(): Promise<void> {
  if (initialized) return;
  initialized = true;
  try {
    const mod = await import('@apps-in-toss/web-framework');
    const A = (mod as { Analytics?: GraniteAnalyticsLike }).Analytics;
    if (A && typeof A.track === 'function') {
      analyticsInstance = A;
    }
  } catch {
    /* SDK 미가용 — mock */
  }
}

void initOnce();

export function track(event: EventName, props: Record<string, unknown> = {}): void {
  void initOnce().then(() => {
    if (analyticsInstance && typeof analyticsInstance.track === 'function') {
      try {
        analyticsInstance.track(event, props);
      } catch (err) {
        console.warn('[analytics] track failed', err);
      }
    }
    if (import.meta.env.DEV) {
      console.info('[analytics]', event, props);
    }
  });
}

// React 화면 mount 시 view 이벤트 자동 적재용 헬퍼
import { useEffect } from 'react';
export function useTrackView(event: EventName, props: Record<string, unknown> = {}): void {
  useEffect(() => {
    track(event, props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
