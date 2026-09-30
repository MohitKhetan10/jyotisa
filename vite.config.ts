import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// swisseph-wasm ships an Emscripten module (.wasm) plus a preloaded ephemeris
// data pack (.data). It must be excluded from dep pre-bundling so Emscripten can
// resolve its sibling assets, and .wasm must be treated as an asset.
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.wasm', '**/*.data'],
  optimizeDeps: { exclude: ['swisseph-wasm'] },
  server: { fs: { allow: ['..'] } },
  worker: { format: 'es' },
});
