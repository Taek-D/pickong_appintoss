# Requirements: 픽콩 (pickkong)

**Defined:** 2026-05-01
**Core Value:** 한 번 픽하면 30초 안에 도감이 채워지고, 한 달치 취향이 친구에게 보여줄 수 있는 캐릭터 카드로 돌아온다.

> 모든 v1 요구사항은 `pickkong_prd_v2.0.md` §8 (F-XX) 및 §3.1 MVP 범위에서 추출되었으며, harness-workflow의 `feature_list.json`과 1:1 추적 가능합니다.

## v1 Requirements

### Auth (인증·계정·닉네임)

- [ ] **AUTH-01**: 사용자는 토스 로그인 (`appLogin`)으로 픽콩에 강제로 로그인하고 user_key를 영속 보유한다 — 우회 경로 0건 (PRD §5.7, §7.3 / F-13)
- [ ] **AUTH-02**: 로그인 끊김이 감지되면 바텀시트 없이 자동으로 S-LOGIN으로 라우팅되어 재연결된다 (PRD §5.7 / F-14)
- [ ] **AUTH-03**: 사용자는 로그인 직후 1회 닉네임을 입력해야 본 흐름을 통과할 수 있고, 한글 완성형 + 영문 + 숫자만 1~10자로 허용된다 — 자모 단독·이모지·특수문자·공백은 입력 단계에서 자동 무시된다 (PRD §5.8, §7.4 / F-21)
- [ ] **AUTH-04**: 닉네임 추천 칩 6개(귀염콩/굿즈콩/문구콩/덕질콩/픽콩러/수집콩)가 최초 입력 화면과 설정 변경 화면 모두에서 동일하게 노출된다 (PRD §5.8, §7.4, §7.5)
- [ ] **AUTH-05**: 사용자는 설정에서 닉네임을 변경할 수 있고, 변경 시 현재 달 active 카드의 nickname_snapshot만 갱신된다 (과거 카드는 시점성 보존) (PRD §5.8, §10.7 / F-25)
- [ ] **AUTH-06**: 사용자는 설정 → '내 도감 데이터 삭제'로 회원 탈퇴할 수 있고, removeByUserKey + accounts.status='withdrawn' + cute_items + monthly_cards 일괄 삭제 + Storage 클리어가 트랜잭션으로 처리된다 (PRD §5.9 / F-15)

### Safety (금칙어·검증)

- [ ] **SAFE-01**: 백엔드 닉네임 API에 `forbidden_nicknames.json` 정적 사전 + `forbidden_patterns.regex` 변형 정규식이 적용되어, 관리자/운영/픽콩공식 등 사칭 단어가 강력히 차단된다 (PRD §5.11, §10.9 / F-26)
- [ ] **SAFE-02**: 욕설·혐오 단어는 가볍게 1차 차단, 정치·종교·광고·도배는 신고 운영으로 처리된다 (PRD §5.11)
- [ ] **SAFE-03**: 금칙어 v1이 W1 마지막 날(D7) 운영 배포에 머지된다 (PRD §5.11)

### Home (도감·집계)

- [ ] **HOME-01**: 메인 도감(S-HOME)은 카테고리 8칸 그리드 + 이번 달 수집률 + 주간 진행 텍스트 + BottomCTA "오늘의 콩 줍기"를 표시한다 (PRD §7.6 / F-01, F-03)
- [ ] **HOME-02**: 이번 달 카드 보기 버튼은 본인 기록 ≥3일 때만 활성화되고, 기록 <3 상태에서는 "기록 3개부터 카드를 받을 수 있어요"가 노출된다 (PRD §7.6)
- [ ] **HOME-03**: 카테고리 상세(S-CAT)는 헤더 + 리스트(이모지/메모/날짜)를 제공하고, empty 시 "이 카테고리는 아직 비어 있어요. 하나 담아볼까요?" CTA가 노출된다 (PRD §7.10 / F-09)

### Add (콩 등록·수정·삭제)

- [ ] **ADD-01**: 콩 등록(S-ADD)은 카테고리 → 금액 → 이모지·메모 3단계로 진행되며, 평균 30초 내 첫 기록을 완료할 수 있다 (PRD §7.7 / F-02)
- [ ] **ADD-02**: 카테고리는 8개 중 1개 필수, 금액은 0 이상 정수(빈값 허용), 이모지는 추천 12개 + 직접 입력, 메모는 1~24자 권장·최대 60자다 (PRD §7.7)
- [ ] **ADD-03**: 등록 완료 화면(S-DONE)은 "{카테고리}콩 하나를 주웠어요" 헤드라인 + "이번 달 N번째 귀여움이에요. 도감 수집률 X%" 서브 + CTA 2종을 표시하고, 광고 트리거가 없다 (PRD §7.8)
- [ ] **ADD-04**: 사용자는 기록 목록(S-LIST)에서 본인 기록을 수정·삭제할 수 있고, 삭제 시 단말+서버 동기화 + 같은 달 카드 dirty 처리가 일어난다 (PRD §7.15 / F-06)

### Card (월간 카드 룰·저장)

- [ ] **CARD-01**: 월간 결과 카드 캐릭터는 카테고리 분포 룰베이스(굿즈≥40%→굿즈콩 햄스터 등 8종 + 다양성≥5종→취향부자 콩요정 + 기록<3→새싹콩 수집가)로 결정되며, 서버·클라가 동일 로직을 사용한다 (PRD §12 / F-04)
- [ ] **CARD-02**: 본인이 S-CARD에 진입할 때마다 `POST /cards/{user_key}/{yyyymm}` upsert가 실행되어 8자 [a-z0-9] hash card_id가 발급되고, 충돌 시 최대 5회 재시도된다 (PRD §7.11, §10.5 / F-18)
- [ ] **CARD-03**: 본인 카드는 `card_status='active'`로 영구 유지되고, 공유 카드(타인 열람용)는 `share_status='active'`로 매월 1일 0시 KST에 expired 처리된다 (PRD §10.8, §13.1 / F-23)
- [ ] **CARD-04**: 본인 S-CARD 본문 하단에는 "친구는 이번 달 안에만 볼 수 있어요" 카피가 매번 노출된다 — 회색 톤·작은 폰트, 경고 컬러 미사용 (PRD §5.10, §7.11 / F-24)

### Share (공유·메시지)

- [ ] **SHARE-01**: S-SHARE 시트에서 사용자는 카드를 이미지로 저장(`saveBase64Data`)하거나 토스로 공유(`getTossShareLink` + `share`)할 수 있고, 외부 SNS 직접 호출은 금지된다 (PRD §7.14 / F-05)
- [ ] **SHARE-02**: 토스 공유 메시지 본문은 `"{닉네임}의 이번 달 카드예요. 이번 달 안에만 볼 수 있어요."` 양식을 사용하고, 닉네임 9~10자에서도 미리보기 컷오프가 발생하지 않는다 (PRD §7.14, §16 / F-27)
- [ ] **SHARE-03**: 공유 링크는 토스 내부 스킴 `/card/{8-hash}`만 사용하며, 외부 호스팅 OG 이미지·미리보기 자산은 0건이다 (PRD §5.4, §5.10)
- [ ] **SHARE-04**: S-SHARE 시트 상단과 공유 메시지 본문 끝에 "이번 달 안에만 볼 수 있어요" 카피가 통일되어 표시된다 (PRD §5.10, §16 / F-24)

### View (공유 카드 열람)

- [ ] **VIEW-01**: 공유 링크로 진입한 사용자는 미로그인이면 S-LOGIN을 통과해야 카드를 열람할 수 있다 (PRD §6.2, §7.13 / F-19)
- [ ] **VIEW-02**: 공유 카드 열람(S-CARD-VIEW)은 본인-active / 타인-active / 만료(expired·deleted·withdrawn) 4가지 상태로 분기되며, 광고 노출이 0건이다 (PRD §7.13)
- [ ] **VIEW-03**: 신규 가입자가 공유 링크로 들어오면 닉네임 입력 후 1장 온보딩(S-VIEWER-INTRO)이 1회만 노출되고 viewer_intro_seen 플래그가 단말에 저장된다 (PRD §7.12 / F-22)
- [ ] **VIEW-04**: 만료/삭제/탈퇴자 카드 진입 시 "이 카드는 지난 달 이야기예요" 헤드라인 + "지금은 볼 수 없지만, 픽콩에서 내 도감은 언제든 시작할 수 있어요" 서브 + CTA "픽콩 시작하기"가 일관되게 표시된다 (PRD §5.10, §7.13 / F-20)

### Ads (광고·캡)

- [ ] **AD-01**: 전면형 광고는 위치 A(S-HOME에서 "이번 달 카드 보기" 첫 시도) 1지점에서만 트리거되며, 사용자당 월 1회 단일 캡이 적용된다 (PRD §5.6, §7.9 / F-16)
- [ ] **AD-02**: 광고 캡 갱신은 `ad_show` 발생 시점에만 수행되고, 로드 실패·타임아웃·skip·종료 시에는 갱신되지 않는다 (PRD §5.6 / F-17)
- [ ] **AD-03**: `IntegratedAd.load()`는 1.5s 타임아웃을 가지며, 실패/타임아웃 시 silent skip으로 즉시 S-CARD에 진입한다 (PRD §5.6, §7.9)
- [ ] **AD-04**: 공유 카드 열람(S-CARD-VIEW), 열람자 1장 온보딩(S-VIEWER-INTRO), S-DONE, 카테고리 전환, 신고/설정 진입, 탈퇴 흐름에는 광고가 노출되지 않는다 (PRD §5.6)

### Submit (출품·메타·검수)

- [ ] **SUBMIT-01**: 챌린지 출품폼 한 줄 소개(50자 이내)와 챌린지 연관성(200자 이내) 카피가 W3a에 1차 확정되고, W3b에 토씨 단위로 최종 점검된다 — 글자수는 띄어쓰기 포함 자동 검증한다 (PRD §14.2 / F-30)
- [ ] **SUBMIT-02**: 앱인토스 §5.15 검수 체크리스트의 모든 필수(✅) 항목이 통과되고, 어뷰징 차별화 코멘트(§5.3)가 검수 요청에 첨부된다 (PRD §5.15)
- [ ] **SUBMIT-03**: 콘솔 제출 메타(앱 이름, 한 줄 소개, 상세 설명, 카테고리, 검색 키워드, 사용 연령)와 광고 콘솔 + 정산 채널이 활성화된다 (PRD §14.1, §17.1)

### Observability (분석·모니터링)

- [ ] **OBS-01**: PRD §9.2 이벤트 택소노미(login_*, nick_*, nickedit_*, ad_*, home_*, add_*, done_*, card_*, share_*, viewerintro_*, cardview_*, set_*)가 Granite Analytics에 적재된다
- [ ] **OBS-02**: Sentry가 클라이언트 + 서버에 적재되어 크래시 프리율 ≥99.5% 가드레일을 모니터링한다 (PRD §17.3, §2.2)
- [ ] **OBS-03**: 광고 직후 `card_view` 도달률 <95%, 만료 배치 실패, 닉네임 `nick_save_fail`(forbidden/jamo_only) 비중 증가 알람이 등록된다 (PRD §17.3)

## v2 Requirements

### Phase 2 (PRD §3.3 백로그)

- **V2-01**: 캐릭터 미세 애니메이션 (F-10)
- **V2-02**: 테마 스킨 (F-11)
- **V2-03**: 월간 히스토리 (F-12)
- **V2-04**: 보상형 광고
- **V2-05**: 토스 공유 리워드
- **V2-06**: 카테고리 커스텀
- **V2-07**: 위젯형 도감
- **V2-08**: 카드 좋아요
- **V2-09**: 닉네임 이모지·특수문자 허용
- **V2-10**: 금칙어 관리 콘솔
- **V2-11**: 카드 OG 이미지 자동 생성·캐싱 (F-31)

## Out of Scope

| Feature | Reason |
|---------|--------|
| 카드/계좌 연동 | 금융 상품 영역 — 검수 회피 |
| 사진 업로드 | 운영 부담 + 개인정보 최소화 |
| 쇼핑/제휴 링크 | 외부 링크 정책 위반 |
| 미로그인 둘러보기 | IA 단순화 + 토스 로그인 강제 |
| 위치 B 광고 | 다크패턴 4번 위험 (예상치 못한 광고) |
| 24h 안전 캡 | 단순화 — 월 1회로 충분 |
| 광고 직전 안내 화면 | 흐름 단절 위험 |
| 보상형 광고 | Phase 2 백로그 |
| 카드 한 줄 메모 | 카드 데이터 텍스트 미저장 |
| 공유 카드 영구 유지 | 본인은 영구 / 공유는 월 만료 정책 분리 |
| 닉네임 이모지·특수문자·자모 단독 | 검수 + 렌더링 안전성 |
| 닉네임 추천 칩 일부 랜덤 | 단순성 |
| 닉네임 과거 카드 일괄 동기화 | 시점성 보존 + 구현 단순화 |
| 별도 금칙어 관리 콘솔 | 코드 푸시 운영으로 충분 |
| 정치·종교·광고·도배 강력 차단 | 신고/hotfix 운영으로 충분 |
| S-LIST/S-CAT 본인 카피 분기 추가 | S-CARD 한 곳으로 충분 |
| 공유 미리보기 OG 이미지 | MVP 복잡도 — Phase 2 |
| 포인트/리워드/친구 초대 보상/AI 코멘트/랭킹/팔로우/채팅/카드 좋아요 | 정책·검수·범위 외 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| AUTH-04 | Phase 1 | Pending |
| AUTH-05 | Phase 2 | Pending |
| AUTH-06 | Phase 2 | Pending |
| SAFE-01 | Phase 1 | Pending |
| SAFE-02 | Phase 1 | Pending |
| SAFE-03 | Phase 1 | Pending |
| HOME-01 | Phase 1 | Pending |
| HOME-02 | Phase 1 | Pending |
| HOME-03 | Phase 1 | Pending |
| ADD-01 | Phase 1 | Pending |
| ADD-02 | Phase 1 | Pending |
| ADD-03 | Phase 1 | Pending |
| ADD-04 | Phase 2 | Pending |
| CARD-01 | Phase 2 | Pending |
| CARD-02 | Phase 2 | Pending |
| CARD-03 | Phase 2 | Pending |
| CARD-04 | Phase 2 | Pending |
| SHARE-01 | Phase 2 | Pending |
| SHARE-02 | Phase 2 | Pending |
| SHARE-03 | Phase 2 | Pending |
| SHARE-04 | Phase 2 | Pending |
| VIEW-01 | Phase 2 | Pending |
| VIEW-02 | Phase 2 | Pending |
| VIEW-03 | Phase 2 | Pending |
| VIEW-04 | Phase 2 | Pending |
| AD-01 | Phase 2 | Pending |
| AD-02 | Phase 2 | Pending |
| AD-03 | Phase 2 | Pending |
| AD-04 | Phase 2 | Pending |
| OBS-01 | Phase 3 | Pending |
| OBS-02 | Phase 3 | Pending |
| OBS-03 | Phase 3 | Pending |
| SUBMIT-01 | Phase 3 | Pending |
| SUBMIT-02 | Phase 3 | Pending |
| SUBMIT-03 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 38 total
- Mapped to phases: 38
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-01*
*Last updated: 2026-05-01 after initial definition (auto mode from pickkong_prd_v2.0.md)*
