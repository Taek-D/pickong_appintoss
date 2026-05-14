import 'dotenv/config';
import { defineConfig } from '@apps-in-toss/web-framework/config';

// 토스 미니앱 헤더 아이콘은 토스 앱 컨텍스트에서 fetch 되므로 절대 URL 필수.
// 상대 경로(/icon.png)는 토스 도메인 기준으로 깨져 기본 홈 아이콘이 노출됨.
const PUBLIC_ICON_URL = process.env.PUBLIC_ICON_URL ?? '/icon.png';
if (PUBLIC_ICON_URL.startsWith('/')) {
  console.warn(
    '[granite.config] PUBLIC_ICON_URL not set (got "%s"). Toss 미니앱 헤더에 브랜드 아이콘이 안 보일 수 있어요. 운영 배포 후 절대 URL(예: https://<운영-도메인>/icon.png)로 .env에 등록하세요.',
    PUBLIC_ICON_URL,
  );
}

export default defineConfig({
  appName: 'pickkong',
  brand: {
    displayName: '픽콩',
    primaryColor: '#7BD389',
    icon: PUBLIC_ICON_URL,
  },
  permissions: [],
  navigationBar: {
    withBackButton: true,
    withHomeButton: true,
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'vite',
      build: 'vite build',
    },
  },
  outdir: 'dist',
});
