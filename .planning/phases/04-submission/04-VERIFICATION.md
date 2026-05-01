---
phase: 4
status: human_needed
verified_at: 2026-05-01
verifier: claude-opus-4-7 (autonomous)
---

# Phase 4 Verification — Submission & Patch

## Success Criteria

| # | Criterion | Status |
|---|---|---|
| 1 | 광고 콘솔 + 정산 채널 활성 + 콘솔 제출 메타 입력 완료 | ⏳ deployment-action (사용자 작업) — 절차 문서 ✓ |
| 2 | 번들 빌드(.ait) ≤30MB + QR 회귀 (공유·닉네임·S-CARD-VIEW·9~10자) 통과 | ⏳ deployment-action — 절차 문서 ✓ |
| 3 | 영업일 3일 검수 후 승인 또는 1차 패치 후 D-3까지 출시 승인 | ⏳ deployment-action |
| 4 | 30분 모니터링 윈도우 — 핵심 이벤트 적재 + Sentry crash-free ≥99.5% | ⏳ deployment-action — 절차 문서 ✓ |
| 5 | 2026-05-24 마감 전 챌린지 출품폼 최종 카피 + 미니앱 링크 제출 | ⏳ deployment-action — 절차 문서 ✓ |

**Overall verdict**: `human_needed`
- 모든 운영 절차 문서 완비
- 실 배포·인증서·검수 요청은 사용자 환경 의존

## 산출물

```
.planning/phases/04-submission/
  04-CONTEXT.md
  04-VERIFICATION.md
submission/
  console-meta.md          PRD §14.1 콘솔 메타 일괄
  deployment-guide.md      .ait 빌드 + 백엔드 배포 + Sentry/Analytics 주입
  qa-checklist.md          QR 회귀 8 섹션
  30min-monitoring.md      출시 후 30분 모니터링 + 롤백 조건
  launch-checklist.md      D-3 출시 승인 게이트 (코드/인프라/콘솔/QR/검수/패치/출시)
  submission-form.md       챌린지 출품폼 제출 절차 + 카피 토씨 점검
  tagline.txt              한 줄 38/50 (Phase 3)
  relevance.txt            연관성 174/200 (Phase 3)
  differentiation-note.md  검수 첨부 어뷰징 차별화 (Phase 3)
```

## D-Day 시퀀스 권장

```
D-7 (2026-05-17)  : pnpm install/test/typecheck/build → .ait 생성
D-6 (5/18)        : 인프라 (mTLS + Supabase + Sentry + GitHub Actions secrets)
D-5 (5/19)        : 콘솔 메타 입력 + 광고/정산 활성 + 백엔드 배포
D-4 (5/20)        : QR 회귀 8 섹션 통과 + 검수 요청
D-3 (5/21)        : 검수 1차 결과 — 승인이면 출시, 반려면 패치
D-2 (5/22)        : 패치 재제출 (필요 시)
D-1 (5/23)        : 출시 + 30분 모니터링 + 챌린지 출품폼 제출
D-Day (5/24)      : 마감일, 안전망 (만일 늦어졌다면 마지막 기회)
```

## Pending (사용자 작업)

전부 외부 의존 — 픽콩 코드/문서 외부에서 결정·실행:
- 토스 콘솔 사업자 인증 + mTLS 인증서 발급
- Supabase 운영 인스턴스 생성 + 마이그레이션
- 백엔드 호스팅 선택 + 배포
- Sentry/Granite Analytics 콘솔 등록 + DSN/키 발급
- 콘솔 메타 입력 + 광고/정산 활성
- QR 회귀 디바이스 테스트
- 검수 요청 + 패치 (필요 시)
- 챌린지 출품폼 제출
