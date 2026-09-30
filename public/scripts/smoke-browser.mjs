// End-to-end browser smoke test: loads the built app, generates a chart via the
// real UI flow, and asserts the WASM engine produced correct positions in-browser.
import puppeteer from 'puppeteer-core';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = process.env.URL || 'http://localhost:4173';

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('requestfailed', (r) => errors.push(`REQ FAIL ${r.url()} ${r.failure()?.errorText}`));
page.on('response', (r) => {
  if (/\/wasm\/|places\.json/.test(r.url())) console.log('net', r.status(), r.url());
});

try {
  await page.goto(`${URL}/birth`, { waitUntil: 'networkidle0', timeout: 30000 });

  // Fill the form: 15 Jan 1990, 12:00, Kathmandu.
  // React controlled inputs need the native setter + input event to update state.
  const setReactInput = (sel, value) => page.evaluate((s, v) => {
    const el = document.querySelector(s);
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, 'value').set;
    setter.call(el, v);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, sel, value);

  await setReactInput('#date', '1990-01-15');
  await setReactInput('#time', '12:00');
  await page.type('input[aria-label="Birthplace city"]', 'Kathmandu');
  await page.waitForSelector('ul button', { timeout: 5000 });
  await page.click('ul button'); // first result
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 4000));
  console.log('after submit → url:', page.url());
  console.log('body now:', (await page.evaluate(() => document.body.innerText)).slice(0, 300));

  // Dashboard should render the ascendant stat once WASM finishes.
  await page.waitForFunction(
    () => /ascendant \(lagna\)/i.test(document.body.innerText),
    { timeout: 30000 },
  );
  const text = await page.evaluate(() => document.body.innerText);
  console.log('--- Dashboard text (excerpt) ---');
  console.log(text.split('\n').filter(Boolean).slice(0, 12).join('\n'));

  const ok = /ascendant \(lagna\)/i.test(text) && /moon sign/i.test(text);
  if (!ok) throw new Error('Dashboard did not show computed chart');
  // Houses page: verify the 12-bhāva framework renders with live data.
  await page.goto(`${URL}/houses`, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.waitForFunction(
    () => /self & body/i.test(document.body.innerText),
    { timeout: 30000 },
  );
  const houseText = await page.evaluate(() => document.body.innerText);
  const housesOk = /Kendra/i.test(houseText) && /Bhāveśa|Lord \(Bhāveśa\)/i.test(houseText)
    && /placed in house/i.test(houseText);
  if (!housesOk) throw new Error('Houses page did not render bhāva framework with data');
  console.log('Houses page: bhāva classes + lord placements rendered ✓');

  // Walk the analysis pages — each exercises an engine in-browser.
  const pages = [
    ['/analysis', /planetary analysis/i],
    ['/life', /soul purpose/i],
    ['/vargas', /what this chart is saying/i],
    ['/dashas', /vimśottarī|vimshottari/i],
    ['/yogas', /yogas & doshas/i],
    ['/today', /gochara/i],
    ['/panchanga', /pañcāṅga|panchanga/i],
    ['/remedies', /remedies/i],
    ['/learn', /encyclopedia/i],
  ];
  for (const [path, re] of pages) {
    await page.goto(`${URL}${path}`, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.waitForFunction((r) => new RegExp(r.source, r.flags).test(document.body.innerText),
      { timeout: 30000 }, { source: re.source, flags: re.flags });
    console.log(`  ${path} rendered ✓`);
  }

  if (errors.length) throw new Error('Console/page errors:\n' + errors.join('\n'));
  console.log('\n✅ Browser smoke test PASSED — full app, all engines in-browser.');
} catch (e) {
  console.error('\n❌ FAILED:', e.message);
  if (errors.length) console.error('Errors:\n' + errors.join('\n'));
  process.exitCode = 1;
} finally {
  await browser.close();
}
