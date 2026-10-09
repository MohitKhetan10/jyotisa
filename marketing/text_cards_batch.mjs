// Renders text-scene cards for the FULL marketing film series (videos 2-5),
// matching video 1's brand language exactly (Playfair Display + Inter,
// dark warm-ink / parchment / gold). Outputs 1920x1080 PNGs to scenes/.
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VERT = process.env.ORIENT === 'v';
const W = VERT ? 1080 : 1920, H = VERT ? 1920 : 1080;
const OUT = path.join(__dirname, VERT ? 'scenes_v' : 'scenes');
const S = VERT ? 0.72 : 1;            // font scale for narrow canvas
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
  .wrap { text-align:center; max-width:${VERT ? 960 : 1480}px; padding:0 ${VERT ? 60 : 80}px; }
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
  .price { font-size:${r(120)}px; font-weight:700; color:#f2cf63; line-height:1.1; }
  .label { font-family:'Inter',sans-serif; font-weight:500; font-size:${r(34)}px;
           letter-spacing:3px; text-transform:uppercase; color:#c8b58f; margin-top:30px; }
  .strike { text-decoration:line-through; text-decoration-color:#9a7b3a;
            text-decoration-thickness:4px; color:#c8b58f; }
</style></head><body><div class="wrap">${inner}</div></body></html>`;

const cards = {
  // ---------- VIDEO 2: DEMO / WOW (free vs Rs.2000) ----------
  d0:    base(`<div class="q">A good astrologer charges<br><span class="price">Rs. 2,000</span><div class="label">for one reading</div></div>`, { size: 70 }),
  d_free:base(`<div class="big">No signup. No payment.<br>No <span class="gold">ads.</span></div><div class="rule"></div>`),
  d_url: base(`<div class="q">Just your <span class="gold">real</span> kundali,<br>in thirty seconds.</div>`, { size: 76 }),

  // ---------- VIDEO 3: SIXTEEN CHARTS (depth flex) ----------
  c0:    base(`<div class="q">Most apps show you<br><span class="gold">one</span> chart.</div>`, { size: 82 }),
  c1:    base(`<div class="q">Your kundali actually holds<br><span class="gold">sixteen.</span></div>`, { size: 80 }),
  c2:    base(`<div class="q" style="font-style:italic">Houses. Dashā periods.<br>Divisional charts. Remedies.</div>`, { size: 66 }),
  c_depth:base(`<div class="big">The depth a <span class="gold">pandit</span><br>spends hours on.</div><div class="rule"></div>`),

  // ---------- VIDEO 4: REMEDY / UPAYA (weak Moon) ----------
  r0:    base(`<div class="q">A weak Moon leaves the mind<br>restless and <span class="gold">anxious.</span></div>`, { size: 74 }),
  r1:    base(`<div class="q" style="font-style:italic">An old remedy your grandmother knew,<br>one most apps never show.</div>`, { size: 62 }),
  r2:    base(`<div class="q">On <span class="gold">Mondays,</span> bathe with<br>a little raw milk or curd.</div>`, { size: 74 }),
  r3:    base(`<div class="q" style="font-style:italic">Wear white. Offer white flowers.<br>Keep clean water by your bed.</div>`, { size: 62 }),
  r4:    base(`<div class="big">Simple. Devotional.<br><span class="gold">Free.</span></div><div class="rule"></div>`),

  // ---------- VIDEO 5: FOUNDER / TRUST ----------
  f0:    base(`<div class="q">I'm a developer from<br><span class="gold">Kathmandu.</span></div>`, { size: 80 }),
  f1:    base(`<div class="q" style="font-style:italic">I watched people pay thousands<br>to be told they were <span class="gold">cursed.</span></div>`, { size: 64 }),
  f2:    base(`<div class="q">Real astrology shouldn't be<br>a <span class="gold">fear</span> business.</div>`, { size: 74 }),
  f3:    base(`<div class="q">So I built the whole thing,<br>and made it <span class="gold">free.</span></div>`, { size: 74 }),
  f4:    base(`<div class="big">No scams. No upsells.<br>Just your <span class="gold">real</span> chart.</div><div class="rule"></div>`),

  // ---------- VIDEO 6: MOON NAKSHATRA (education) ----------
  n0:    base(`<div class="q">Everyone knows<br>their sun sign.</div>`, { size: 80 }),
  n1:    base(`<div class="q">Almost no one knows their<br><span class="gold">Moon nakshatra.</span></div>`, { size: 74 }),
  n2:    base(`<div class="q" style="font-style:italic">Yet it shapes your mind,<br>your instinct, your emotions.</div>`, { size: 66 }),
  n3:    base(`<div class="q">Your free kundali reveals it<br>in <span class="gold">seconds.</span></div>`, { size: 74 }),

  // ---------- VIDEO 7: MAHADASHA (education) ----------
  m0:    base(`<div class="q">Ever feel like life moves<br>in <span class="gold">chapters?</span></div>`, { size: 78 }),
  m1:    base(`<div class="q" style="font-style:italic">Vedic astrology calls them <span class="gold">dashās</span>,<br>the planetary seasons of a life.</div>`, { size: 62 }),
  m2:    base(`<div class="q">Each one colours years<br>of who you become.</div>`, { size: 74 }),
  m3:    base(`<div class="q">See the chapter<br>you're living <span class="gold">now.</span></div>`, { size: 76 }),

  // ---------- VIDEO 8: WEAK SUN remedy ----------
  su0:   base(`<div class="q">A weak Sun dims<br>confidence and vitality.</div>`, { size: 74 }),
  su1:   base(`<div class="q" style="font-style:italic">A remedy passed down<br>for generations.</div>`, { size: 66 }),
  su2:   base(`<div class="q">At <span class="gold">sunrise,</span> offer water<br>to the rising sun.</div>`, { size: 74 }),
  su3:   base(`<div class="q" style="font-style:italic">Add a touch of red. Face the light.<br>Breathe slowly.</div>`, { size: 62 }),
  su4:   base(`<div class="big">Quiet. Daily.<br><span class="gold">Free.</span></div><div class="rule"></div>`),

  // ---------- VIDEO 9: SADE SATI (no fear) ----------
  ss0:   base(`<div class="q">You've heard <span class="gold">Sade Sati</span><br>spoken with fear.</div>`, { size: 76 }),
  ss1:   base(`<div class="q" style="font-style:italic">Saturn's seven and a half years<br>of pressure, and of growth.</div>`, { size: 62 }),
  ss2:   base(`<div class="q">It is not a curse.<br>It is a <span class="gold">teacher.</span></div>`, { size: 78 }),
  ss3:   base(`<div class="q">See exactly where<br>you stand today.</div>`, { size: 76 }),

  // ---------- VIDEO 10: MANGAL DOSHA (truth vs fear) ----------
  md0:   base(`<div class="q"><span class="gold">Mangal Dosha.</span><br>The word that scares families.</div>`, { size: 70 }),
  md1:   base(`<div class="q" style="font-style:italic">Often used to <span class="gold">frighten,</span><br>rarely ever explained.</div>`, { size: 64 }),
  md2:   base(`<div class="q">The truth is calmer<br>than the fear.</div>`, { size: 78 }),
  md3:   base(`<div class="q">Understand yours,<br>honestly.</div>`, { size: 78 }),
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
