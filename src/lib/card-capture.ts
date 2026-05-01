// 카드 화면을 PNG base64로 캡처 — saveBase64Data로 단말 갤러리 저장
// 의존성 없는 Canvas 버전 (간단한 합성). 추후 Phase 3에서 html-to-image 교체 가능.

export interface CardCapturePayload {
  nickname: string;
  characterEmoji: string;
  characterLabel: string;
  totalCount: number;
  totalAmount: number;
  topCategoryLabel: string;
  background: string;
  primary: string;
}

const W = 600;
const H = 800;

export async function captureCardPng(p: CardCapturePayload): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas 2d context unavailable');

  // 배경
  ctx.fillStyle = p.background;
  ctx.fillRect(0, 0, W, H);

  // 카드 박스
  const m = 32;
  ctx.fillStyle = '#FFFFFF';
  roundRect(ctx, m, m, W - m * 2, H - m * 2, 32);
  ctx.fill();

  // 닉네임 (상단)
  ctx.fillStyle = '#8C7B6F';
  ctx.font = '500 18px Pretendard, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(p.nickname, W / 2, 100);

  // 캐릭터 emoji (큰 원)
  const cx = W / 2;
  const cy = 280;
  ctx.fillStyle = p.primary + '40';
  ctx.beginPath();
  ctx.arc(cx, cy, 100, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = '120px system-ui';
  ctx.fillStyle = '#3F2D24';
  ctx.fillText(p.characterEmoji, cx, cy + 38);

  // 캐릭터 라벨
  ctx.font = '700 28px Pretendard, system-ui, sans-serif';
  ctx.fillStyle = '#3F2D24';
  ctx.fillText(p.characterLabel, cx, 460);

  // 집계
  ctx.font = '500 16px Pretendard, system-ui, sans-serif';
  ctx.fillStyle = '#8C7B6F';
  ctx.fillText(`이번 달 ${p.totalCount}콩 · 최애 ${p.topCategoryLabel}`, cx, 510);
  if (p.totalAmount > 0) {
    ctx.fillText(`${p.totalAmount.toLocaleString()}원의 행복`, cx, 540);
  }

  // 본인 안내 카피 (작게 하단)
  ctx.font = '12px Pretendard, system-ui, sans-serif';
  ctx.fillStyle = '#8C7B6F';
  ctx.fillText('친구는 이번 달 안에만 볼 수 있어요', cx, H - 80);

  // 픽콩 워터마크
  ctx.font = '700 14px Pretendard, system-ui, sans-serif';
  ctx.fillStyle = p.primary;
  ctx.fillText('픽콩', cx, H - 50);

  // base64 (data: prefix 제거하고 저장 페이로드용)
  return canvas.toDataURL('image/png').split(',')[1] ?? '';
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
