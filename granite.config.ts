import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'pickkong',
  brand: {
    displayName: '픽콩',
    primaryColor: '#7BD389',
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
