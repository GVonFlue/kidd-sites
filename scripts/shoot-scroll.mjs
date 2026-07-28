/**
 * Scroll-state screenshots of the agent hero.
 *
 * The cutout effect is invisible in a static screenshot by design: at scroll 0
 * the composition must look completely ordinary. The whole point is what happens
 * between frames, so this captures the same viewport at a series of scroll
 * offsets and reports the measured transform at each one.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

mkdirSync('shots', { recursive: true });

const OFFSETS = [0, 120, 260, 420, 620, 900];

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: ['--host-resolver-rules=MAP www.agentkidd.com 127.0.0.1'],
});

for (const [label, reduce] of [['motion', 'no-preference'], ['reduced', 'reduce']]) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: reduce,
  });
  const page = await ctx.newPage();
  await page.goto('http://www.agentkidd.com:3000/', { waitUntil: 'networkidle' });

  const out = [];
  for (const y of OFFSETS) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(220);
    const m = await page.evaluate(() => {
      const img = document.querySelector('img[src*="justus-cutout"]');
      if (!img) return { missing: true };
      const layer = img.closest('[style*="will-change"]') || img.parentElement;
      const r = img.getBoundingClientRect();
      const hero = document.querySelector('main section');
      const hr = hero.getBoundingClientRect();
      return {
        transform: getComputedStyle(layer).transform,
        imgBottom: Math.round(r.bottom),
        heroBottom: Math.round(hr.bottom),
        // Positive = how much of him is below the hero seam, i.e. hidden.
        sunk: Math.round(r.bottom - hr.bottom),
        width: Math.round(r.width),
      };
    });
    out.push({ y, ...m });
    if (label === 'motion') {
      await page.screenshot({ path: `shots/hero-scroll-${String(y).padStart(4, '0')}.png` });
    }
  }
  console.log(`\n  ${label}:`);
  for (const r of out) {
    console.log(
      `   scrollY ${String(r.y).padStart(4)}  transform ${String(r.transform).padEnd(34)} sunk ${String(r.sunk).padStart(5)}px`
    );
  }
  await ctx.close();
}

await browser.close();
