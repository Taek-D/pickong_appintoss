// 금칙어 검증 단위 테스트 (Node 22 native test runner)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkNickname, normalize } from '../src/lib/forbidden';

// ─── 차단되어야 하는 케이스 ─────────────────────────────────
const SHOULD_BLOCK = [
  // 관리자 사칭 — exact
  'toss', 'Toss', 'TOSS', 'TOss',
  '토스', '토스공식', '토스운영',
  'admin', 'Admin', 'ADMIN',
  '관리자', '운영자', '운영팀',
  '공식', 'official', 'OFFICIAL',
  '픽콩공식', '픽콩운영', '픽콩팀',
  'pickkong', 'PickKong', 'Pickkong',
  'pickkong_admin', 'pickkongadmin',
  'manager', 'mod',
  // 변형 — 분리/특수문자
  't.o.s.s', 't o s s', 't_o_s_s', 't-o-s-s',
  '토 스', '토_스', '토.스',
  'a.d.m.i.n', 'a_d_m_i_n', 'A D M I N',
  '관 리 자', '관_리_자', '관.리.자',
  'o.f.f.i.c.i.a.l', 'O.F.F.I.C.I.A.L',
  '픽 콩 공 식', '픽_콩_공_식',
  '픽 콩 관 리',
  'pickkongofficial', 'PickKong_Admin',
  'p.i.c.k.k.o.n.g.team',
  'm.a.n.a.g.e.r',
  // 욕설
  '씨발', 'ㅅㅂ', 'ㅆㅂ', 'fuck', 'Fuck', 'shit', '병신', '개새끼',
  // 혐오
  '한남', '한녀', '메갈', '일베',
];

// ─── 통과해야 하는 케이스 (false positive 회귀 방지) ─────
const SHOULD_PASS = [
  // 추천 칩 6개
  '귀염콩', '굿즈콩', '문구콩', '덕질콩', '픽콩러', '수집콩',
  // 일반 닉네임
  '하늘', '바다', '서윤', '재훈', '유진',
  'cute', 'lovely', 'sunny',
  '도감마스터', '콩수집가', '굿즈러버',
  '한국인', '운명', '운치', '관악구',
  // '픽콩'은 brand 자체이므로 차단되지만 '픽콩러'는 통과해야 함 — 이건 실제로 통과 (exact_match에 픽콩러 없음)
  // '운영'은 단어 자체 (관리자 의미가 아닌 일반 단어 분리도 차단되므로 false positive 위험은 있음)
];

test('금칙어 — 관리자/욕설/혐오 차단', () => {
  for (const w of SHOULD_BLOCK) {
    const r = checkNickname(w);
    assert.equal(r.ok, false, `"${w}"는 차단되어야 함 — 결과: ${JSON.stringify(r)}`);
  }
});

test('금칙어 — 정상 닉네임 통과', () => {
  for (const w of SHOULD_PASS) {
    const r = checkNickname(w);
    assert.equal(r.ok, true, `"${w}"는 통과해야 함 — 결과: ${JSON.stringify(r)}`);
  }
});

test('normalize — NFKC + lowercase + 공백/특수문자 제거', () => {
  assert.equal(normalize('TOSS'), 'toss');
  assert.equal(normalize('T O S S'), 'toss');
  assert.equal(normalize('t.o.s.s'), 'toss');
  assert.equal(normalize('관 리 자'), '관리자');
  assert.equal(normalize('Pick Kong'), 'pickkong');
});

test('금칙어 — 추천 닉네임 6개 모두 통과 (회귀)', () => {
  const recommended = ['귀염콩', '굿즈콩', '문구콩', '덕질콩', '픽콩러', '수집콩'];
  for (const n of recommended) {
    const r = checkNickname(n);
    assert.equal(r.ok, true, `추천 칩 "${n}"는 반드시 통과해야 함`);
  }
});

test('금칙어 — 빈 입력은 통과 (length 검증은 별도)', () => {
  // 검증 책임 분리 — checkNickname은 금칙어만, length는 route에서
  const r = checkNickname('');
  assert.equal(r.ok, true);
});
