/**
 * Horizontal overflow, on every route, at the three narrowest widths that
 * matter. A single element wider than the viewport gives the whole page a
 * sideways scroll, and it is invisible in a screenshot taken at a wider size.
 *
 * Also reports the widest offending element, because "the page overflows" is
 * not actionable and "the nav rail is 412px" is.
 */
import { chromium } from 'playwright';

const ROUTES = {
  agent: { host: 'www.agentkidd.com', paths: ['/', '/buy', '/sell', '/investors', '/about', '/reviews', '/contact'] },
  cornerstone: {
    host: 'www.cornerstonemgmt.co',
    paths: ['/', '/property-management', '/hoa', '/commercial', '/owners', '/availability', '/about', '/contact'],
  },
};
const WIDTHS = [320, 375, 390];

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: ['--host-resolver-rules=MAP www.agentkidd.com 127.0.0.1, MAP www.cornerstonemgmt.co 127.0.0.1'],
});

const bad = [];
let checked = 0;

for (const width of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (const [brand, cfg] of Object.entries(ROUTES)) {
    for (const p of cfg.paths) {
      await page.goto(`http://${cfg.host}:3000${p}`, { waitUntil: 'networkidle' });
      // Scroll the whole page so anything revealed on scroll is laid out too.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 40));
        }
        window.scrollTo(0, 0);
      });
      const r = await page.evaluate((w) => {
        const doc = document.documentElement;
        let worst = null;
        for (const el of document.querySelectorAll('body *')) {
          const b = el.getBoundingClientRect();
          if (b.width === 0) continue;
          const right = b.right + window.scrollX;
          if (right > w + 1 && (!worst || right > worst.right)) {
            worst = { right: Math.round(right), tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 60) };
          }
        }
        return { scrollW: doc.scrollWidth, clientW: doc.clientWidth, worst };
      }, width);
      checked += 1;
      if (r.scrollW > r.clientW + 1) bad.push({ width, at: `${brand}${p}`, ...r });
    }
  }
  await ctx.close();
}

await browser.close();

if (bad.length) {
  console.log(`\n  ${bad.length} OVERFLOWING:`);
  for (const b of bad) {
    console.log(`   ${String(b.width).padStart(3)}px ${b.at.padEnd(32)} scrollWidth ${b.scrollW} > ${b.clientW}`);
    if (b.worst) console.log(`        widest: <${b.worst.tag} class="${b.worst.cls}"> right edge ${b.worst.right}`);
  }
  process.exitCode = 1;
} else {
  console.log(`\n  no horizontal overflow — ${checked} route/width combinations at ${WIDTHS.join(', ')}px`);
}
