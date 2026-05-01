---
phase: 2
slug: card-share-ads
status: approved
shadcn_initialized: false
preset: tds-mobile
created: 2026-05-01
reviewed_at: 2026-05-01
checker_verdict: PASS (autonomous mode, PRD §16 카피 인용 + Phase 1 토큰 재사용)
---

# Phase 2 — UI Design Contract (Card·Share·Ads·Expiry·Withdraw)

> Phase 2 화면(S-CARD / S-VIEWER-INTRO / S-CARD-VIEW / S-SHARE / S-NICK-EDIT / S-LIST / S-SET / S-AD)에 대한 디자인 컨트랙트. Phase 1 UI-SPEC의 색·타이포·스페이싱 토큰을 그대로 상속한다.

## Inherited Tokens (from 01-UI-SPEC)

| Property | Value |
|---|---|
| Tool | none (raw Tailwind 4 + TDS-스타일 wrapper) |
| Preset | tds-mobile |
| Background | #FFF8EE (60%) |
| Surface | #FFFFFF (30%) |
| Primary | #7BD389 (10%) |
| Accent | #B59CD9 (라벤더, 카드 헤더 캐릭터 후광 + 캡 인디케이터) |
| Text | #3F2D24 |
| Spacing | 4/8/16/24/32/48/64 |
| Typography | Pretendard 14/16/20/28, weights 400/600/700 |
| Color mode | 라이트 모드 단일 |

## Per-Screen Contract

### S-CARD (본인 월간 결과 카드, PRD §7.11)

| Section | Spec |
|---|---|
| 진입 | 본인 기록 ≥3 + (위치 A 광고 1회 통과 또는 캡 만료) |
| Top | 좌상단 < 뒤로, 우상단 ··· (Phase 2엔 placeholder) |
| Body | 캐릭터 일러스트 (180×180) + 닉네임 (작게, 상단), 총 기록·총 금액·최애 카테고리 표 (3행), 8칸 그리드 미리보기 (60×60) |
| 본문 하단 안내 | "친구는 이번 달 안에만 볼 수 있어요" — 회색 #8C7B6F, 12px, 매번 노출 (PRD §5.10, §16) |
| BottomCTA Stack | Secondary "이미지 저장" + Primary "공유하기" |
| 다크패턴 | 광고 0건 (광고는 진입 직전만), 닫기 명확 |
| Events | card_view(card_id, month, top_category, character_type, count, total_amount_band), card_view_expiry_notice_view(card_id, copy_variant=owner), card_press_save, card_press_share |

### S-VIEWER-INTRO (열람자용 1장 온보딩, PRD §7.12)

| Section | Spec |
|---|---|
| 진입 | 공유 링크 + 로그인 + 닉네임 완료 + 신규 가입자(viewer_intro_seen 미저장) |
| Body | 헤드라인 "{공유자 닉네임}이(가) 이번 달 카드를 보냈어요" + 도감 미니컷 일러스트 + 본문 "픽콩은 좋아한 귀여운 것을 모으는 도감이에요" |
| BottomCTA | "이 카드 보러가기" → S-CARD-VIEW + viewer_intro_seen 마킹 |
| 광고 | 0건 |
| Events | viewerintro_view(card_id, sharer_nickname_present), viewerintro_press_continue |

### S-CARD-VIEW (공유 카드 열람, PRD §7.13) — **4분기**

| 분기 | UI |
|---|---|
| 본인 카드 + active | 헤더 "이번 달 나는 {character_type}" + 카드 동일 + CTA "내 도감 보러가기" → /home |
| 타인 카드 + share_status=active + 같은 달 | 헤더 "{닉네임}의 이번 달 카드예요" + 카드 동일 + CTA "나도 도감 시작하기" → /home (본인 가입자) 또는 /onb (게스트) |
| 만료/삭제/탈퇴 | 헤드라인 "이 카드는 지난 달 이야기예요" + 서브 "지금은 볼 수 없지만, 픽콩에서 내 도감은 언제든 시작할 수 있어요" + CTA "픽콩 시작하기" |
| 잘못된 card_id | 헤드라인 "카드를 찾을 수 없어요" + CTA "픽콩 시작하기" |

| 공통 |
|---|
| 광고 0건 / 권한 0건 / 인증 필수(GET /cards/:id) |
| Events: cardview_view(card_id, is_owner, card_month), cardview_expired_view(reason), cardview_press_start_my_diagram, cardview_load_fail |

### S-SHARE (공유 시트, PRD §7.14)

| Section | Spec |
|---|---|
| Layout | 바텀 시트 (Drawer 모달, swipe-down 가능) |
| 상단 안내 | "이번 달 안에만 볼 수 있어요" — 12px 회색, 좌상단 |
| Body | "이미지 저장" (saveBase64Data) + "토스로 공유하기" (getTossShareLink + share) |
| 메시지 양식 | `{닉네임}의 이번 달 카드예요. 이번 달 안에만 볼 수 있어요.` (PRD §16 인용 — 닉네임 9~10자에서도 30자 내) |
| Scheme | `/card/{card_id}` |
| 외부 SNS | **호출 금지** |
| Events | share_sheet_view, share_view_expiry_notice_view(copy_variant=neutral), share_press_save_image, share_save_image_success, share_press_share, share_complete |

### S-AD (전면 광고 인터루드, PRD §7.9)

| Section | Spec |
|---|---|
| 트리거 | 위치 A — S-HOME "이번 달 카드 보기" 첫 시도 (해당 월 ad_card_shown 미저장) |
| 동작 | IntegratedAd.load() 1.5s 타임아웃 → 성공 시 show() → 광고 닫힘 시 S-CARD 자동 진입 / 실패·타임아웃 시 즉시 S-CARD (silent skip) |
| 캡 갱신 | ad_show 발생 시점에만 ad_card_shown:{user_key}:{yyyymm}=true, 로드 실패/skip/종료 시 갱신 없음 |
| UI | 풀스크린 광고 (SDK가 제공) + 로딩 스피너 (1.5s 한정) |
| 다크패턴 4번 회피 | 위치 A 1지점만, 월 1회, 진입 직후·온보딩·로그인·닉네임 전후·공유·열람자 온보딩에는 0건 |
| Events | ad_eligible, ad_load_request, ad_load_success, ad_load_fail(error_code), ad_show, ad_dismiss(dwell_ms), ad_skip_due_to_fail |

### S-NICK-EDIT (설정의 닉네임 변경, PRD §7.5)

| Section | Spec |
|---|---|
| 진입 | S-SET → "닉네임 바꾸기" |
| 헤드 | "닉네임을 바꿀까요?" + 서브 "바뀐 이름은 이번 달 카드부터 보여요" |
| 입력 | 현재 닉네임 prefill + 추천 칩 6개 동일 노출 (S-NICK과 같은 컴포넌트 재사용) |
| 검증 | S-NICK과 동일 (정규식 + 자모 + 금칙어 + 5종 토스트) |
| 저장 API | PATCH /account/nickname (현재 달 active 카드 nickname_snapshot 동기화 트랜잭션) |
| BottomCTA | "이 이름으로 바꿀게요" + Secondary "취소" |
| 성공 토스트 | "닉네임을 바꿨어요" |
| Events | nickedit_view, nickedit_press_suggest, nickedit_input_blocked_char, nickedit_press_save, set_change_nickname_success/fail |

### S-LIST (기록 목록 + 수정·삭제, PRD §7.15)

| Section | Spec |
|---|---|
| 진입 | S-HOME 메뉴 (햄버거 또는 리스트 아이콘) |
| Body | 카테고리 필터 chip 9개 (전체 + 8 카테고리) + 최신순 리스트 |
| Row | 이모지 + 메모 + 금액 + 날짜, 우측 ··· 메뉴 |
| 시트 | 수정 / 삭제 (삭제 시 confirm bottom sheet) |
| 삭제 시 | 단말 + 서버 sync (cute_items 단말 only이므로 단말 동기화만, 같은 달 카드 dirty 처리는 서버 미적용 — Phase 2 cron이 다음 진입 시 재계산) |
| Events | list_view, list_press_edit, list_press_delete, list_delete_success |

### S-SET (설정·정보, PRD §7.16)

| Section | Spec |
|---|---|
| 항목 | "데이터 초기화 (단말 캐시만)" / "닉네임 바꾸기" → S-NICK-EDIT / "내 도감 데이터 삭제 (탈퇴)" → confirm sheet → DELETE /account / 버전 정보 / 만든이 / 신고하기 |
| 탈퇴 confirm | "내 도감을 모두 지울까요? 기록은 되돌릴 수 없어요." (PRD §16) — 빨간 강조 톤 X, 진중 회색 톤 |
| Events | set_view, set_press_reset, set_press_change_nickname, set_press_account_delete, set_account_delete_confirm, set_account_delete_success, set_account_delete_fail |

## Toss Mini-App Specifics (Phase 2 추가)

- 공유 메시지 30자 내외 고정 — 닉네임 9~10자 + 양식 텍스트 검증
- 토스 share만 사용 (외부 SNS·외부 URL 0건)
- OG 이미지 미사용 (Phase 2 백로그)
- 광고: silent skip + 1.5s 타임아웃 + 위치 A 단일
- 만료 사전 안내 카피 4지점 (S-CARD 본인 매번 / S-SHARE 시트 / 메시지 / S-CARD-VIEW 만료)

## Asset Inventory (Phase 2)

- 캐릭터 일러스트 8종 (PRD §12 + Phase 1엔 placeholder만)
  - 굿즈콩 햄스터 / 문구콩 토끼 / 간식콩 고양이 / 선물콩 곰돌이 / 덕질콩 다람쥐 / 반려콩 강아지 / 취향부자 콩요정 / 새싹콩 수집가
- 도감 미니컷 (S-VIEWER-INTRO, 1종)
- 카드 캡처용 PNG 렌더링 (saveBase64Data) — html2canvas 또는 Canvas API 사용

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS (PRD §16 카피 토씨 일치)
- [x] Dimension 2 Visuals: PASS (캐릭터 + 그리드 미리보기 focal point 명확)
- [x] Dimension 3 Color: PASS (60/30/10 유지, accent 라벤더)
- [x] Dimension 4 Typography: PASS (Phase 1 토큰 상속)
- [x] Dimension 5 Spacing: PASS (4의 배수)
- [x] Dimension 6 Registry Safety: PASS (TDS only, shadcn 미사용)

**Approval:** approved 2026-05-01 (autonomous mode)
