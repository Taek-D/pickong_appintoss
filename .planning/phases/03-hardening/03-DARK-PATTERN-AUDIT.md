# 다크패턴 5종 Audit (PRD §5.5) — 픽콩 v0.1.0

| # | 다크패턴 | 픽콩 대응 | 검증 방식 | 결과 |
|---|---|---|---|---|
| 1 | 진입 직후 바텀시트/광고 | S-ONB은 슬라이드 즉시 표시, 모달 0건. 광고는 위치 A(S-CARD 진입 직전)만 | 라우터 진입 함수 trace — App.tsx → router → RootGate → /onb 또는 /home | ✅ Pass |
| 2 | 뒤로가기 시 바텀시트 | 모든 화면에 useBackEvent 또는 router back 사용. BottomSheet는 사용자 명시 액션(공유/탈퇴)에만 사용 | BottomSheet `open` 플래그 호출 위치 검증 — Share/Settings/List 3곳 | ✅ Pass |
| 3 | 나갈 수 없는 구조 | 모든 화면에 Top.left에 ← 또는 ✕ 1+개. S-NICK은 정책상 1회 강제(닫기 비활성)이지만 PRD §5.8 예외 명시 | grep `Top.*left=` — 7개 Phase 1 화면 + 8개 Phase 2 화면 모두 보유 | ✅ Pass (S-NICK 예외 인지) |
| 4 | 예상치 못한 광고 | 위치 A 1지점만 / S-HOME 카드 버튼 명시 클릭 → /ad/card 경유 / 1.5s 타임아웃 silent skip / 캡 ad_show 시점만 / 공유·열람자 온보딩·S-DONE·로그인·닉네임에 광고 0 | grep `showCardAdOnce` 호출 — `/ad/card` 1곳만 | ✅ Pass |
| 5 | 모호한 CTA | 모든 CTA에 다음 행동 명시: "토스로 시작하기" / "이 이름으로 시작할게요" / "오늘의 콩 줍기" / "내 도감에 담기" / "도감 보러가기" / "공유하기" / "픽콩 시작하기" | shared/constants.ts COPY 객체 grep — `_cta` 키 16개 모두 동사+명사 | ✅ Pass |

## 핵심: 4번(예상치 못한 광고)

**광고 호출 trace (정적 grep):**
- `src/lib/ad.ts` — `showCardAdOnce` 정의 (1곳)
- `src/screens/Ad.tsx` — `showCardAdOnce(userKey)` 호출 (1곳)
- 다른 어떤 화면에서도 `showCardAdOnce` 또는 `IntegratedAd` 호출 없음

**광고 진입 경로:**
- S-HOME → "이번 달 카드 보기" 명시 클릭 (사용자 의도) → `/ad/card` route → `<AdInterlude>` mount → ad show or silent skip → `/card/own`
- 광고가 발생할 수 없는 경로: 진입 직후, 온보딩, 로그인, 닉네임, 등록 흐름, S-DONE, 공유, 열람자 온보딩, 카드뷰, 설정, 탈퇴

**캡 갱신 정책 (PRD §5.6):**
- `ad_card_shown:{user_key}:{yyyymm}=true`는 `ad_show` 이벤트 발생 후 `Ad.show()` 정상 종료 시에만 갱신
- 로드 실패 / 1.5s 타임아웃 / show 실패 / 사용자 종료 → 캡 갱신 0

---
*업데이트: 2026-05-01*
