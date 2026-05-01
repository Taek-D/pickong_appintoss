# Phase 2: Card·Share·Ads — Context

**Gathered:** 2026-05-01
**Status:** Ready for planning
**Mode:** Auto-generated (autonomous mode, smart_discuss skipped)

<domain>
## Phase Boundary

본인이 한 달치 기록을 캐릭터 카드로 받아 토스 친구에게 공유하고, 공유 카드는 월 만료 + 본인 영구 유지 정책으로 동작한다. 전면 광고는 위치 A 단일 지점에서 월 1회만 노출되며, 닉네임 변경과 회원 탈퇴가 정상 처리된다.

**Scope (8 screens):** S-CARD / S-VIEWER-INTRO / S-CARD-VIEW / S-SHARE / S-AD / S-NICK-EDIT / S-LIST / S-SET
**Requirements covered:** AUTH-05, AUTH-06, ADD-04, CARD-01~04, SHARE-01~04, VIEW-01~04, AD-01~04 (총 19개)
**일정:** W2 (D8~D14), 7 영업일.
</domain>

<decisions>
## Implementation Decisions

### Locked from PROJECT.md

- Backend Hono 패턴 + Postgres `monthly_cards` 스키마 (Phase 1에서 마이그레이션 완료)
- 토스 SDK dynamic import + isSupported() (Phase 1 sdk.ts 확장)
- 공유 카드 월 만료 cron: GitHub Actions schedule (`0 15 1 * *` UTC = KST 매월 2일 0시 — 1일 0시 KST는 `0 15 L * *` 가 더 적합하지만 Linux cron은 L 미지원 → 결과적으로 매월 1일 자정 한국시간 = UTC 31/30일 15시. 단순화 위해 `0 15 1 * *` 사용 = KST 매월 2일 0시 (1일 24시 처리). 지연 1시간 6회 retry는 워크플로우 내.

### Phase 2 신규 결정

- **카드 캡처**: Canvas API + html2canvas — 이미지 저장 시 `<canvas>` 렌더 → base64 → `saveBase64Data`
- **8자 hash 발급**: crypto.randomBytes(5) → base32-like [a-z0-9] 8자, 충돌 시 5회 재시도 → 6번째 실패 시 `card_id_collision` 에러
- **카드 캐릭터 일러스트**: SVG 인라인 (8종 + 미니컷 1종, 가벼움 + 컬러 토큰 적용 가능). 별도 파일로 분리해 lazy load.
- **광고 1.5s 타임아웃**: Promise.race 패턴, AbortController로 취소
- **만료 cron**: server/scripts/expire-cards.ts (`pnpm --dir server expire`) → GitHub Actions에서 호출
- **카드 dirty 재계산**: 사용자가 S-CARD 진입 시 cute_items 단말 데이터로 upsert → 자동 재계산. 별도 dirty 플래그 처리 불필요 (단말이 source of truth).
- **공유 메시지 길이 검증**: PRD §10.12 — `{닉네임}의 이번 달 카드예요. 이번 달 안에만 볼 수 있어요.` = 닉네임 + 22자 = 닉네임 10자 시 32자, 9자 시 31자, 8자 시 30자 (모두 토스 share 미리보기 컷오프 안에 들어옴)

### Claude's Discretion

- S-CARD 캐릭터 일러스트는 SVG inline 인라인 (Phase 2 시점에는 8종 모두 placeholder + 색상 톤 컴포넌트로 대체, 본격 일러스트는 Phase 3에 추가)
- S-CARD-VIEW 본인/타인 분기는 `is_owner = card.user_key === session.user_key` 단순 비교
- S-LIST 카테고리 필터는 chip 가로 스크롤
- S-SET 탈퇴 confirm은 별도 화면이 아닌 BottomSheet (다크패턴 회피 — 진입한 사용자가 의도한 액션)
</decisions>

<code_context>
## Existing Code Insights

- Phase 1에서 다음이 이미 갖춰짐:
  - `shared/types.ts`: MonthlyCard, ShareStatus, CardStatus, CharacterType
  - `shared/constants.ts`: CATEGORIES, COPY (Phase 1만), amountBand, ymOf
  - `server/src/migrations/001_init.sql`: monthly_cards 스키마 + UNIQUE(user_key, month)
  - `server/src/lib/toss-client.ts`: removeByUserKey
  - `server/src/lib/session-cookie.ts`: HMAC 세션
  - `server/src/middleware/auth.ts`: requireAuth
  - `server/src/routes/cards.ts`: 501 placeholder
  - `src/lib/sdk.ts`: getTossShareLink, share, saveBase64Data, getSchemeUri (mock + 실)
  - `src/state/items.ts`: cute_items 단말 store
  - `src/lib/storage.ts`: ad_card_shown, viewer_intro_seen 헬퍼
- Phase 2에서 추가:
  - `shared/constants.ts`: COPY 확장 (Phase 2 카피)
  - `server/src/routes/cards.ts`: POST/GET 풀구현
  - `server/src/lib/character-rule.ts`: 8 character_type 룰
  - `server/src/lib/card-id.ts`: 8자 hash + 충돌 재시도
  - `server/scripts/expire-cards.ts`: 만료 배치
  - `.github/workflows/expire-cards.yml`: GitHub Actions schedule
  - `src/screens/Card.tsx`, `CardView.tsx`, `ViewerIntro.tsx`, `Share.tsx`, `NickEdit.tsx`, `List.tsx`, `Settings.tsx`
  - `src/lib/ad.ts`: IntegratedAd wrapper + silent skip
  - `src/lib/card-capture.ts`: html2canvas
</code_context>

<specifics>
## Specific Ideas

- **만료 사전 안내 카피 통일성**: COPY 객체에 `card_expiry_notice_owner / card_expiry_notice_neutral / card_expired_headline / card_expired_sub` 4개로 명확히 분리
- **광고 silent skip**: 사용자에게는 어떤 안내도 노출 X — load 실패 = 즉시 S-CARD. UX 마찰 0
- **공유 링크 진입 흐름**: getSchemeUri 호출은 App.tsx mount 시 1회 — 결과를 Zustand에 저장하고 라우터 가드가 분기
- **8자 hash 재시도 전략**: insert ON CONFLICT (card_id) DO NOTHING + 영향받은 row 0이면 새 ID로 재시도. monthly_cards UNIQUE(user_key, month) 충돌은 별개 — 같은 사용자×월은 upsert 동작
</specifics>

<deferred>
## Deferred Ideas

- 카드 OG 이미지 자동 생성·캐싱 (Phase 2 백로그 → 후속 milestone)
- S-LIST 검색·태그 필터
- S-CARD 한 줄 메모 저장 (PRD out-of-scope)
- 카드 좋아요 (out-of-scope)
- 캐릭터 미세 애니메이션 (out-of-scope)
</deferred>
