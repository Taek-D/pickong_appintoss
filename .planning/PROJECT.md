# 픽콩 (pickkong)

## What This Is

픽콩은 문구·굿즈·간식·선물처럼 마음에 든 귀여운 것을 하나씩 도감에 기록하는 앱인토스 미니앱이에요. 굿즈·덕질·문구 수집을 즐기는 20~30대가 30초 안에 한 번 픽하면 도감 한 칸이 채워지고, 한 달치 취향이 콩 캐릭터 카드로 정리되어 토스 친구에게 카드로 공유돼요.

## Core Value

**한 번 픽하면 30초 안에 도감이 채워지고, 한 달치 취향이 친구에게 보여줄 수 있는 캐릭터 카드로 돌아온다.**

이 한 줄이 무너지면 모든 게 무너진다 — 등록 입력 마찰, 카드 공유 흐름, 본인/타인 카드 분기, 만료 안내까지 전부 이 한 문장 보호용이다.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] 토스 로그인 강제 (mTLS) + 끊김 자동 재연결 + 회원 탈퇴 트랜잭션
- [ ] 닉네임 1회 입력 강제 (한글 완성형 + 영문 + 숫자, 추천 칩 6개 고정) + 설정 변경 + 금칙어 사전 v1
- [ ] 도감 그리드 8칸 + 콩 등록 3단계 (30초 내) + 수집률·주간 진행 + 기록 수정·삭제
- [ ] 월간 결과 카드 룰베이스 + 서버 upsert (8자 hash card_id, 본인 영구·공유 월 만료)
- [ ] 결과 카드 이미지 저장 + 토스 share (스킴 /card/{8-hash}, 외부 링크 0건)
- [ ] 공유 카드 열람 (S-CARD-VIEW) — 본인/타인/만료/탈퇴자 4분기 + 신규 가입자 1장 온보딩
- [ ] 만료 사전 안내 카피 4지점 통일 (S-CARD 본인·S-SHARE·메시지·S-CARD-VIEW)
- [ ] 전면 광고 단일 지점 (위치 A: S-CARD 진입 직전), 월 1회 단일 캡, ad_show 시점만 갱신
- [ ] 공유 카드 월 만료 배치 (매월 1일 0시 KST cron, 1시간 6회 재시도)
- [ ] 닉네임 변경 시 현재 달 active 카드만 nickname_snapshot 동기화
- [ ] 검수 체크리스트 (§5.15) 전 항목 통과 — 다크패턴 5종 0건, TDS 라이트 모드, Safe Area
- [ ] 챌린지 출품폼 카피 (한 줄 50자 / 연관성 200자) 1차 확정 + 글자수 검증
- [ ] Sentry 적재 + Granite Analytics 핵심 이벤트 (§9.2)

### Out of Scope

- 카드/계좌 연동 — 금융 상품 영역 (검수 회피)
- 사진 업로드 — 운영 부담 + 개인정보 최소화
- 미로그인 둘러보기 — IA 단순화 + 토스 로그인 강제 정책
- 보상형 광고 — Phase 2 백로그 (전면형 단일로 단순화)
- 카드 한 줄 메모 — 카드 데이터에 텍스트 미저장 (개인정보 노출 회피)
- 공유 카드 영구 유지 — 본인은 영구, 공유는 월 만료로 정책 분리
- 닉네임 이모지·특수문자·자모 단독 — 검수 + 렌더링 안전성
- 닉네임 추천 칩 일부 랜덤 — 단순성
- 닉네임 과거 카드 일괄 동기화 — 시점성 보존 + 구현 단순화
- 별도 금칙어 관리 콘솔 — 코드 푸시 운영으로 충분
- 정치·종교·광고·도배 강력 차단 — 신고/hotfix 운영으로 충분
- 위치 B 광고 — 다크패턴 4번(예상치 못한 광고) 위험
- 공유 미리보기 OG 이미지 — MVP 복잡도, Phase 2 백로그
- 포인트/리워드/친구 초대 보상/AI 코멘트/랭킹/팔로우/채팅/카드 좋아요 — 정책·검수·범위

## Context

- **챌린지 컨텍스트**: 앱인토스 바이브코딩 챌린지 "귀여운 게 최고야" 출품작. 마감 2026-05-24 (잔여 23일).
- **앱 유형**: 비게임 (라이프스타일/일상/기록) — TDS 디자인 시스템 적용 필수.
- **자사앱 어뷰징 리스크**: PRD §5.3에 커피 트래킹·작심삼일 루틴 챌린지와의 본질·UX·결과물·IA 차이를 명시한 차별화 코멘트가 검수 첨부 필수.
- **토스 로그인 강제 정책**: 우회 경로 0건, 동의 항목 최소화, 탈퇴 시 user_key 폐기.
- **외부 링크 정책**: 외부 호스팅 자산 0건 (OG 이미지 미사용). 토스 share만 사용 (`getTossShareLink` + `share`).
- **다크패턴 5종 회피**: 진입 직후 인터럽트, 뒤로가기 바텀시트, 나갈 수 없는 구조, 예상치 못한 광고(특히 4번), 모호한 CTA — 모두 구조적으로 차단.
- **선행 자산**:
  - `pickkong_prd_v2.0.md` — 출품 확정안 PRD (모든 섹션의 단일 진리원)
  - `granite.config.ts` — `appName: pickkong`, `displayName: 픽콩`, `primaryColor: #7BD389`
  - `feature_list.json` — F000~F099 30개 기능 트래커 (harness-workflow 산출물)
  - `claude-progress.txt` — 세션 간 컨텍스트 핸드오프
  - `apps-in-toss-examples-robin/` — SDK 2.0.1 블록 카탈로그 + 시나리오 레퍼런스

## Constraints

- **Timeline**: 2026-05-24 마감 — 잔여 23일 (개발 14일 + 검수 7~9일 + 패치 5일 버퍼). PRD §18 W1~W3b 일정 고수.
- **Tech stack**: React 19 + Vite + Tailwind 4 + `@apps-in-toss/web-framework` 2.0.1 (WebView 미니앱). React Native가 아님.
- **Backend**: 토스 mTLS + 자체 카드/계정/닉네임 API + 매월 1일 0시 KST 만료 cron + 금칙어 정적 사전.
- **Performance budget**: 번들 압축 해제 ≤30MB, 첫 렌더 TTI ≤1.5s, 카드 upsert ≤600ms, 닉네임 저장 ≤300ms, 광고 로드 1.5s 타임아웃 + silent skip.
- **Compliance**: 라이트 모드 단일, iframe 금지, CORS 운영·테스트 도메인 등록, 권한 요청 0건 (토스 로그인 외).
- **Security**: 외부 호스팅 자산 0건, 카드 조회 인증 필수, mTLS 환경별 인증서 분리.
- **검수 정책**: 앱인토스 §5.15 체크리스트 모두 ✅, 어뷰징 차별화 코멘트 첨부, 다크패턴 5종 0건.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| OG 이미지 자동 생성·캐싱 미사용 (MVP) | 워커·정적 호스팅·캐시 무효화 복잡도가 W2 일정 초과 위험. 메시지 카피 + 닉네임 강조로 클릭률 확보. | — Pending (Phase 2 백로그) |
| 전면 광고 단일 지점 (위치 A만) | 다크패턴 4번 회피. 위치 B는 진입 직후 인터럽트로 검수 반려 위험. | — Pending |
| 공유 카드 월 만료 + 본인 영구 분리 | 자랑형 톤 보존 + 공유 데이터 라이프사이클 단순화 (운영 부담 최소). | — Pending |
| 닉네임 변경 시 현재 달 active 카드만 동기화 | 과거 카드 일괄 갱신은 시점성 혼동. 트랜잭션 1줄로 단순화. | — Pending |
| 추천 닉네임 6개 고정 (랜덤 접미 없음) | 활성화 KPI(닉네임 ≤12초) 보호 + 단순성. | — Pending |
| 금칙어 운영을 코드 PR로 (관리자 콘솔 미구축) | MVP 범위 단순화. 변형 정규식으로 관리자 사칭만 강력 차단, 욕설·혐오는 가볍게. | — Pending |
| 챌린지 출품폼 한 줄 50자 카피를 35자로 다듬음 | "좋아한 귀여운 것들" 어색함 해소 → "마음에 든 귀여움". | ✓ Good (PRD v2.0 확정) |
| 챌린지 연관성 200자에 "소비를 반성하는 가계부가 아니라" 보존 | 검수 안전판 — 소비 조장 오해 차단. | ✓ Good |
| 백엔드 = Node.js + Hono + TypeScript | Hono는 가장 가벼운 모던 TS 프레임워크 — Node/Bun/Cloudflare/Vercel 모두 호환, mTLS는 Node native fetch agent. Express보다 가벼우면서 type-safe. | — Pending (autonomous-default) |
| DB = Postgres via Supabase | 무료 티어, 서버리스, mTLS 미사용(연결 끊김 자동 재시도), 타임존 KST cron 지원, 마이그레이션 SQL로 단순. | — Pending (autonomous-default) |
| Cron = GitHub Actions schedule | 무료, 매월 1일 0시 KST cron 표현식 `0 15 L-1 * *` 또는 `0 0 1 * *`(UTC+9 보정). 1시간 6회 재시도는 워크플로 내 retry. | — Pending (autonomous-default) |
| Sentry/Granite Analytics = Mock DSN | 실 DSN/콘솔 ID는 배포 시점에 .env로 주입. 코드는 wrapper로 분리해 mock fallback. | — Pending (autonomous-default) |
| 카테고리 Slot 7·8 라벨 = 책·잡지(📚) / 기타(📦) | PRD §12 6종 캐릭터 + 다양성 보너스 1 + 새싹 1 = 8 슬롯이지만 Slot 7·8 라벨 PRD 침묵. 책·잡지는 굿즈/문구 인접 도메인, 기타는 안전판. | — Pending (autonomous-default, 변경 가능) |
| S-ADD 추천 이모지 12종 = 🎁✨💕🌸⭐🍀🐰🐻🌿🍡📒💝 | PRD §7.7 수량만 명시. 카테고리(굿즈/문구/간식/선물/덕질/반려/책/기타) 톤 분포 + 일반 귀여움 이모지 배합. | — Pending (autonomous-default) |
| Accent 컬러 = 라벤더 #B59CD9 | PRD §15 핑크/라벤더 양자택일. 라벤더가 도감/취향/굿즈 톤과 정합, 핑크의 할인·세일 톤 충돌 회피. | — Pending (autonomous-default) |
| S-DONE secondary CTA = TDS Button variant=secondary, outline #7BD389 | UI-SPEC checker 권장 명시. Primary("도감 보러가기")는 BottomCTA, Secondary("하나 더 줍기")는 그 위 outline 버튼. | — Pending (autonomous-default) |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-01 after initialization (auto mode from pickkong_prd_v2.0.md)*
