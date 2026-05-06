import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'pickkong',
  brand: {
    displayName: '픽콩',
    primaryColor: '#7BD389',
    // public/icon.png — 빌드 시 dist/icon.png 으로 배포됨
    // SDK 2.4.7+ 는 HTTP URL 필수. 운영 배포 후 절대 URL로 교체 필요:
    // 예) 'https://<배포-도메인>/icon.png' 또는 jsDelivr CDN URL
    icon: '/icon.png',
  },
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
