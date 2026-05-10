// 픽콩 공유 상수 — PRD §5.13/§7/§12/§16에서 추출
import type { CategoryId } from './types';

export const APP_NAME = '픽콩';
export const APP_NAME_EN = 'pickkong';
export const BRAND_PRIMARY = '#7BD389';
export const BRAND_BACKGROUND = '#FFF8EE';
export const BRAND_ACCENT = '#B59CD9';

export const CATEGORIES: ReadonlyArray<{
  id: CategoryId;
  label: string;
  emoji: string;
  color: string;
}> = [
  { id: 'goods',      label: '굿즈',     emoji: '🎁', color: '#FFC0CB' },
  { id: 'stationery', label: '문구',     emoji: '📒', color: '#FFE7A0' },
  { id: 'snack',      label: '간식',     emoji: '🍡', color: '#FFD2A8' },
  { id: 'gift',       label: '선물',     emoji: '💝', color: '#FFB6D9' },
  { id: 'fan',        label: '덕질',     emoji: '⭐', color: '#C8B6E2' },
  { id: 'pet',        label: '반려',     emoji: '🐾', color: '#A8E6CF' },
  { id: 'book',       label: '책·잡지',  emoji: '📚', color: '#B5D8FF' },
  { id: 'etc',        label: '기타',     emoji: '📦', color: '#D9D9D9' },
] as const;

export const RECOMMENDED_NICKNAMES = ['귀염콩', '굿즈콩', '문구콩', '덕질콩', '픽콩러', '수집콩'] as const;

export const RECOMMENDED_EMOJIS = ['🎁', '✨', '💕', '🌸', '⭐', '🍀', '🐰', '🐻', '🌿', '🍡', '📒', '💝'] as const;

export const NICKNAME_REGEX = /^[가-힣A-Za-z0-9]{1,10}$/;
export const NICKNAME_MAX_LEN = 10;
export const JAMO_ONLY_REGEX = /^[ㄱ-ㅎㅏ-ㅣ]+$/;
export const MEMO_MAX_LEN = 60;
export const MEMO_RECOMMENDED_LEN = 24;

// 카드 잠금 임계
export const CARD_UNLOCK_THRESHOLD = 3;

// 주간 목표
export const WEEKLY_TARGET = 3;

// 광고 캡 (Phase 2)
export const AD_CAP_PER_MONTH = 1;

// PRD §16 카피 표 (Phase 1만)
export const COPY = {
  app_subtitle: '오늘의 귀여움, 하나 픽',
  empty_diagram: '오늘의 귀여움 하나 담아볼까요?',
  main_cta: '오늘의 콩 줍기',
  card_lock_hint: '기록 3개부터 카드를 받을 수 있어요',
  login_headline: '픽콩에서 내 도감을 시작해 볼까요?',
  login_sub: '토스로 로그인하면 기록이 안전하게 이어져요',
  login_cta: '토스로 시작하기',
  login_disconnect: '토스 로그인을 다시 연결해 볼까요?',
  nick_headline_first: '어떻게 부를까요?',
  nick_sub_first: '친구에게 카드를 공유할 때 이렇게 보여요',
  nick_cta_first: '이 이름으로 시작할게요',
  nick_toast_length: '닉네임을 한 글자 이상 적어 볼까요?',
  nick_toast_blocked_char: '닉네임은 한글, 영문, 숫자만 쓸 수 있어요',
  nick_toast_jamo: '자음·모음만으로는 닉네임을 만들 수 없어요. 완성된 글자로 적어 볼까요?',
  nick_toast_forbidden: '이 닉네임은 쓸 수 없어요. 다른 이름으로 바꿔 볼까요?',
  add_step1: '어떤 귀여움이에요?',
  add_step2: '얼마였어요? (선택)',
  add_step3: '어떤 콩으로 남길까요?',
  add_save_cta: '내 도감에 담기',
  done_headline: (cat: string) => `${cat}콩 하나를 주웠어요`,
  done_sub: (n: number, rate: number) => `이번 달 ${n}번째 귀여움이에요. 도감 수집률 ${rate}%`,
  done_cta_home: '도감 보러가기',
  done_cta_more: '하나 더 줍기',
  cat_empty: '이 카테고리는 아직 비어 있어요. 하나 담아볼까요?',
  toast_save_fail: '저장이 안 됐어요. 다시 한 번 눌러 볼까요?',
  card_save_fail: '카드를 만들지 못했어요. 잠시 후 다시 시도해 볼까요?',
  toast_network: '인터넷 연결을 확인하고 다시 시도해 볼까요?',
  weekly_progress: (left: number) =>
    left <= 0 ? '이번 주 목표를 채웠어요!' : `이번 주 3콩까지 ${left}콩 남았어요`,
  collection_rate: (rate: number) => `이번 달 ${rate}% 채웠어요`,

  // ─── Phase 2: Card·Share·View·Ad ─────────────────────
  card_expiry_owner: '친구는 이번 달 안에만 볼 수 있어요',
  card_expiry_neutral: '이번 달 안에만 볼 수 있어요',
  card_expired_headline: '이 카드는 지난 달 이야기예요',
  card_expired_sub: '지금은 볼 수 없지만, 픽콩에서 내 도감은 언제든 시작할 수 있어요',
  card_expired_cta: '픽콩 시작하기',
  card_not_found_headline: '카드를 찾을 수 없어요',
  card_save_image: '이미지 저장',
  card_share_button: '공유하기',
  card_share_via_toss: '토스로 공유하기',
  card_owner_cta: '내 도감 보러가기',
  card_other_cta: '나도 도감 시작하기',
  card_other_header: (nickname: string) => `${nickname}의 이번 달 카드예요`,
  card_owner_header: (character: string) => `이번 달 나는 ${character}`,

  // 공유 메시지 양식 (PRD §16, 30자 내외)
  share_message: (nickname: string) => {
    const full = `${nickname}의 이번 달 카드예요. 이번 달 안에만 볼 수 있어요.`;
    return full.length <= 35 ? full : `${nickname}의 이번 달 카드예요.`;
  },

  viewer_intro_headline: (nickname: string) => `${nickname}이(가) 이번 달 카드를 보냈어요`,
  viewer_intro_body: '픽콩은 좋아한 귀여운 것을 모으는 도감이에요',
  viewer_intro_cta: '이 카드 보러가기',

  // 닉네임 변경 (S-NICK-EDIT)
  nick_headline_edit: '닉네임을 바꿀까요?',
  nick_sub_edit: '바뀐 이름은 이번 달 카드부터 보여요',
  nick_cta_edit: '이 이름으로 바꿀게요',
  nick_cta_cancel: '취소',
  nick_changed_toast: '닉네임을 바꿨어요',

  // 설정 + 탈퇴
  set_reset: '데이터 초기화',
  set_change_nickname: '닉네임 바꾸기',
  set_account_delete: '내 도감 데이터 삭제',
  set_account_delete_confirm: '내 도감을 모두 지울까요? 기록은 되돌릴 수 없어요.',
  set_account_delete_fail: '지금은 처리가 안 됐어요. 잠시 후 다시 시도해 볼까요?',
  set_version: '버전 정보',
  set_about: '만든이',
  set_report: '신고하기',

  // 기록 목록 + 수정·삭제
  list_filter_all: '전체',
  list_edit: '수정',
  list_delete: '삭제',
  list_delete_confirm: '이 콩을 도감에서 지울까요?',
} as const;

// 캐릭터 라벨 (PRD §12)
export const CHARACTER_LABELS: Record<string, string> = {
  goods_hamster: '굿즈콩 햄스터',
  stationery_rabbit: '문구콩 토끼',
  snack_cat: '간식콩 고양이',
  gift_bear: '선물콩 곰돌이',
  fan_squirrel: '덕질콩 다람쥐',
  pet_dog: '반려콩 강아지',
  taste_diverse: '취향부자 콩요정',
  sprout: '새싹콩 수집가',
};

// amount band (PRD §9.2 add_input_amount property)
export function amountBand(amount: number): string {
  if (amount === 0) return '0';
  if (amount < 1000) return '1-1k';
  if (amount < 5000) return '1k-5k';
  if (amount < 10000) return '5k-10k';
  return '10k+';
}

// 주차 시작 (KST 기준 월요일)
export function weekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function ymOf(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}
