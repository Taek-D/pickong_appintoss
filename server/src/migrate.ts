// 마이그레이션 러너 — server/src/migrations/*.sql 순서대로 적용
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sql } from './db';

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(__dirname, 'migrations');

async function run(): Promise<void> {
  if (!sql) throw new Error('DATABASE_URL not set');
  // _migrations 테이블
  await sql`
    CREATE TABLE IF NOT EXISTS _migrations (
      name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  const files = readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();
  for (const f of files) {
    const applied = await sql`SELECT 1 FROM _migrations WHERE name = ${f}`;
    if (applied.length > 0) {
      console.log(`[migrate] skip ${f} (already applied)`);
      continue;
    }
    const ddl = readFileSync(join(migrationsDir, f), 'utf8');
    console.log(`[migrate] applying ${f}`);
    await sql.unsafe(ddl);
    await sql`INSERT INTO _migrations (name) VALUES (${f})`;
  }
  console.log('[migrate] done');
  await sql.end();
}

run().catch((err) => {
  console.error('[migrate] failed', err);
  process.exit(1);
});
