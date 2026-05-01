# State: 픽콩 (pickkong)

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-05-01)

**Core value:** 한 번 픽하면 30초 안에 도감이 채워지고, 한 달치 취향이 친구에게 보여줄 수 있는 캐릭터 카드로 돌아온다.
**Current focus:** Phase 1 — Foundation (W1, D1~D7)

## Current Phase

**Phase 1: Foundation** — ✅ Implementation complete (static-pass), awaiting human runtime verification + Phase 2 진입

**Goal:** 사용자가 픽콩에 토스 로그인으로 진입해 닉네임을 1회 등록하고, 30초 내 첫 콩을 도감에 기록할 수 있다. 백엔드 mTLS와 금칙어 사전 v1이 D7까지 운영 배포된다.

**Artifacts:**
- ✅ `.planning/phases/01-foundation/01-UI-SPEC.md`
- ✅ `.planning/phases/01-foundation/01-CONTEXT.md`
- ✅ `.planning/phases/01-foundation/01-01~05-PLAN.md` (5 plans)
- ✅ `.planning/phases/01-foundation/01-VERIFICATION.md` — status: human_needed
- ✅ Code: 50+ files (frontend + Hono server + Postgres schema + 금칙어 v1 + 단위 테스트)

**Plans:**
- [x] 01-01: Scaffold (Vite + React 19 + Tailwind 4 + Hono + Postgres)
- [x] 01-02: 토스 로그인 (S-ONB + S-LOGIN + appLogin + /auth/exchange + /auth/me + 끊김 자동 재연결)
- [x] 01-03: 닉네임 (S-NICK + 정규식 + 추천 칩 6개 + 5종 토스트 + POST /account/nickname)
- [x] 01-04: 금칙어 v1 (forbidden_nicknames.json + forbidden_patterns.regex + 단위 테스트 + 미들웨어 wired)
- [x] 01-05: 도감 + 등록 (S-HOME 그리드 + S-ADD 3단계 + S-DONE + S-CAT empty + cute_items store)

**Pending user verification (Phase 4 직전):**
- pnpm install + pnpm dev (네트워크/시간 의존)
- 토스 콘솔 mTLS 인증서 발급
- Supabase 또는 로컬 Postgres 마이그레이션 실행
- 브라우저 mock 흐름 e2e 확인 (5종 닉네임 케이스 + 도감 → 등록 → 완료)

## Milestones

- 🚧 **v1.0 출품**: 4페이즈 (Phase 1~4) — 마감 2026-05-24

## Recent Activity

### 2026-05-01 — Phase 1 implementation complete (autonomous)
- /gsd-autonomous --auto 진입 → Phase 1 5 plans + scaffold + verify 완수
- 산출물: ~50 files, ~3,000+ lines (frontend + Hono server + Postgres schema + 금칙어 v1)
- VERIFICATION status: `human_needed` — 정적 PASS, 런타임 검증은 사용자 환경 셋업 후
- 커밋: scaffold(c6995ee) + 4 plan implementations (이번 turn에서 단일 커밋)
- 다음: Phase 2 (Card·Share·Ads·Expiry·Withdraw) 진입

### 2026-05-01 — Phase 1 UI-SPEC approved
- `/gsd-ui-phase 1` 하이브리드 실행 (gsd-sdk query 미지원분 직접 구현)
- gsd-ui-researcher: UI-SPEC.md 생성 (587 lines, 7화면, PRD §16 카피 토씨 일치)
- gsd-ui-checker: 6/6 차원 PASS + pickkong-specific 6/6 PASS, BLOCK 0건, FLAG 4건(non-blocking)
- 커밋: `4972d4c` docs(phase-1): UI design contract for Foundation

### 2026-05-01 — Initialization
- 신규 프로젝트로 감지됨 (PRD `pickkong_prd_v2.0.md` 기반)
- harness-workflow 2단계 완료: granite.config.ts + index.html + feature_list.json + claude-progress.txt 생성
- gsd-sdk v0.1.0 글로벌 설치 (`npm install -g @gsd-build/sdk`)
- /gsd-new-project --auto 하이브리드 실행:
  - SDK가 노출하지 않는 `gsd-sdk query *` 호출은 직접 구현으로 대체
  - 사용자 선택: Coarse 4페이즈
  - PRD §8(F-XX 30개) → REQ-XX 38개 변환, PRD §18(W1~W3b) → 4 phases 매핑
- 산출물:
  - `.planning/PROJECT.md` (Core Value, Active 13개, Out of Scope 18개, Key Decisions 8건)
  - `.planning/REQUIREMENTS.md` (v1: 38개 / v2: 11개 / Out of Scope: 18개 / Coverage 100%)
  - `.planning/ROADMAP.md` (4 phases, 17 plans 총괄)
  - `.planning/config.json` (yolo, coarse, parallel, balanced models, 모든 워크플로우 에이전트 ON)
  - `.planning/research/SUMMARY.md` (PRD를 단일 진리원으로 참조)
  - `.planning/STATE.md` (현 파일)

## Next Action

**Phase 2: Card·Share·Ads·Expiry·Withdraw 진입** — autonomous loop가 자동으로 다음 phase로 advance.

Phase 2 plans (계획됨):
- 02-01 카드 룰베이스 + monthly_cards upsert (8자 hash) + S-CARD 본인 카피
- 02-02 S-SHARE 시트 + 토스 share + 만료 안내 카피 4지점 통일
- 02-03 S-CARD-VIEW 4분기 + S-VIEWER-INTRO + 라우팅
- 02-04 전면 광고 위치 A 단일 + 월 1회 캡 + silent skip
- 02-05 닉네임 변경 + 회원 탈퇴 + 만료 cron + 기록 수정/삭제

## Cross-Workflow Integration

이 프로젝트는 **harness-workflow와 GSD를 동시 운영**합니다:

| 트랙 | 산출물 | 용도 |
|---|---|---|
| harness-workflow | `granite.config.ts`, `index.html`, `feature_list.json`, `claude-progress.txt` | 앱인토스 반려방지 + 기능 추적 + 세션 핸드오프 |
| GSD | `.planning/PROJECT.md`, `REQUIREMENTS.md`, `ROADMAP.md`, `STATE.md`, `config.json` | PDCA 페이즈 관리 + 요구사항 추적성 + 검증 게이트 |

두 트랙은 충돌하지 않으며, REQ-XX ↔ F-XX 매핑이 PRD §8 기준으로 추적됩니다. PDCA 페이즈가 진행되면 양쪽 모두 업데이트됩니다.

---
*State initialized: 2026-05-01*
*Last updated: 2026-05-01 after /gsd-new-project --auto*
