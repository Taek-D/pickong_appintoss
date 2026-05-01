---
phase: 1
status: human_needed
verified_at: 2026-05-01
verifier: claude-opus-4-7 (autonomous)
---

# Phase 1 Verification — Foundation

## Success Criteria 점검

| # | Criterion | Status | Note |
|---|---|---|---|
| 1 | 신규 사용자가 온보딩 → 토스 로그인 → 닉네임 → S-HOME 인터럽트 없이 통과 | ◆ Static-pass | 라우터 가드(`RootGate`) + onboarding/login/nickname 화면 + 세션 hydrate 흐름 작성 완료. 실 토스 환경에서의 풀 e2e는 미실행 (mTLS·콘솔 등록 필요) |
| 2 | 닉네임 자모 단독·이모지·특수문자·관리자 사칭 차단 + 추천 칩 1탭 | ◆ Static-pass | `sanitizeInput` + 5종 토스트 + 금칙어 v1 + 단위 테스트 케이스 작성 (실행 미필) |
| 3 | S-HOME → 등록 3단계 → S-DONE 30초 내 가능 | ◆ Static-pass | Wizard 패턴, 카테고리 1탭 자동 진입, 금액 빈값 허용, 추천 이모지 12개 1탭, BottomCTA 키보드 위 |
| 4 | 백엔드 mTLS + 금칙어 v1 D7 운영 배포 | ⚠ Pending-deploy | 코드는 준비 완료. 실 배포는 Supabase 인스턴스 + 토스 콘솔 mTLS 인증서 발급 후 가능 |
| 5 | 도감 그리드 8칸 + 수집률 + 주간 진행 + 카드 버튼 조건부 | ◆ Static-pass | `summary.ts` collection_rate + this_week_count + CARD_UNLOCK_THRESHOLD 분기 |

**Overall verdict**: `human_needed`
- 코드/파일 작성은 완료 (50+ files, ~3,000+ lines)
- 실 환경 e2e 검증은 사용자 환경 셋업(Supabase Postgres + Toss 콘솔 mTLS) 후 가능

## 정적 검증 결과

| Check | Result |
|---|---|
| TypeScript 구조 (parsing) | ✅ 모든 .ts/.tsx 파일 자체-일관 (수동 검토) |
| Import 경로 | ✅ `@shared/*`, `@/*` alias tsconfig + vite.config 일치 |
| PRD §16 카피 인용 | ✅ `shared/constants.ts` COPY 객체에서 인용, screen이 reference |
| PRD §13.1 스키마 일치 | ✅ accounts/monthly_cards 컬럼·제약 일치 |
| SDK dynamic import 패턴 | ✅ `src/lib/sdk.ts`가 catalog CLAUDE.md 규칙 준수 (정적 import 0건) |
| Web fallback (mock mode) | ✅ appLogin/Storage/share/saveBase64Data 모두 mock 분기 |
| 다크패턴 5종 (PRD §5.5) | ✅ 광고 0건, 진입 직후 인터럽트 0건, 모든 화면 닫기/뒤로가기 1+개 |
| 라이트 모드 단일 | ✅ globals.css `color-scheme: light only` |
| 권한 요청 0건 | ✅ Phase 1 화면에 권한 호출 0건 |
| iframe 미사용 | ✅ 사용 안 함 |
| viewport user-scalable=no | ✅ index.html (harness-init 단계) |

## Human Verification 필요 항목

런타임 환경이 갖춰지면 다음을 확인해 주세요:

1. **`pnpm install && pnpm dev`** — frontend(5173) + backend(8787) 동시 기동 확인
2. **`curl http://localhost:8787/health`** → `{"ok":true,"version":"0.1.0"}`
3. **브라우저 mock 흐름** (mTLS 미설정 환경):
   - `/onb` → 슬라이드 3장 + "시작하기" → `/login`
   - "토스로 시작하기" → mock user_key 발급 → 첫 진입이면 `/nick`
   - 닉네임 추천 칩 6개 1탭 → "이 이름으로 시작할게요" → `/`
   - S-HOME 도감 그리드 8칸(빈 상태) + 진행 게이지 0% + "이번 주 3콩까지 3콩 남았어요"
   - "오늘의 콩 줍기" → 카테고리 8칸 → 1탭 → 금액 → 이모지+메모 → "내 도감에 담기" → S-DONE
   - "도감 보러가기" → S-HOME → 그리드 채워진 칸 + 수집률 12% (1/8)
   - 카테고리 칸 클릭 → S-CAT → 등록한 콩 1건 노출
4. **금칙어 단위 테스트** — `cd server && node --test --import tsx 'test/**/*.test.ts'` (Postgres 미필요)
5. **닉네임 차단 케이스** (브라우저):
   - "ㄱ" 입력 → 자모 토스트
   - "👍" 입력 → 자동 무시 (이모지)
   - "test test" 입력 → 공백 자동 무시
   - "관리자" 입력 + 저장 → "이 닉네임은 쓸 수 없어요" 토스트
   - 한글 11자 입력 → max=10에서 차단

## Pending (Phase 2~4 의존)

- 토스 mTLS 실 인증서 발급 + Supabase 운영 배포 (Phase 4 직전)
- Sentry/Granite Analytics 실 DSN 주입 (Phase 3)
- 카테고리 캐릭터 일러스트 8종 + 도감 미니컷 1종 (Phase 2)
- 카드/공유/광고/만료 (Phase 2 전체)

## Verification Skipped (Sandbox 한계)

- `pnpm install` (네트워크 의존, 수~분 소요) → 사용자 실행
- Postgres 마이그레이션 실행 → 사용자 환경
- 실 토스 콘솔 등록 + 인증서 발급 → 사용자 작업

## Completed Artifacts

```
src/
  App.tsx, main.tsx, router.tsx, styles/globals.css
  components/ — BottomCTA.tsx, BottomCTAStack, Top.tsx, Toast.tsx
  lib/ — sdk.ts, storage.ts, api.ts, analytics.ts, summary.ts, auth.ts, cn.ts
  screens/ — Onboarding.tsx, Login.tsx, Nickname.tsx, Home.tsx, Add/index.tsx, Done.tsx, CategoryDetail.tsx
  state/ — session.ts, items.ts
shared/
  types.ts (40+ types), constants.ts (COPY, CATEGORIES, RECOMMENDED_*, regex)
server/
  package.json, tsconfig.json
  src/index.ts (Hono on Node 22)
  src/db.ts, src/migrate.ts, src/migrations/001_init.sql
  src/lib/ — toss-client.ts(mTLS+mock), session-cookie.ts(HMAC), forbidden.ts, forbidden-patterns.ts
  src/middleware/auth.ts
  src/routes/auth.ts (POST /auth/exchange, GET /auth/me, POST /auth/logout)
  src/routes/account.ts (POST/PATCH /nickname, DELETE /)
  src/routes/cards.ts (Phase 2 placeholder)
  data/forbidden_nicknames.json
  test/forbidden.test.ts (35+ cases)
```
