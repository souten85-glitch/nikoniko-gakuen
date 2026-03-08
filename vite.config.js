import { defineConfig } from 'vite';

export default defineConfig({
  // GitHub Pages: /<repo-name>/ がベースパスになる
  // ローカル開発時は / を使用
  base: process.env.GITHUB_PAGES_BASE || '/',
  server: {
    host: true,
    port: 5173,
  },
  build: {
    outDir: 'dist',
  },
});
