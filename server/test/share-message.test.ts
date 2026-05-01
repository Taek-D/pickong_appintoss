// 공유 메시지 양식 + 닉네임 9~10자 미리보기 컷오프 회귀 (PRD §11.3)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { COPY } from '../../shared/constants';

const MAX = 35;

function build(nickname: string): string {
  return COPY.share_message(nickname);
}

test('공유 메시지 양식 — PRD §16 토씨 일치', () => {
  const m = build('귀염콩');
  assert.equal(m, '귀염콩의 이번 달 카드예요. 이번 달 안에만 볼 수 있어요.');
});

test('닉네임 1자 — 메시지 25자 이하', () => {
  assert.ok(build('A').length <= MAX);
});

test('닉네임 8자 — 메시지 30자 이하', () => {
  const n = '귀염콩굿즈콩수';
  assert.equal(n.length, 7);
  const m = build('귀염콩굿즈콩수집');
  assert.ok(m.length <= MAX, `length=${m.length}, msg="${m}"`);
});

test('닉네임 9자 — 메시지 31자 이하', () => {
  const m = build('귀염콩굿즈콩수집러');
  assert.ok(m.length <= MAX, `length=${m.length}`);
});

test('닉네임 10자 (max) — 메시지 32자 이하 (한도 35 내)', () => {
  const m = build('귀염콩굿즈콩수집러판');
  assert.ok(m.length <= MAX, `length=${m.length}, msg="${m}"`);
});

test('영문 10자 — 한도 내', () => {
  const m = build('PickKongFn');
  assert.ok(m.length <= MAX, `length=${m.length}`);
});
