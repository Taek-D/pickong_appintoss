// S-SHARE — 공유 시트 (PRD §7.14)
import { BottomSheet } from '@/components/BottomSheet';
import { useEffect, useState } from 'react';
import { saveBase64Data, getTossShareLink, share as tossShare } from '@/lib/sdk';
import { captureCardPng } from '@/lib/card-capture';
import { buildShareMessage } from '@/lib/share-message';
import { track } from '@/lib/analytics';
import { COPY, BRAND_BACKGROUND, BRAND_PRIMARY } from '@shared/constants';
import { toast } from '@/components/Toast';
import type { CharacterType } from '@shared/types';

interface Props {
  open: boolean;
  onClose: () => void;
  cardId: string;
  nickname: string;
  character: CharacterType;
  characterLabel: string;
  topCategoryLabel: string;
  totalCount: number;
  totalAmount: number;
}

const CHAR_EMOJI: Record<CharacterType, string> = {
  goods_hamster: '🐹',
  stationery_rabbit: '🐰',
  snack_cat: '🐱',
  gift_bear: '🐻',
  fan_squirrel: '🐿️',
  pet_dog: '🐶',
  taste_diverse: '🧚',
  sprout: '🌱',
};

export function Share(props: Props): JSX.Element {
  const { open, onClose, cardId, nickname, character, characterLabel, topCategoryLabel, totalCount, totalAmount } = props;
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      track('share_sheet_view', { card_id: cardId });
      track('share_view_expiry_notice_view', { card_id: cardId, copy_variant: 'neutral' });
    }
  }, [open, cardId]);

  async function onSaveImage(): Promise<void> {
    if (busy) return;
    setBusy(true);
    track('share_press_save_image', { card_id: cardId });
    try {
      const base64 = await captureCardPng({
        nickname,
        characterEmoji: CHAR_EMOJI[character],
        characterLabel,
        totalCount,
        totalAmount,
        topCategoryLabel,
        background: BRAND_BACKGROUND,
        primary: BRAND_PRIMARY,
      });
      await saveBase64Data({ base64, filename: `pickkong-${cardId}.png` });
      track('share_save_image_success', { card_id: cardId });
      toast('이미지를 저장했어요');
    } catch (err) {
      console.error(err);
      toast(COPY.toast_save_fail);
    } finally {
      setBusy(false);
    }
  }

  async function onShare(): Promise<void> {
    if (busy) return;
    setBusy(true);
    track('share_press_share', { card_id: cardId });
    try {
      const url = await getTossShareLink(`/card/${cardId}`);
      const message = buildShareMessage(nickname);
      await tossShare({ message, url });
      track('share_complete', { card_id: cardId });
      onClose();
    } catch (err) {
      console.error(err);
      toast(COPY.toast_save_fail);
    } finally {
      setBusy(false);
    }
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="카드 공유">
      <p className="mt-1 text-[12px] text-[var(--color-text-muted)]">
        {COPY.card_expiry_neutral}
      </p>
      <div className="mt-4 flex flex-col gap-3 pb-4">
        <button
          onClick={onSaveImage}
          disabled={busy}
          className="flex items-center justify-between rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 text-left transition active:scale-[0.98] disabled:opacity-50"
        >
          <span className="text-[16px] font-semibold">{COPY.card_save_image}</span>
          <span className="text-[20px]" aria-hidden>📥</span>
        </button>
        <button
          onClick={onShare}
          disabled={busy}
          className="flex items-center justify-between rounded-2xl bg-[var(--color-primary)] px-4 py-4 text-left text-white transition active:scale-[0.98] disabled:opacity-50"
        >
          <span className="text-[16px] font-semibold">{COPY.card_share_via_toss}</span>
          <span className="text-[20px]" aria-hidden>📨</span>
        </button>
      </div>
    </BottomSheet>
  );
}
