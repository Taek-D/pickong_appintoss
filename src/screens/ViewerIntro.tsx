// S-VIEWER-INTRO — 열람자용 1장 온보딩 (PRD §7.12, 신규 가입자만 1회)
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BottomCTA } from '@/components/BottomCTA';
import { DiagramMiniCut } from '@/lib/character-illustration';
import { useSession } from '@/state/session';
import { viewerIntro } from '@/lib/storage';
import { track } from '@/lib/analytics';
import { COPY } from '@shared/constants';

export function ViewerIntro(): JSX.Element {
  const nav = useNavigate();
  const { hash } = useParams<{ hash: string }>();
  const { userKey, nickname } = useSession();

  useEffect(() => {
    track('viewerintro_view', {
      card_id: hash,
      sharer_nickname_present: nickname != null,
    });
  }, [hash, nickname]);

  async function onContinue(): Promise<void> {
    if (userKey) await viewerIntro.markSeen(userKey);
    track('viewerintro_press_continue');
    nav(`/card/${hash}`, { replace: true });
  }

  return (
    <div className="safe-area flex h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
        <DiagramMiniCut size={140} />
        <h1 className="text-[20px] font-bold leading-snug">
          {COPY.viewer_intro_headline(nickname ?? '친구')}
        </h1>
        <p className="text-[14px] text-[var(--color-text-muted)]">
          {COPY.viewer_intro_body}
        </p>
      </div>
      <BottomCTA onClick={onContinue}>{COPY.viewer_intro_cta}</BottomCTA>
    </div>
  );
}
