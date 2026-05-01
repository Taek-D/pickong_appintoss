// CLI: 만료 배치 실행 (GitHub Actions 또는 수동 호출)
// 1시간 단위 6회 retry는 GitHub Actions workflow 측에서 처리
import { expireOldShareCards } from '../lib/expire-cards';
import { sql } from '../db';

(async () => {
  try {
    const result = await expireOldShareCards();
    console.log(JSON.stringify(result));
  } catch (err) {
    console.error('[expire-cards] failed', err);
    process.exitCode = 1;
  } finally {
    if (sql) await sql.end();
  }
})();
