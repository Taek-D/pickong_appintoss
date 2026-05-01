# Research Summary: 픽콩 (pickkong)

> **Note**: 본 프로젝트는 PRD `pickkong_prd_v2.0.md`가 이미 출품 확정 수준의 종합 리서치 결과를 포함하고 있어, 별도의 4-parallel research subagent spawn(Stack/Features/Architecture/Pitfalls)을 생략했습니다. PRD가 단일 진리원(single source of truth)이며, 이 SUMMARY.md는 그 핵심을 GSD 형식으로 추출한 인덱스입니다.

## Source of Truth

- **Primary**: `pickkong_prd_v2.0.md` (출품 확정안)
- **Domain reference**: `apps-in-toss-examples-robin/` (SDK 2.0.1 블록 카탈로그 + 시나리오 레퍼런스)
- **External docs**: https://developers-apps-in-toss.toss.im/bedrock/reference/framework/ (각 SDK API)

## Stack (PRD §10.1, §10.3 기반)

| Layer | Choice | Rationale |
|---|---|---|
| Client framework | React 19 + Vite + Tailwind 4 | apps-in-toss-examples-robin 표준 (`_template/package.json`) |
| Mini-app SDK | `@apps-in-toss/web-framework@2.0.1` | WebView 미니앱, dynamic import + isSupported() 패턴 필수 |
| Backend | Node/TypeScript + mTLS | 토스 API 호출 (generateOauth2Token, refreshOauth2Token, loginMe, removeByUserKey) |
| Storage | SDK Storage (단말 캐시) + RDB (accounts, monthly_cards) | 단말은 cute_items, summary, ad_card_shown / 서버는 카드 + 닉네임 |
| Analytics | Granite Analytics | PRD §9.2 이벤트 택소노미 |
| Monitoring | Sentry (client + server) | 크래시 프리율 ≥99.5% 가드레일 |

**금지 사항:**
- Static SDK import (`import { loadFullScreenAd } from '@apps-in-toss/web-framework'`) → dynamic import 강제
- iframe 사용 → 검수 반려
- 외부 호스팅 자산 (OG 이미지 등) → 검수 반려

## Features — Table Stakes (앱인토스 비게임 미니앱 기준)

- 토스 로그인 (`appLogin`) 강제 + 동의 항목 최소화 + 끊김 자동 재연결 + 회원 탈퇴 (`removeByUserKey`)
- TDS 컴포넌트 사용 (Button, BottomCTA, Top, ListRow, ListHeader, Tab, Badge)
- 라이트 모드 단일
- 다크패턴 5종 부재 (특히 4번 예상치 못한 광고)
- 외부 링크/자사앱 설치 유도 0건
- Safe Area + iOS 스와이프 백 정상

## Features — Differentiators (픽콩 고유)

- 카테고리 8칸 도감 그리드 (커피 트래킹·루틴 챌린지와 본질·UX·결과물·IA 차별화)
- 월간 캐릭터 룰베이스 + 8자 hash card_id로 카드 공유
- 본인 카드 영구 + 공유 카드 월 만료 정책 분리
- 만료 사전 안내 카피 4지점 통일 (S-CARD 본인 / S-SHARE / 메시지 / S-CARD-VIEW)
- 닉네임 추천 칩 6개 고정 + 변경 시 현재 달만 동기화 (시점성 보존)

## Features — Anti-Features (의도적 미구현)

- 카드 OG 이미지 자동 생성·캐싱 → MVP 비범위, Phase 2
- 보상형 광고 → Phase 2 (전면형 단일 캡으로 단순화)
- 카드 한 줄 메모 → 데이터 텍스트 미저장 (개인정보 노출 회피)
- 미로그인 둘러보기 → IA 단순화 + 토스 로그인 강제
- 위치 B 광고 → 다크패턴 4번 위험

## Architecture (PRD §6, §10, §13 기반)

**화면 트리:**
- (0) S-ONB → (0a) S-LOGIN → (0b) S-NICK → (1) S-HOME
- (1) S-HOME → (2) S-ADD → (2a) S-DONE / (3) S-CAT / (5) S-CARD
- (5) S-CARD → (4) S-AD → S-CARD / (5c) S-SHARE
- 공유 링크 → S-LOGIN → (신규) S-NICK → (5b) S-VIEWER-INTRO → (5a) S-CARD-VIEW / (기존) S-CARD-VIEW

**API 경계:**
- Client → Backend: `/auth/exchange`, `/auth/me`, `/account/nickname` (POST/PATCH), `/account` (DELETE), `/cards/{user_key}/{yyyymm}` (POST), `/cards/{card_id}` (GET)
- Backend → 토스 (mTLS): `generateOauth2Token`, `refreshOauth2Token`, `loginMe`, `removeByUserKey`

**데이터:**
- accounts (user_key PK, nickname, status, withdrawn_at)
- monthly_cards (card_id PK 8자 hash, user_key, month, top_category, character_type, nickname_snapshot, card_status, share_status)
- cute_items (단말 only, uuid, user_key, category, amount, emoji, memo, created_at)

**배치:**
- 매월 1일 0시 KST cron — `UPDATE monthly_cards SET share_status='expired' WHERE month < this_month AND share_status='active'`
- 본인 `card_status='active'` 영구 유지
- 1시간 6회 재시도 + 알람

## Pitfalls (PRD §5, §11.2, §20 기반)

| Pitfall | Warning Signs | Prevention | Phase |
|---|---|---|---|
| 자사앱 어뷰징 오해 | 검수 코멘트 "기존 자사 미니앱과 유사" | §5.3 차별화 표 첨부 | Phase 4 |
| 다크패턴 4번 (예상치 못한 광고) | 광고가 진입 직후/공유/온보딩에 노출 | 위치 A 단일, ad_show 시점만 갱신, silent skip | Phase 2 |
| 소비 조장 오해 | 검수 코멘트 "가계부 앱" | 출품폼 카피 "소비를 반성하는 가계부가 아니라" 보존 | Phase 3 |
| 관리자/공식 사칭 닉네임 | nick_save_fail(forbidden) 비중 증가 | 변형 정규식 적극 차단 (D7 v1 배포) | Phase 1 |
| 토스 share 미리보기 컷오프 | 닉네임 9~10자에서 메시지 잘림 | 메시지 30자 내외 + 9~10자 회귀 케이스 | Phase 3 |
| 닉네임 변경 후 과거 카드 시점성 혼동 | 사용자 신고 "과거 카드 닉네임 안 맞음" | 현재 달 active만 갱신 | Phase 2 |
| 공유 만료 배치 지연 | 만료 카드 노출 사용자 신고 | 1시간 6회 재시도 + 알람 | Phase 2 |
| 카드 ID 8자 hash 충돌 | 발급 실패 로그 | 5회 재시도 + 알람 | Phase 2 |
| mTLS 환경 차이 | 운영/테스트 인증서 만료 | 환경별 분리 + 만료 알람 | Phase 1 |
| 광고 인벤토리 부족 | ad_skip_due_to_fail 비중 증가 | 1.5s 타임아웃 + silent skip + 모니터링 | Phase 2 |

---
*Synthesized: 2026-05-01 from pickkong_prd_v2.0.md (no separate parallel research spawned — PRD already contains research-grade depth)*
