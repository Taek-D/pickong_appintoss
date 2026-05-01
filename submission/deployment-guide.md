# 픽콩 배포 가이드 (Phase 4)

> 사용자 환경에서 실행할 배포 절차. mTLS 인증서·DB·콘솔은 외부 의존이라 자동화 불가.

## 사전 준비

### 1. 토스 콘솔 인증서 발급
- 콘솔 → 사업자 인증 → mTLS 인증서 다운로드 (`client-cert.pem` + `client-key.pem`)
- 로컬 `certs/` 폴더에 배치 (gitignore 됨)
- `.env` 작성: `TOSS_MTLS_CERT_PATH=./certs/client-cert.pem`, `TOSS_MTLS_KEY_PATH=./certs/client-key.pem`, `TOSS_CLIENT_ID`, `TOSS_CLIENT_SECRET`

### 2. Supabase 운영 DB
- supabase.com → New Project → 픽콩-prod
- Connection string → `.env` `DATABASE_URL`
- 마이그레이션 실행: `pnpm db:migrate` (server/src/migrations/001_init.sql 적용)

### 3. Sentry DSN
- sentry.io → New Project → React + Node
- `.env`: `VITE_SENTRY_DSN`, `SENTRY_DSN`
- (선택) 알람 룰은 `.planning/phases/03-hardening/03-ALERTS.md` 참조

### 4. GitHub Actions secrets
- `DATABASE_URL` (만료 cron이 사용)

## 빌드

```bash
pnpm install
pnpm typecheck   # 0 errors 확인
pnpm test        # forbidden + character-rule + share-message 모든 테스트 PASS
pnpm submission:validate   # tagline 38/50, relevance 174/200 ✓
pnpm build       # Vite → dist/
```

번들 크기 확인 (PRD §10.11 ≤30MB 압축 해제):
```bash
du -sh dist/   # OS별 압축 해제 사이즈
```

## .ait 패키징

`@apps-in-toss/web-framework` 의 `ait build` 명령 사용 (또는 콘솔 업로드 양식에 맞춰):
```bash
# (실제 명령은 SDK 버전에 따라 변동, 콘솔 업로드 안내 참조)
npx ait build       # 가정 — granite.config.ts 기반 .ait 생성
```

산출물: `dist/pickkong.ait` (또는 동등). 콘솔 업로드.

## 백엔드 배포

옵션 A — Railway / Render:
```bash
# Railway CLI 예시
railway up --service pickkong-server
```
환경 변수 일괄 등록: `DATABASE_URL`, `TOSS_*`, `SESSION_SECRET`, `SENTRY_DSN`, `PORT`.

옵션 B — Supabase Edge Functions: 현재 Hono 코드는 Node 22 가정. Edge Function 변경 시 별도 작업 필요.

옵션 C — VM (수동): mTLS 인증서 파일 시스템 접근 가능하면 가장 단순.

## CORS 등록 (PRD §5.14)
- 백엔드 CORS allowlist에 콘솔 안내된 토스 미니앱 도메인 등록
- 운영·테스트 도메인 모두

## 30분 모니터링

별도 문서: `submission/30min-monitoring.md`

## 핫픽스 절차

1. 백엔드 핫픽스: 새 커밋 + Railway/Render 자동 배포
2. 프론트 핫픽스: 새 .ait 빌드 + 콘솔 새 버전 업로드 + 검수 요청 (영업일 1~3일)
3. 금칙어 추가: `server/data/forbidden_nicknames.json` PR + 백엔드 재배포 (DB 변경 0)
