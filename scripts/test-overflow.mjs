/**
 * Horizontal overflow, on every route, at the narrowest widths that matter.
 *
 * WHY THIS DOES NOT JUST CHECK scrollWidth. The page frame is `overflow: hidden`,
 * so an element wider than the viewport does NOT produce a sideways scroll — it
 * is silently CLIPPED. scrollWidth stays equal to clientWidth and the page looks
 * fine to any test that only asks "does this scroll sideways". The visitor sees
 * a card with its left and right edges cut off.
 *
 * That is exactly how the chat panel shipped broken on phones: one `whitespace-
 * nowrap` status line set the min-content width of its grid track, the track
 * grew past the viewport, and the frame quietly cut the card in half.
 *
 * So this measures TWO things:
 *   1. document scrollWidth vs clientWidth  (unclipped overflow)
 *   2. any element wider than the viewport  (clipped overflow — the silent one)
 *
 * It also waits for the scripted bot conversation to finish playing, because
 * the widest content on the page does not exist until several seconds after
 * load.
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
      // The scripted bot conversation reveals a line at a time over ~6s. Its
      // last bubbles are the widest content on the page.
      await page.waitForTimeout(6500);
      const r = await page.evaluate((w) => {
        const doc = document.documentElement;
        let worst = null;
        for (const el of document.querySelectorAll('body *')) {
          const b = el.getBoundingClientRect();
          if (b.width === 0) continue;
          // SVG decoration is deliberately oversized and clipped by its own
          // wrapper; it is not a layout fault.
          if (el.ownerSVGElement || el.tagName.toLowerCase() === 'svg') continue;
          // DECLARED overflow. A marquee track is wider than the viewport by
          // design — that is the mechanism, not a bug. The exemption is an
          // explicit attribute rather than a class-name match on purpose: it
          // has to be something an author opts into deliberately, so a genuine
          // runaway element can never inherit the exemption by accident. The
          // clipping ancestor is still required to be `overflow: hidden`,
          // which is verified below rather than assumed.
          const declared = el.closest('[data-allow-overflow]');
          if (declared) {
            // WALK UP FOR THE CLIPPING ANCESTOR — do not assume it is the
            // direct parent. It was written that way first, and the moment a
            // presentational wrapper was inserted between the track and the
            // clipping box every marquee page started failing again. The
            // guarantee we actually need is "something above this clips it",
            // not "its parent clips it".
            let host = declared.parentElement;
            let clipped = false;
            while (host && host !== document.body) {
              const ox = getComputedStyle(host).overflowX;
              if (ox === 'hidden' || ox === 'clip') { clipped = true; break; }
              host = host.parentElement;
            }
            if (clipped) continue;
          }
          if (b.width > w + 1 && (!worst || b.width > worst.w)) {
            worst = {
              w: Math.round(b.width),
              tag: el.tagName.toLowerCase(),
              cls: String(el.className || '').slice(0, 70),
            };
          }
        }
        return { scrollW: doc.scrollWidth, clientW: doc.clientWidth, worst };
      }, width);
      checked += 1;
      if (r.scrollW > r.clientW + 1 || r.worst) bad.push({ width, at: `${brand}${p}`, ...r });
    }
  }
  await ctx.close();
}

await browser.close();

if (bad.length) {
  console.log(`\n  ${bad.length} OVERFLOWING:`);
  for (const b of bad) {
    const clipped = b.scrollW <= b.clientW + 1;
    console.log(
      `   ${String(b.width).padStart(3)}px ${b.at.padEnd(32)} ${
        clipped ? 'CLIPPED (no scrollbar — silent)' : `scrolls sideways ${b.scrollW} > ${b.clientW}`
      }`
    );
    if (b.worst) console.log(`        widest element: ${b.worst.w}px  <${b.worst.tag} class="${b.worst.cls}">`);
  }
  process.exitCode = 1;
} else {
  console.log(
    `\n  no horizontal overflow, clipped or scrolling — ${checked} route/width combinations at ${WIDTHS.join(', ')}px`
  );
}
