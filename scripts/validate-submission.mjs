#!/usr/bin/env node
// 출품폼 카피 글자수 검증 — 띄어쓰기 포함 (PRD §14.2)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const TAGLINE_LIMIT = 50;
const RELEVANCE_LIMIT = 200;

function countChars(s) {
  // 트레일링 newline 제거 + 그래프 단위 카운트 (이모지 안전, 한글 1자)
  const trimmed = s.replace(/\s+$/g, '');
  return Array.from(trimmed).length;
}

function load(rel) {
  return readFileSync(join(process.cwd(), rel), 'utf8');
}

const tagline = load('submission/tagline.txt');
const relevance = load('submission/relevance.txt');

const tlen = countChars(tagline);
const rlen = countChars(relevance);

console.log('═══ 픽콩 출품폼 글자수 검증 ═══');
console.log(`tagline:   ${tlen} / ${TAGLINE_LIMIT} ${tlen <= TAGLINE_LIMIT ? '✓' : '✗ OVER'}`);
console.log(`relevance: ${rlen} / ${RELEVANCE_LIMIT} ${rlen <= RELEVANCE_LIMIT ? '✓' : '✗ OVER'}`);
console.log('');
console.log('--- tagline ---');
console.log(tagline.replace(/\s+$/, ''));
console.log('');
console.log('--- relevance ---');
console.log(relevance.replace(/\s+$/, ''));

const ok = tlen <= TAGLINE_LIMIT && rlen <= RELEVANCE_LIMIT;
process.exit(ok ? 0 : 1);
