// 서버 Sentry wrapper (PRD §17.3) — DSN 없으면 no-op
let initialized = false;
let captureFn: ((e: unknown) => void) | null = null;

export async function initSentry(): Promise<void> {
  if (initialized) return;
  initialized = true;
  const dsn = process.env.SENTRY_DSN ?? '';
  if (!dsn) {
    console.info('[sentry] DSN not set — no-op');
    return;
  }
  try {
    // @ts-expect-error optional peer
    const Sentry = await import('@sentry/node');
    Sentry.init({
      dsn,
      environment: process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV ?? 'development',
      tracesSampleRate: 0.1,
    });
    captureFn = (e) => Sentry.captureException(e);
  } catch (err) {
    console.warn('[sentry] init failed', err);
  }
}

export function captureException(err: unknown): void {
  if (captureFn) captureFn(err);
  else console.error('[sentry-noop]', err);
}
