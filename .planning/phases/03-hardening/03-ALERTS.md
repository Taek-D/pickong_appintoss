# Sentry/Analytics 알람 정의 (PRD §17.3)

> 실 DSN/콘솔 ID 발급 후 콘솔에서 알람 룰 등록. 본 문서는 룰 정의 단일 진리원.

## Sentry 알람

| Alert | Trigger | Severity | Channel |
|---|---|---|---|
| `crash_rate_drop` | crash-free rate < 99.5% (PRD §2.2 가드레일) over 1h | critical | Slack #pickkong-alerts |
| `auth_exchange_5xx` | `/auth/exchange` 5xx > 1% over 5min | critical | Slack |
| `cards_upsert_5xx` | `/cards/:user_key/:yyyymm` 5xx > 1% over 5min | warning | Slack |
| `expire_cron_failed` | GitHub Actions expire-cards workflow failed | critical | email + Slack |
| `mtls_handshake_error` | toss-client 호출 시 mTLS 실패 burst | critical | email + Slack |

## Granite Analytics 알람 (PRD §17.3)

| Alert | Trigger | Severity |
|---|---|---|
| `card_view_after_ad_drop` | `card_view`/`ad_show` ratio < 95% over 1d | warning |
| `expire_batch_no_run` | 매월 1일에 expire-cards 이벤트 없음 | critical |
| `nick_save_fail_forbidden_burst` | `nick_save_fail`(error_code=forbidden) > baseline×3 over 1h | warning (사칭 시도 모니터링) |
| `share_complete_drop` | `share_complete`/`card_press_share` < 80% over 1d | info |
| `login_fail_burst` | `login_fail` > baseline×5 over 30min | critical (토스 API 장애 의심) |

## 채널·운영

- Slack: #pickkong-alerts (실제 채널명은 Phase 4 콘솔 운영 시점에 결정)
- email: 픽콩 팀 운영 메일링 (정산 채널 활성 시 동일 주소)
- 응답 SLA: critical 1h, warning 4h, info 1d

---
*업데이트: 2026-05-01 (Phase 3 작성, Phase 4에 콘솔 등록)*
