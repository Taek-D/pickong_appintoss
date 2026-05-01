---
phase: 1
slug: foundation
status: approved
shadcn_initialized: false
preset: tds-mobile
created: 2026-05-01
reviewed_at: 2026-05-01
checker_verdict: PASS (6/6 dimensions + pickkong-specific 6/6)
---

# Phase 1 — UI Design Contract (Foundation)

> 픽콩 Phase 1 (W1, D1~D7) 시각·인터랙션 계약. 단일 진리원: `pickkong_prd_v2.0.md` v2.0 (출품 확정안). 이 문서는 PRD §5.5/§5.12/§5.13/§7/§9.2/§10.11/§10.12/§15/§16에서 추출되었으며, 어떤 카피·치수·정책도 PRD를 재해석하지 않고 그대로 옮긴다. Phase 1 화면(S-ONB / S-LOGIN / S-NICK / S-HOME / S-ADD / S-DONE / S-CAT)만 다루며, S-CARD·S-CARD-VIEW·S-SHARE·S-VIEWER-INTRO·S-NICK-EDIT·S-LIST·S-SET·S-AD는 Phase 2 범위로 본 문서 적용 대상 아님.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none (TDS Mobile 내장 컴포넌트만 사용 — shadcn registry 미사용) |
| Preset | tds-mobile (Toss Design System) |
| Component library | TDS Mobile via `@apps-in-toss/web-framework@2.0.1` (WebView 미니앱 — React Native 아님) |
| Icon library | TDS 기본 아이콘 — 모노톤 (`Asset` 컴포넌트 또는 TDS 아이콘 토큰만, 컬러 아이콘 금지) |
| Font | TDS 기본 (Pretendard 권장) |
| Color mode | 라이트 모드 단일 (다크 모드 미지원 — 검수 가드레일, PRD §5.13/§5.15) |

---

## Spacing Scale

8-point 스케일 (모든 값은 4의 배수):

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | 칩·아이콘 사이 간격, 인라인 패딩 |
| sm | 8px | 입력 필드 내부 패딩, ListRow 사이 |
| md | 16px | 기본 좌우 화면 패딩, 섹션 내부 간격 |
| lg | 24px | 섹션 사이 간격, BottomCTA 위 여백 |
| xl | 32px | 헤드라인-서브 사이, 그리드 행 간격 |
| 2xl | 48px | 슬라이드 일러스트-카피 사이, 빈 상태 일러스트 위 |
| 3xl | 64px | 화면 상단 여백 (Top 컴포넌트 아래) |

Exceptions:
- TDS BottomCTA 자체 높이는 라이브러리 기본값(56~64px) 사용 — 재정의 금지
- 키보드 위 떠있는 BottomCTA는 KeyboardAboveView가 관리하는 동적 여백 — 수동 패딩 금지 (PRD §10.12)
- 터치 타겟 최소 44×44px 보장 (S-NICK 추천 칩, S-HOME 카테고리 칸)

---

## Typography

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Body | 16px | 400 (regular) | 1.5 |
| Label | 14px | 600 (semibold) | 1.4 |
| Heading | 20px | 600 (semibold) | 1.3 |
| Display | 28px | 700 (bold) | 1.2 |

- 가용 weight 2종 한정: 400 / 600. Display만 700 1회 사용 (S-ONB 슬라이드 헤드라인, S-NICK·S-LOGIN 헤드라인).
- 만료/카드 잠금 안내 등 보조 텍스트는 `12px / 400 / line-height 1.4`, **회색 톤** (PRD §15: "작은 폰트, 회색 톤, 경고 컬러 미사용"). Phase 1에서는 S-HOME "기록 3개부터 카드를 받을 수 있어요"가 유일한 적용처.
- 숫자(수집률 %, 주간 카운트)는 동일 사이즈에서 `font-variant-numeric: tabular-nums` 적용 권장 — 점프 방지.

---

## Color

> PRD §5.13/§15. 액센트는 PRD가 "핑크 또는 라벤더"로 두 옵션을 제시 — 본 contract는 **라벤더(#B59CD9)**를 채택. 사유: 픽콩 아이덴티티의 "도감/취향/콘서트 굿즈" 톤이 핑크보다 라벤더에 가깝고, 핑크는 욕설·할인·세일 톤과 충돌. 라벤더는 "수집·아카이브" 의미 부여에 적합.

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | `#FFF8EE` (크림) | 화면 배경, 카드 그리드 빈칸 배경, BottomCTA 영역 배경 |
| Secondary (30%) | `#FFFFFF` (순백) | 카드/리스트/입력 필드 표면, S-HOME 카테고리 칸 표면, 토스트 시트 |
| Accent (10%) | `#7BD389` (연두/민트, primary) | Primary BottomCTA, 활성 칩, 활성 탭 인디케이터, 진행률 게이지 fill |
| Accent-secondary | `#B59CD9` (라벤더) | 수집률 % 강조, 주간 진행 텍스트 강조, 카드 잠금 unlock 직전 활성 상태, 추천 칩 hover/pressed |
| Text primary | `#3D2E1F` (진한 브라운/차콜) | 본문, 헤드라인, 입력 텍스트 |
| Text secondary | `#8A7866` | 서브 텍스트, 만료/잠금 안내 |
| Text disabled | `#C9BFB1` | 비활성 칩, 비활성 CTA 라벨 |
| Border / Divider | `#EFE6D7` | ListRow 사이, 카테고리 칸 외곽선 |
| Empty slot dashed | `#D9CFBF` | 빈 도감 칸 점선 |
| Destructive | (Phase 1 미적용) | Phase 1엔 destructive 액션 0건 — Phase 2 S-LIST 삭제, S-SET 탈퇴에서 도입 |

**Accent reserved for** (이 외 사용 금지):
- Primary BottomCTA fill (`시작하기` / `토스로 시작하기` / `이 이름으로 시작할게요` / `오늘의 콩 줍기` / `내 도감에 담기` / `도감 보러가기` / `하나 더 줍기`)
- S-HOME 도감 그리드의 채워진 카테고리 칸 fill
- S-ADD 단계 진행 인디케이터 활성 dot
- S-NICK 추천 칩의 선택된 상태
- 수집률 게이지 / 주간 진행 텍스트 강조 (라벤더로 분리)

**금지:**
- 모든 인터랙티브 요소에 액센트 적용 금지 — 60/30/10 비율 유지
- 경고/위험/만료 안내에 빨강·주황 사용 금지 (PRD §5.10/§15: 회색 톤)
- 광고 0건 화면(전 Phase 1)에 광고 영역용 색상 미배정

---

## Copywriting Contract

> 모든 카피는 PRD §16에서 그대로 인용. **재작성·번역·다듬기 금지** — 토씨 한 자도 바꾸지 않는다. 표에 없는 화면 보조 카피만 PRD §15 톤(해요체 / 능동 / 긍정 / 캐주얼 경어)을 따라 새로 작성한다.

### Phase 1 카피 매트릭스 (PRD §16 발췌)

| Element | Copy | Source |
|---------|------|--------|
| 앱 부제 | 오늘의 귀여움, 하나 픽 | §16 |
| Primary CTA (S-ONB) | 시작하기 | §7.2 |
| Primary CTA (S-LOGIN) | 토스로 시작하기 | §16 |
| Primary CTA (S-NICK) | 이 이름으로 시작할게요 | §16 |
| Primary CTA (S-HOME) | 오늘의 콩 줍기 | §16 |
| Primary CTA (S-ADD) | 내 도감에 담기 | §16 |
| Primary CTA (S-DONE 1) | 도감 보러가기 | §7.8 |
| Primary CTA (S-DONE 2) | 하나 더 줍기 | §7.8 |
| Primary CTA (S-CAT empty) | (PRD에 명시되지 않음 — `오늘의 콩 줍기` 재사용 권장, S-HOME과 동일 동선이므로 일관성 확보) | derived |
| 로그인 헤드라인 | 픽콩에서 내 도감을 시작해 볼까요? | §16 |
| 로그인 서브 | 토스로 로그인하면 기록이 안전하게 이어져요 | §16 |
| 로그인 끊김 안내 (Phase 1엔 자동 라우팅으로만 사용) | 토스 로그인을 다시 연결해 볼까요? | §16 |
| 닉네임 헤드라인(최초) | 어떻게 부를까요? | §16 |
| 닉네임 서브(최초) | 친구에게 카드를 공유할 때 이렇게 보여요 | §16 |
| 닉네임 추천 칩(고정 6개, 순서 고정) | 귀염콩 / 굿즈콩 / 문구콩 / 덕질콩 / 픽콩러 / 수집콩 | §16 |
| 닉네임 빈값 토스트 | 닉네임을 한 글자 이상 적어 볼까요? | §16 |
| 닉네임 허용 외 문자 토스트 | 닉네임은 한글, 영문, 숫자만 쓸 수 있어요 | §16 |
| 닉네임 자모 단독 토스트 | 자음·모음만으로는 닉네임을 만들 수 없어요. 완성된 글자로 적어 볼까요? | §16 |
| 닉네임 금칙어 토스트 | 이 닉네임은 쓸 수 없어요. 다른 이름으로 바꿔 볼까요? | §16 |
| S-ONB 1p 슬라이드 | 좋아한 것을 그냥 지나치기 아쉬울 때 | §7.2 |
| S-ONB 2p 슬라이드 | 문구·굿즈·간식을 도감 한 칸에 담아요 | §7.2 |
| S-ONB 3p 슬라이드 | 이번 달 내 취향이 캐릭터로 돌아와요 | §7.2 |
| 빈 도감 (S-HOME 진입 직후 0건) | 오늘의 귀여움 하나 담아볼까요? | §16 |
| 카드 잠금 안내 (S-HOME, 기록 < 3) | 기록 3개부터 카드를 받을 수 있어요 | §16 |
| S-HOME 주간 진행 텍스트 (예시) | 이번 주 3콩까지 1콩 남았어요 | §7.6 |
| S-ADD 1단계 헤드라인 | 어떤 귀여움이에요? | §16 |
| S-ADD 2단계 헤드라인 | 얼마였어요? (선택) | §16 |
| S-ADD 3단계 헤드라인 | 어떤 콩으로 남길까요? | §16 |
| S-DONE 헤드라인 | {카테고리}콩 하나를 주웠어요 (예: "문구콩 하나를 주웠어요") | §16 |
| S-DONE 서브 | 이번 달 N번째 귀여움이에요. 도감 수집률 X% (예: "이번 달 7번째 귀여움이에요. 도감 수집률 37%") | §16 |
| S-CAT empty | 이 카테고리는 아직 비어 있어요. 하나 담아볼까요? | §7.10 |
| 저장 실패 토스트 (S-ADD) | 저장이 안 됐어요. 다시 한 번 눌러 볼까요? | §16 |
| 네트워크 오류 토스트 (전역) | 인터넷 연결을 확인하고 다시 시도해 볼까요? | §16 |

### Empty / Error / Destructive

| Slot | Copy |
|------|------|
| Empty state heading (S-HOME 0건) | 오늘의 귀여움 하나 담아볼까요? |
| Empty state body (S-HOME 0건) | (서브 카피 없음 — 8칸 그리드 전체가 점선 빈칸 + BottomCTA `오늘의 콩 줍기`로 다음 행동 명시) |
| Empty state heading (S-CAT 카테고리 0건) | 이 카테고리는 아직 비어 있어요. 하나 담아볼까요? |
| Error state (저장 실패) | 저장이 안 됐어요. 다시 한 번 눌러 볼까요? |
| Error state (네트워크) | 인터넷 연결을 확인하고 다시 시도해 볼까요? |
| Error state (닉네임 5종) | (위 표 5개 토스트 — PRD §16에서 그대로 인용) |
| Destructive confirmation | (Phase 1엔 destructive 액션 0건 — 탈퇴/삭제는 Phase 2 범위) |

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| TDS Mobile (built-in via `@apps-in-toss/web-framework@2.0.1`) | Button, BottomCTA, Top, ListRow, ListHeader, Tab, Asset, Badge | not required (built-in 1st-party — 토스가 직접 배포·검증) |
| shadcn official | (미사용) | not applicable |
| Third-party registry | (미사용 — 0건 선언) | not applicable |

**선언:** Phase 1은 TDS Mobile 외 어떤 외부 UI registry도 사용하지 않는다. 외부 호스팅 자산(OG 이미지·폰트·아이콘 CDN) 0건 (PRD §5.4/§5.10).

---

## Per-Screen Contract

### S-ONB — 온보딩 슬라이드

- **진입 조건:** `onboarding_completed = false` (Storage). 일반 진입 + 미로그인 사용자 (PRD §6.2)
- **종료 조건:** 마지막(3p) 슬라이드의 `시작하기` BottomCTA → S-LOGIN 라우팅
- **TDS 컴포넌트:** Top (브랜드 로고 + `픽콩` 텍스트, 닫기 X 버튼), Asset (슬라이드별 일러스트, MVP는 점선 빈칸 자리에 placeholder), BottomCTA `시작하기`, 페이지 인디케이터(dot 3개)
- **레이아웃:**

```
┌─ Top (logo + 픽콩 + 닫기 X) ────────────┐
│                                          │
│              [Asset 일러스트]             │  ← 64px 상단
│                                          │
│         ╔══════════════════╗             │
│         ║ Display 28/700   ║   ← 슬라이드 헤드라인
│         ╚══════════════════╝             │
│                                          │
│              ● ○ ○                       │  ← 페이지 인디케이터 (액센트=연두)
│                                          │
│                                          │
├─ BottomCTA 시작하기 (Primary, 연두) ─────┤
└──────────────────────────────────────────┘
```

- **카피:**
  - 1p: "좋아한 것을 그냥 지나치기 아쉬울 때"
  - 2p: "문구·굿즈·간식을 도감 한 칸에 담아요"
  - 3p: "이번 달 내 취향이 캐릭터로 돌아와요"
  - CTA: "시작하기"
- **상태 매트릭스:** loading (슬라이드 prefetch — placeholder 회색 박스) / success (정상 표시) / error (전역 네트워크 토스트, 슬라이드 자체는 정적 이미지이므로 사실상 미발생)
- **이벤트 (PRD §9.2):** `onb_view_step` (`step: 1|2|3`), `onb_press_start`
- **다크패턴 회피:** 1번(진입 직후 인터럽트) — 즉시 슬라이드 표시, 모달/바텀시트 0건. 3번(나갈 수 없는 구조) — Top 우상단 닫기 X 상시 노출. 5번(모호한 CTA) — `시작하기` 라벨로 다음 행동(로그인 진입) 명시. 권한 0건.

---

### S-LOGIN — 토스 로그인 (강제)

- **진입 조건:** 미로그인 + S-ONB 통과 / 공유 링크 미로그인자 / 자동 끊김 감지 (PRD §5.7/§7.3)
- **종료 조건:** `appLogin` 성공 → 백엔드 `/auth/exchange` (mTLS) → user_key 영속 → (닉네임 NULL이면) S-NICK / (있으면) S-HOME
- **TDS 컴포넌트:** Top (브랜드 + 닫기 X), Asset (브랜드 일러스트 또는 콩 캐릭터 placeholder), BottomCTA `토스로 시작하기`
- **레이아웃:**

```
┌─ Top (logo + 픽콩 + 닫기 X) ────────────┐
│                                          │
│            [브랜드 일러스트]              │
│                                          │
│   ╔════════════════════════════════╗    │
│   ║ Display 28/700                 ║    │  ← "픽콩에서 내 도감을 시작해 볼까요?"
│   ╚════════════════════════════════╝    │
│                                          │
│   Body 16/400 text-secondary             │  ← "토스로 로그인하면 기록이 안전하게 이어져요"
│                                          │
├─ BottomCTA 토스로 시작하기 (Primary) ────┤
└──────────────────────────────────────────┘
```

- **카피:**
  - 헤드라인: "픽콩에서 내 도감을 시작해 볼까요?"
  - 서브: "토스로 로그인하면 기록이 안전하게 이어져요"
  - CTA: "토스로 시작하기"
  - 끊김 자동 라우팅 시 토스트(보조): "토스 로그인을 다시 연결해 볼까요?"
- **상태 매트릭스:**
  - loading: BottomCTA 비활성 + 스피너 (`appLogin` 호출 중)
  - success: 즉시 라우팅 (시각 효과 없음)
  - error: PRD §16 토스트 — `error_code=user_cancel` 시 무토스트, `error_code=network` 시 "인터넷 연결을 확인하고 다시 시도해 볼까요?"
  - disconnect: **바텀시트 금지** — 자동 S-LOGIN 라우팅만 (PRD §5.7)
- **이벤트:** `login_view`, `login_press_start`, `login_success` (`is_first_login`, `entry_source`), `login_cancel`, `login_fail` (`error_code`), `login_disconnect_detected`, `login_reconnect_press`
- **다크패턴 회피:** 1번 — 광고/모달 0건. 3번 — 닫기 X 노출. 5번 — `토스로 시작하기`가 다음 동작(토스 로그인 → 닉네임 입력) 명시. 동의 항목 추가 0건 (PRD §5.7).

---

### S-NICK — 닉네임 입력 (최초 1회)

- **진입 조건:** 로그인 + `accounts.nickname IS NULL` (PRD §5.8/§7.4)
- **종료 조건:** 정규식·금칙어 검증 통과 후 `POST /account/nickname` 성공 → S-HOME (또는 공유 링크 인입자는 S-VIEWER-INTRO — Phase 2)
- **TDS 컴포넌트:** Top (브랜드 + 닫기 X 비활성), TextField (1~10자, 한글 완성형 + 영문 + 숫자), Badge ×6 (추천 칩, 가로 스크롤 가능 wrap), BottomCTA `이 이름으로 시작할게요`, KeyboardAboveView (BottomCTA를 키보드 위에 띄움)
- **레이아웃:**

```
┌─ Top (logo + 픽콩) ─────────────────────┐  ← 닫기 X는 비활성/숨김 (필수 입력)
│                                          │
│   Display 28/700                         │  ← "어떻게 부를까요?"
│   Body 14/400 text-secondary             │  ← "친구에게 카드를 공유할 때 이렇게 보여요"
│                                          │
│   ┌──────────────────────────────────┐  │
│   │ TextField (placeholder)          │  │  ← 1~10자
│   └──────────────────────────────────┘  │
│   N/10 (label 14/400 text-secondary, 우측 하단)
│                                          │
│   ┌─Badge─┐┌─Badge─┐┌─Badge─┐           │  ← 추천 칩 6개 (순서 고정)
│   │귀염콩 ││굿즈콩 ││문구콩 │           │
│   └───────┘└───────┘└───────┘           │
│   ┌─Badge─┐┌─Badge─┐┌─Badge─┐           │
│   │덕질콩 ││픽콩러 ││수집콩 │           │
│   └───────┘└───────┘└───────┘           │
│                                          │
├─ BottomCTA 이 이름으로 시작할게요 ──────┤  ← KeyboardAboveView 적용
└──────────────────────────────────────────┘
```

- **카피:**
  - 헤드라인: "어떻게 부를까요?"
  - 서브: "친구에게 카드를 공유할 때 이렇게 보여요"
  - 추천 칩: "귀염콩 / 굿즈콩 / 문구콩 / 덕질콩 / 픽콩러 / 수집콩" (순서·내용 고정, 랜덤 접미 없음)
  - CTA: "이 이름으로 시작할게요"
  - 5종 토스트(에러): PRD §16 그대로
- **상태 매트릭스:**
  - default: BottomCTA 비활성 (회색 — text disabled)
  - typing valid: BottomCTA 활성 (액센트=연두)
  - blocked char (이모지·특수문자·자모 단독·공백): **입력 단계에서 자동 무시** — 토스트 없음 (이벤트만 `nick_input_blocked_char` 적재)
  - empty submit (이론상 BottomCTA 비활성으로 미발생): "닉네임을 한 글자 이상 적어 볼까요?"
  - server validation fail (forbidden): "이 닉네임은 쓸 수 없어요. 다른 이름으로 바꿔 볼까요?"
  - jamo_only (서버 사이드만, 클라는 입력 단계에서 무시): "자음·모음만으로는 닉네임을 만들 수 없어요. 완성된 글자로 적어 볼까요?"
  - blocked_char (서버 fallback): "닉네임은 한글, 영문, 숫자만 쓸 수 있어요"
  - loading: BottomCTA 비활성 + 스피너
  - network error: "인터넷 연결을 확인하고 다시 시도해 볼까요?"
- **이벤트:** `nick_view` (`entry_source`), `nick_press_suggest` (`suggestion`), `nick_input_blocked_char` (`reason: emoji|special_char|space|jamo_only|length`), `nick_press_save` (`length`, `used_suggestion`), `nick_save_success`, `nick_save_fail` (`error_code: forbidden|length|blocked_char|jamo_only|network`)
- **다크패턴 회피:** 1번 — 광고 0건. 3번 — 닫기 X는 정책상 비활성(닉네임 미입력 시 본 흐름 통과 불가, PRD §5.8) — 단, 사용자에게 "왜 막혔는지"는 헤드라인+서브로 명시되므로 "나갈 수 없는 구조"가 아닌 "입력 강제 흐름". 5번 — `이 이름으로 시작할게요`가 다음 동작(도감 진입) 명시. KeyboardAboveView 필수 (PRD §10.12).

---

### S-HOME — 메인 도감

- **진입 조건:** 로그인 + 닉네임 입력 완료 (PRD §6.2/§7.6)
- **종료 조건:** 닫기 X (앱인토스 메인으로 복귀) / `오늘의 콩 줍기` BottomCTA → S-ADD / 카테고리 칸 탭 → S-CAT
- **TDS 컴포넌트:** Top (브랜드 + 닫기 X + 수집률 영역), Tab (월 단위 — Phase 1엔 단일 "이번 달"만 표시), 도감 그리드 (자체 컴포넌트, TDS Asset+Badge 조합), ListHeader ("이번 주 진행"), Body 텍스트 (주간 진행), Button (이번 달 카드 보기 — Phase 1엔 비활성 상태로만 노출), BottomCTA `오늘의 콩 줍기`
- **레이아웃:**

```
┌─ Top (logo + 픽콩 + 닫기 X) ────────────┐
│                                          │
│   Label 14/600 "이번 달 수집률"          │
│   Display 28/700 라벤더 "37%"            │
│                                          │
│   ┌──┐┌──┐┌──┐┌──┐                       │  ← 도감 그리드 8칸 (4×2)
│   │🎁││✏️││🍬││🎀│                       │     채워진 칸: 흰 표면 + 연두 outline + 이모지/카운트
│   └──┘└──┘└──┘└──┘                       │     빈 칸: 점선 #D9CFBF, 빈칸 일러스트 placeholder
│   ┌╌╌┐┌╌╌┐┌╌╌┐┌╌╌┐                       │
│   │  ││  ││  ││  │                       │
│   └╌╌┘└╌╌┘└╌╌┘└╌╌┘                       │
│                                          │
│   Body 14/400 라벤더                     │  ← "이번 주 3콩까지 1콩 남았어요"
│                                          │
│   ┌── Button (비활성, 회색) ──────────┐  │  ← 기록 < 3
│   │  이번 달 카드 보기                │  │     Phase 1엔 항상 비활성
│   └────────────────────────────────────┘  │
│   Body 12/400 text-secondary             │  ← "기록 3개부터 카드를 받을 수 있어요"
│                                          │
├─ BottomCTA 오늘의 콩 줍기 (Primary) ─────┤
└──────────────────────────────────────────┘
```

- **카피:**
  - 빈 도감 첫 진입(0건): "오늘의 귀여움 하나 담아볼까요?" (그리드 위에 표시 또는 그리드 자체가 메시지)
  - 카드 잠금: "기록 3개부터 카드를 받을 수 있어요" (12px / text-secondary / 회색 톤, 경고 컬러 미사용)
  - 주간 진행: "이번 주 N콩까지 M콩 남았어요"
  - 카드 버튼 라벨: "이번 달 카드 보기" (Phase 1엔 항상 비활성, Phase 2에서 활성화 로직 추가)
  - CTA: "오늘의 콩 줍기"
- **상태 매트릭스:**
  - loading: 그리드 8칸 skeleton (회색 박스 8개, 점선 없음)
  - empty (0건): 8칸 모두 점선 빈칸 + 빈 도감 카피 + 수집률 "0%"
  - success: 채워진 칸은 흰 표면 + 카테고리 이모지 + 카운트 Badge (예: "3")
  - error: 전역 토스트 "인터넷 연결을 확인하고 다시 시도해 볼까요?"
  - disconnect: 자동 S-LOGIN 라우팅 (바텀시트 금지)
- **이벤트:** `home_view` (`is_first_visit`, `collected_count`, `month`), `home_press_add`, `home_press_category` (`category`), `home_press_card_unlock` (`eligible: false`, `ad_eligible`) — Phase 1에선 항상 `eligible: false`
- **다크패턴 회피:** 1번 — 광고 0건. 3번 — 닫기 X 노출. 4번(예상치 못한 광고) — 자동 충족 (Phase 1 광고 0건). 5번 — `오늘의 콩 줍기`가 다음 동작(콩 등록) 명시. 비활성 카드 버튼 옆에 잠금 사유 카피로 "왜 안 눌리는지" 명시.

---

### S-ADD — 콩 등록 (3단계)

- **진입 조건:** S-HOME `오늘의 콩 줍기` BottomCTA / 앱 내 기능 진입 (PRD §7.7)
- **종료 조건:** 3단계 저장 성공 → S-DONE / 취소 (Top 닫기 X) → S-HOME 복귀
- **TDS 컴포넌트:** Top (브랜드 + 닫기 X + 단계 인디케이터 1/2/3), 1단계: Asset 그리드 8칸 (카테고리 선택), 2단계: TextField (숫자 키보드), 3단계: Badge 그리드 (추천 이모지 12개) + TextField (메모), BottomCTA `내 도감에 담기` (3단계에서만), KeyboardAboveView (2/3단계에서)
- **레이아웃 (각 단계):**

```
1단계 — 카테고리 선택
┌─ Top (logo + 닫기 X + ●○○) ────────────┐
│                                          │
│   Display 28/700 "어떤 귀여움이에요?"    │
│                                          │
│   ┌──┐┌──┐┌──┐┌──┐                       │  ← 카테고리 8칸
│   │🎁││✏️││🍬││🎀│                       │
│   └──┘└──┘└──┘└──┘                       │
│   ┌──┐┌──┐┌──┐┌──┐                       │
│   │💜││🐶││📚││📦│                       │
│   └──┘└──┘└──┘└──┘                       │
│                                          │
│   (선택 시 즉시 2단계로 진행, 별도 CTA 없음)
└──────────────────────────────────────────┘

2단계 — 금액 (선택)
┌─ Top (logo + 닫기 X + ○●○) ────────────┐
│                                          │
│   Display 28/700 "얼마였어요? (선택)"   │
│                                          │
│   ┌──────────────────────────────────┐  │
│   │ TextField (숫자 키보드, 빈값 OK) │  │
│   └──────────────────────────────────┘  │
│   Body 14/400 text-secondary "원"        │
│                                          │
│   (다음 버튼 또는 빈값 입력 후 다음)
├─ BottomCTA 다음 (Primary) ──────────────┤  ← KeyboardAboveView
└──────────────────────────────────────────┘

3단계 — 이모지 + 메모
┌─ Top (logo + 닫기 X + ○○●) ────────────┐
│                                          │
│   Display 28/700 "어떤 콩으로 남길까요?"│
│                                          │
│   ┌─Badge─┐┌─Badge─┐┌─Badge─┐ ... 12개   │
│   │  🎁   ││  ✨  ││  💕  │             │
│   └───────┘└───────┘└───────┘             │
│                                          │
│   ┌──────────────────────────────────┐  │
│   │ TextField 메모 (1~24자 권장,     │  │
│   │   60자 max)                      │  │
│   └──────────────────────────────────┘  │
│                                          │
├─ BottomCTA 내 도감에 담기 (Primary) ────┤  ← KeyboardAboveView
└──────────────────────────────────────────┘
```

- **카피:**
  - 1단계 헤드라인: "어떤 귀여움이에요?"
  - 2단계 헤드라인: "얼마였어요? (선택)"
  - 3단계 헤드라인: "어떤 콩으로 남길까요?"
  - 저장 CTA: "내 도감에 담기"
  - 저장 실패 토스트: "저장이 안 됐어요. 다시 한 번 눌러 볼까요?"
  - 네트워크 토스트: "인터넷 연결을 확인하고 다시 시도해 볼까요?"
- **상태 매트릭스:**
  - 1단계: default (8칸 모두 비활성 표면) → selected (즉시 2단계)
  - 2단계: empty 허용 / 음수·소수 자동 무시 / 정수만 허용
  - 3단계: 이모지 미선택 시 BottomCTA 비활성, 메모 0~60자 허용 (24자 초과 시 카운터 색상 변경 — 라벤더 → text-secondary 회색만, 경고 컬러 미사용)
  - loading (저장 중): BottomCTA 비활성 + 스피너
  - success: S-DONE 라우팅
  - error: PRD §16 저장 실패 토스트
- **이벤트:** `add_step_view` (`step: 1|2|3`), `add_select_category` (`category`), `add_input_amount` (`amount_band`), `add_press_save` (`step: 3`), `add_save_success`, `add_save_fail` (`error_code`)
- **다크패턴 회피:** 1번 — 광고 0건 (S-ADD/S-DONE 모두). 3번 — 각 단계 Top에 닫기 X 노출 (취소 시 1탭 시트로 "정말 취소할까요?" 노출 금지 — PRD §5.5/§5.12 중간 인터럽트 금지, 즉시 S-HOME 복귀). 5번 — 단계별 헤드라인이 다음 입력 명시. 권한 0건 (사진·갤러리·연락처 등 어떤 권한도 요청 금지).

---

### S-DONE — 기록 완료

- **진입 조건:** S-ADD 저장 성공 (PRD §7.8)
- **종료 조건:** `도감 보러가기` → S-HOME / `하나 더 줍기` → S-ADD 1단계 / 닫기 X → S-HOME
- **TDS 컴포넌트:** Top (브랜드 + 닫기 X), Asset (콩 캐릭터 일러스트 — Phase 1엔 placeholder), Display 헤드라인, Body 서브, Button 2개 (또는 BottomCTA + secondary)
- **레이아웃:**

```
┌─ Top (logo + 픽콩 + 닫기 X) ────────────┐
│                                          │
│            [콩 캐릭터 일러스트]           │  ← Phase 1 placeholder
│                                          │
│   Display 28/700 "{카테고리}콩 하나를 주웠어요"
│                                          │
│   Body 16/400 text-secondary             │
│   "이번 달 N번째 귀여움이에요. 도감 수집률 X%"
│                                          │
│                                          │
├─ Button 도감 보러가기 (Primary, 연두) ───┤
│  Button 하나 더 줍기 (Secondary, 흰 + 연두 outline)
└──────────────────────────────────────────┘
```

- **카피:**
  - 헤드라인: "{카테고리}콩 하나를 주웠어요" (예: "문구콩 하나를 주웠어요" — 카테고리 동적 치환)
  - 서브: "이번 달 N번째 귀여움이에요. 도감 수집률 X%" (N, X 동적 치환)
  - CTA1: "도감 보러가기"
  - CTA2: "하나 더 줍기"
- **상태 매트릭스:**
  - success: 정상 표시 (Phase 1 유일 상태)
  - empty/error 미적용 (S-ADD 성공 후에만 진입)
- **이벤트:** `done_view` (`category`, `total_in_month`), `done_press_home`, `done_press_more`
- **다크패턴 회피:** 1번 — 광고 0건 명시 (PRD §5.6 금지 시점 목록에 S-DONE 포함). 3번 — 닫기 X 노출. 5번 — CTA 두 개 모두 다음 동작(도감 진입 / 추가 등록) 명시.

---

### S-CAT — 카테고리 상세

- **진입 조건:** S-HOME 카테고리 칸 탭 (PRD §7.10)
- **종료 조건:** 뒤로가기 (Top 좌측 < / iOS 스와이프 백 / Android 백 키)
- **TDS 컴포넌트:** Top (좌측 < + 카테고리명), ListHeader (월 단위 — "2026년 5월"), ListRow (이모지 + 메모 + 날짜), Asset (empty 일러스트 placeholder), BottomCTA `오늘의 콩 줍기` (empty 상태)
- **레이아웃:**

```
정상 (≥1건)
┌─ Top (< + "문구콩") ────────────────────┐
│                                          │
│ ListHeader "2026년 5월"                  │
│ ┌────────────────────────────────────┐  │
│ │ ✏️  메모 텍스트 ...      05.01     │  │  ← ListRow
│ └────────────────────────────────────┘  │
│ ┌────────────────────────────────────┐  │
│ │ 📒  메모 텍스트 ...      04.28     │  │
│ └────────────────────────────────────┘  │
│ ...                                      │
│                                          │
│ (BottomCTA 없음 — Phase 1)               │
└──────────────────────────────────────────┘

Empty (0건)
┌─ Top (< + "문구콩") ────────────────────┐
│                                          │
│         [빈칸 점선 일러스트]              │
│                                          │
│   Heading 20/600                         │
│   "이 카테고리는 아직 비어 있어요.       │
│    하나 담아볼까요?"                     │
│                                          │
├─ BottomCTA 오늘의 콩 줍기 (Primary) ─────┤
└──────────────────────────────────────────┘
```

- **카피:**
  - empty: "이 카테고리는 아직 비어 있어요. 하나 담아볼까요?"
  - 정상: 헤더는 카테고리명 ("문구콩" 등), 행은 사용자 입력 메모 + 날짜 (yyyy.MM.dd)
  - empty CTA: "오늘의 콩 줍기" (S-HOME과 동일 라벨로 동선 일관성 — derived, PRD에 explicit 카피 없음)
- **상태 매트릭스:**
  - loading: ListRow skeleton ×3
  - empty: 빈칸 일러스트 + 카피 + BottomCTA
  - success: ListRow 목록 (최신순)
  - error: 전역 네트워크 토스트
- **이벤트:** `cat_view` (`category`, `count`), `cat_press_add` (empty 상태 CTA)
- **다크패턴 회피:** 1번 — 광고 0건 (PRD §5.6: 카테고리 전환 광고 금지). 3번 — Top 좌측 < + iOS 스와이프 백 + Android 백 키 모두 동작. 5번 — empty CTA가 명확.

---

## Toss Mini-App Specifics — 검수 가드레일 체크리스트

| 항목 | Phase 1 적용 | 비고 |
|------|--------------|------|
| viewport `user-scalable=no` | ✅ 완료 (`index.html`) | PRD §10.12 |
| NavigationBar는 TDS `Top` 컴포넌트 사용 / 자체 백버튼 금지 | ✅ 모든 화면 | PRD §5.15 |
| 브랜드 로고 + `픽콩` 텍스트 노출 | ✅ S-ONB/S-LOGIN/S-NICK/S-HOME/S-DONE | `granite.config.ts` displayName |
| Safe Area (`useSafeArea` 훅) | ✅ 모든 화면 상하단 inset | PRD §10.12/§10.3 |
| iOS 스와이프 백 (`setIosSwipeGestureEnabled`) | ✅ S-CAT 전용 활성, S-NICK은 비활성(필수 입력) | PRD §10.12 |
| Android 시스템 백 (`useBackEvent`) | ✅ 모든 화면 — 바텀시트 인터럽트 0건 | PRD §5.5 |
| KeyboardAboveView | ✅ S-NICK / S-ADD 2·3단계 | BottomCTA가 키보드 위 표시 (PRD §10.12) |
| 권한 요청 0건 | ✅ Phase 1 전체 — 토스 로그인 외 일체 요청 금지 | PRD §5.7 |
| 다크패턴 1번 (진입 직후 인터럽트) | ✅ S-ONB 즉시 슬라이드, 모달/광고 0건 | PRD §5.5 |
| 다크패턴 2번 (뒤로가기 바텀시트) | ✅ 모든 화면 백 시 인터럽트 0건 | PRD §5.5 |
| 다크패턴 3번 (나갈 수 없는 구조) | ✅ S-NICK 제외 모든 화면 닫기 X / 백 / 취소 1개 이상 (S-NICK은 정책상 입력 강제) | PRD §5.5 |
| 다크패턴 4번 (예상치 못한 광고) | ✅ 자동 충족 — Phase 1 광고 0건 | PRD §5.6 |
| 다크패턴 5번 (모호한 CTA) | ✅ 모든 CTA에 다음 행동 명시 (PRD §16 카피 그대로) | PRD §5.5/§5.12 |
| 라이트 모드 단일 | ✅ `prefers-color-scheme: dark` 무시 / 모든 색상 라이트 모드 토큰만 | PRD §5.13 |
| iframe 미사용 | ✅ React 컴포넌트만 | PRD §5.14 |
| 외부 호스팅 자산 0건 | ✅ 일러스트는 번들 내부 (WebP), 폰트도 TDS 기본 | PRD §5.4 |
| TDS 컴포넌트 사용 | ✅ Button / BottomCTA / Top / ListRow / ListHeader / Tab / Asset / Badge | PRD §15 |
| 모노톤 아이콘 / 컬러 아이콘 금지 | ✅ TDS 기본 아이콘만 | PRD §15 |
| 외부 SNS 호출 0건 | ✅ Phase 1엔 공유 기능 자체 없음 (Phase 2) | PRD §5.4 |
| `granite.config.ts` brand 등록 | ✅ `displayName: 픽콩`, `primaryColor: #7BD389` | PRD §5.13 |

---

## Asset Inventory — Phase 1 필수 자산

### 일러스트

| 자산 | 용도 | 형식 | Phase 1 필수 |
|------|------|------|---------------|
| 빈칸 점선 일러스트 1종 | S-HOME 빈 도감 칸 8개 / S-CAT empty | SVG (인라인) 또는 WebP | ✅ 필수 |
| S-ONB 슬라이드 일러스트 3종 | S-ONB 1p/2p/3p | WebP | ✅ 필수 (placeholder 가능, MVP 우선) |
| S-LOGIN 브랜드 일러스트 1종 | S-LOGIN 본문 | WebP | ✅ 필수 (S-ONB 1p 재활용 가능) |
| S-DONE 콩 캐릭터 placeholder 1종 | S-DONE 본문 (공용 placeholder) | WebP | ✅ 필수 |
| 콩 캐릭터 8종 | 카드 캐릭터 (굿즈콩 햄스터 등) | WebP | ❌ Phase 2 (S-CARD에서 사용) |
| 도감 미니컷 1종 | S-VIEWER-INTRO 본문 | WebP | ❌ Phase 2 |
| **총 용량 예산** | | | **합산 ≤ 2MB (PRD §10.11)** |

### 카테고리 8종 (S-HOME 그리드 / S-ADD 1단계 / S-CAT)

PRD §12 캐릭터 룰에서 명시된 6종 + 본 contract의 derived 2종:

| Slot | 카테고리 라벨 | 이모지 (제안) | 캐릭터 (Phase 2) | 출처 |
|------|---------------|----------------|-------------------|------|
| 1 | 굿즈 | 🎁 | 굿즈콩 햄스터 | PRD §12 |
| 2 | 문구 | ✏️ | 문구콩 토끼 | PRD §12 |
| 3 | 간식 | 🍬 | 간식콩 고양이 | PRD §12 |
| 4 | 선물 | 🎀 | 선물콩 곰돌이 | PRD §12 |
| 5 | 덕질 | 💜 | 덕질콩 다람쥐 | PRD §12 |
| 6 | 반려 | 🐶 | 반려콩 강아지 | PRD §12 |
| 7 | 책·잡지 | 📚 | (Phase 2 결정) | derived — PRD §12에 7번째 카테고리 미명시 |
| 8 | 기타 | 📦 | (Phase 2 결정) | derived — 8칸 그리드 채움용 |

> ⚠️ Slot 7·8은 PRD가 explicit하지 않은 derived. Phase 1 구현 직전에 사용자 확인 필요. PRD §3.1은 "8 카테고리 고정"만 명시하고 §12는 6종 + "다양성 ≥ 5종" 룰만 명시. 후보: 책·잡지 / 음악·앨범 / 옷·패션 / 뷰티 / 기타.

### 추천 이모지 12종 (S-ADD 3단계)

PRD §7.7 "추천 12개 + 직접 입력" 명시. 구체 12개는 PRD에 미정 — 본 contract 제안 (Phase 1 구현 직전 사용자 확인 필요):

🎁 ✨ 💕 🌸 ⭐ 🍀 🐰 🐻 🌿 🍡 📒 💝

### 추천 닉네임 칩 6종 (S-NICK)

PRD §16 고정 — 변경·재정렬 금지: **귀염콩 / 굿즈콩 / 문구콩 / 덕질콩 / 픽콩러 / 수집콩**

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: 모든 카피 PRD §16 그대로 인용 / 다음 행동 명시 / 해요체 일관 / 5종 닉네임 토스트 포함 → PASS 대기
- [ ] Dimension 2 Visuals: TDS 컴포넌트 8종만 사용 / 모노톤 아이콘 / 라이트 모드 단일 / 외부 자산 0건 → PASS 대기
- [ ] Dimension 3 Color: 60/30/10 (크림/순백/연두) + 라벤더 보조 / accent reserved-for 5항목 명시 / 경고 컬러 미사용 → PASS 대기
- [ ] Dimension 4 Typography: 4 사이즈 (16/14/20/28) / 2~3 weight (400/600/700) / 보조 12px 회색만 1처 → PASS 대기
- [ ] Dimension 5 Spacing: 4의 배수 8 토큰 / TDS BottomCTA 높이 재정의 금지 / 터치 타겟 44px 보장 → PASS 대기
- [ ] Dimension 6 Registry Safety: TDS Mobile (built-in) only / third-party 0건 / shadcn 미사용 → PASS 대기

**Approval:** pending

---

## Open Questions (PRD가 explicit하지 않아 기본값 채택한 항목)

1. **카테고리 8종 중 Slot 7·8 라벨** — PRD §12에 6종만 명시. 본 contract는 책·잡지(📚) + 기타(📦) 제안. → Phase 1 구현 시작 전 사용자 1탭 확인 필요.
2. **S-ADD 3단계 추천 이모지 12개** — PRD §7.7이 "12개 + 직접 입력"만 명시. 본 contract가 12종 제안. → Phase 1 구현 시작 전 사용자 1탭 확인 필요.
3. **액센트 핑크 vs 라벤더** — PRD §15는 "핑크 또는 라벤더" 양자택일. 본 contract는 **라벤더(#B59CD9)** 채택 (사유: §Color 섹션 참조). → 사용자 거부 시 핑크(`#F4B5C7` 등) 토큰만 교체.
4. **S-CAT empty CTA 라벨** — PRD §7.10에 CTA 라벨 미명시. 본 contract는 S-HOME과 동일하게 `오늘의 콩 줍기` 재사용 제안 (동선 일관성).
5. **닉네임 변경 토스트("닉네임을 바꿨어요") Phase 1 미적용** — PRD §16에 있으나 S-NICK-EDIT은 Phase 2 범위이므로 Phase 1 contract에서 제외.

---
*UI-SPEC drafted: 2026-05-01 by gsd-ui-researcher (auto from `pickkong_prd_v2.0.md` v2.0)*
