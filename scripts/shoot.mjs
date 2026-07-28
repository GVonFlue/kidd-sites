import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const ROUTES = {
  agent: { host: 'www.agentkidd.com', paths: ['/', '/buy', '/sell', '/investors', '/about', '/reviews', '/contact'] },
  cornerstone: { host: 'www.cornerstonemgmt.co', paths: ['/', '/property-management', '/hoa', '/commercial', '/owners', '/availability', '/contact'] },
};
const SIZES = [
  { name: '375', width: 375, height: 900 },
  { name: '390', width: 390, height: 900 },
  { name: '768', width: 768, height: 1000 },
  { name: '1280', width: 1280, height: 900 },
  { name: '1920', width: 1920, height: 1000 },
];
const ONLY = process.argv[2] ? process.argv[2].split(',') : ['375', '1280'];
const FULL = process.env.FULL === '1';

mkdirSync('shots', { recursive: true });
// Resolve the real hostnames to the local server so the screenshots exercise the
// actual host-routing middleware rather than bypassing it with prefixed paths.
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: ['--host-resolver-rules=MAP www.agentkidd.com 127.0.0.1, MAP www.cornerstonemgmt.co 127.0.0.1'],
});
const errors = [];

for (const size of SIZES.filter((s) => ONLY.includes(s.name))) {
  for (const [brand, cfg] of Object.entries(ROUTES)) {
    const ctx = await browser.newContext({
      viewport: { width: size.width, height: size.height },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    page.on('console', (m) => { if (m.type() === 'error') errors.push(`${brand}${page.url()} :: ${m.text()}`); });
    page.on('pageerror', (e) => errors.push(`${brand} :: ${e.message}`));
    for (const p of cfg.paths) {
      const url = `http://${cfg.host}:3000${p}`;
      const res = await page.goto(url, { waitUntil: 'networkidle' });
      if (res.status() !== 200) errors.push(`${brand}${p} :: HTTP ${res.status()}`);
      const slug = p === '/' ? 'home' : p.replace(/\//g, '');
      await page.screenshot({ path: `shots/${brand}-${slug}-${size.name}.png`, fullPage: FULL });
    }
    await ctx.close();
  }
  console.log(`  shot ${size.width}px`);
}
await browser.close();
console.log(errors.length ? `\n  ${errors.length} CONSOLE/HTTP ERRORS:\n` + errors.map(e=>'   '+e).join('\n') : '\n  zero console errors, zero non-200 responses');
