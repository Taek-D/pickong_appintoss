// Postgres 클라이언트 — porsager/postgres
import postgres from 'postgres';

const url = process.env.DATABASE_URL;
if (!url) {
  console.warn('[db] DATABASE_URL not set — DB ops will fail. Use mock-only mode.');
}

export const sql = url
  ? postgres(url, {
      max: 10,
      idle_timeout: 30,
      connect_timeout: 10,
      transform: { undefined: null },
    })
  : null;

export function requireDb(): NonNullable<typeof sql> {
  if (!sql) throw new Error('DATABASE_URL is not configured');
  return sql;
}
