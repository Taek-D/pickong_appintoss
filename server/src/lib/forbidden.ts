// 금칙어 검증 — placeholder (01-04 plan에서 풀구현)
// 현재는 항상 ok 반환. 01-04에서 forbidden_nicknames.json + forbidden_patterns.regex 로딩.
export interface ForbiddenResult {
  ok: boolean;
  error_code?: 'forbidden';
  reason?: string;
}

export function checkNickname(_input: string): ForbiddenResult {
  return { ok: true };
}
