# §5.15 앱인토스 검수 체크리스트 — 픽콩 v0.1.0 (Phase 3 추적)

> 출처: `pickkong_prd_v2.0.md` §5.15. 모든 필수(✅) 통과 + ⭕ 권장 항목도 가능한 한 충족.

## 필수 (✅)

| 분류 | 항목 | 픽콩 대응 | 상태 |
|---|---|---|---|
| 접속 | 진입 직후 인터럽트 없음 | S-ONB은 슬라이드 즉시 표시, 모달/광고 0건 | ✅ Pass |
| 내비게이션 바 | 토스 컴포넌트 / 닫기 정상 | granite.config.ts navigationBar (토스 기본) + 자체 백버튼 0 | ✅ Pass |
| 내비게이션 바 | 브랜드 로고/이름 노출 | granite.config.ts brand.displayName=픽콩 / index.html title=픽콩 | ✅ Pass |
| 서비스 동작 | 앱 내 기능 미니앱 내 완결 | 모든 흐름이 미니앱 내, 외부 페이지 0 | ✅ Pass |
| 서비스 동작 | 외부 링크/앱 설치 유도 없음 | 외부 URL 0건, 자사앱 prompt 0건 | ✅ Pass |
| 서비스 동작 | Safe Area / iOS 스와이프 백 정상 | globals.css safe-area + setIosSwipeGestureEnabled (Phase 4 SDK 호출 wired) | ✅ Pass |
| 로그인 | 토스 로그인 정상 / 재연결 / 동의 최소화 / 끊김 시 데이터 보존 / 탈퇴 경로 | F013/F014/F015 모두 풀구현 | ✅ Pass |
| 닉네임 | 완성형 한글+영문+숫자 / 자모 단독 차단 / 1회 입력 강제 / 설정 변경 시 추천 칩 6개 / 금칙어 필터 | F021 + F026 + S-NICK-EDIT | ✅ Pass |
| 금칙어 | 관리자 사칭 강력 + 욕설·혐오 가볍게 / D7 v1 배포 | F026 단위 테스트 50+ 케이스 | ✅ Pass (D7 배포 시점 적용) |
| 광고 | 위치 A 단일 / 월 1회 단일 캡 / ad_show 시점만 갱신 / silent skip / S-CARD 자연 진입 | F016/F017 ad.ts | ✅ Pass |
| 광고 | 공유 카드 열람·열람자 온보딩에 광고 없음 | 라우터 분기상 호출 0 | ✅ Pass |
| 공유 | 토스 share만 / 외부 URL 0건 / 외부 미리보기 호스팅 없음 | F005 sdk.ts share/getTossShareLink만 | ✅ Pass |
| 공유 | 만료·삭제 카드 진입 시 명확 안내 | F019/F020 4분기 분기 | ✅ Pass |
| 공유 안내 | S-CARD 본인 카피(매번 노출) / S-SHARE 통일 / 메시지 통일 / S-CARD-VIEW 만료 통일 | F024 4지점 COPY 인용 | ✅ Pass |
| 공유 메시지 | `"{닉네임}의 이번 달 카드예요. 이번 달 안에만 볼 수 있어요."` 양식 | F027 share-message.ts | ✅ Pass |
| 카드 만료 | 매월 1일 0시 KST 배치 / 본인 카드 영구 유지 | F023 expire-cards.ts + GitHub Actions (KST 정확도는 Phase 4 cron-job.org 검토) | ⚠ Pass with note |
| UX | 다크패턴 5종 부재 | 03-DARK-PATTERN-AUDIT.md 참조 (모두 Pass) | ✅ Pass |
| UX | 해요체·능동·긍정 라이팅 일관 | shared/constants.ts COPY 객체에서 일괄 관리 | ✅ Pass |
| UX | 모든 CTA에서 다음 행동 예측 가능 | "토스로 시작하기", "이 이름으로 시작할게요", "내 도감에 담기", "도감 보러가기" 등 | ✅ Pass |
| 디자인 | TDS 컴포넌트 / 라이트 모드 일관성 | TDS-스타일 wrapper (Button, BottomCTA, Top, BottomSheet, Toast) + globals.css color-scheme:light only | ✅ Pass |
| 데이터 | 개인정보 최소 수집 | 토스 로그인 외 권한 0건, 닉네임만 자유 입력 | ✅ Pass |
| 데이터 | user_key 기반 사용자 분리 정상 | accounts PK + Storage 키 prefix + cookie 세션 | ✅ Pass |
| 어뷰징 | 자사 미니앱 본질 차별 명시 | submission/differentiation-note.md (Phase 3에서 작성) | ✅ Pass |
| 사업자/정산 | 정산 채널 활성 | Phase 4에서 콘솔 활성화 | ⏳ Phase 4 |
| 설명자료 | 앱 이름/한 줄/상세/검색 키워드 | submission/console-meta.md (Phase 4에서 정리) | ⏳ Phase 4 |
| 출품폼 | 한 줄 50자 / 연관성 200자 양식 준수 | submission/tagline.txt + relevance.txt + validate-submission.mjs | ✅ Pass |

## 권장 (⭕)

| 항목 | 픽콩 대응 | 상태 |
|---|---|---|
| 분석 | Granite Analytics + 핵심 이벤트 | analytics.ts wrapper + 41 EventName 정의 + 적재 | ✅ Pass |
| 모니터링 | Sentry 연동 | sentry.ts wrapper (lazy init, DSN 없으면 no-op) | ✅ Pass |

---
*업데이트: 2026-05-01 — Phase 3 작성*
