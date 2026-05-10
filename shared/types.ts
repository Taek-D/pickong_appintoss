// 픽콩 공유 타입 — frontend ↔ backend 간 진리원
// PRD §13 데이터 모델 + §9.2 이벤트 + §16 카피 기준

export type CategoryId =
  | 'goods'
  | 'stationery'
  | 'snack'
  | 'gift'
  | 'fan'
  | 'pet'
  | 'book'
  | 'etc';

export type CharacterType =
  | 'goods_hamster'
  | 'stationery_rabbit'
  | 'snack_cat'
  | 'gift_bear'
  | 'fan_squirrel'
  | 'pet_dog'
  | 'taste_diverse'
  | 'sprout';

export type AccountStatus = 'active' | 'withdrawn';
export type CardStatus = 'active' | 'dirty' | 'withdrawn';
export type ShareStatus = 'active' | 'expired';

export interface Account {
  user_key: string;
  nickname: string | null;
  status: AccountStatus;
  created_at: string;
  last_login_at: string;
  nickname_updated_at: string | null;
  withdrawn_at: string | null;
}

export interface MonthlyCard {
  card_id: string; // 8 chars [a-z0-9]
  user_key: string;
  month: string; // YYYY-MM
  total_count: number;
  total_amount: number;
  top_category: CategoryId;
  category_breakdown: Record<CategoryId, number>;
  character_type: CharacterType;
  nickname_snapshot: string;
  card_status: CardStatus;
  share_status: ShareStatus;
  created_at: string;
  updated_at: string;
}

export interface CuteItem {
  id: string; // uuid
  user_key: string;
  category: CategoryId;
  amount: number;
  emoji: string;
  memo: string;
  created_at: string;
}

export interface MonthlySummary {
  ym: string; // YYYY-MM
  total_count: number;
  total_amount: number;
  by_category: Partial<Record<CategoryId, number>>;
  collection_rate: number; // 0~1
  this_week_count: number;
  weekly_target: number;
}

// API
export interface AuthExchangeRequest { code: string; }
export interface AuthExchangeResponse {
  user_key: string;
  is_first_login: boolean;
  nickname: string | null;
}

export interface AuthMeResponse {
  user_key: string;
  nickname: string | null;
}

export interface NicknameRequest { nickname: string; }
export interface NicknameSuccess { ok: true; }
export interface NicknameFailure { ok: false; error_code: NicknameErrorCode; }
export type NicknameErrorCode =
  | 'length'
  | 'blocked_char'
  | 'jamo_only'
  | 'forbidden'
  | 'network';

// Analytics events (PRD §9.2)
export type EventName =
  | 'onb_view_step' | 'onb_press_start'
  | 'login_view' | 'login_press_start' | 'login_success' | 'login_cancel' | 'login_fail'
  | 'login_disconnect_detected' | 'login_reconnect_press'
  | 'nick_view' | 'nick_press_suggest' | 'nick_input_blocked_char'
  | 'nick_press_save' | 'nick_save_success' | 'nick_save_fail'
  | 'nickedit_view' | 'nickedit_press_suggest' | 'nickedit_input_blocked_char'
  | 'nickedit_press_save'
  | 'set_change_nickname_success' | 'set_change_nickname_fail'
  | 'home_view' | 'home_press_add' | 'home_press_category' | 'home_press_card_unlock'
  | 'add_step_view' | 'add_select_category' | 'add_input_amount'
  | 'add_press_save' | 'add_save_success' | 'add_save_fail'
  | 'done_view' | 'done_press_home' | 'done_press_more'
  | 'cat_view' | 'cat_press_add'
  | 'ad_eligible' | 'ad_load_request' | 'ad_load_success' | 'ad_load_fail'
  | 'ad_show' | 'ad_impression' | 'ad_clicked' | 'ad_dismiss' | 'ad_complete' | 'ad_skip_due_to_fail'
  | 'card_view' | 'card_view_expiry_notice_view'
  | 'card_upsert_success' | 'card_upsert_fail'
  | 'card_press_save' | 'card_press_share'
  | 'share_sheet_view' | 'share_view_expiry_notice_view'
  | 'share_press_save_image' | 'share_save_image_success'
  | 'share_press_share' | 'share_complete'
  | 'viewerintro_view' | 'viewerintro_press_continue'
  | 'cardview_view' | 'cardview_expired_view'
  | 'cardview_press_start_my_diagram' | 'cardview_load_fail'
  | 'list_view' | 'list_press_edit' | 'list_press_delete' | 'list_delete_success'
  | 'set_view' | 'set_press_reset'
  | 'set_press_account_delete' | 'set_account_delete_confirm'
  | 'set_account_delete_success' | 'set_account_delete_fail';
