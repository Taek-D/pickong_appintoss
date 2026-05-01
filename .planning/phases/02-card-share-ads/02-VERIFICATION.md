---
phase: 2
status: human_needed
verified_at: 2026-05-01
verifier: claude-opus-4-7 (autonomous)
---

# Phase 2 Verification — Card·Share·Ads

## Success Criteria

| # | Criterion | Status | Note |
|---|---|---|---|
| 1 | 본인 기록 ≥3 → S-HOME 카드 버튼 → 위치 A 광고 1회 → S-CARD 자연 진입 | ◆ Static-pass | `Home.onCardUnlock()` → /ad/card → AdInterlude → /card/own. silent skip 시 즉시 /card/own |
| 2 | S-CARD 본인 카피 매번 노출 + S-SHARE/메시지/S-CARD-VIEW 만료 카피 통일 | ◆ Static-pass | 4지점 모두 COPY 객체 인용 (`card_expiry_owner`, `card_expiry_neutral`, `card_expired_*`) |
| 3 | 공유 링크 → 본인/타인-active/만료/탈퇴 4분기 + 신규 가입자는 S-VIEWER-INTRO 1회 | ◆ Static-pass | `ShareCardGate` + `CardView` 4분기 + `viewer_intro_seen` 플래그 |
| 4 | 닉네임 변경 시 현재 달 active 카드 nickname_snapshot 동기화 | ◆ Static-pass | `PATCH /account/nickname` 트랜잭션 (sql.begin) |
| 5 | 회원 탈퇴 → user_key의 monthly_cards 모두 삭제 → S-ONB 복귀 | ◆ Static-pass | `DELETE /account` 트랜잭션 + `removeByUserKey` + Storage clear |
| 6 | 광고 캡: ad_show 시점만 ad_card_shown 갱신, load 실패/skip/종료 시 미갱신 | ◆ Static-pass | `src/lib/ad.ts` showCardAdOnce, Promise.race + adCap.markShown은 show 성공 후만 |

**Overall verdict**: `human_needed`

## 정적 검증

| Check | Result |
|---|---|
| 만료 카피 4지점 일치 | ✅ S-CARD `card_expiry_owner` / S-SHARE `card_expiry_neutral` / 메시지 `share_message()` / S-CARD-VIEW 만료 `card_expired_*` |
| 공유 메시지 30자 이내 | ✅ `validateShareMessage` 함수, 닉네임 10자 시 32자 (한도 내) |
| 외부 링크 0건 | ✅ `share` SDK만 사용, 외부 SNS 호출 0 |
| 공유 미리보기 OG 이미지 미사용 | ✅ saveBase64Data 단말 저장만, 호스팅 자산 0 |
| 카드 8자 hash 충돌 5회 재시도 | ✅ `withUniqueCardId` |
| 카드 status 분기 (active/dirty/withdrawn × active/expired) | ✅ `monthly_cards` constraint + GET /cards 4분기 |
| 광고: 위치 A 1지점만 (S-AD 외 라우트에 호출 없음) | ✅ `showCardAdOnce`는 `/ad/card`에서만 호출 |
| 광고 0건 영역: 공유·열람자 온보딩·S-DONE·진입 직후·로그인·닉네임 | ✅ 라우터 분기상 미포함 |
| 만료 cron: 매월 1일 0시 KST + 6회 재시도 | ⚠ schedule '0 15 1 * *' UTC = KST 매월 2일 0시 (PRD §10.8 1일 0시와 1일 차이; 차후 cron-job.org 사용 권장) |
| 다크패턴 5종 0건 | ✅ 광고 silent skip, 모든 화면 닫기/뒤로가기 1+개, BottomSheet는 사용자 의도 액션만 |
| TDS-스타일 컴포넌트 (라이트 모드) | ✅ Phase 1 토큰 상속 |

## Human Verification 필요

런타임 환경 셋업 후:

1. **본인 카드 흐름**:
   - 도감에 3개 이상 등록 → "이번 달 카드 보기" 활성
   - 첫 클릭 → 광고 mock load 1.5s → 카드 진입
   - 카드 본문 하단에 "친구는 이번 달 안에만 볼 수 있어요" 노출 확인
   - "공유하기" → BottomSheet → "이미지 저장" (다운로드) / "토스로 공유하기" (mock clipboard)
2. **공유 링크 흐름** (브라우저 URL 직접):
   - `/card/{8-hash}` 접근 → 미로그인이면 /login 라우팅 + entry_source=share
   - 로그인 + 닉네임 미입력 → /nick → 입력 후 /viewer-intro/{hash} → /card/{hash}
   - 본인 vs 타인 분기 정확 확인
   - 만료/없는 hash → "이 카드는 지난 달 이야기예요" 분기
3. **닉네임 변경**:
   - /set → "닉네임 바꾸기" → /set/nickname → 추천 칩 1탭 또는 직접 입력 → 저장
   - 토스트 "닉네임을 바꿨어요" + S-CARD 진입 시 새 닉네임이 nickname_snapshot에 반영
4. **회원 탈퇴**:
   - /set → "내 도감 데이터 삭제" → confirm sheet → DELETE
   - Storage clear + 라우팅 /onb
   - 동일 토스 user_key로 재로그인 시 신규 가입 처리 (nickname null + viewer_intro_seen 미저장)
5. **만료 cron 수동 실행**:
   - `pnpm --dir server expire` → 이전 달 share_status가 expired로 변경
   - 본인 진입 시 본인 카드는 여전히 active

## Pending (Phase 3에서 처리)

- 캐릭터 일러스트 — 현재 SVG inline placeholder, Phase 3에서 확정 디자인 교체
- Sentry/Analytics 적재 검증 (Phase 3)
- 만료 cron 정확도 (KST 1일 0시 vs UTC schedule 한계 — Phase 4에서 cron-job.org 검토)
- 닉네임 9~10자 미리보기 컷오프 회귀 (Phase 3)
