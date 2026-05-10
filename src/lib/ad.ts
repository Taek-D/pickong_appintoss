// Fullscreen ad wrapper: loadFullScreenAd -> showFullScreenAd + silent skip.
// PRD 5.6/7.9: one placement before S-CARD, monthly cap, cap only after show.
import { adCap } from './storage';
import { track } from './analytics';
import { ymOf } from '@shared/constants';

const TIMEOUT_MS = 1500;

interface FullScreenAdEvent {
  type: string;
}

interface FullScreenAdParams {
  options: { adGroupId: string };
  onEvent: (event: FullScreenAdEvent) => void;
  onError: (error: unknown) => void;
}

interface FullScreenAdFn {
  (params: FullScreenAdParams): () => void;
  isSupported?: () => boolean;
}

interface FullScreenAdSdk {
  loadFullScreenAd: FullScreenAdFn;
  showFullScreenAd: FullScreenAdFn;
}

async function tryGetFullScreenAdSdk(): Promise<FullScreenAdSdk | null> {
  try {
    const mod = await import('@apps-in-toss/web-framework');
    const sdk = mod as {
      loadFullScreenAd?: FullScreenAdFn;
      showFullScreenAd?: FullScreenAdFn;
    };
    if (
      typeof sdk.loadFullScreenAd === 'function' &&
      typeof sdk.showFullScreenAd === 'function' &&
      sdk.loadFullScreenAd.isSupported?.() === true &&
      sdk.showFullScreenAd.isSupported?.() === true
    ) {
      return {
        loadFullScreenAd: sdk.loadFullScreenAd,
        showFullScreenAd: sdk.showFullScreenAd,
      };
    }
  } catch {
    /* ignore */
  }
  return null;
}

function normalizeError(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

export async function showCardAdOnce(userKey: string): Promise<{ shown: boolean; skipped_reason?: string }> {
  const yyyymm = ymOf(new Date()).replace('-', '');

  if (await adCap.wasShown(userKey, yyyymm)) {
    track('ad_skip_due_to_fail', { error_code: 'cap_already_shown' });
    return { shown: false, skipped_reason: 'cap_already_shown' };
  }

  track('ad_eligible', { cap_state: 'eligible' });

  const adGroupId = import.meta.env.VITE_TOSS_AD_GROUP_ID as string | undefined;
  if (!adGroupId) {
    track('ad_skip_due_to_fail', { error_code: 'ad_group_missing' });
    return { shown: false, skipped_reason: 'ad_group_missing' };
  }

  const ad = await tryGetFullScreenAdSdk();
  if (!ad) {
    track('ad_skip_due_to_fail', { error_code: 'sdk_unavailable' });
    return { shown: false, skipped_reason: 'sdk_unavailable' };
  }

  const cleanupFns: Array<() => void> = [];

  try {
    track('ad_load_request');
    const loaded = await new Promise<boolean>((resolve) => {
      const timeout = setTimeout(() => resolve(false), TIMEOUT_MS);
      const cleanup = ad.loadFullScreenAd({
        options: { adGroupId },
        onEvent: (event) => {
          if (event.type === 'loaded') {
            clearTimeout(timeout);
            resolve(true);
          }
        },
        onError: (err) => {
          clearTimeout(timeout);
          track('ad_load_fail', { error_code: normalizeError(err) });
          resolve(false);
        },
      });
      cleanupFns.push(cleanup);
    });

    if (!loaded) {
      track('ad_skip_due_to_fail', { error_code: 'load_timeout' });
      return { shown: false, skipped_reason: 'load_timeout' };
    }
    track('ad_load_success');

    const startedAt = Date.now();
    let markShown: Promise<void> | null = null;
    const shown = await new Promise<boolean>((resolve) => {
      const timeout = setTimeout(() => resolve(false), TIMEOUT_MS);
      const cleanup = ad.showFullScreenAd({
        options: { adGroupId },
        onEvent: (event) => {
          if (event.type === 'show') {
            track('ad_show');
            markShown = adCap.markShown(userKey, yyyymm);
          }
          if (event.type === 'impression') track('ad_impression');
          if (event.type === 'clicked') track('ad_clicked');
          if (event.type === 'dismissed') {
            clearTimeout(timeout);
            track('ad_dismiss', { dwell_ms: Date.now() - startedAt });
            void Promise.resolve(markShown).finally(() => resolve(markShown !== null));
          }
          if (event.type === 'failedToShow') {
            clearTimeout(timeout);
            track('ad_skip_due_to_fail', { error_code: 'failed_to_show' });
            resolve(false);
          }
        },
        onError: (err) => {
          clearTimeout(timeout);
          track('ad_skip_due_to_fail', { error_code: 'show_failed:' + normalizeError(err) });
          resolve(false);
        },
      });
      cleanupFns.push(cleanup);
    });

    if (!shown) return { shown: false, skipped_reason: 'show_failed' };
    track('ad_complete', { dwell_ms: Date.now() - startedAt });
    return { shown: true };
  } catch (err) {
    track('ad_skip_due_to_fail', { error_code: 'show_failed:' + normalizeError(err) });
    return { shown: false, skipped_reason: 'show_failed' };
  } finally {
    for (const cleanup of cleanupFns.reverse()) cleanup();
  }
}
