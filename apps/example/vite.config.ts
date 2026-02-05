import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3030,
  },
  resolve: {
    alias: {
      '@g-ai-metrics/metrics': path.resolve(__dirname, '../../packages/metrics/src'),
    },
  },
});
