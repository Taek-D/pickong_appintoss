// 금칙어 변형 정규식 — 관리자/공식 사칭 강력 차단 (PRD §5.11, §10.9)
// 분리·치환·삽입 변형까지 catch (toss → t.o.s.s, t0ss, t-o-s-s 등)
export interface ForbiddenPattern {
  pattern: RegExp;
  reason: string;
}

export const FORBIDDEN_PATTERNS: ForbiddenPattern[] = [
  // 'toss' 변형 — 영문 + 분리
  { pattern: /t[\W_0-9]{0,3}o[\W_0-9]{0,3}s[\W_0-9]{0,3}s/iu, reason: 'toss_variant' },
  // '토스' 변형 — 한글 + 공백·특수문자 분리
  { pattern: /토[\s\W_]{0,3}스/u, reason: 'toss_kr_variant' },
  // 'admin' 변형
  { pattern: /a[\W_0-9]{0,3}d[\W_0-9]{0,3}m[\W_0-9]{0,3}i[\W_0-9]{0,3}n/iu, reason: 'admin_variant' },
  // '관리자' 변형
  { pattern: /관[\s\W_]{0,3}리[\s\W_]{0,3}자/u, reason: 'admin_kr_variant' },
  // '운영자' 변형
  { pattern: /운[\s\W_]{0,3}영[\s\W_]{0,3}자/u, reason: 'operator_kr_variant' },
  // '공식' 변형
  { pattern: /공[\s\W_]{0,3}식/u, reason: 'official_kr_variant' },
  // 'official' 변형
  {
    pattern: /o[\W_0-9]{0,3}f[\W_0-9]{0,3}f[\W_0-9]{0,3}i[\W_0-9]{0,3}c[\W_0-9]{0,3}i[\W_0-9]{0,3}a[\W_0-9]{0,3}l/iu,
    reason: 'official_variant',
  },
  // '픽콩공식' / '픽콩운영' / '픽콩관리' 변형
  {
    pattern: /픽[\s\W_]{0,3}콩[\s\W_]{0,3}(공[\s\W_]{0,3}식|운[\s\W_]{0,3}영|관[\s\W_]{0,3}리|팀)/u,
    reason: 'pickkong_official_variant',
  },
  // 'pickkong' + (admin|official|team|운영|관리|공식) 조합
  {
    pattern: /p[\W_0-9]*i[\W_0-9]*c[\W_0-9]*k[\W_0-9]*k[\W_0-9]*o[\W_0-9]*n[\W_0-9]*g[\W_0-9_]*?(admin|official|team|운영|관리|공식)/iu,
    reason: 'pickkong_combo',
  },
  // 'manager' / 'mod' 변형
  { pattern: /m[\W_0-9]{0,2}a[\W_0-9]{0,2}n[\W_0-9]{0,2}a[\W_0-9]{0,2}g[\W_0-9]{0,2}e[\W_0-9]{0,2}r/iu, reason: 'manager_variant' },
];
