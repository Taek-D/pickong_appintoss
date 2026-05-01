// /account — placeholder (01-03 닉네임에서 채움, Phase 2에서 탈퇴 채움)
import { Hono } from 'hono';

export const accountRoutes = new Hono();

accountRoutes.post('/nickname', (c) => c.json({ error_code: 'not_implemented' }, 501));
accountRoutes.patch('/nickname', (c) => c.json({ error_code: 'not_implemented' }, 501));
accountRoutes.delete('/', (c) => c.json({ error_code: 'not_implemented' }, 501));
