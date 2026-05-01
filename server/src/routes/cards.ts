// /cards — Phase 2 placeholder
import { Hono } from 'hono';

export const cardsRoutes = new Hono();

cardsRoutes.post('/:user_key/:yyyymm', (c) => c.json({ error_code: 'not_implemented' }, 501));
cardsRoutes.get('/:card_id', (c) => c.json({ error_code: 'not_implemented' }, 501));
