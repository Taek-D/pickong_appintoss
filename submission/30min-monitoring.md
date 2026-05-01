# 출시 후 30분 모니터링 윈도우 (PRD §17.1)

> 콘솔 "출시하기" 직후 30분간 핵심 이벤트 적재 + 크래시율 모니터링. 이 30분이 가장 위험.

## 모니터링 대상

| 시그널 | 대시보드 | 임계값 |
|---|---|---|
| `home_view` 적재 | Granite Analytics | 신규 사용자 도달 ≥1 |
| `login_success` | Granite | 로그인 성공률 ≥95% (PRD §2.2) |
| `nick_save_success` | Granite | 가입 → 닉네임 → 메인 진입 (≥55%) |
| `add_save_success` | Granite | 첫 기록 도달 |
| `card_view` (광고 직후) | Granite | `card_view`/`ad_show` ≥95% (PRD §17.3) |
| `share_complete` | Granite | 공유 시도 발생 시 |
| Sentry crash-free rate | Sentry | ≥99.5% (PRD §2.2) |
| 백엔드 5xx | Sentry/로그 | < 1% |
| `nick_save_fail`(forbidden) | Granite | baseline ×3 이상 시 사칭 시도 알림 |
| 만료 cron | GitHub Actions | (출시 30분 윈도우 내 미발생, 매월 1일에 별도 모니터) |

## 30분 동안 할 일

1. **5분 단위로 대시보드 새로고침** (Granite + Sentry)
2. **첫 사용자 시그널 (home_view) 확인** — 5분 내 적재 시작 정상
3. **첫 login_success** — 토스 로그인 mTLS 핸드셰이크 정상
4. **첫 nick_save_success** — 닉네임 정상 처리
5. **첫 add_save_success** — Storage 정상 동작
6. **Sentry 빨간 알람 0건 유지** — 발생 시 즉시 핫픽스 또는 롤백 결정

## 롤백 조건

다음 중 하나라도 발생 시 30분 윈도우 내 콘솔 "롤백" 메뉴 실행:
- crash-free rate < 95%
- `login_fail` 비중 > 50% (토스 API 장애 의심)
- `card_upsert_fail` 비중 > 30% (DB·서버 장애)
- 5xx 폭증 (서버 다운)

## 핫픽스 트리거

다음은 핫픽스 (롤백 X):
- 닉네임 사칭 신고 → forbidden 사전 추가 PR
- 단일 화면 텍스트 오타 → frontend 핫픽스 빌드 + 콘솔 재업로드 (검수 필요)

## 30분 종료 후

- 모니터링 로그 캡처 → `.planning/phases/04-submission/launch-30min-log.md` (수동)
- 이상 없으면 채널톡 워크플로우 활성 + Slack 알림 설정 확인
- 챌린지 출품폼 최종 제출 (`submission/submission-form.md`)
