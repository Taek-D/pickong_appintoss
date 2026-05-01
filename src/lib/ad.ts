// 전면 광고 wrapper — IntegratedAd + 1.5s 타임아웃 + silent skip
// PRD §5.6, §7.9: 위치 A 단일, 월 1회 캡, ad_show 시점만 갱신
import { adCap } from './storage';
import { track } from './analytics';
import { ymOf } from '@shared/constants';

const TIMEOUT_MS = 1500;

interface IntegratedAdLike {
  load: () => Promise<unknown>;
  show: () => Promise<unknown>;
  on?: (event: string, fn: () => void) => void;
}

async function tryGetIntegratedAd(): Promise<IntegratedAdLike | null> {
  try {
    const mod = await import('@apps-in-toss/web-framework');
    const Ad = (mod as { IntegratedAd?: IntegratedAdLike }).IntegratedAd;
    if (Ad && typeof Ad.load === 'function') return Ad;
  } catch {
    /* ignore */
  }
  return null;
}

// 결과: ad_show가 발생했으면 true, silent skip이면 false
export async function showCardAdOnce(userKey: string): Promise<{ shown: boolean; skipped_reason?: string }> {
  const yyyymm = ymOf(new Date()).replace('-', '');

  // 캡 확인
  if (await adCap.wasShown(userKey, yyyymm)) {
    track('ad_skip_due_to_fail', { error_code: 'cap_already_shown' });
    return { shown: false, skipped_reason: 'cap_already_shown' };
  }

  track('ad_eligible', { cap_state: 'eligible' });

  const Ad = await tryGetIntegratedAd();
  if (!Ad) {
    track('ad_skip_due_to_fail', { error_code: 'sdk_unavailable' });
    return { shown: false, skipped_reason: 'sdk_unavailable' };
  }

  track('ad_load_request');

  // load with 1.5s timeout
  const loaded = await Promise.race([
    Ad.load().then(
      () => true,
      (err: unknown) => {
        track('ad_load_fail', { error_code: String(err) });
        return false;
      },
    ),
    new Promise<boolean>((resolve) => setTimeout(() => resolve(false), TIMEOUT_MS)),
  ]);

  if (!loaded) {
    track('ad_skip_due_to_fail', { error_code: 'load_timeout' });
    return { shown: false, skipped_reason: 'load_timeout' };
  }

  track('ad_load_success');

  // show — 광고 닫힘까지 대기. show가 reject되거나 종료 시 캡 갱신 X
  const startedAt = Date.now();
  try {
    await Ad.show();
    const dwell = Date.now() - startedAt;
    track('ad_show');
    track('ad_dismiss', { dwell_ms: dwell });
    // 캡 갱신은 ad_show 시점에만
    await adCap.markShown(userKey, yyyymm);
    return { shown: true };
  } catch (err) {
    track('ad_skip_due_to_fail', { error_code: 'show_failed:' + String(err) });
    return { shown: false, skipped_reason: 'show_failed' };
  }
}
