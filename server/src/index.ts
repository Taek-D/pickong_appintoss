// 픽콩 백엔드 — Hono on Node 22
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import { authRoutes } from './routes/auth';
import { accountRoutes } from './routes/account';
import { cardsRoutes } from './routes/cards';
import { sessionMiddleware } from './middleware/auth';
import { initSentry, captureException } from './lib/sentry';

void initSentry();

const app = new Hono();

app.use('*', logger());
app.use(
  '*',
  cors({
    origin: (origin) => origin ?? '*',
    credentials: true,
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  }),
);

// 세션 cookie 파싱 미들웨어 (모든 요청)
app.use('*', sessionMiddleware());

app.get('/health', (c) => c.json({ ok: true, version: '0.1.0' }));

app.route('/auth', authRoutes);
app.route('/account', accountRoutes);
app.route('/cards', cardsRoutes);

// 에러 핸들러
app.onError((err, c) => {
  console.error('[error]', err);
  captureException(err);
  return c.json({ error_code: 'internal' }, 500);
});

const port = Number(process.env.PORT ?? 8787);
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`[pickkong] server on http://localhost:${info.port}`);
});

export type AppType = typeof app;
