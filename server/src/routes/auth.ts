// /auth — placeholder (01-02 plan에서 풀구현)
import { Hono } from 'hono';

export const authRoutes = new Hono();

authRoutes.post('/exchange', (c) => {
  return c.json({ error_code: 'not_implemented' }, 501);
});

authRoutes.get('/me', (c) => {
  return c.json({ error_code: 'not_implemented' }, 501);
});
