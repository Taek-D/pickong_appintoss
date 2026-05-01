# Roadmap: 픽콩 (pickkong)

## Overview

23일 내 앱인토스 비게임 미니앱 출품을 위한 4페이즈 코스 로드맵. PRD §18(W1~W3b) 일정과 1:1 매핑되며, 각 페이즈는 검수 반려를 차단하는 게이트로 기능한다 — Phase 1은 토스 로그인·닉네임·금칙어 v1 D7 배포로 신뢰 베이스를 깔고, Phase 2는 카드·공유·광고·만료까지 핵심 가치 루프를 완성하고, Phase 3은 검수 직전 회귀와 출품폼 카피로 반려 가능성을 사전 차단하고, Phase 4는 콘솔 검토 → 반려 패치 → 출품 마감 D-3까지 안착한다.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3, 4): Planned milestone work
- Decimal phases (e.g., 2.1): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Foundation (W1, D1~D7)** — 인프라 + 토스 로그인 강제 + 닉네임 1회 입력 + 도감/등록 핵심 루프 + 금칙어 v1 D7 배포 ✓ 2026-05-01 (static-pass, 런타임 검증 대기)
- [x] **Phase 2: Card·Share·Ads (W2, D8~D14)** — 월간 카드 upsert + 공유 흐름 + 만료 배치 + 전면 광고 단일 캡 + 닉네임 변경/탈퇴 + 만료 사전 안내 카피 ✓ 2026-05-01 (static-pass)
- [x] **Phase 3: Pre-submission Hardening (W3a, D15~D18)** — §5.15 검수 체크리스트 + 회귀(S-CARD-VIEW 4케이스, 닉네임 동기화, 9~10자 미리보기) + Sentry/Analytics + 출품폼 카피 1차 확정 ✓ 2026-05-01 (passed)
- [ ] **Phase 4: Submission & Patch (W3b, D19~D23)** — 콘솔 검토 요청 + 반려 시 패치 1회 + 챌린지 출품폼 최종 제출 (D-3 출시 승인)

## Phase Details

### Phase 1: Foundation

**Goal**: 사용자가 픽콩에 토스 로그인으로 진입해 닉네임을 1회 등록하고, 30초 내 첫 콩을 도감에 기록할 수 있다. 백엔드 mTLS와 금칙어 사전 v1이 D7까지 운영 배포된다.

**Depends on**: Nothing (first phase)

**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, SAFE-01, SAFE-02, SAFE-03, HOME-01, HOME-02, HOME-03, ADD-01, ADD-02, ADD-03

**Success Criteria** (what must be TRUE):
  1. 신규 사용자가 온보딩 → 토스 로그인 → 닉네임 입력 → S-HOME 진입까지 인터럽트 없이 통과한다
  2. 닉네임 입력에서 자모 단독·이모지·특수문자·관리자 사칭 단어가 모두 차단되고, 추천 칩 6개가 1탭으로 적용된다
  3. 사용자가 S-HOME에서 BottomCTA를 누르면 카테고리 → 금액 → 이모지·메모 3단계로 30초 내 첫 콩을 등록하고 S-DONE에 도달한다
  4. 백엔드 `/auth/exchange`, `/auth/me`, `/account/nickname`이 mTLS로 동작하고 D7까지 `forbidden_nicknames.json` + `forbidden_patterns.regex` v1이 운영에 머지된다
  5. 도감 그리드 8칸 + 이번 달 수집률 + 주간 진행 텍스트가 정상 렌더되고, 기록 <3 상태에서 카드 버튼이 비활성화된다

**Plans**: 5 plans

Plans:
- [ ] 01-01: Vite + React 19 + Tailwind 4 + @apps-in-toss/web-framework 2.0.1 스캐폴드 + 백엔드 mTLS 스켈레톤 + DB 마이그레이션(accounts, monthly_cards) + Storage 키 세팅
- [ ] 01-02: 토스 로그인 강제 (S-ONB → S-LOGIN → 끊김 자동 재연결) + appLogin + /auth/exchange + user_key 영속
- [ ] 01-03: 닉네임 1회 입력 (S-NICK) — 정규식 + 자동 무시 + 추천 칩 6개 + POST /account/nickname
- [ ] 01-04: 금칙어 v1 (forbidden_nicknames.json + forbidden_patterns.regex 변형) + 백엔드 검증 파이프라인 + D7 운영 배포
- [ ] 01-05: 도감 그리드 (S-HOME) + 콩 등록 3단계 (S-ADD) + 완료 화면 (S-DONE) + S-CAT empty 상태 + cute_items 단말 모델

### Phase 2: Card·Share·Ads

**Goal**: 사용자가 한 달치 기록을 캐릭터 카드로 받아 토스 친구에게 공유할 수 있고, 공유 카드는 월 만료 + 본인 영구 유지 정책으로 동작한다. 전면 광고는 위치 A 단일 지점에서 월 1회만 노출되며, 닉네임 변경과 회원 탈퇴가 정상 처리된다.

**Depends on**: Phase 1

**Requirements**: AUTH-05, AUTH-06, ADD-04, CARD-01, CARD-02, CARD-03, CARD-04, SHARE-01, SHARE-02, SHARE-03, SHARE-04, VIEW-01, VIEW-02, VIEW-03, VIEW-04, AD-01, AD-02, AD-03, AD-04

**Success Criteria** (what must be TRUE):
  1. 본인이 기록 ≥3 후 S-HOME에서 카드 버튼을 누르면 위치 A 광고 1회 → S-CARD 진입 또는 silent skip → S-CARD 진입이 자연스럽게 일어난다
  2. S-CARD 본문 하단에 "친구는 이번 달 안에만 볼 수 있어요" 카피가 매번 노출되고, S-SHARE/메시지/S-CARD-VIEW 만료에서도 카피가 통일된다
  3. 사용자가 토스 share로 카드를 보낸 후 공유 링크를 다시 열면 본인은 active, 타인은 같은 달 active, 매월 1일 0시 KST 이후엔 expired 안내 화면이 표시된다
  4. 신규 가입자가 공유 링크로 들어오면 로그인 → 닉네임 → S-VIEWER-INTRO 1장 → S-CARD-VIEW로 도달하고, 기존 사용자는 즉시 S-CARD-VIEW로 직진한다
  5. 사용자가 설정에서 닉네임을 바꾸면 현재 달 active 카드의 nickname_snapshot만 갱신되고, 회원 탈퇴 시 user_key의 monthly_cards가 모두 삭제되며 S-ONB로 복귀한다
  6. 광고 캡은 ad_show 시점에만 갱신되고, 로드 실패/타임아웃/skip/종료 시에는 갱신되지 않는다

**Plans**: 5 plans

Plans:
- [ ] 02-01: 월간 카드 룰베이스 (서버·클라 동일) + monthly_cards upsert (8자 hash, 5회 재시도) + S-CARD 본인 카피 분기 매번 노출
- [ ] 02-02: S-SHARE 시트 (이미지 저장 + 토스 share + 메시지 양식) + 스킴 /card/{8-hash} 파싱 + 만료 사전 안내 카피 4지점 통일
- [ ] 02-03: S-CARD-VIEW 4분기(본인·타인·만료·탈퇴자) + S-VIEWER-INTRO + viewer_intro_seen 플래그 + 공유 링크 라우팅
- [ ] 02-04: 전면 광고 위치 A 단일 (IntegratedAd 1.5s 타임아웃 + silent skip) + 월 1회 캡 (ad_card_shown:{user_key}:{yyyymm}, ad_show 시점만 갱신)
- [ ] 02-05: 닉네임 변경 (S-NICK-EDIT + PATCH /account/nickname + 현재 달 active 카드 nickname_snapshot 동기화 트랜잭션) + 회원 탈퇴 + 공유 카드 월 만료 cron (매월 1일 0시 KST + 1시간 6회 재시도) + 기록 수정/삭제 (S-LIST)

### Phase 3: Pre-submission Hardening

**Goal**: §5.15 검수 체크리스트의 모든 필수 항목이 통과되고, S-CARD-VIEW 4케이스·닉네임 동기화·닉네임 9~10자 미리보기 회귀가 우선순위로 클로즈된다. Sentry/Analytics가 적재되고 챌린지 출품폼 카피가 1차 확정된다.

**Depends on**: Phase 2

**Requirements**: OBS-01, OBS-02, OBS-03, SUBMIT-01, SUBMIT-02

**Success Criteria** (what must be TRUE):
  1. §5.15 앱인토스 검수 체크리스트의 모든 필수(✅) 항목이 통과되고 어뷰징 차별화 코멘트가 작성되어 검수 요청에 첨부 가능하다
  2. S-CARD-VIEW 본인·타인·만료·탈퇴자 4케이스, 닉네임 변경 후 active 카드 동기화, 닉네임 9~10자 공유 메시지 미리보기 컷오프 없음이 회귀 검증된다
  3. 다크패턴 5종(특히 4번 예상치 못한 광고) 0건 + 라이트 모드 일관성 + Safe Area + iOS 스와이프 백 정상 + UX 라이팅 디테일이 다듬어진다
  4. PRD §9.2 이벤트 택소노미가 Granite Analytics에 적재되고, Sentry가 클라+서버에 연동되며, 광고 직후 card_view 도달률·만료 배치 실패·nick_save_fail 알람이 등록된다
  5. 챌린지 출품폼 한 줄 50자 / 연관성 200자 카피가 1차 확정되고 글자수 자동 검증을 통과한다

**Plans**: 4 plans

Plans:
- [ ] 03-01: §5.15 검수 체크리스트 전수 점검 + 다크패턴 5종 회귀 + Safe Area/스와이프 백/라이트 모드 일관성 검증
- [ ] 03-02: 회수분 우선 회귀 — (b) S-CARD-VIEW 4케이스 → (c) 닉네임 변경 후 active 카드 동기화 → (a) 라이팅 디테일 + 닉네임 9~10자 미리보기 추가 케이스
- [ ] 03-03: Sentry 클라+서버 연동 + Granite Analytics 이벤트 적재 + 알람 등록 (광고 도달률, 만료 배치, nick_save_fail)
- [ ] 03-04: 출품폼 카피 1차 확정 (한 줄 35자 / 연관성 196자) + 글자수 자동 검증 + 어뷰징 차별화 코멘트 작성

### Phase 4: Submission & Patch

**Goal**: 콘솔 검토 요청 → 반려 시 패치 1회 → 챌린지 출품폼 최종 제출까지 완료한다. 마감 D-3(2026-05-21)까지 출시 승인을 받고, 30분 모니터링 윈도우에서 핵심 이벤트가 정상 적재된다.

**Depends on**: Phase 3

**Requirements**: SUBMIT-03

**Success Criteria** (what must be TRUE):
  1. 광고 콘솔 + 정산 채널이 활성화되고, 콘솔 제출 메타(앱 이름, 한 줄, 상세, 키워드, 사용 연령, 고객센터 채널)가 입력 완료된다
  2. 번들(.ait) 압축 해제 ≤30MB로 빌드되고 콘솔 업로드 + QR 테스트(공유 4가지·닉네임 5가지·S-CARD-VIEW 4케이스·닉네임 9~10자)가 통과된다
  3. 영업일 3일 검수 후 승인되거나, 반려 시 1차 패치(5일 버퍼 내)로 재제출되어 D-3까지 출시 승인을 받는다
  4. 출시 후 30분 모니터링 윈도우에서 home_view, login_success, nick_save_success, card_view, share_complete, ad_show 적재 + Sentry 크래시 프리율 ≥99.5%가 확인된다
  5. 2026-05-24 마감 전 챌린지 출품폼 최종 카피 + 미니앱 링크가 제출된다

**Plans**: 3 plans

Plans:
- [ ] 04-01: 광고 콘솔 + 정산 채널 활성 + 콘솔 제출 메타 + mTLS 인증서 환경 분리 + 만료 배치 cron + 알람 등록 최종 점검
- [ ] 04-02: 번들 빌드(.ait, ≤30MB) + 콘솔 업로드 + QR 회귀 테스트(공유·닉네임·S-CARD-VIEW·9~10자) + 검수 요청 (어뷰징 차별화 코멘트 첨부)
- [ ] 04-03: 반려 시 패치 1회 → 재제출 → 출시 승인 → 30분 모니터링 → 챌린지 출품폼 제출 (한 줄 + 연관성 최종 토씨 점검)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 5/5 | Complete (static-pass) | 2026-05-01 |
| 2. Card·Share·Ads | 5/5 | Complete (static-pass) | 2026-05-01 |
| 3. Pre-submission Hardening | 4/4 | Complete (passed) | 2026-05-01 |
| 4. Submission & Patch | 0/3 | Not started | - |

---
*Roadmap created: 2026-05-01 (Coarse, 4 phases, derived from pickkong_prd_v2.0.md §18)*
