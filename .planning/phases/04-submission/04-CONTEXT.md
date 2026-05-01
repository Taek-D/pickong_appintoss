# Phase 4: Submission & Patch — Context

**Gathered:** 2026-05-01
**Mode:** Auto-generated (autonomous)

## Phase Boundary
콘솔 검토 요청 → 반려 시 1회 패치 → 챌린지 출품폼 최종 제출. 마감 D-3까지 출시 승인. 30분 모니터링 윈도우 통과.

**Scope:** 콘솔 메타·빌드·QR 회귀·검수·출품. 신규 제품 코드 없음, 운영 문서 + 배포 작업.
**Requirements:** SUBMIT-03
**일정:** W3b (D19~D23) — 잔여 5일

## Decisions
- 빌드: ait CLI (`@apps-in-toss/web-framework` 제공) — `pnpm build` 후 `ait build` 또는 동등 명령
- mTLS 인증서: 토스 콘솔 → 사업자 등록 후 발급 (사용자 작업)
- DB: Supabase 운영 인스턴스 + 마이그레이션 (`pnpm db:migrate`)
- Sentry: DSN 발급 후 .env 주입
- Granite Analytics: 콘솔 등록 후 키 주입
- cron: GitHub Actions secrets에 DATABASE_URL 등록
- 30분 모니터링: 출시 직후 home_view/login_success/card_view/share_complete/ad_show 적재 여부 + Sentry crash-free

## Outputs (모두 운영 문서)
- submission/console-meta.md — PRD §14.1 콘솔 등록 항목 일괄
- submission/deployment-guide.md — .ait 빌드 + 콘솔 업로드 절차
- submission/qa-checklist.md — QR 회귀 체크리스트
- submission/30min-monitoring.md — 출시 후 모니터링
- submission/launch-checklist.md — D-3 출시 승인 게이트
- submission/submission-form.md — 챌린지 출품폼 제출 절차
