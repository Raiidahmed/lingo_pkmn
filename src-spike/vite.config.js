import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Shell is served by Flask at /spike/. Keep asset paths relative so the
// built bundle works under that subpath without extra config.
export default defineConfig({
  plugins: [react()],
  base: '/spike/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2019',
  },
  server: {
    port: 5173,
    // When running `vite dev` directly, proxy API calls through to Flask.
    proxy: {
      '/scores': 'http://127.0.0.1:5000',
      '/api': 'http://127.0.0.1:5000',
      '/legacy': 'http://127.0.0.1:5000',
      '/src': 'http://127.0.0.1:5000',
    },
  },
});
