// 공유 메시지 양식 + 길이 검증 (PRD §16, §10.12)
import { COPY } from '@shared/constants';

export const SHARE_MESSAGE_LIMIT = 35; // 토스 share 미리보기 안전선

export function buildShareMessage(nickname: string): string {
  return COPY.share_message(nickname);
}

export function validateShareMessage(nickname: string): {
  message: string;
  withinLimit: boolean;
  length: number;
} {
  const message = buildShareMessage(nickname);
  return {
    message,
    length: message.length,
    withinLimit: message.length <= SHARE_MESSAGE_LIMIT,
  };
}
