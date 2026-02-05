import { defineConfig } from 'tsup';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  external: ['react', 'react-dom', '@g-ai-metrics/ai', 'rrweb'],
  tsconfig: resolve(__dirname, 'tsconfig.json'),
  outDir: 'dist',
});
