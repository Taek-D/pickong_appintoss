# 픽콩 PRD v2.0 — 앱인토스 런칭용 (출품 확정안)

> **픽콩 = 오늘의 귀여움 수집 도감**
> 문구·굿즈·간식·선물처럼 마음에 든 귀여운 것들을 하나씩 픽하고, 나만의 취향도감을 채우는 미니앱.

---

## 0. 문서 메타

| 항목 | 내용 |
|---|---|
| 문서 버전 | v2.0 (출품·검수용 확정안) |
| 이전 버전 | v1.9 |
| 작성일 | 2026-05-01 |
| 작성자 | PRD Builder (Assistant) |
| 대상 플랫폼 | 앱인토스(Apps in Toss) 미니앱 |
| 챌린지 | 앱인토스 바이브코딩 챌린지 — “귀여운 게 최고야” |
| 출품 마감 | 2026-05-24 (잔여 약 23일) |
| 앱 유형 판정 | 비게임(non-game) — 라이프스타일/일상/기록 |
| 사업자 등록 | 콘솔 등록 완료 |

### 0.1 변경 요약 (v1.9 → v2.0)

**확정 / 다듬음**

- **출품폼 한 줄 소개 카피 자연스러움 보강**: “좋아한 귀여운”의 어색함을 풀어 “마음에 든 귀여움을 하나씩 픽해 모으는 나만의 취향 도감이에요.” 로 다듬음.
- **출품폼 연관성 카피의 ‘소비 조장 방어 문구’ 유지**: “소비를 반성하는 가계부가 아니라, 좋아한 마음을 가볍게 자랑하는…”을 그대로 살림.
- **W1 OG 제거 회수분 재배치**(권장안 확정): (b) S-CARD-VIEW 만료/탈퇴자 케이스 회귀 → (c) 닉네임 변경 후 active 카드 동기화 회귀 → (a) 라이팅 디테일 다듬기 순으로 일정에 명시.
- **닉네임 9~10자 공유 메시지 미리보기 검증**을 W3a 회귀 케이스에 추가.
- **Phase 2 백로그에 OG 이미지 항목 유지**(의사결정 흔적 보존).
- 위 변경에 맞춰 §14.2 카피 텍스트, §16 출품폼 한 줄 소개, §11.1·§11.3 QA 케이스, §18 일정, §19 DoD에 반영.

**유지**

- 토스 로그인 강제 / 회원 탈퇴 P0 / 라이트 모드 / 다크패턴 0건.
- 전면 광고 위치 A 단일, 월 1회 단일 캡, `ad_show` 시점만 캡 갱신.
- 8자 hash 카드 ID, 본인 카드 영구·공유 카드 월 만료.
- 닉네임: 한글 완성형 + 영문 + 숫자, 자모 단독 차단, 추천 칩 6개 고정.
- 닉네임 변경 시 현재 달 active 카드만 동기화.
- 금칙어 v1 D7 배포, 관리자 사칭 강력 / 욕설·혐오 가볍게.
- 공유 미리보기 OG 이미지 미사용(MVP), Phase 2 백로그 유지.

**삭제**

- “좋아한 귀여운 것들”이라는 어색한 문장.
- 한 줄 소개 변형(28자) 후보 보관 옵션(동결 결정).

---

## 1. 1페이지 요약

| 항목 | 내용 |
|---|---|
| 문제 | 좋아한 귀여운 것들이 사진첩·메모·카톡에 흩어져 있어요. |
| 가치 | 마음에 든 것을 모아보는 **취향 도감 기록 앱**이에요. |
| 대상 | 귀여운 것에 반응하는 20~30대, 덕질·굿즈·문구 수집을 즐기는 사용자 |
| 핵심 기능 (P0) | 1) 토스 로그인 2) 닉네임 입력(완성형 텍스트만, 1회) 3) 콩 등록 4) 도감 그리드 5) 수집률 6) 월간 캐릭터 7) 결과 카드 8) 서버 카드 저장·공유 9) 공유 카드 월 만료 + 본인 카피 분기 10) 회원 탈퇴 |
| 수익화 | 전면형 인앱 광고 1곳 — “월간 결과 카드 첫 진입 직전, 사용자당 월 1회”, 보상형은 Phase 2 |
| 핵심 제약 | 비게임 검수 / 자사앱·외부링크 제한 / 다크패턴 금지 / 어뷰징 방지 / 라이트 모드 / 광고 1지점·월 1회 / 토스 로그인 강제 / 공유 카드 월 만료 / 관리자 사칭 강력 차단 |
| 일정 | 약 3주(개발 14일 + 검수·반려 7~9일) |

---

## 2. 목표와 성공지표

### 2.1 목표

- **정성**: 진입한 순간 “이거 귀엽다, 한 번 해볼래”를 5초 안에 느끼게 해요.
- **정량**: 챌린지 기간 내 검수 1회 통과, 일평균 기록 1회 이상 사용자 비율 30% 이상.

### 2.2 KPI / 가드레일

| 구분 | 지표 | 목표 | 가드레일 |
|---|---|---:|---|
| 활성화 | 첫 방문 → 첫 기록 전환율 | ≥ 40% | 첫 화면 이탈률 60% 이하 |
| 활성화 | 첫 기록까지 평균 시간 | ≤ 30초 | 입력 단계 3단계 이하 |
| 활성화 | 토스 로그인 성공률 | ≥ 95% | 회복 경로 100% |
| 활성화 | 로그인 → 닉네임 → 첫 기록 전환율 | ≥ 55% | 1탭 추천 닉네임 |
| 활성화 | 닉네임 입력 평균 시간 | ≤ 12초 | 추천 칩 6개 고정 |
| 리텐션 | D7 재방문율 | ≥ 15% | 알림 동의 강제 없음 |
| 리텐션 | 사용자당 평균 기록 수 | ≥ 3 | — |
| 바이럴 | 결과 카드 공유 시도율 | ≥ 10% | 공유 강요 없음 |
| 바이럴 | 공유 링크 클릭 → 카드 열람 도달률 | ≥ 80% | 만료 안내 100% / 신규 1장 온보딩 |
| 바이럴 | 공유 링크 → 신규 가입 전환율 | ≥ 8% | — |
| 수익화 | 광고 직후 S-CARD 도달률 | ≥ 95% | — |
| 수익화 | 광고 노출당 이탈률 | ≤ 5% | — |
| 품질 | Sentry 크래시 프리율 | ≥ 99.5% | — |

---

## 3. 범위

### 3.1 MVP 범위 (In)

- 온보딩 2~3장
- 토스 로그인 (강제)
- 닉네임 입력 (로그인 직후 1회, 한글 완성형 + 영문 + 숫자, 추천 칩 6개 고정)
- 닉네임 변경(설정)에서도 동일 추천 칩 6개 노출
- 도감 메인 / 콩 등록 3단계 / 기록 완료 / 도감 갱신
- 월간 결과 카드 (룰베이스, 룰 서버·클라 동일)
- 서버 카드 저장(monthly_cards) + 8자 hash 카드 ID
- 만료 사전 안내 — S-CARD 본인 카피 분기(매번 노출) / S-SHARE·메시지·S-CARD-VIEW 통일
- 결과 카드 이미지 저장 / 토스 공유 (메시지 + 토스 내부 링크)
- 공유 카드 열람 (S-CARD-VIEW) — 본인/타인 모두 읽기 전용, 광고 없음
- 열람자용 1장 온보딩 (S-VIEWER-INTRO) — 신규 가입자만 1회
- 공유 카드 월 만료 (매월 1일 0시 KST 배치)
- 기록 수정 / 삭제
- 전면형 광고 1곳 (위치 A, 월 1회 단일 캡)
- 회원 탈퇴 / 데이터 삭제
- 금칙어 정적 사전 + 코드 푸시 운영 — D7까지 v1 배포
- **챌린지 출품폼 카피 1차 확정**(50자 / 200자, 자연스러움 다듬음)

### 3.2 비범위 (Out)

| 제외 기능 | 이유 |
|---|---|
| 카드/계좌 연동 | 금융 상품 영역 |
| 사진 업로드 | 운영 부담 / 개인정보 최소화 |
| 쇼핑/제휴 링크 | 외부 링크 정책 |
| 미로그인 둘러보기 | IA 단순화 |
| 위치 B 광고 | 다크패턴 4번 위험 |
| 24h 안전 캡 | 단순화 |
| 광고 직전 안내 화면 | 흐름 단절 위험 |
| 보상형 광고 | Phase 2 |
| 카드 한 줄 메모 | 카드 데이터 텍스트 미저장 |
| 공유 카드 영구 유지 | 본인은 영구 / 공유는 월 만료 |
| 닉네임 이모지·특수문자·자모 단독 | 검수·렌더링 안전성 |
| 닉네임 추천 칩 일부 랜덤 | 단순성 |
| 닉네임 과거 카드 일괄 동기화 | 시점성 보존·구현 단순화 |
| 별도 금칙어 관리 콘솔 | 단순 코드 푸시 운영 |
| 정치·종교·광고·도배 강력 차단 | 신고·hotfix 운영으로 충분 |
| 본인 카피 분기 추가 위치(S-LIST·S-CAT) | S-CARD 한 곳으로 충분 |
| 챌린지 시나리오 가이드 부록 | PRD로 갈음 |
| 공유 미리보기 OG 이미지(자동 생성·정적 호스팅·캐시 무효화) | MVP 복잡도 증가, Phase 2로 분리 |
| 포인트/리워드 / 친구 초대 보상 / AI 코멘트 / 랭킹·팔로우·채팅 / 카드 좋아요 | 정책·검수·범위 |

### 3.3 Phase 2 백로그

캐릭터 애니메이션 / 테마 스킨 / 월간 히스토리 / 보상형 광고 / 토스 공유 리워드 / 카테고리 커스텀 / 위젯형 도감 / 카드 좋아요 / 닉네임 이모지·특수문자 허용 / 금칙어 관리 콘솔 / **카드 OG 이미지 자동 생성·캐싱(공유 미리보기)**.

---

## 4. 사용자 & 시나리오

### 4.1 페르소나

| # | 페르소나 | 핵심 동기 | 주요 행동 |
|---|---|---|---|
| P1 | 굿즈 모으는 25세 직장인 ‘유진’ | 좋아하는 것을 자랑하고 모으고 싶음 | 다이소·올영·문구점에서 산 것을 도감에 등록 |
| P2 | 덕질하는 22세 대학생 ‘하늘’ | 콘서트 굿즈·포카 수집 기록 | 콘서트 직후 도감 일괄 등록 |
| P3 | 반려동물 보호자 30세 ‘서윤’ | 강아지 용품·간식 기록 | 주 단위로 일괄 등록 |
| P4 | 공유 링크로 처음 들어온 ‘재훈’ | 친구 카드가 궁금함 | 1장 온보딩 → 카드 → 자기 도감 |

### 4.2 핵심 유저 여정

**기록자**

1. 픽콩 진입 → 온보딩 → 토스 로그인 → 닉네임 1회 입력
2. 메인 도감 → 콩 등록 (3단계)
3. 기록 3개 이상 → S-HOME “이번 달 카드 보기” 활성
4. 카드 보기 첫 시도 → 전면 광고 1회 → S-CARD
5. S-CARD 하단 안내 “친구는 이번 달 안에만 볼 수 있어요” (매번 노출)
6. 카드 저장 또는 공유 → 8자 hash 카드 ID 발급
7. 토스 share에 메시지 + 토스 내부 링크 전송 (공유 미리보기 이미지 미사용)

**열람자**

1. 공유 링크 → 토스 미니앱 진입
2. 로그인 강제 게이트 통과
3. 신규 가입자: 닉네임 입력 → S-VIEWER-INTRO 1장 → S-CARD-VIEW
4. 기존 사용자: 즉시 S-CARD-VIEW
5. 카드 상태에 따라 정상 표시 또는 만료 안내

---

## 5. 정책 / 검수 / 컴플라이언스 (앱인토스 전용)

### 5.1 앱 유형 판정

- 비게임 미니앱.
- 카테고리 후보: 라이프스타일 / 일상 / 취향 / 기록.

### 5.2 서비스 오픈 정책 적합성

| 정책 항목 | 픽콩 해당 여부 | 비고 |
|---|---|---|
| 디지털 자산/가상자산 | 해당 없음 | NFT·코인 미사용 |
| 자금세탁 가능성 | 해당 없음 | 현금성 보상·전환 없음 |
| 불법/부정 조장 | 해당 없음 | — |
| 사행성/베팅성 | 해당 없음 | 룰베이스 결과는 보상 아님 |
| 금융상품 중개 | 해당 없음 | 금액은 단순 메모 |
| 투자 자문/리딩 | 해당 없음 | — |
| 의료/쇼핑/교육 자격 | 해당 없음 | — |
| 생성형 AI | 해당 없음 | Phase 2 도입 시 사전고지·표시 의무 |
| 광고(전면형) | 해당 | 1지점·월 1회 캡·콘솔 광고 설정 필수 |
| 토스 로그인 | 해당 | 동의 항목 최소화·끊김 대응·탈퇴 경로 |
| 외부 공유 | 해당 | 토스 share만 / 내부 스킴 / 별도 미리보기 이미지 호스팅 없음 |
| 닉네임 수집 | 해당 | 자유 입력(완성형 한글/영문/숫자) + 금칙어 1차 필터 |

### 5.3 어뷰징 방지 정책 — 자체 차별화 명시 ⚠️

| 비교 | 커피 트래킹 | 작심삼일 루틴 챌린지 | **픽콩** |
|---|---|---|---|
| 본질 | 줄이고 싶은 행동 모니터링 | 시작하고 싶은 행동 반복 | **마음에 든 것 수집·도감** |
| 기록 단위 | 잔/날짜 | 루틴 완료 체크 | 카테고리·금액·이모지·메모 |
| 결과물 | 절감 통계 | 연속 성공 그래프 | **취향 캐릭터·도감 카드(서버 저장·월 단위 공유)** |
| 감정 톤 | 절제·반성 | 도전·습관 | 귀여움·자랑 |
| 화면 IA | 캘린더형 | 챌린지형 | 그리드 도감형 |

> 검수 코멘트: “기존 자사 미니앱과 기능 본질·UX·결과물·정보구조 모두 상이”.

### 5.4 자사앱 설치 / 외부 링크

- 외부 링크·자사앱 설치 유도 0건.
- 결과 카드 공유는 토스 SDK `getTossShareLink` + `share`만 사용.
- 공유 링크는 토스 내부 라우팅(`/card/{8-hash}`).
- 외부 호스팅 자산(OG 이미지 등) 없음.
- 콘솔 ‘앱 내 기능’ 등록: “오늘의 귀여움 기록하기”, “월간 취향 카드 보기”, “공유 카드 열기”.

### 5.5 다크패턴 방지 — 5종

| 사례 | 픽콩 대응 |
|---|---|
| 진입 직후 바텀시트/광고 | 인터럽트·광고 0건 |
| 뒤로가기 시 바텀시트 | 인터럽트 없음 |
| 나갈 수 없는 구조 | 모든 화면에 닫기·뒤로가기·취소 1개 이상 |
| 예상치 못한 광고 (4번) | 위치 A 단일 / 월 1회 / `ad_show` 시점만 갱신 / silent skip / 공유·열람자 온보딩에 광고 없음 |
| 모호한 CTA | 모든 CTA에 다음 행동 명시 |

### 5.6 전면형 광고 노출 정책

| 위치 | 트리거 | 빈도 캡 |
|---|---|---|
| A. 월간 결과 카드 첫 진입 직전 | S-HOME “이번 달 카드 보기” 누른 직후 (해당 월) | 사용자당 월 1회 단일 캡 |

**금지 시점**: 진입 직후, 온보딩, 로그인 전후, 닉네임 입력 전후, 닫기·뒤로가기 직후, 입력 중간, 카드 공유·이미지 저장 직전·직후, 신고하기/설정 진입, S-DONE, 카테고리 전환, S-VIEWER-INTRO, S-CARD-VIEW, 탈퇴 흐름.

**캡 갱신**: `ad_show` 시점에만 `ad_card_shown:{user_key}:{yyyymm} = true`. 로드 실패·skip·종료 시 갱신 없음.

**기술 구현**: `IntegratedAd`(전면형). 1.5s 타임아웃 → 즉시 S-CARD. 광고 닫힘 → S-CARD.

### 5.7 토스 로그인 정책 (강제)

| 항목 | 처리 |
|---|---|
| 도입 시점 | 온보딩 마지막 → ‘시작하기’ 직후 S-LOGIN. 공유 링크 미로그인자도 S-LOGIN 통과 필수 |
| 우회 경로 | 없음 |
| 동의 항목 | 토스 로그인 기본만, 추가 개인정보 0건 |
| 사용자 식별 | `appLogin` → 인가 코드 → 서버 mTLS → `generateOauth2Token` → `loginMe` → `user_key` 영속 |
| 단말 캐시 | Storage `user_key:current` |
| 자동 로그인 | 재진입 시 즉시 라우팅 |
| 끊김 감지 | 자동 S-LOGIN (바텀시트 금지) |
| 데이터 영속 | user_key 키로 저장 |
| 회원 탈퇴 | §5.9 트랜잭션 |

### 5.8 닉네임 정책

| 항목 | 처리 |
|---|---|
| 입력 시점 | 로그인 직후 1회 (S-NICK). 미입력 시 본 흐름 통과 불가 |
| 입력 규칙 | 한글 완성형(가~힣) + 영문 대소문자 + 숫자만 허용. 1~10자. 공백·이모지·특수문자·자모 단독 차단 |
| 정규식 | `^[가-힣A-Za-z0-9]{1,10}$` |
| 추천 닉네임 | 고정 6개: 귀염콩 / 굿즈콩 / 문구콩 / 덕질콩 / 픽콩러 / 수집콩 |
| 변경 화면 | 설정의 ‘닉네임 바꾸기’에서도 동일 6개 추천 칩 노출 + 직접 입력 |
| 금칙어 | §5.11 |
| 변경 API | `/account/nickname` PATCH |
| 변경 시 카드 동기화 | 현재 달 active 카드의 `nickname_snapshot`만 갱신. 과거 카드는 시점성 보존 |
| 노출 | 공유 카드 헤더 / 열람자 온보딩 / 본인 화면에서는 노출 최소화 |
| 저장 위치 | 서버 `accounts.nickname` |
| 익명성 | 토스 실명·연락처와 별개 자유 입력값 |

### 5.9 회원 탈퇴 정책

**탈퇴 트랜잭션**

1. 사용자: 설정 → ‘내 도감 데이터 삭제’ → 시트 확인
2. 서버: `removeByUserKey` 호출 → 토스 ↔ 픽콩 user_key 페어링 제거
3. 서버: `accounts.status = 'withdrawn'` + `withdrawn_at`
4. 서버: `cute_items` / `monthly_cards` 모두 삭제
5. 단말: Storage 전부 클리어
6. 앱: S-ONB 라우팅

**재로그인**: 신규 user_key 발급 + 신규 accounts. 닉네임도 다시 입력. 이전 카드·기록 복원 불가.

### 5.10 공유 카드 만료 정책 (사전 안내 카피 분기)

- 본인 카드: `card_status='active'` 영구 유지.
- 공유 카드(타인 열람): 매월 1일 0시 KST 배치로 `share_status='expired'`.
- **사전 안내 카피 — 화면 맥락별 분기**
  - **S-CARD 본문 하단(본인)**: “친구는 이번 달 안에만 볼 수 있어요” — **매번 노출**
  - **S-SHARE 시트 상단**: “이번 달 안에만 볼 수 있어요”
  - **공유 메시지 본문 끝**: “이번 달 안에만 볼 수 있어요”
  - **S-CARD-VIEW 만료(타인)**: 헤드라인 “이 카드는 지난 달 이야기예요” + 서브 “지금은 볼 수 없지만, 픽콩에서 내 도감은 언제든 시작할 수 있어요”
- 톤: 기능 명세 안내. 강조·경고색 미사용.
- 공유 미리보기 이미지 미사용. 토스 share는 메시지 + 내부 링크 텍스트 형태로만 전달.

### 5.11 금칙어 사전 운영

| 카테고리 | 처리 강도 | 비고 |
|---|---|---|
| 관리자 사칭 | 강하게 차단 | toss / TOSS / 토스 / admin / 관리자 / 운영자 / 운영팀 / 공식 / official / 픽콩공식 / 픽콩운영 + 변형 정규식 |
| 욕설 | 가볍게 1차 차단 | 한국어·영어 대표 단어 |
| 혐오 표현 | 가볍게 1차 차단 | 대표 단어 |
| 정치·종교 강한 표현 | 차단 안 함 | 신고 운영 |
| 광고·도배 | 차단 안 함 | 신고 운영 |

- 저장: 코드 저장소 `forbidden_nicknames.json` + `forbidden_patterns.regex`.
- 검증: 백엔드 `/account/nickname` POST/PATCH에서 항상 수행.
- 운영: 단어 추가는 코드 PR + 일반 배포.
- 배포 시점: D7(W1 마지막 날)까지 v1 머지·운영 배포 완료.
- 모니터링: `nick_save_fail`(`error_code=forbidden`) 비중·증가 추세 알람.
- 긴급 차단: 백엔드 hotfix.

### 5.12 UX 라이팅 규칙 적용

해요체 / 능동형 / 긍정형 / 캐주얼 경어 / {명사}+{명사} 지양 / CTA에 다음 행동 명시.

### 5.13 브랜딩 가이드 적용

| 항목 | 적용 |
|---|---|
| 브랜드 로고 | 600×600px 정사각, 모서리 각짐 |
| 브랜드 이름 | 한글 “픽콩” |
| 브랜드 컬러 | `#7BD389` (연두/민트) |
| `granite.config.ts` | `appsInToss.brand.icon`, `brand.displayName`, `brand.primaryColor` |

### 5.14 기술 제약

- iframe 사용 금지.
- CORS Origin: 운영·테스트 도메인 모두 등록.
- 앱 번들 압축 해제 100MB 이하.
- mTLS는 백엔드 → 토스 API + 백엔드 자체 API에 적용.
- 라이트 모드 일관성.

### 5.15 앱인토스 검수 체크리스트 (필수/선택)

| 분류 | 항목 | 필수 | 상태 |
|---|---|:---:|:---:|
| 접속 | 진입 직후 인터럽트 없음 | ✅ | ☐ |
| 내비게이션 바 | 토스 컴포넌트 / 닫기 정상 | ✅ | ☐ |
| 내비게이션 바 | 브랜드 로고/이름 노출 | ✅ | ☐ |
| 서비스 동작 | 앱 내 기능 미니앱 내 완결 | ✅ | ☐ |
| 서비스 동작 | 외부 링크/앱 설치 유도 없음 | ✅ | ☐ |
| 서비스 동작 | Safe Area / iOS 스와이프 백 정상 | ✅ | ☐ |
| 로그인 | 토스 로그인 정상 / 재연결 / 동의 최소화 / 끊김 시 데이터 보존 / 탈퇴 경로 | ✅ | ☐ |
| 닉네임 | 완성형 한글+영문+숫자만 / 자모 단독 차단 / 1회 입력 강제 / 설정 변경 시에도 추천 칩 6개 / 금칙어 필터 | ✅ | ☐ |
| 금칙어 | 관리자 사칭 강력 차단 + 욕설·혐오 가볍게 / D7 v1 배포 완료 | ✅ | ☐ |
| 광고 | 위치 A 단일 / 월 1회 단일 캡 / `ad_show` 시점만 갱신 / silent skip / S-CARD 자연 진입 | ✅ | ☐ |
| 광고 | 공유 카드 열람·열람자 온보딩에 광고 없음 | ✅ | ☐ |
| 공유 | 토스 share만 / 외부 URL 0건 / 외부 미리보기 호스팅 없음 | ✅ | ☐ |
| 공유 | 만료·삭제 카드 진입 시 명확 안내 | ✅ | ☐ |
| 공유 안내 | S-CARD 본인 카피 분기(매번 노출) / S-SHARE 통일 / 메시지 통일 / S-CARD-VIEW 만료 통일 | ✅ | ☐ |
| 공유 메시지 | `"{닉네임}의 이번 달 카드예요. 이번 달 안에만 볼 수 있어요."` 양식 사용 | ✅ | ☐ |
| 카드 만료 | 매월 1일 0시 KST 배치 / 본인 카드 영구 유지 | ✅ | ☐ |
| UX | 다크패턴 5종 부재 | ✅ | ☐ |
| UX | 해요체·능동·긍정 라이팅 일관 | ✅ | ☐ |
| UX | 모든 CTA에서 다음 행동 예측 가능 | ✅ | ☐ |
| 디자인 | TDS 컴포넌트 / 라이트 모드 일관성 | ✅ | ☐ |
| 데이터 | 개인정보 최소 수집 | ✅ | ☐ |
| 데이터 | user_key 기반 사용자 분리 정상 | ✅ | ☐ |
| 어뷰징 | 자사 미니앱 본질 차별 명시 | ✅ | ☐ |
| 분석 | Granite Analytics + 핵심 이벤트 | ⭕ | ☐ |
| 모니터링 | Sentry 연동 | ⭕ | ☐ |
| 사업자/정산 | 정산 채널 활성 | ✅ | ☐ |
| 설명자료 | 앱 이름/한 줄/상세/검색 키워드 | ✅ | ☐ |
| 출품폼 | 한 줄 50자 이내 / 챌린지 연관성 200자 이내 양식 준수 | ✅ | ☐ |

---

## 6. 정보구조(IA) & 내비게이션

### 6.1 화면 트리

- (0) 온보딩 (S-ONB)
- (0a) 토스 로그인 (S-LOGIN)
- (0b) 닉네임 입력 (S-NICK)
- (1) 메인 도감 (S-HOME)
- (2) 콩 등록 (S-ADD) → (2a) 기록 완료 (S-DONE)
- (3) 카테고리 상세 (S-CAT)
- (4) (조건부) 전면 광고 인터루드 (S-AD)
- (5) 월간 결과 카드 (S-CARD) — 본인용 / 만료 사전 안내(본인 카피, 매번 노출)
- (5a) 공유 카드 열람 (S-CARD-VIEW) — 본인/타인 읽기 전용
- (5b) 열람자용 1장 온보딩 (S-VIEWER-INTRO) — 신규 가입자만 1회
- (5c) 카드 저장/공유 시트 (S-SHARE)
- (6) 기록 목록 / 수정·삭제 (S-LIST)
- (7) 설정 / 정보 / 닉네임 변경(S-NICK-EDIT) / 데이터 삭제 (S-SET)

### 6.2 진입 라우팅 규칙

| 진입 | 로그인 상태 | 닉네임 상태 | 라우트 |
|---|---|---|---|
| 일반 진입 | 미로그인 | — | S-ONB → S-LOGIN |
| 일반 진입 | 로그인 | 미입력 | S-NICK |
| 일반 진입 | 로그인 | 입력 완료 | S-HOME |
| 공유 링크 | 미로그인 | — | S-LOGIN → (신규)S-NICK → S-VIEWER-INTRO → S-CARD-VIEW / (기존)S-CARD-VIEW |
| 공유 링크 | 로그인 + 첫 가입 | 미입력 | S-NICK → S-VIEWER-INTRO → S-CARD-VIEW |
| 공유 링크 | 로그인 + 기존 사용자 | 입력 완료 | S-CARD-VIEW (직진) |

### 6.3 앱 내 기능 (콘솔 등록)

| 등록명 | 진입 화면 | 비로그인 시 동작 |
|---|---|---|
| 오늘의 귀여움 기록하기 | S-ADD 직진입 | S-LOGIN 강제 |
| 이번 달 취향 카드 보기 | S-AD → S-CARD | S-LOGIN 강제 / 기록 0건이면 S-HOME |
| 공유 카드 열기 | S-CARD-VIEW | S-LOGIN 강제 → (신규)S-VIEWER-INTRO → S-CARD-VIEW |

---

## 7. 화면별 상세 스펙

### 7.1 화면 인덱스

| Screen ID | 이름 | 진입 조건 | 종료 조건 |
|---|---|---|---|
| S-ONB | 온보딩 | `onboarding_completed = false` | 마지막 페이지 “시작하기” |
| S-LOGIN | 토스 로그인 | 미로그인 | 로그인 성공만 통과 |
| S-NICK | 닉네임 입력 (최초) | 로그인 + `nickname IS NULL` | 입력 + 저장 성공 |
| S-NICK-EDIT | 닉네임 변경 (설정) | S-SET ‘닉네임 바꾸기’ | 변경 저장 또는 취소 |
| S-HOME | 메인 도감 | 로그인 + 닉네임 완료 | 닫기 |
| S-ADD | 콩 등록 | S-HOME CTA / 앱 내 기능 | 저장 완료 또는 취소 |
| S-DONE | 기록 완료 | S-ADD 저장 성공 | CTA |
| S-AD | 전면 광고 인터루드 | §5.6 위치 A | 광고 닫힘 / 로드 실패 패스 |
| S-CAT | 카테고리 상세 | S-HOME 카테고리 탭 | 뒤로가기 |
| S-CARD | 본인 월간 결과 카드 | 본인 이번 달 기록 ≥ 3 | 닫기 / 공유 |
| S-VIEWER-INTRO | 열람자용 1장 온보딩 | 공유 링크 + 신규 가입(첫 카드뷰) | `이 카드 보러가기` |
| S-CARD-VIEW | 공유 카드 열람 | 공유 링크 + 로그인 | 닫기 / 시작하기 |
| S-SHARE | 공유 시트 | S-CARD ‘공유하기’ | 시트 닫기 |
| S-LIST | 기록 목록 | S-HOME 메뉴 | 뒤로가기 |
| S-SET | 설정/정보 | S-HOME 메뉴 | 뒤로가기 |

### 7.2 S-ONB 온보딩

- 슬라이드 2~3장 + BottomCTA `시작하기`
- 1p: “좋아한 것을 그냥 지나치기 아쉬울 때”
- 2p: “문구·굿즈·간식을 도감 한 칸에 담아요”
- 3p: “이번 달 내 취향이 캐릭터로 돌아와요”
- 권한 0건 / 종료 후 S-LOGIN
- 이벤트: `onb_view_step`, `onb_press_start`

### 7.3 S-LOGIN 토스 로그인 (강제)

- 헤드라인 “픽콩에서 내 도감을 시작해 볼까요?” / 서브 “토스로 로그인하면 기록이 안전하게 이어져요”
- BottomCTA `토스로 시작하기`
- 흐름: `appLogin` → 서버 mTLS → `user_key`
- 진입 분기: §6.2
- 이벤트: `login_view`, `login_press_start`, `login_success`(`is_first_login`, `entry_source`), `login_cancel`, `login_fail`(`error_code`)

### 7.4 S-NICK 닉네임 입력 (최초)

- 진입: 로그인 직후 닉네임 없는 사용자
- 헤드라인: “어떻게 부를까요?”
- 서브: “친구에게 카드를 공유할 때 이렇게 보여요”
- 입력
  - 텍스트 필드(1~10자, 한글 완성형 + 영문 + 숫자)
  - 허용 외 문자(이모지·특수문자·자모 단독·공백)는 입력 단계에서 자동 무시
  - **추천 칩 6개 고정**: 귀염콩 / 굿즈콩 / 문구콩 / 덕질콩 / 픽콩러 / 수집콩 (랜덤 접미 없음)
- 검증
  - 빈값/공백 → “닉네임을 한 글자 이상 적어 볼까요?”
  - 길이 초과 → 입력 차단
  - 자모 단독 → “자음·모음만으로는 닉네임을 만들 수 없어요. 완성된 글자로 적어 볼까요?”
  - 허용 외 문자 → “닉네임은 한글, 영문, 숫자만 쓸 수 있어요”
  - 금칙어 → “이 닉네임은 쓸 수 없어요. 다른 이름으로 바꿔 볼까요?”
  - 중복 허용
- 저장: `POST /account/nickname` (서버 정규식 + 금칙어 재검증)
- BottomCTA: `이 이름으로 시작할게요`
- 상태: loading / 실패(토스트) / 성공(다음 라우트)
- 권한: 0건
- 이벤트: `nick_view`(`entry_source`), `nick_press_suggest`(`suggestion`), `nick_input_blocked_char`(`reason`), `nick_press_save`(`length`, `used_suggestion`), `nick_save_success`, `nick_save_fail`(`error_code`)

### 7.5 S-NICK-EDIT 닉네임 변경 (설정)

- 진입: S-SET → ‘닉네임 바꾸기’
- 헤드라인: “닉네임을 바꿀까요?”
- 서브: “바뀐 이름은 이번 달 카드부터 보여요”
- 입력
  - 텍스트 필드 (현재 닉네임 prefill, 1~10자, 한글 완성형 + 영문 + 숫자)
  - 허용 외 문자(이모지·특수문자·자모 단독·공백) 자동 무시
  - **추천 칩 6개 동일 노출**: 귀염콩 / 굿즈콩 / 문구콩 / 덕질콩 / 픽콩러 / 수집콩
- 검증: S-NICK과 동일 (정규식 + 금칙어 백엔드 재검증)
- 저장: `PATCH /account/nickname`
- 저장 성공 시
  - `accounts.nickname`, `accounts.nickname_updated_at` 갱신
  - 현재 달 active 카드 `nickname_snapshot` 동기 갱신
- BottomCTA: `이 이름으로 바꿀게요` / 보조 `취소`
- 상태: loading / 실패(토스트) / 성공(이전 화면 복귀 + 토스트 “닉네임을 바꿨어요”)
- 권한: 0건
- 이벤트: `nickedit_view`, `nickedit_press_suggest`, `nickedit_input_blocked_char`(`reason`), `nickedit_press_save`(`length`, `used_suggestion`), `set_change_nickname_success`, `set_change_nickname_fail`(`error_code`)

### 7.6 S-HOME 메인 도감

- 상단: 브랜드 로고/이름 + 이번 달 수집률
- 도감 그리드 8칸
- 주간 진행 텍스트(예: “이번 주 3콩까지 1콩 남았어요”)
- 이번 달 카드 보기 버튼 (조건부 활성)
- 하단 BottomCTA `오늘의 콩 줍기`
- 상태: loading / empty / success / error / disconnect(자동 S-LOGIN)
- 카드 버튼 동작
  - 기록 < 3: 비활성 + “기록 3개부터 카드를 받을 수 있어요”
  - 기록 ≥ 3 + 광고 미노출(이번 달): → S-AD
  - 기록 ≥ 3 + 광고 노출(이번 달): → 즉시 S-CARD
- 이벤트: `home_view`, `home_press_add`, `home_press_category`, `home_press_card_unlock`(`eligible`, `ad_eligible`)

### 7.7 S-ADD 콩 등록

- 단계: 카테고리 → 금액 → 이모지·메모
- 입력/검증
  - 카테고리: 8개 중 1개 필수
  - 금액: 0 이상 정수, 빈 값 허용
  - 이모지: 1자 이상, 추천 12개 + 직접 입력
  - 메모: 1~24자 권장, 최대 60자
- 상태: 저장 중 / 성공(S-DONE) / 실패(토스트)
- CTA: `내 도감에 담기`
- 이벤트: `add_step_view`, `add_select_category`, `add_input_amount`, `add_press_save`, `add_save_success`, `add_save_fail`

### 7.8 S-DONE 기록 완료

- 헤드라인 “문구콩 하나를 주웠어요”
- 서브 “이번 달 7번째 귀여움이에요. 도감 수집률 37%”
- CTA: `도감 보러가기` / `하나 더 줍기`
- 광고 트리거 없음
- 이벤트: `done_view`, `done_press_home`, `done_press_more`

### 7.9 S-AD 전면 광고 인터루드

- 트리거: 위치 A — “이번 달 카드 보기” 첫 시도 (해당 월 미노출 상태)
- 동작
  - 캡 체크: `ad_card_shown:{user_key}:{yyyymm} != true`
  - `IntegratedAd.load()` (1.5s 타임아웃)
  - 성공 → `show()` → 광고 닫힘 시 S-CARD 자동 진입
  - 실패/타임아웃 → 즉시 S-CARD
- **캡 갱신**: `ad_show` 발생 시점에만 `ad_card_shown:{user_key}:{yyyymm} = true`. 로드 실패·skip·종료 시 갱신 없음.
- 이벤트: `ad_eligible`, `ad_load_request`, `ad_load_success`, `ad_load_fail`(`error_code`), `ad_show`, `ad_dismiss`(`dwell_ms`), `ad_skip_due_to_fail`

### 7.10 S-CAT 카테고리 상세

- UI: 카테고리 헤더 + 리스트(이모지/메모/날짜)
- empty: “이 카테고리는 아직 비어 있어요. 하나 담아볼까요?” + CTA
- 이벤트: `cat_view`, `cat_press_add`

### 7.11 S-CARD 본인 월간 결과 카드

- 잠금 해제: 본인 이번 달 기록 ≥ 3
- 진입 시: 서버 `POST /cards/{user_key}/{yyyymm}` upsert → 8자 hash `card_id`. 본인 카드 영구 유지.
- 화면 구성
  - 캐릭터 일러스트 + 닉네임(상단 작게)
  - 총 기록 수·총 금액·최애 카테고리
  - **본문 하단 보조 텍스트(본인 카피, 매번 노출)**: “친구는 이번 달 안에만 볼 수 있어요” (작은 회색 톤)
- CTA: `이미지 저장`, `공유하기`
- 공유 시 share link payload: `scheme: '/card/{card_id}'`
- 이벤트: `card_view`, `card_view_expiry_notice_view`(`copy_variant=owner`), `card_upsert_success`, `card_upsert_fail`(`error_code`), `card_press_save`, `card_press_share`

### 7.12 S-VIEWER-INTRO 열람자용 1장 온보딩

- 진입: 공유 링크 + 로그인·닉네임 완료 + 신규 가입자(`is_first_login = true`)
- 헤드라인: “{공유자 닉네임}이(가) 이번 달 카드를 보냈어요”
- 본문: “픽콩은 좋아한 귀여운 것을 모으는 도감이에요” + 도감 미니컷
- BottomCTA: `이 카드 보러가기` → S-CARD-VIEW
- 광고 없음 / 권한 0건
- 이벤트: `viewerintro_view`, `viewerintro_press_continue`

### 7.13 S-CARD-VIEW 공유 카드 열람 (읽기 전용)

- 진입: 공유 링크 + 로그인 (+신규 가입자는 S-VIEWER-INTRO 거쳐 진입)
- 진입 시 서버 `GET /cards/{card_id}` (인증 필수)
- 분기
  - 본인 카드 + active: 헤더 “이번 달 나는 {character_type}” + CTA `내 도감 보러가기`
  - 타인 카드 + share_status=active + 같은 달: 헤더 “{닉네임}의 이번 달 카드예요” + CTA `나도 도감 시작하기`
  - 타인 카드 + 만료/삭제/탈퇴: 만료 안내 화면
- 만료 안내
  - 헤드라인: “이 카드는 지난 달 이야기예요”
  - 서브: “지금은 볼 수 없지만, 픽콩에서 내 도감은 언제든 시작할 수 있어요”
  - CTA: `픽콩 시작하기`
- 광고 없음 / 권한 0건
- 이벤트: `cardview_view`, `cardview_expired_view`(`reason`), `cardview_press_start_my_diagram`, `cardview_load_fail`(`error_code`)

### 7.14 S-SHARE 공유 시트

- **상단 안내 텍스트**: “이번 달 안에만 볼 수 있어요” (작게, 다크패턴 회피 톤)
- 본문
  - `이미지 저장` (`saveBase64Data`)
  - `토스로 공유하기` (`getTossShareLink` + `share`)
- 공유 메시지 페이로드 양식: `"{닉네임}의 이번 달 카드예요. 이번 달 안에만 볼 수 있어요."`
- 외부 SNS 직접 호출 금지
- 이벤트: `share_sheet_view`, `share_view_expiry_notice_view`(`copy_variant=neutral`), `share_press_save_image`, `share_save_image_success`, `share_press_share`, `share_complete`

### 7.15 S-LIST 기록 목록 / 수정 / 삭제

- 정렬: 최신순, 카테고리 필터
- 시트: 수정/삭제
- 삭제 시: 단말 + 서버 동기화. 같은 달 카드 dirty
- 이벤트: `list_view`, `list_press_edit`, `list_press_delete`, `list_delete_success`

### 7.16 S-SET 설정/정보

- 항목
  - 데이터 초기화(단말 캐시만)
  - 닉네임 바꾸기 → S-NICK-EDIT → `PATCH /account/nickname` → 현재 달 active 카드 nickname_snapshot만 갱신
  - 내 도감 데이터 삭제(탈퇴) (§5.9)
  - 버전 정보, 만든이, 신고하기
- 이벤트: `set_view`, `set_press_reset`, `set_press_change_nickname`, `set_change_nickname_success`, `set_change_nickname_fail`(`error_code`), `set_press_account_delete`, `set_account_delete_confirm`, `set_account_delete_success`, `set_account_delete_fail`(`error_code`)

---

## 8. 기능 요구사항

| ID | 기능 | 우선순위 | 비고 |
|---|---|:---:|---|
| F-01 | 도감 그리드 표시 | P0 | 8 카테고리 고정 |
| F-02 | 콩 등록(3단계) | P0 | 30초 내 완료 |
| F-03 | 수집률·주간 진행 | P0 | 이번 달/이번 주 |
| F-04 | 월간 캐릭터 룰 | P0 | §12 |
| F-05 | 결과 카드 이미지 저장·공유 | P0 | `saveBase64Data` + `share` |
| F-18 | 서버 카드 저장 + 8자 hash | P0 | §13 |
| F-19 | 공유 링크 열람 화면 | P0 | 광고 없음 |
| F-20 | 공유 만료/삭제 처리 | P0 | 안내 + 시작하기 |
| F-21 | 닉네임 입력/변경 | P0 | 완성형 한글+영문+숫자, 1회 강제, 설정 변경 시에도 추천 칩 6개 |
| F-22 | 열람자 1장 온보딩 | P0 | 신규 가입자만 1회 |
| F-23 | 공유 카드 월 만료 배치 | P0 | 매월 1일 0시 KST |
| F-24 | 만료 사전 안내 | P0 | S-CARD 본인 카피(매번 노출) / 통일안 |
| F-25 | 닉네임 변경 시 active 카드 동기화 | P0 | 현재 달만 |
| F-26 | 금칙어 정적 사전 + 정규식 | P0 | D7 v1 배포 |
| F-27 | 공유 메시지 본문 양식 | P0 | `"{닉네임}의 이번 달 카드예요. 이번 달 안에만 볼 수 있어요."` |
| F-30 | 출품폼 카피 양식 | P0 | 한 줄 50자 / 연관성 200자, 자연스러움 다듬음 |
| F-06 | 기록 수정·삭제 | P1 | — |
| F-07 | 온보딩 | P1 | — |
| F-08 | 빈/완료 상태 UX | P1 | — |
| F-09 | 카테고리 상세 | P1 | — |
| F-13 | 토스 로그인 (강제) | P0 | — |
| F-14 | 로그인 끊김 재연결 | P0 | — |
| F-15 | 회원 탈퇴 / 데이터 삭제 | P0 | `removeByUserKey` + 카드 삭제 |
| F-16 | 전면형 광고(단일 지점) | P0 | §5.6 |
| F-17 | 광고 캡 관리 | P0 | 월 1회 / `ad_show`만 갱신 |
| F-10 | 캐릭터 미세 애니메이션 | P2 | — |
| F-11 | 테마 스킨 | P2 | — |
| F-12 | 월간 히스토리 | P2 | — |
| F-31 | 카드 OG 이미지 자동 생성·캐싱 | P2 | Phase 2 (MVP 비범위) |

---

## 9. 데이터 & 이벤트 (Analytics)

### 9.1 식별 키

- `user_key`: 토스 user_key (영속, 탈퇴 시 폐기)
- `card_id`: 8자 hash, 사용자×월 단위 1건 active
- `nickname`: 자유 입력(완성형 텍스트만)

### 9.2 이벤트 택소노미

| event_name | trigger | properties |
|---|---|---|
| onb_view_step / onb_press_start | 온보딩 | `step` |
| login_view / login_press_start / login_cancel / login_fail | 로그인 | `entry_source`, `error_code` |
| login_success | 로그인 성공 | `is_first_login`, `entry_source` |
| login_disconnect_detected / login_reconnect_press | 끊김 | `screen` |
| nick_view | 닉네임 화면 | `entry_source` |
| nick_press_suggest | 추천 칩 클릭 | `suggestion` |
| nick_input_blocked_char | 허용 외 문자 차단 | `reason`(emoji/special_char/space/jamo_only/length) |
| nick_press_save | 저장 시도 | `length`, `used_suggestion` |
| nick_save_success / nick_save_fail | 결과 | `error_code`(forbidden/length/blocked_char/jamo_only/network) |
| nickedit_view / nickedit_press_suggest / nickedit_input_blocked_char / nickedit_press_save | 설정 닉네임 변경 | 동일 properties |
| set_change_nickname_success / set_change_nickname_fail | 변경 결과 | `error_code` |
| home_view | 메인 진입 | `is_first_visit`, `collected_count`, `month` |
| home_press_add / home_press_category / home_press_card_unlock | CTA | (§7.6) |
| add_step_view / add_select_category / add_input_amount / add_press_save / add_save_success / add_save_fail | 등록 단계 | `step`, `category`, `amount_band`, `error_code` |
| done_view / done_press_home / done_press_more | 완료 | `category`, `total_in_month` |
| ad_eligible / ad_load_request / ad_load_success / ad_load_fail / ad_show / ad_dismiss / ad_skip_due_to_fail | 광고 | `cap_state`, `error_code`, `dwell_ms` |
| card_view | 본인 카드 노출 | `card_id`, `month`, `top_category`, `character_type`, `count`, `total_amount_band` |
| card_view_expiry_notice_view | 카드 본문 안내 노출 | `card_id`, `copy_variant=owner` |
| card_upsert_success / card_upsert_fail | 서버 저장 | `card_id`, `error_code` |
| card_press_save / card_press_share | CTA | `card_id` |
| share_sheet_view | 시트 노출 | `card_id` |
| share_view_expiry_notice_view | 시트 안내 노출 | `card_id`, `copy_variant=neutral` |
| share_press_save_image / share_save_image_success | 결과 | `card_id` |
| share_press_share / share_complete | 결과 | `card_id` |
| viewerintro_view / viewerintro_press_continue | 열람자 온보딩 | `card_id`, `sharer_nickname_present` |
| cardview_view | 공유 카드 열람 | `card_id`, `is_owner`, `card_month` |
| cardview_expired_view | 만료 진입 | `card_id`, `reason` |
| cardview_press_start_my_diagram | CTA | `card_id` |
| cardview_load_fail | 로드 실패 | `error_code` |
| list_view / list_press_edit / list_press_delete / list_delete_success | 목록 | — |
| set_view / set_press_reset | 설정 | — |
| set_press_account_delete / set_account_delete_confirm / set_account_delete_success / set_account_delete_fail | 탈퇴 | `error_code` |

### 9.3 전환 퍼널

- 활성화: `onb_press_start` → `login_success` → `nick_save_success` → `home_view` → `home_press_add` → `add_save_success` → `done_view`
- 카드 공유: `home_press_card_unlock` → (`ad_show` → `ad_dismiss`) → `card_view` → `card_view_expiry_notice_view` → `card_press_share` → `share_sheet_view` → `share_view_expiry_notice_view` → `share_complete`
- 바이럴 인입(신규): 공유 링크 → `login_view`(`entry_source=share_link`) → `login_success` → `nick_save_success` → `viewerintro_view` → `viewerintro_press_continue` → `cardview_view` → `cardview_press_start_my_diagram` → `home_view`
- 바이럴 인입(기존): `login_success` → `cardview_view` → `cardview_press_start_my_diagram`(또는 본인이면 `내 도감 보러가기`)
- 닉네임 헬스: `nick_view` 대비 `nick_save_success`, `nick_save_fail`(`forbidden`/`jamo_only`) 분포
- 광고 건강: `ad_eligible` 대비 `ad_show`, 광고 직후 `card_view` 도달률 ≥ 95%

---

## 10. 기술 / 아키텍처

### 10.1 클라이언트

- React Native + Granite SDK.
- TDS 컴포넌트(Button, BottomCTA, Top, ListRow, ListHeader, Tab, Badge).
- 라이트 모드 일관 디자인.

### 10.2 백엔드

- 토스 로그인 mTLS + 자체 카드/계정/닉네임 API.
- 매월 1일 0시 KST 공유 카드 만료 cron.
- 금칙어 정적 사전 D7 머지.
- OG 이미지 워커·정적 호스팅 없음.

### 10.3 SDK 사용 항목

| SDK | 용도 |
|---|---|
| `appLogin` | 토스 로그인 |
| `getIsTossLoginIntegratedService` | 끊김 감지 |
| `Storage.*` | user_key·기록·광고 캡 캐시 |
| `IntegratedAd`(전면형) | 광고 |
| `saveBase64Data` | 카드 이미지 저장 |
| `getTossShareLink` + `share` | 카드 공유(스킴 `/card/{card_id}`) |
| `getSchemeUri` | 진입 카드 ID 파싱 |
| `useBackEvent` / `closeView` | 내비게이션 |
| `useSafeArea` / `KeyboardAboveView` | 화면 보정 |
| `Analytics` | 분석 |

### 10.4 백엔드 API

**서버 → 토스 (mTLS)**

| API | 용도 |
|---|---|
| `generateOauth2Token` | 인가 코드 → 토큰 |
| `refreshOauth2Token` | 토큰 갱신 |
| `loginMe` | user_key 조회 |
| `removeByUserKey` | 탈퇴 |

**클라이언트 → 백엔드**

| API | 메서드 | 용도 |
|---|---|---|
| `/auth/exchange` | POST | 인가 코드 → 세션 토큰 + user_key |
| `/auth/me` | GET | 로그인 상태 검증 (닉네임 포함) |
| `/account/nickname` | POST/PATCH | 닉네임 등록/변경 |
| `/account` | DELETE | 탈퇴 트랜잭션 |
| `/cards/{user_key}/{yyyymm}` | POST | 본인 카드 upsert → `card_id` |
| `/cards/{card_id}` | GET | 카드 단건 조회 |

### 10.5 카드 ID 발급 정책

- 8자리 [a-z0-9]. 충돌 시 5회 재시도.
- 같은 사용자×달 1건 active. 재진입 시 같은 card_id 갱신.

### 10.6 닉네임 검증 파이프라인

1. 클라이언트 입력 단계: 키보드 입력 시 허용 외 문자 자동 무시(이모지·특수문자·자모 단독·공백)
2. 클라이언트 저장 직전: 정규식 1차 검증 `^[가-힣A-Za-z0-9]{1,10}$`
3. 백엔드 저장: 정규식 재검증 + 금칙어 사전 + 변형 정규식 검증
4. 실패 시 `error_code` 반환

### 10.7 닉네임 변경 동기화 정책

- `PATCH /account/nickname` 성공 시 트랜잭션 1줄
  - `UPDATE monthly_cards SET nickname_snapshot = :new_nickname WHERE user_key = :uk AND month = :current_yyyymm AND card_status = 'active'`
- 과거 카드 미갱신.

### 10.8 공유 카드 만료 배치

- 매월 1일 0시 KST cron.
- `UPDATE monthly_cards SET share_status='expired' WHERE month < :this_month AND share_status='active'`
- 본인 영구 유지: `card_status='active'` 유지.
- 배치 실패 알람 + 1시간 단위 재시도 6회.

### 10.9 금칙어 검증

- 백엔드에 `forbidden_nicknames.json`(정적 사전) + `forbidden_patterns.regex`(정규식 묶음).
- 닉네임 저장/변경 API에서 항상 검증.
- 위반 시 `error_code='forbidden'` 반환 → 클라이언트 토스트.
- 단어 추가는 코드 PR로 처리.

### 10.10 보안 / 개인정보

- 카메라·앨범·연락처·위치 권한 0건.
- 메모는 단말 저장 기본. 카드는 집계값만 서버 저장.
- 닉네임은 완성형 텍스트만, 자유 입력.
- 카드 조회는 인증 필수.
- 외부 호스팅 자산 없음.

### 10.11 성능 / 리소스 예산

| 항목 | 예산 |
|---|---|
| 번들 압축 해제 | ≤ 30MB |
| 첫 렌더 TTI | ≤ 1.5s |
| 그리드 첫 페인트 | ≤ 800ms |
| 카드 upsert | ≤ 600ms |
| 카드 단건 조회 | ≤ 400ms |
| 닉네임 저장 | ≤ 300ms |
| 광고 로드 타임아웃 | 1.5s |
| 일러스트 합산 | ≤ 2MB, WebP |

### 10.12 환경 차이 리스크 / 대응

| 리스크 | 대응 |
|---|---|
| CORS 도메인 차이 | 운영·테스트 모두 등록 |
| iOS 스와이프 백 | `setIosSwipeGestureEnabled` |
| Safe Area / 키보드(닉네임) | TDS Layout + Safe Area 훅 + `KeyboardAboveView` |
| 광고 인벤토리 부족 | 1.5s 타임아웃 + silent skip |
| mTLS 인증서 환경 분리 | 환경별 분리·만료 알람 |
| 공유 링크 만료 | S-CARD-VIEW 안내 + 분석 이벤트 |
| 카드 정합성 | 본인 진입 시 upsert 재계산 |
| 만료 배치 지연 | 1시간 재시도 + 알람 |
| 토스 share 미리보기 컷오프 | 공유 메시지 30자 내외 고정 |
| 금칙어 사전 누락 | 신고 모니터링 + hotfix |

---

## 11. QA / 테스트 계획

### 11.1 테스트 범위

| 영역 | 항목 |
|---|---|
| 기능 | 등록/완료/도감/수정/삭제/카드/공유 |
| 로그인 | 성공/취소/실패/끊김/재연결/탈퇴/탈퇴 후 재가입 |
| 닉네임 | 최초 입력 / 설정 변경 시 추천 칩 6개 동일 노출 / 정규식·금칙어·자모 단독 / **변경 시 active 카드 동기화 회귀(현재 달만) / 과거 카드 미변경** |
| 서버 카드 | upsert / 조회 / 본인·타인 분기 / 기록 수정 후 재계산 / 8자 hash 충돌 회복 |
| 카드 만료 | 이번 달 active / 다음 달 1일 0시 이후 share_status=expired / 본인 영구 / 타인 만료 안내 |
| **S-CARD-VIEW** | **본인·타인 분기 / 만료 / 탈퇴자 카드 진입 — 4가지 케이스 회귀(우선)** |
| 만료 사전 안내 | S-CARD 본인 카피(매번 노출) / S-SHARE·메시지·S-CARD-VIEW 통일 |
| 공유 메시지 | 양식 적용 / 토스 share 미리보기 컷오프 없음 / **닉네임 9~10자 미리보기 케이스 추가** |
| 공유 흐름 | 공유 링크 → 로그인 → (신규)닉네임 → 1장 온보딩 → 카드 / (기존)즉시 카드 / 본인·타인·만료 |
| 광고 | 위치 A / 월 1회 / `ad_show`만 갱신 / silent skip / S-CARD 자연 진입 / 공유·열람자 온보딩 광고 없음 |
| 금칙어 | 관리자 사칭 강력 차단 / 욕설·혐오 1차 / D7 v1 회귀 |
| UI | 라이트 모드, Safe Area, 키보드 가림, BottomCTA 키보드 위 표시 |
| 라이팅 | 해요체·능동·긍정 / 모호 CTA 0건 — **W3a 후반에 디테일 다듬기 라운드** |
| 권한 | 토스 로그인 외 권한 요청 0건 |
| 회귀 | 데이터 초기화·탈퇴 후 재가입(신규 user_key + 닉네임 미입력) |
| 오프라인 | 등록 로컬 / 광고 silent skip / 카드·닉네임 저장 실패 토스트 |
| 성능 | 100건 이상 그리드 / 카드·닉네임 응답 시간 |
| 다크패턴 | 5종 부재 (4번 집중) |
| 출품폼 | 한 줄 50자 이내 / 연관성 200자 이내 카피 검증 |

### 11.2 테스트 환경

- 샌드박스 / 토스앱(QR + 피처 테스트) 풀 회귀
- 기기: iOS 최신·iOS-1 / Android 메인 해상도 2종
- 시간 모킹: 전월 카드 + 이번 달 진입, 닉네임 변경 후 과거 vs 현재 카드
- **닉네임 9~10자 시뮬레이션** 환경 셋업

### 11.3 검토 요청 직전 체크리스트

- §5.15 검수 체크리스트 모두 ✅
- 어뷰징 차별화 코멘트 첨부
- 앱 메타·로고·`granite.config.ts` 확정
- 광고 콘솔 + 정산 채널 활성
- 만료 배치 cron + 알람 등록
- 금칙어 사전 v1 D7 배포 + 회귀 통과
- 닉네임 5가지 케이스 통과 (S-NICK·S-NICK-EDIT)
- **S-CARD-VIEW 4가지 케이스 통과(본인·타인·만료·탈퇴자)** — 회수분 우선 배치
- **닉네임 변경 후 active 카드 동기화 회귀 통과** — 회수분 우선 배치
- **공유 메시지 닉네임 9~10자 미리보기 컷오프 없음 확인**
- **라이팅 디테일 다듬기 1라운드 완료**
- S-CARD 본인 카피 매번 노출 확인
- 출품폼 한 줄 50자 / 연관성 200자 카피 1차 확정 완료(W3a 시점)

---

## 12. 월간 캐릭터 룰

(서버·클라이언트 동일 로직)

| 조건 | 결과 |
|---|---|
| 굿즈 ≥ 40% | 굿즈콩 햄스터 |
| 문구 ≥ 40% | 문구콩 토끼 |
| 간식 ≥ 40% | 간식콩 고양이 |
| 선물 ≥ 40% | 선물콩 곰돌이 |
| 덕질 ≥ 40% | 덕질콩 다람쥐 |
| 반려 ≥ 40% | 반려콩 강아지 |
| 카테고리 다양성 ≥ 5종 | 취향부자 콩요정 |
| 기록 < 3 | 새싹콩 수집가 |

---

## 13. 데이터 모델

### 13.1 서버

**accounts**

| 필드 | 타입 | 비고 |
|---|---|---|
| user_key | string (PK) | 토스 user_key |
| nickname | string(1~10) NULL | 완성형 한글+영문+숫자 |
| created_at / last_login_at / nickname_updated_at / withdrawn_at | ts | |
| status | enum | active / withdrawn |

**monthly_cards**

| 필드 | 타입 | 비고 |
|---|---|---|
| card_id | string(8) PK | [a-z0-9], 충돌 시 재발급 |
| user_key | string (FK) | |
| month | string(YYYY-MM) | |
| total_count / total_amount | int | |
| top_category | enum | |
| category_breakdown | json | |
| character_type | enum | §12 |
| nickname_snapshot | string | upsert/변경 시 닉네임 |
| card_status | enum | active / dirty / withdrawn |
| share_status | enum | active / expired |
| created_at / updated_at | ts | |
| (UNIQUE) (user_key, month) | | |

**카드 라이프사이클**

- 본인 진입 시 upsert.
- 기록 수정/삭제 → `card_status='dirty'`.
- 매월 1일 0시 KST → 이전 달 `share_status='expired'`.
- 본인 카드 표시: `card_status='active'`로 영구 유지.
- 타인 카드 표시: `card_status='active'` AND `share_status='active'`.
- 탈퇴 시 user_key의 모든 monthly_cards 삭제.

### 13.2 단말 (Storage)

| 키 | 값 | 비고 |
|---|---|---|
| `user_key:current` | string | 로그인 후 캐시 |
| `nickname:current` | string | 헤더 표시용 |
| `cute_items:{user_key}` | array | 기록 전체 |
| `summary:{user_key}:{ym}` | object | 월 요약 캐시 |
| `ad_card_shown:{user_key}:{yyyymm}` | boolean | 월 광고 캡 |
| `onboarding_completed` | boolean | 일반 온보딩 |
| `viewer_intro_seen:{user_key}` | boolean | 열람자 1장 온보딩 노출 여부 |

### 13.3 cute_items (단말)

| 필드 | 타입 | 비고 |
|---|---|---|
| id | string(uuid) | 단말 생성 |
| user_key | string | |
| category | enum | 8종 |
| amount | int | 0 이상, 선택 |
| emoji | string | 1자 이상 |
| memo | string | 0~60자 |
| created_at | iso8601 | 서버 시간 보정 |

### 13.4 금칙어 자산 (코드 저장소)

- `forbidden_nicknames.json`
  - 관리자 사칭 강력: `toss`, `Toss`, `TOSS`, `토스`, `admin`, `Admin`, `관리자`, `운영자`, `운영팀`, `공식`, `official`, `픽콩공식`, `픽콩운영`, `pickkong_admin` 등
  - 욕설·혐오 1차: 대표 단어 위주
- `forbidden_patterns.regex`
  - 관리자 사칭 변형(분리·치환·접두접미) 정규식 묶음
  - 예: `t[\W_0-9]*o[\W_]*s[\W_]*s`, `관[\W_]*리[\W_]*자`, `ad[\W_]*m[\W_0-9]*i[\W_]*n`

---

## 14. 앱인토스 제출 메타 + 챌린지 출품폼 카피 (확정)

### 14.1 콘솔 제출 메타

| 항목 | 내용 |
|---|---|
| 앱 이름 | 픽콩 |
| appName | pickkong |
| 한 줄 소개 | 귀여운 취향을 하나씩 모으는 나만의 도감 |
| 상세 설명 | 픽콩은 문구·굿즈·간식·선물처럼 마음에 든 귀여움을 하나씩 기록하는 취향 도감이에요. 오늘 마음에 든 귀여움을 픽하면 도감이 채워지고, 기록이 쌓이면 이번 달 나의 취향 캐릭터를 받을 수 있어요. 친구에게 카드를 보내 함께 즐겨 보세요. |
| 카테고리 | 라이프스타일 / 일상 / 기록 |
| 검색 키워드 | 귀여움, 도감, 취향, 굿즈, 문구, 선물, 덕질, 간식, 기록, 수집 |
| 사용 연령 | 전체 |
| 고객센터 채널 | 이메일 1개 |

### 14.2 챌린지 출품폼 카피 (자연스러움 다듬음, 1차 확정)

> 두 카피 모두 W3a(D15~D18)에 1차 확정해 둔 안이며, 출품 직전 W3b(D19~D23)에 토씨 단위로 최종 점검해요. 글자수는 띄어쓰기 포함 기준이에요.

#### A. 미니앱 한 줄 소개 (50자 이내)

> **오늘 마음에 든 귀여움을 하나씩 픽해 모으는 나만의 취향 도감이에요.** *(35자)*

- 다듬기 의도: 이전 안의 “좋아한 귀여운 것들”이 어색하게 늘어졌던 점을 해소했어요. **“좋아한 → 마음에 든”**, **“것들을 → 귀여움을”** 으로 바꿔 명사 흐름을 자연스럽게 정리했어요.
- 검토 포인트: ‘픽콩’ 브랜드 어휘 노출 없이도 가치가 전달되는지(O), 50자 안에 여유 있게 들어오는지(O), 동사 흐름이 한 호흡으로 읽히는지(O).

#### B. 챌린지 주제(“귀여운 게 최고야”)와의 연관성 (200자 이내)

> **픽콩은 “귀여운 게 최고야”라는 마음을 도감처럼 모으는 앱이에요. 문구·굿즈·간식·덕질템처럼 일상에서 마주친 귀여움을 카테고리 칸에 담아 두면, 한 달치 취향이 콩 캐릭터로 정리돼 친구에게 카드로 보낼 수 있어요. 소비를 반성하는 가계부가 아니라, 좋아한 마음을 가볍게 자랑하는 픽콩만의 귀여움 표현 방식이에요.** *(약 196자)*

- 의도: 챌린지 주제를 그대로 인용해 톤을 맞춘 뒤, 기능(카테고리 도감 + 월간 캐릭터 카드 공유)과 차별점(가계부 아님, 자랑형 표현)을 한 흐름으로 설명. **“소비를 반성하는 가계부가 아니라, 좋아한 마음을 가볍게 자랑하는”** 문구는 검수 안전판으로 그대로 유지했어요.
- 검토 포인트: 200자 안에 들어오는지(O), 검수에서 “소비 조장” 오해를 피하는 톤인지(O — 명시적 분리 문구 보존).

> 글자수 카운트는 띄어쓰기 포함 기준으로 출품 직전 자동 검증해요.

---

## 15. 디자인 방향

- 키워드: 귀여움 / 도감 / 콩 / 수집 / 파스텔 / 가벼움 / 3초 기록
- 메인 컬러: 크림 + 연두/민트 (`#7BD389`)
- 포인트: 핑크 또는 라벤더
- 텍스트: 진한 브라운/차콜
- 컴포넌트: TDS Button, BottomCTA, ListRow, ListHeader, Top, Tab, Asset, Badge
- 일러스트: 콩 캐릭터 8종 + 빈칸용 점선 칸 1종 + 열람자 온보딩용 도감 미니컷 1종
- 카드 비주얼: 본인용·공유용 동일, 헤더·하단 안내 카피만 분기
- 만료 안내 텍스트: 작은 폰트, 회색 톤(경고 컬러 미사용)
- 라이트 모드 단일 톤 유지

---

## 16. 핵심 카피 (UX 라이팅 적용)

| 위치 | 문구 |
|---|---|
| 앱 부제 | 오늘의 귀여움, 하나 픽 |
| 빈 도감 | 오늘의 귀여움 하나 담아볼까요? |
| 메인 CTA | 오늘의 콩 줍기 |
| 카드 잠금 안내 | 기록 3개부터 카드를 받을 수 있어요 |
| 로그인 헤드라인 | 픽콩에서 내 도감을 시작해 볼까요? |
| 로그인 서브 | 토스로 로그인하면 기록이 안전하게 이어져요 |
| 로그인 CTA | 토스로 시작하기 |
| 로그인 끊김 안내 | 토스 로그인을 다시 연결해 볼까요? |
| 닉네임 헤드라인(최초) | 어떻게 부를까요? |
| 닉네임 서브(최초) | 친구에게 카드를 공유할 때 이렇게 보여요 |
| 닉네임 CTA(최초) | 이 이름으로 시작할게요 |
| 닉네임 헤드라인(변경) | 닉네임을 바꿀까요? |
| 닉네임 서브(변경) | 바뀐 이름은 이번 달 카드부터 보여요 |
| 닉네임 CTA(변경) | 이 이름으로 바꿀게요 |
| 닉네임 변경 토스트 | 닉네임을 바꿨어요 |
| 닉네임 빈값 토스트 | 닉네임을 한 글자 이상 적어 볼까요? |
| 닉네임 허용 외 문자 토스트 | 닉네임은 한글, 영문, 숫자만 쓸 수 있어요 |
| 닉네임 자모 단독 토스트 | 자음·모음만으로는 닉네임을 만들 수 없어요. 완성된 글자로 적어 볼까요? |
| 닉네임 금칙어 토스트 | 이 닉네임은 쓸 수 없어요. 다른 이름으로 바꿔 볼까요? |
| 닉네임 추천 칩(고정) | 귀염콩 / 굿즈콩 / 문구콩 / 덕질콩 / 픽콩러 / 수집콩 |
| 등록 1단계 | 어떤 귀여움이에요? |
| 등록 2단계 | 얼마였어요? (선택) |
| 등록 3단계 | 어떤 콩으로 남길까요? |
| 등록 저장 CTA | 내 도감에 담기 |
| 완료 헤드라인 | 문구콩 하나를 주웠어요 |
| 완료 서브 | 이번 달 7번째 귀여움이에요. 도감 수집률 37% |
| 카드 본문 하단 안내(본인) | 친구는 이번 달 안에만 볼 수 있어요 |
| 공유 시트 상단 안내 | 이번 달 안에만 볼 수 있어요 |
| 공유 메시지 본문 양식 | {닉네임}의 이번 달 카드예요. 이번 달 안에만 볼 수 있어요. |
| 열람자 온보딩 헤드라인 | {닉네임}이(가) 이번 달 카드를 보냈어요 |
| 열람자 온보딩 본문 | 픽콩은 좋아한 귀여운 것을 모으는 도감이에요 |
| 열람자 온보딩 CTA | 이 카드 보러가기 |
| 공유 카드 헤더(타인) | {닉네임}의 이번 달 카드예요 |
| 공유 카드 CTA(타인) | 나도 도감 시작하기 |
| 공유 카드 헤더(본인) | 이번 달 나는 굿즈콩 햄스터 |
| 공유 카드 CTA(본인) | 내 도감 보러가기 |
| 공유 카드 만료 헤드라인(타인) | 이 카드는 지난 달 이야기예요 |
| 공유 카드 만료 서브 | 지금은 볼 수 없지만, 픽콩에서 내 도감은 언제든 시작할 수 있어요 |
| 공유 카드 만료 CTA | 픽콩 시작하기 |
| 삭제 확인 | 이 콩을 도감에서 지울까요? |
| 저장 실패 토스트 | 저장이 안 됐어요. 다시 한 번 눌러 볼까요? |
| 카드 저장 실패 토스트 | 카드를 만들지 못했어요. 잠시 후 다시 시도해 볼까요? |
| 네트워크 오류 토스트 | 인터넷 연결을 확인하고 다시 시도해 볼까요? |
| 탈퇴 확인 | 내 도감을 모두 지울까요? 기록은 되돌릴 수 없어요. |
| 탈퇴 실패 토스트 | 지금은 처리가 안 됐어요. 잠시 후 다시 시도해 볼까요? |
| **출품폼 한 줄 소개** | **오늘 마음에 든 귀여움을 하나씩 픽해 모으는 나만의 취향 도감이에요.** |

---

## 17. 배포 / 출시 / 운영

### 17.1 출시 절차

1. 광고 콘솔 설정 + 정산 채널 활성 확인
2. mTLS 인증서 발급 + 운영/테스트 환경 분리
3. 백엔드 운영 배포: `/auth/*`, `/account/*`, `/cards/*` + 공유 만료 cron + 금칙어 v1 머지(D7)
4. 번들(.ait) 생성 (압축 해제 ≤ 30MB)
5. 콘솔 업로드 → 토스앱 QR 테스트 + 4가지 공유·5가지 닉네임·**S-CARD-VIEW 4케이스·닉네임 9~10자 미리보기** 검증
6. 검토 요청 (영업일 3일)
7. 승인 후 `출시하기` + 30분 모니터링 윈도우

### 17.2 버전 / 롤백 / 핫픽스

- 버전: `MAJOR.MINOR.PATCH`
- 롤백: 콘솔 ‘앱 출시’ 메뉴
- 핫픽스: 채널톡 워크플로우
- 금칙어 긴급 추가: 백엔드 hotfix

### 17.3 모니터링

- Sentry(클라+서버)
- 콘솔 분석 핵심: `home_view`, `add_save_success`, `card_view`, `card_view_expiry_notice_view`, `share_complete`, `login_success`, `nick_save_success`, `nick_save_fail`(`forbidden`/`jamo_only`), `ad_show`, `ad_skip_due_to_fail`, `cardview_view`, `cardview_press_start_my_diagram`, `cardview_expired_view`, `set_change_nickname_success`, `set_account_delete_success`
- 광고 직후 `card_view` 도달률 < 95% 알람
- 공유 링크 → `cardview_view` 도달률 알람
- 만료 배치 실패 알람
- 신고 내역(콘솔)

### 17.4 고객센터 / 신고

- NavigationBar ‘신고하기’ 활성
- 콘솔 고객센터 이메일 기재
- 신고 24~48시간 내 1차 응대

---

## 18. 일정 (잔여 23일, OG 회수분 재배치 반영)

| 주 | 목표 | 핵심 작업 |
|---|---|---|
| W1 (D1~D7) | 핵심 루프 + 로그인 + 닉네임 + 백엔드 + 금칙어 v1 배포 | 프로젝트 세팅 / Granite·TDS / 백엔드 mTLS·자체 API 스켈레톤 / 토스 로그인 / S-NICK / Storage / 도감 그리드 / 콩 등록 / 완료 / **D7: 금칙어 v1 머지·운영 배포 완료** |
| W2 (D8~D14) | 결과·서버 카드·공유·광고·만료·만료 안내·탈퇴 + S-NICK-EDIT + **회수분 우선 배치** | 룰베이스 / monthly_cards upsert·조회(8자 hash) / S-CARD + 본인 카피 분기(매번 노출) / S-NICK-EDIT(설정 추천 칩 6개) / S-VIEWER-INTRO / S-CARD-VIEW(본인·타인·만료) / 결과 카드 저장·공유 + 시트 통일 안내 + 공유 메시지 양식 / 전면 광고(위치 A, 월 1회) / 공유 만료 cron / **닉네임 변경 시 active 카드 동기화** + 회귀 라운드 / 회원 탈퇴 + 카드 정리 / 빈·에러 상태 / 라이팅 1차 정리 |
| W3a (D15~D18) | 검수 직전 점검 + 출품폼 카피 1차 확정 | §5.15 체크리스트 / Safe Area / 라이트 모드 / 다크패턴 5종 / 광고 4번 집중 / Sentry / 분석 이벤트 / 어뷰징 차별화 코멘트 / 광고·정산 활성 / 금칙어 회귀 / 만료 배치 / 공유·닉네임 케이스 / 공유 메시지 컷오프 / 카피 분기 노출 / **(b) S-CARD-VIEW 4케이스 회귀 우선 → (c) 닉네임 변경 후 active 카드 동기화 회귀 → (a) 라이팅 디테일 다듬기** / **닉네임 9~10자 미리보기 추가 케이스** / 출품폼 한 줄 50자 / 연관성 200자 1차 확정 |
| W3b (D19~D23) | 검수·반려·출품 | 콘솔 검토 요청 / 반려 시 패치 1회 / **출품폼 최종 카피 확정 + 챌린지 출품폼 제출** |

---

## 19. 런칭 기준 (DoD)

| 기준 | 완료 |
|---|:---:|
| 온보딩 → 로그인 → 닉네임 → 메인 도감 진입 | ☐ |
| 토스 로그인 강제 / 끊김 재연결 / 탈퇴(신규 user_key + 닉네임 재입력) 정상 | ☐ |
| 닉네임 완성형 + 추천 칩 6개 / 자모 단독·이모지·특수문자 차단 / 설정 변경 시에도 추천 칩 6개 / **변경 시 현재 달 active 카드만 동기화 회귀 통과** | ☐ |
| 30초 내 첫 기록 가능 | ☐ |
| 본인 카드 upsert·표시·이미지 저장·공유 가능 (8자 hash) | ☐ |
| 만료 사전 안내 화면 맥락별 카피 일관성 / 본인 카피 매번 노출 | ☐ |
| 공유 메시지 양식 + 토스 share 미리보기 컷오프 없음 (**닉네임 9~10자 케이스 포함**) | ☐ |
| 공유 링크 → 로그인 → (신규)닉네임 → 1장 온보딩 → S-CARD-VIEW | ☐ |
| 공유 링크 → (기존)즉시 S-CARD-VIEW | ☐ |
| **S-CARD-VIEW 본인·타인·만료·탈퇴자 4케이스 회귀 통과** | ☐ |
| 공유 카드 월 만료 배치 정상 / 본인 카드 영구 유지 | ☐ |
| 카드 만료/삭제/탈퇴자 진입 시 안내 화면 정상 | ☐ |
| 전면 광고 위치 A / 월 1회 / `ad_show` 시점만 갱신 / silent skip | ☐ |
| 광고 직후 S-CARD 자연 진입 / 공유·열람자 온보딩 광고 없음 | ☐ |
| 라이트 모드 일관성 / Safe Area 정상 | ☐ |
| 외부 링크·자사앱 유도 0건 / 공유는 토스 share만 | ☐ |
| 다크패턴 5종 0건 (특히 4번) | ☐ |
| **UX 라이팅 디테일 다듬기 1라운드 완료** | ☐ |
| 분석 이벤트(login_*, nick_*, nickedit_*, ad_*, home·add·card·card_view_expiry_notice·share_*·viewerintro_*·cardview_*·set_*) 적재 | ☐ |
| Sentry 적재 정상(클라+서버) | ☐ |
| 어뷰징 차별화 코멘트 첨부 | ☐ |
| 앱 메타·로고·`granite.config.ts` 확정 | ☐ |
| 광고 콘솔 + 정산 채널 활성 | ☐ |
| 금칙어 v1 D7 배포 완료(관리자 사칭 변형 회귀 통과) | ☐ |
| 만료 배치 알람 등록 | ☐ |
| **출품폼 한 줄(자연스러움 다듬음) 50자 / 연관성 200자 1차 확정** | ☐ |

---

## 20. 리스크 & 오픈 이슈

### 20.1 정책 리스크

| 리스크 | 영향 | 완화 |
|---|---|---|
| 자사 미니앱 어뷰징 오해 | 검수 반려 | §5.3 차별화 코멘트 |
| 소비 조장 오해(금액 표시) | 검수 반려 | 금액은 선택값·총합만·할인/링크 없음 / 출품폼 카피에서도 “소비를 반성하는 가계부가 아니라” 명시 |
| 전면 광고 다크패턴 4번 위반 | 검수 반려 | 위치 A 단일·월 1회·`ad_show` 시점만 갱신·silent skip / 공유·열람자 온보딩에 광고 없음 |
| 공유 카드를 통한 개인정보 노출 | 신뢰 저하 | 카드는 집계값 + 닉네임만, 메모·이모지 미노출 |
| 닉네임 부적절 내용 | 신뢰 저하·검수 반려 | 완성형 텍스트만 + 정적 사전·정규식 + 신고 + 변경 |
| 관리자/공식 사칭 닉네임 | 신뢰 저하 / 사기 위험 | 변형 정규식 적극 차단 / 신고 / hotfix |
| 본인 입장에서 만료 카피 오해 | 사용자 혼란 | S-CARD 본인 카피 분기 매번 노출 |
| 토스 로그인 동의 항목 과다 | 검수 반려 | 추가 항목 0건 |
| 로그인·닉네임 강제로 진입 이탈 | KPI 하락 | 추천 칩 6개 1탭 / 12초 / 가치 카피 |

### 20.2 기술 리스크

| 리스크 | 영향 | 완화 |
|---|---|---|
| 카드 정합성(기록 수정 후) | 잘못된 결과 노출 | 본인 진입 시 upsert + dirty 플래그 |
| 카드 ID 충돌(8자) | 발급 실패 | 5회 재시도 + 알람 |
| 공유 만료 배치 지연 | 만료 카드 노출 | 1시간 재시도 + 알람 |
| 닉네임 변경 후 과거 카드 시점성 혼동 | 사용자 혼란 | 현재 달만 갱신 |
| 탈퇴 후 카드 잔존 | 개인정보 이슈 | 탈퇴 트랜잭션에 monthly_cards 삭제 포함 |
| CORS / mTLS 환경 차이 | 실 환경 호출 실패 | 환경별 분리·만료 알람 |
| 광고 인벤토리 부족 | 노출 0회 | silent skip + 실패율 모니터링 |
| 단말 스토리지 한계 | 100건+ 성능 저하 | 단순 구조 + 페이지네이션 |
| 토스 share 미리보기 빈약 | 클릭 도달률 약화 | 메시지 카피 30자 내외 + 닉네임 강조 — Phase 2에서 OG 도입 검토 |
| 금칙어 사전 누락 | 운영 위험 | 신고 모니터링 + hotfix |

### 20.3 일정 리스크

| 리스크 | 완화 |
|---|---|
| W1 마지막 날 금칙어 v1 머지 지연 | W1 중반에 사전 후보 단어 풀 1차 작성 / 코드 리뷰 사전 정렬 |
| W2 부담(카드·공유·광고·만료·안내·탈퇴) | 안내 동일 문구 재사용 / 만료 cron 단일 SQL / 닉네임 동기화 단일 SQL / **OG 제거로 워커 작업 라인 폐기 → W2 여유 회복** |
| 검수 반려 1회 이상 가능성 | D19까지 1차 제출 / 패치 5일 확보 |
| 챌린지 출품 마감(5/24) | 제출 D-3까지 출시 승인 + 출품폼 사전 작성 / W3a 카피 초안 W3b 최종 |

---

## 21. 부록

### 21.1 용어집

| 용어 | 설명 |
|---|---|
| 픽콩 | 본 미니앱 서비스명 |
| 콩 | 등록되는 1건의 “귀여운 것” 기록 단위 |
| 도감 | 카테고리 8칸으로 구성된 메인 그리드 |
| 카드 | 월간 결과 카드. 캐릭터·집계·공유 단위 |
| `card_id` | 8자 hash 카드 식별자, 공유 링크에 사용 |
| `user_key` | 토스 로그인 후 영속 발급되는 사용자 식별 키 |
| Granite | 앱인토스 미니앱 SDK 프레임워크 |
| TDS | 토스 디자인 시스템 |
| OG 이미지 | Open Graph 미리보기 이미지(MVP 비범위, Phase 2) |

### 21.2 참고 링크

- 앱인토스 문서 인덱스: https://developers-apps-in-toss.toss.im/llms.txt
- 서비스 오픈 정책: https://developers-apps-in-toss.toss.im/intro/guide.md
- 비게임 출시 가이드: https://developers-apps-in-toss.toss.im/checklist/app-nongame.md
- 다크패턴 방지 정책: https://developers-apps-in-toss.toss.im/design/consumer-ux-guide.md
- UX 라이팅: https://developers-apps-in-toss.toss.im/design/ux-writing.md
- 자사 앱 설치/외부 링크 가이드라인: https://developers-apps-in-toss.toss.im/checklist/miniapp-external-link.md
- 미니앱 출시(번들·검수·롤백): https://developers-apps-in-toss.toss.im/development/deploy.md
- 미니앱 브랜딩 가이드: https://developers-apps-in-toss.toss.im/design/miniapp-branding-guide.md
- 토스 로그인 개발: https://developers-apps-in-toss.toss.im/login/develop.md
- 인앱 광고 2.0 ver2(전면형): https://developers-apps-in-toss.toss.im/bedrock/reference/framework/광고/IntegratedAd.md
- 공유하기(SDK): https://developers-apps-in-toss.toss.im/bedrock/reference/framework/공유/share.md
- saveBase64Data: https://developers-apps-in-toss.toss.im/bedrock/reference/framework/데이터/saveBase64Data.md
