// Renders the text-scene cards as 1920x1080 PNGs using Jyotisa's real brand
// fonts (Playfair Display + Inter) and palette (dark warm-ink, parchment, gold).
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VERT = process.env.ORIENT === 'v';
const W = VERT ? 1080 : 1920, H = VERT ? 1920 : 1080;
const OUT = path.join(__dirname, VERT ? 'scenes_v' : 'scenes');
const S = VERT ? 0.72 : 1;
const r = n => Math.round(n * S);

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">`;

const base = (inner, opts = {}) => `<!doctype html><html><head><meta charset="utf-8">${FONTS}
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html,body { width:${W}px; height:${H}px; overflow:hidden; }
  body {
    display:flex; align-items:center; justify-content:center;
    background:
      radial-gradient(130% 120% at 50% 42%, #17110a 0%, #0d0a06 46%, #070503 100%);
    font-family:'Playfair Display', Georgia, serif;
    color:#fdf6e9;
    -webkit-font-smoothing:antialiased;
  }
  .wrap { text-align:center; max-width:${VERT ? 960 : 1400}px; padding:0 ${VERT ? 60 : 80}px; }
  .q {
    font-size:${r(opts.size || 74)}px; font-weight:500; line-height:1.32;
    letter-spacing:.5px; font-style:${opts.italic ? 'italic' : 'normal'};
    color:#fbf1dd;
  }
  .gold { color:#f2cf63; }
  .sub {
    font-family:'Inter', sans-serif; font-weight:400; font-size:${r(30)}px;
    letter-spacing:${r(4)}px; text-transform:uppercase; color:#c8b58f;
    margin-top:38px;
  }
  .mark { color:#e3b22d; font-size:${r(40)}px; letter-spacing:2px; margin-bottom:34px;
          font-family:'Inter',sans-serif; font-weight:600; }
  .rule { width:60px; height:1px; background:#e3b22d; opacity:.6; margin:40px auto 0; }
  .big { font-size:${r(96)}px; font-weight:600; line-height:1.22; letter-spacing:.5px; }
  .cta-title { font-size:${r(110)}px; font-weight:600; letter-spacing:1px; }
</style></head><body><div class="wrap">${inner}</div></body></html>`;

const cards = {
  q0:    base(`<div class="q">How well do you really know yourself?</div>`, { size: 80 }),
  q1:    base(`<div class="q" >Why do I behave this way?</div>`, { italic: true }),
  q2:    base(`<div class="q">Why do certain relationships feel different?</div>`, { italic: true }),
  q3:    base(`<div class="q">What are my natural strengths?</div>`, { italic: true }),
  q4:    base(`<div class="q">Why do some periods of life<br>feel completely different?</div>`, { italic: true }),
  q5:    base(`<div class="q">Where am I heading?</div>`, { italic: true }),
  bridge:base(`<div class="q">What if you could explore<br>the answers <span class="gold">yourself?</span></div>`, { size: 78 }),
  brand: base(`<div class="big">You shouldn't have to <span class="gold">pay</span><br>to know yourself.</div><div class="rule"></div>`),
  cta:   base(`<div class="mark">✶ JYOTIṢA</div><div class="cta-title">Explore Jyotiṣa.</div><div class="sub">Your chart &nbsp;·&nbsp; Your questions &nbsp;·&nbsp; Your journey</div>`),
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
for (const [name, html] of Object.entries(cards)) {
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600); // let webfonts settle
  await page.screenshot({ path: path.join(OUT, `${name}.png`) });
  console.log('card:', name);
}
await browser.close();
console.log('DONE');
