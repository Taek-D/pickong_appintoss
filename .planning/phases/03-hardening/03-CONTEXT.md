# Phase 3: Pre-submission Hardening — Context

**Gathered:** 2026-05-01
**Mode:** Auto-generated (autonomous, smart_discuss skipped)

<domain>
## Phase Boundary

§5.15 검수 체크리스트 모든 필수 항목 통과 + S-CARD-VIEW 4케이스·닉네임 동기화·9~10자 미리보기 회귀 + Sentry/Analytics 적재 + 출품폼 카피 1차 확정.

**Scope:** UX 디테일 다듬기, Sentry/Analytics wrapper, 회귀 테스트, 출품폼 카피, 어뷰징 차별화 코멘트.
**Requirements:** OBS-01, OBS-02, OBS-03, SUBMIT-01, SUBMIT-02
**일정:** W3a (D15~D18)
</domain>

<decisions>
- Sentry: Sentry SDK lazy init, DSN 없으면 no-op wrapper
- Granite Analytics: Phase 1에서 이미 wrapper. Phase 3에서 이벤트 적재 점검 + 알람 정의 문서
- 출품폼 카피 글자수 검증: Node 스크립트로 자동화
- 어뷰징 차별화 코멘트: 별도 마크다운 파일 (검수 첨부용)
- 회귀 테스트: 정적 markdown 체크리스트로 운영 (수동 실행)
</decisions>
