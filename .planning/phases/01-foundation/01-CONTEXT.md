# Phase 1: Foundation — Context

**Gathered:** 2026-05-01
**Status:** Ready for planning
**Mode:** Auto-generated (autonomous mode, smart_discuss skipped)

<domain>
## Phase Boundary

사용자가 픽콩에 토스 로그인으로 진입해 닉네임을 1회 등록하고, 30초 내 첫 콩을 도감에 기록할 수 있다. 백엔드 mTLS와 금칙어 사전 v1이 D7까지 운영 배포된다.

**Scope (7 screens):** S-ONB / S-LOGIN / S-NICK / S-HOME / S-ADD / S-DONE / S-CAT
**Out of scope (Phase 2):** S-CARD, S-CARD-VIEW, S-SHARE, S-VIEWER-INTRO, S-NICK-EDIT, S-LIST, S-SET, S-AD

**Requirements covered:** AUTH-01~04, SAFE-01~03, HOME-01~03, ADD-01~03 (총 13개)

**일정:** W1 (D1~D7), 7 영업일. D7 마감: 금칙어 v1 운영 배포.
</domain>

<decisions>
## Implementation Decisions

### Locked from PROJECT.md (Auto-defaults)

| Area | Choice | Why |
|---|---|---|
| Frontend stack | React 19 + Vite 6 + Tailwind 4 + `@apps-in-toss/web-framework@2.0.1` | PRD §10.1 명시 |
| Component library | TDS Mobile (Button, BottomCTA, Top, ListRow, ListHeader, Tab, Badge) — 로컬 wrapping 필요 (실제 npm 패키지 미공개일 가능성, examples-robin 패턴 따름) | PRD §10.1 |
| Backend | Node 22 + Hono + TypeScript | 가장 가벼운 modern TS 프레임워크, mTLS는 Node native fetch agent |
| Database | Postgres via Supabase (또는 로컬 Postgres docker-compose) | 무료 티어 + 마이그레이션 SQL 단순 |
| Cron | GitHub Actions schedule `0 15 1 * *` (UTC 15시 = KST 다음날 0시 — Phase 2 use) | 무료, 6회 retry는 워크플로우 내 |
| ORM | 가벼운 raw SQL via `postgres` (porsager) — Drizzle 등 무거운 ORM 회피 | 마이그레이션 단순, 타입 추론 충분 |
| Sentry/Analytics | Mock DSN with env placeholder, wrapper로 추상화 | Phase 3에서 실 DSN 주입 |
| Color palette | Primary `#7BD389` (연두), Background `#FFF8EE` (크림), Surface `#FFFFFF`, Accent `#B59CD9` (라벤더), Text `#3F2D24` (브라운) | UI-SPEC 승인안 |
| Spacing scale | 4/8/16/24/32/48/64 (4의 배수) | UI-SPEC |
| Typography | Pretendard, 14/16/20/28, weights 400/600/700 | UI-SPEC |

### Locked from Phase 1 UI-SPEC (Pending → Auto-default)

| Item | Default Value |
|---|---|
| 카테고리 8종 라벨 | 굿즈 / 문구 / 간식 / 선물 / 덕질 / 반려 / 책·잡지 / 기타 |
| S-ADD 추천 이모지 12종 | 🎁 ✨ 💕 🌸 ⭐ 🍀 🐰 🐻 🌿 🍡 📒 💝 |
| Accent 컬러 | 라벤더 #B59CD9 |
| S-DONE secondary CTA | TDS Button variant=secondary, outline #7BD389 |

### Claude's Discretion

- Routing library: React Router v7 (가벼운 SPA용)
- State: useState + Zustand (lightweight) — 필요 시점에만 도입
- Form 검증: Zod schema (서버/클라 공유 검증)
- Backend folder: `server/` 하위 (frontend는 `src/`)
- Shared types: `shared/` 폴더로 분리 (frontend ↔ backend 타입 공유)
- mTLS 인증서: `certs/` 폴더 (gitignore), .env에 경로 명시, 미설정 시 mock mode
- 토스 SDK 호출: `src/lib/sdk.ts`에서 dynamic import + isSupported() 패턴 (apps-in-toss-examples-robin/CLAUDE.md 규칙)
</decisions>

<code_context>
## Existing Code Insights

- 프로젝트는 갓 시작된 상태 — 코드 0줄
- `apps-in-toss-examples-robin/_template/`이 표준 스캐폴드 레퍼런스
- `apps-in-toss-examples-robin/with-app-login/`이 토스 로그인 레퍼런스
- `apps-in-toss-examples-robin/with-storage/`가 Storage 패턴 레퍼런스
- `granite.config.ts`/`index.html`은 이미 작성 완료 (harness-init)
</code_context>

<specifics>
## Specific Ideas

- **사용자 목표 30초**: S-ADD 3단계의 입력 마찰을 최소화 — 카테고리 1탭, 금액 빈값 허용(스킵 1탭), 이모지 추천 1탭. 평균 3탭 + 메모 입력으로 완료 가능해야 함.
- **닉네임 1탭 추천**: 추천 칩 6개를 누르면 즉시 텍스트 필드에 채워짐 + BottomCTA 활성. 12초 SLA 보호.
- **로그인 끊김 자동 재연결 (바텀시트 금지)**: getIsTossLoginIntegratedService 폴링이 아니라, API 호출 시 401 → S-LOGIN 라우팅 패턴.
- **금칙어 검증 파이프라인**: 클라이언트 입력 단계 자동 무시 → 클라 저장 직전 정규식 → 백엔드 정규식 + 사전 + 변형 정규식. 3중 방어.
- **Web fallback (개발 환경)**: SDK isSupported가 false면 mock — appLogin은 fake user_key 반환, Storage는 localStorage. 개발자가 토스 환경 없이도 풀 흐름 시연 가능.
</specifics>

<deferred>
## Deferred Ideas

- TDS Mobile 컴포넌트 실 패키지 검색 (Phase 1 진행 중 별도 task) — 일단 wrapper 폴더로 추상화하고 미사용 시 자체 컴포넌트로 대체
- E2E 테스트 (Phase 3에서 ZeroScript QA로)
- 다국어 지원 (현재 한국어만)
- 일러스트 8종 (Phase 2에서 카드용으로 필요, Phase 1엔 Slot 빈칸 점선만)
- iOS/Android 디바이스 실기 테스트 (Phase 4 검수 직전)
</deferred>
