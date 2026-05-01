---
phase: 3
plans: 4
status: pending
created: 2026-05-01
mode: consolidated (autonomous)
---

# Phase 3 Consolidated PLAN

## 03-01: §5.15 검수 체크리스트 + 다크패턴 5종 회귀 + Safe Area
**Files:**
- `.planning/phases/03-hardening/03-CHECKLIST.md` — §5.15 24항목 추적표
- `.planning/phases/03-hardening/03-DARK-PATTERN-AUDIT.md` — 5종 audit (특히 4번 광고)

## 03-02: 회수분 우선 회귀 (S-CARD-VIEW 4케이스 + 닉네임 동기화 + 9~10자)
**Files:**
- `.planning/phases/03-hardening/03-REGRESSION.md` — 케이스별 검증 절차
- `server/test/share-message.test.ts` — 닉네임 9~10자 메시지 길이 회귀
- `server/test/account-nickname-sync.test.ts` — PATCH 후 monthly_cards nickname_snapshot 동기화 검증

## 03-03: Sentry + Granite Analytics 적재 + 알람
**Files:**
- `src/lib/sentry.ts` — 클라이언트 Sentry lazy init wrapper (DSN 없으면 no-op)
- `server/src/lib/sentry.ts` — 서버 Sentry wrapper
- `src/main.tsx` 수정 — Sentry 초기화 + ErrorBoundary
- `server/src/index.ts` 수정 — Sentry 미들웨어
- `package.json`, `server/package.json` — `@sentry/react`, `@sentry/node` 의존성 추가
- `.planning/phases/03-hardening/03-ALERTS.md` — 알람 정의 (광고 도달률/만료 배치/nick_save_fail)

## 03-04: 출품폼 카피 1차 확정 + 글자수 자동 검증 + 차별화 코멘트
**Files:**
- `submission/tagline.txt` — 한 줄 50자 (확정안)
- `submission/relevance.txt` — 200자 (확정안)
- `submission/differentiation-note.md` — 어뷰징 차별화 코멘트 (검수 첨부용)
- `scripts/validate-submission.mjs` — 글자수 자동 검증 (CI에서 호출 가능)
- `package.json` 수정 — `submission:validate` 스크립트
