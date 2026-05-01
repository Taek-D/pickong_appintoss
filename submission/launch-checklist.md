# 픽콩 출시 승인 게이트 — D-3 (2026-05-21) 마감

> 마감 D-3까지 모두 ✓이어야 D-Day 출시 승인 가능. 어느 하나라도 ✗이면 검수 반려 또는 출품 실패 위험.

## 코드 / 빌드

- [ ] `pnpm install` 성공
- [ ] `pnpm typecheck` 0 errors
- [ ] `pnpm test` 모든 테스트 PASS (forbidden + character-rule + share-message)
- [ ] `pnpm submission:validate` 0 exit
- [ ] `pnpm build` 성공 + `dist/` 압축 해제 ≤30MB
- [ ] `.ait` 패키지 생성 + 콘솔 업로드 완료

## 인프라

- [ ] mTLS 인증서 발급 + `.env` 등록 완료
- [ ] Supabase prod DB + 마이그레이션 (`pnpm db:migrate`) 완료
- [ ] 백엔드 배포 (Railway/Render/Vercel/VM) + `/health` 200 응답
- [ ] CORS allowlist (운영·테스트 도메인)
- [ ] Sentry DSN 발급 + .env + 첫 테스트 이벤트 적재 확인
- [ ] Granite Analytics 키 + 첫 이벤트 적재 확인
- [ ] GitHub Actions secrets `DATABASE_URL` 등록
- [ ] expire-cards workflow 수동 실행 → 0 exit

## 콘솔

- [ ] 콘솔 메타 입력 (`submission/console-meta.md` 일괄 복사)
- [ ] 광고 콘솔 활성 + 위치 A 등록
- [ ] 정산 채널 활성 (사업자 인증 완료)
- [ ] 앱 내 기능 3건 등록 (오늘의 귀여움 기록하기 / 이번 달 취향 카드 보기 / 공유 카드 열기)
- [ ] 고객센터 이메일 등록

## QR 회귀 (`submission/qa-checklist.md`)

- [ ] iOS 최신 + iOS-1 디바이스 통과
- [ ] Android 메인 해상도 2종 통과
- [ ] A~H 8개 섹션 모두 통과
- [ ] S-CARD-VIEW 4분기 모두 정확
- [ ] 닉네임 9~10자 미리보기 컷오프 없음

## 검수 요청

- [ ] 콘솔 "검수 요청" 클릭
- [ ] 어뷰징 차별화 코멘트 (`submission/differentiation-note.md`) 첨부
- [ ] 영업일 3일 대기 → 승인 또는 반려 의견

## 반려 패치 (조건부)

- [ ] 반려 의견 1차 분석 + 1회 패치 (D-3까지 5일 버퍼)
- [ ] 재제출 → 영업일 1~3일

## 출시

- [ ] 콘솔 "출시하기" 클릭 (D-3 = 2026-05-21까지)
- [ ] 30분 모니터링 윈도우 (`submission/30min-monitoring.md`)
- [ ] 챌린지 출품폼 제출 (`submission/submission-form.md`)
