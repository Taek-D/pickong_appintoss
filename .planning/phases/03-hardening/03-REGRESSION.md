# Phase 3 회귀 테스트 — 회수분 우선

> PRD §11.1·§11.3·§18 W3a 회귀 케이스. 자동화 가능한 항목은 단위 테스트로, 그 외는 수동 절차.

## (b) S-CARD-VIEW 4케이스 회귀 — 우선

| 케이스 | 절차 | 자동화 | Status |
|---|---|---|---|
| 본인 + active | 본인이 자기 카드 hash로 진입 → 헤더 "이번 달 나는 {character}" + CTA "내 도감 보러가기" | 수동 (브라우저 mock) | ⏳ pending runtime |
| 타인 + share=active + 같은 달 | 다른 user_key로 로그인 후 진입 → 헤더 "{닉네임}의 이번 달 카드예요" + CTA "나도 도감 시작하기" | 수동 | ⏳ |
| 만료 (이전 달) | DB 직접 조작 또는 시간 모킹으로 share_status='expired' → 헤드 "이 카드는 지난 달 이야기예요" | 수동 | ⏳ |
| 탈퇴자 | 탈퇴 처리 후 카드 hash 진입 → 만료와 동일 분기 (server cards.ts에서 card_status='withdrawn' 체크) | 수동 | ⏳ |

**서버 GET /cards/:card_id 응답 4분기 (코드 검증):**
- `owner_active` ← `is_owner && card_status='active'`
- `other_active` ← `!is_owner && card_status='active' && share_status='active' && month=current`
- `expired` ← `share_status='expired' || card_status='withdrawn' || month<current`
- `not_found` ← row 없음 또는 invalid hash

## (c) 닉네임 변경 후 active 카드 동기화 회귀

| 절차 | 자동화 | Status |
|---|---|---|
| 1. 사용자 A: 도감 3개 등록 → S-CARD 진입 → card_id_X 발급 (nickname_snapshot=A) | 수동 | ⏳ |
| 2. /set/nickname → 새 닉네임 B로 변경 | 수동 | ⏳ |
| 3. /card/card_id_X 진입 또는 본인 S-CARD 재진입 → nickname_snapshot=B 확인 | 자동 (server test) | ✅ test 작성 |
| 4. 다른 달 카드는 nickname_snapshot 변경 없음 (시점성 보존) | 수동 | ⏳ |

**자동 테스트 위치:** `server/test/account-nickname-sync.test.ts`

## 닉네임 9~10자 공유 메시지 미리보기 컷오프

| 케이스 | 메시지 | 길이 | Status |
|---|---|---|---|
| 8자 닉네임 | `귀염콩굿즈콩의 이번 달 카드예요. 이번 달 안에만 볼 수 있어요.` (8자 + 22) | 30 | ✅ |
| 9자 닉네임 | 9자 + 22 = 31 | ≤ 35 한도 | ✅ |
| 10자 닉네임 | 10자 + 22 = 32 | ≤ 35 한도 | ✅ |

**자동 테스트 위치:** `server/test/share-message.test.ts`

## (a) 라이팅 디테일 다듬기 1라운드

전수 점검 — `shared/constants.ts` COPY 객체 + 모든 화면 인용 위치:

| 카피 | 일관성 | Status |
|---|---|---|
| 해요체 통일 ("~해요" / "~할까요?") | ✅ 모두 일관 | ✅ |
| 능동형 (사용자 주어 또는 명령형 "~해 보세요") | ✅ | ✅ |
| 긍정형 ("실패" 같은 부정 단어 회피, "다시 한 번 눌러 볼까요?" 같은 회복 경로) | ✅ | ✅ |
| {명사}+{명사} 지양 | ✅ ("도감 갱신" 대신 "도감을 채웠어요" 등) | ✅ |
| 모든 CTA 다음 행동 명시 | ✅ 16개 CTA 모두 동사+명사 | ✅ |
| 다듬기 후보 | "픽콩 준비 중..." → "잠시만 기다려 주세요" 검토. 현재 "..." 표기 OK. | — |

---
*업데이트: 2026-05-01*
