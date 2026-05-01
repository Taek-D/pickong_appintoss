# State: 픽콩 (pickkong)

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-05-01)

**Core value:** 한 번 픽하면 30초 안에 도감이 채워지고, 한 달치 취향이 친구에게 보여줄 수 있는 캐릭터 카드로 돌아온다.
**Current focus:** Phase 1 — Foundation (W1, D1~D7)

## Current Phase

**Phase 1: Foundation** — UI-SPEC approved, awaiting plan

**Goal:** 사용자가 픽콩에 토스 로그인으로 진입해 닉네임을 1회 등록하고, 30초 내 첫 콩을 도감에 기록할 수 있다. 백엔드 mTLS와 금칙어 사전 v1이 D7까지 운영 배포된다.

**Artifacts:**
- ✅ `.planning/phases/01-foundation/01-UI-SPEC.md` — 7화면 디자인 컨트랙트 (S-ONB/S-LOGIN/S-NICK/S-HOME/S-ADD/S-DONE/S-CAT) — 6/6 + pickkong-specific 6/6 PASS
- ⬜ `.planning/phases/01-foundation/01-CONTEXT.md` — `/gsd-discuss-phase 1`에서 생성 (선택)
- ⬜ `.planning/phases/01-foundation/01-RESEARCH.md` — `/gsd-research-phase 1`에서 생성 (선택, PRD가 이미 커버)
- ⬜ `.planning/phases/01-foundation/01-PLAN.md` — `/gsd-plan-phase 1`에서 생성

**Plans (5, planning 대기):**
- [ ] 01-01: Vite + React 19 + Tailwind 4 스캐폴드 + 백엔드 mTLS 스켈레톤 + DB 마이그레이션 + Storage 세팅
- [ ] 01-02: 토스 로그인 강제 + appLogin + /auth/exchange + user_key 영속
- [ ] 01-03: 닉네임 1회 입력 (S-NICK) + 정규식 + 추천 칩 6개
- [ ] 01-04: 금칙어 v1 (D7 운영 배포)
- [ ] 01-05: 도감 그리드 + 콩 등록 + S-DONE + S-CAT empty + cute_items

**Pending user confirmations (UI-SPEC checker recommendations, non-blocking):**
1. 카테고리 Slot 7·8 라벨 — 기본값: 책·잡지(📚), 기타(📦)
2. S-ADD 추천 이모지 12개 — 기본값: 🎁 ✨ 💕 🌸 ⭐ 🍀 🐰 🐻 🌿 🍡 📒 💝
3. Accent 컬러 — 기본값: 라벤더 #B59CD9 (vs 핑크)
4. S-DONE secondary 버튼 색상/배치 명시 보강 권장

## Milestones

- 🚧 **v1.0 출품**: 4페이즈 (Phase 1~4) — 마감 2026-05-24

## Recent Activity

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

**`/gsd-plan-phase 1`** — UI-SPEC 승인 완료, 이제 plan-phase가 UI-SPEC + REQUIREMENTS를 컨텍스트로 5개 plan 파일을 생성한다.

**Also available:**
- `/gsd-discuss-phase 1` — 추가 컨텍스트 수집이 필요하면 plan 전에 실행 (선택)
- `/harness-progress F000a` — GSD plan 단계 건너뛰고 harness 트랙으로 Vite 스캐폴드 바로 시작

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
