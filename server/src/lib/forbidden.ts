// 금칙어 검증 모듈 — 정적 사전 + 변형 정규식 (PRD §5.11, §10.9)
// 정책: 관리자 사칭 강력 차단 / 욕설·혐오 1차 / 정치·종교·광고·도배는 신고 운영
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FORBIDDEN_PATTERNS } from './forbidden-patterns';

export interface ForbiddenResult {
  ok: boolean;
  error_code?: 'forbidden';
  reason?: string;
}

interface ForbiddenDict {
  exact_match_admin: string[];
  exact_match_profanity: string[];
  exact_match_hate: string[];
}

let dict: ForbiddenDict | null = null;
let normalizedAdmin: Set<string> = new Set();
let normalizedProfanity: Set<string> = new Set();
let normalizedHate: Set<string> = new Set();

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '..', '..', 'data', 'forbidden_nicknames.json');

function loadDict(): ForbiddenDict {
  if (dict) return dict;
  const raw = readFileSync(DATA_PATH, 'utf8');
  const parsed = JSON.parse(raw) as ForbiddenDict & { _meta?: unknown };
  dict = parsed;
  normalizedAdmin = new Set(parsed.exact_match_admin.map(normalize));
  normalizedProfanity = new Set(parsed.exact_match_profanity.map(normalize));
  normalizedHate = new Set(parsed.exact_match_hate.map(normalize));
  return parsed;
}

// 비교용 normalize: NFKC + 소문자 + 공백/특수문자 제거
export function normalize(input: string): string {
  return input
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '');
}

export function checkNickname(input: string): ForbiddenResult {
  loadDict();
  const norm = normalize(input);

  if (normalizedAdmin.has(norm)) {
    return { ok: false, error_code: 'forbidden', reason: 'exact_admin' };
  }
  if (normalizedProfanity.has(norm)) {
    return { ok: false, error_code: 'forbidden', reason: 'exact_profanity' };
  }
  if (normalizedHate.has(norm)) {
    return { ok: false, error_code: 'forbidden', reason: 'exact_hate' };
  }

  // 변형 정규식은 normalize 안 한 원본 + normalize 한 사본 모두 검사
  // (변형은 분리/특수문자 패턴을 catch하므로 원본 검사가 더 효과적)
  for (const p of FORBIDDEN_PATTERNS) {
    if (p.pattern.test(input) || p.pattern.test(norm)) {
      return { ok: false, error_code: 'forbidden', reason: p.reason };
    }
  }

  return { ok: true };
}

// 테스트용 reset
export function _resetCache(): void {
  dict = null;
  normalizedAdmin = new Set();
  normalizedProfanity = new Set();
  normalizedHate = new Set();
}
