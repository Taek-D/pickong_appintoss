---
phase: 2
plans: 5
status: pending
created: 2026-05-01
mode: consolidated (autonomous)
---

# Phase 2 Consolidated PLAN

> 5 sub-plans을 단일 문서로 통합 (autonomous mode 효율화). 각 sub-plan은 별도 커밋 단위로 처리.

## 02-01: 카드 룰베이스 + monthly_cards upsert + S-CARD

**Requirements**: CARD-01, CARD-02, CARD-04

**Files:**
- `server/src/lib/character-rule.ts` — 8 character_type 룰 (PRD §12)
- `server/src/lib/card-id.ts` — 8자 hash + 5회 재시도
- `server/src/routes/cards.ts` — POST `/cards/:user_key/:yyyymm` upsert
- `server/test/character-rule.test.ts` — 8 character_type 케이스 + 다양성/새싹 boundary
- `src/screens/Card.tsx` — S-CARD 화면 (캐릭터 + 집계 + 8칸 미리보기 + 본인 카피 매번 노출 + Save/Share CTA)
- `src/lib/character-illustration.tsx` — 8종 SVG inline placeholder (라벤더 후광)
- `shared/constants.ts` — COPY 확장 (card_expiry_*, character_label)
- `src/router.tsx` — `/card/own` 라우트 (S-CARD)
- `src/screens/Home.tsx` 수정 — 카드 버튼 클릭 → 광고 분기 → S-CARD

**Acceptance:**
- POST `/cards/:user_key/:yyyymm` 호출 시 character_type 정확 분류 (8종)
- card_id [a-z0-9]{8} 발급, 충돌 시 5회 재시도
- 본인 진입마다 upsert 재계산 (cute_items 변경 반영)
- S-CARD 본인 카피 매번 노출 (PRD §16 토씨 일치)

## 02-02: S-SHARE + 토스 share + 만료 카피 4지점 통일

**Requirements**: SHARE-01, SHARE-02, SHARE-03, SHARE-04

**Files:**
- `src/screens/Share.tsx` — Bottom Sheet (이미지 저장 + 토스 공유)
- `src/lib/card-capture.ts` — `<canvas>` 렌더 + base64
- `src/lib/share-message.ts` — `{닉네임}의 이번 달 카드예요. 이번 달 안에만 볼 수 있어요.` (양식 + 길이 검증)
- `shared/constants.ts` — share 관련 COPY

**Acceptance:**
- 이미지 저장: `saveBase64Data` 호출 (mock fallback = 다운로드)
- 토스 공유: `getTossShareLink('/card/{card_id}')` + `share(message + url)`
- 메시지 30자 이내 (닉네임 10자 시에도)
- S-SHARE 시트 상단 "이번 달 안에만 볼 수 있어요" 통일 카피 노출

## 02-03: S-CARD-VIEW 4분기 + S-VIEWER-INTRO + 라우팅

**Requirements**: VIEW-01, VIEW-02, VIEW-03, VIEW-04

**Files:**
- `src/screens/CardView.tsx` — 본인-active / 타인-active / 만료·삭제·탈퇴 / not_found 4분기
- `src/screens/ViewerIntro.tsx` — 신규 가입자 1장 온보딩
- `src/router.tsx` 수정 — `/card/:hash` 풀구현 + 신규 가입자 분기
- `src/lib/share-entry.ts` — getSchemeUri → URL parse → next 파라미터 결정
- `src/App.tsx` 수정 — mount 시 share entry 감지
- `server/src/routes/cards.ts` — GET `/cards/:card_id` (인증 필수, 4분기 응답)

**Acceptance:**
- 본인 카드 + active: 헤더 "이번 달 나는 {character}" + CTA "내 도감 보러가기"
- 타인 카드 + same month + active: 헤더 "{닉네임}의 이번 달 카드예요" + CTA "나도 도감 시작하기"
- 만료/삭제/탈퇴: 헤드라인 "이 카드는 지난 달 이야기예요" + CTA "픽콩 시작하기"
- not_found: 헤드라인 "카드를 찾을 수 없어요"
- 신규 가입자: 닉네임 입력 후 S-VIEWER-INTRO 1회 → S-CARD-VIEW
- 광고 0건 / 권한 0건

## 02-04: 전면 광고 위치 A 단일 + 월 1회 캡 + silent skip

**Requirements**: AD-01, AD-02, AD-03, AD-04

**Files:**
- `src/lib/ad.ts` — IntegratedAd wrapper (load + show + 1.5s timeout + silent skip)
- `src/screens/Home.tsx` 수정 — 카드 버튼 → 광고 → S-CARD 흐름
- `src/screens/Ad.tsx` — 광고 인터루드 화면 (스피너 + auto-route)
- `src/router.tsx` 수정 — `/ad/card` 추가

**Acceptance:**
- ad_card_shown:{user_key}:{yyyymm} 캡 적용
- 캡 갱신은 ad_show 시점만 (load 실패/skip/종료 시 미갱신)
- 1.5s 타임아웃 → silent skip → 즉시 S-CARD
- 진입 직후·온보딩·로그인·닉네임·공유·열람자에 광고 0건 (라우터 분기 검증)

## 02-05: 닉네임 변경 + 회원 탈퇴 + 만료 cron + 기록 수정/삭제 + 라우터·SET

**Requirements**: AUTH-05, AUTH-06, ADD-04, CARD-03

**Files:**
- `src/screens/Settings.tsx` — S-SET (메뉴 + 탈퇴 confirm sheet)
- `src/screens/NickEdit.tsx` — S-NICK-EDIT (Nickname 화면 재사용 + PATCH)
- `src/screens/List.tsx` — S-LIST (카테고리 필터 + 수정/삭제 sheet)
- `src/components/BottomSheet.tsx` — 공통 모달
- `server/src/lib/expire-cards.ts` — 만료 배치 함수
- `server/src/scripts/expire-cards.ts` — CLI entry point
- `.github/workflows/expire-cards.yml` — GitHub Actions schedule + retry
- `server/test/expire-cards.test.ts` — 회귀 테스트
- `src/router.tsx` 수정 — /list, /set, /set/nickname

**Acceptance:**
- S-SET → 닉네임 바꾸기 → S-NICK-EDIT → PATCH /account/nickname → 현재 달 active 카드 nickname_snapshot 동기화
- S-SET → 탈퇴 → confirm → DELETE /account → Storage clear → S-ONB
- S-LIST 수정/삭제 → cute_items 단말 동기화 + summary 무효화
- 만료 cron: `pnpm --dir server expire` 실행 시 expired 처리
- GitHub Actions schedule 정의 (`0 15 1 * *` UTC)
