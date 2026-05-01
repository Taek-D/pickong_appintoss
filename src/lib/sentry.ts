// Sentry wrapper — DSN 없으면 no-op (PRD §17.3)
// 실제 SDK는 dynamic import로 lazy load (번들 사이즈 최소화)

let initialized = false;
let sentryClient: { captureException: (e: unknown) => void; addBreadcrumb: (b: unknown) => void } | null = null;

export async function initSentry(): Promise<void> {
  if (initialized) return;
  initialized = true;
  const dsn = (import.meta.env.VITE_SENTRY_DSN as string | undefined) ?? '';
  if (!dsn) {
    if (import.meta.env.DEV) console.info('[sentry] DSN not set — using no-op');
    return;
  }
  try {
    // @ts-expect-error — peer dep, optional
    const Sentry = await import('@sentry/react');
    Sentry.init({
      dsn,
      environment: import.meta.env.MODE,
      tracesSampleRate: 0.1,
    });
    sentryClient = {
      captureException: (e) => Sentry.captureException(e),
      addBreadcrumb: (b) => Sentry.addBreadcrumb(b as Parameters<typeof Sentry.addBreadcrumb>[0]),
    };
  } catch (err) {
    console.warn('[sentry] init failed (peer dep missing?)', err);
  }
}

export function captureException(err: unknown): void {
  if (sentryClient) sentryClient.captureException(err);
  else console.error('[sentry-noop]', err);
}

export function breadcrumb(message: string, data?: Record<string, unknown>): void {
  if (sentryClient) {
    sentryClient.addBreadcrumb({ message, level: 'info', data });
  }
}
