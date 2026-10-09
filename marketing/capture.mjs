// Drives the REAL Jyotisa birth form, then captures high-res screenshots of
// the strongest pages for the marketing montage. No invented screens.
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE || 'http://localhost:4198';
const OUT = path.join(__dirname, 'shots');
const W = 1920, H = 1080;

const shot = async (page, name, full = false) => {
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: full });
  console.log('shot:', name);
};

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: W, height: H },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();

// --- Fill the real birth form ---
await page.goto(`${BASE}/birth`, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

await page.fill('#name', 'Aarav Sharma');
await page.fill('#date', '1996-07-21');
await page.fill('#time', '09:15');

// City autocomplete
const city = page.getByPlaceholder(/Search city/i);
await city.click();
await city.fill('Kathmandu');
await page.waitForTimeout(1200);
await page.locator('ul li button').first().click();
await page.waitForTimeout(400);

await page.getByRole('button', { name: /generate/i }).click();
await page.waitForURL(/dashboard/, { timeout: 20000 });
await page.waitForTimeout(1500);

// --- Capture strong pages ---
const pages = [
  ['/dashboard', 'dashboard'],
  ['/chart', 'chart'],
  ['/houses', 'houses'],
  ['/analysis', 'analysis'],
  ['/dashas', 'dashas'],
  ['/life', 'life'],
  ['/today', 'today'],
];

for (const [route, name] of pages) {
  await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await shot(page, name);
  // also a full-page version for tall screens
  await page.screenshot({ path: path.join(OUT, `${name}_full.png`), fullPage: true });
}

await browser.close();
console.log('DONE');
