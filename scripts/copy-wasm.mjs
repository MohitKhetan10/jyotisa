// swisseph-wasm resolves its .wasm/.data via `new URL('../wasm/'+f, import.meta.url)`.
// Since that path is dynamic, Vite can't emit the assets automatically. In the
// production build the JS chunk sits in /assets/, so `../wasm/` → /wasm/. We copy
// the engine assets into public/wasm/ so those URLs resolve. Runs before build.
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
// Resolve swisseph-wasm via Node's module resolution rather than a hardcoded
// node_modules path, so the build works regardless of where the package is
// installed (root, hoisted, or a base-directory install on CI).
const require = createRequire(import.meta.url);
const pkgDir = dirname(require.resolve('swisseph-wasm/package.json'));
const src = join(pkgDir, 'wasm');
const dest = join(root, 'public', 'wasm');

mkdirSync(dest, { recursive: true });
for (const f of ['swisseph.wasm', 'swisseph.data']) {
  copyFileSync(join(src, f), join(dest, f));
  console.log('copied', f, '→ public/wasm/');
}
