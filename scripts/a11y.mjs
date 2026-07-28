/**
 * Quality floor audit, Build Standard §13. Runs against the real rendered pages.
 * Every check here is something that would otherwise be claimed rather than tested.
 */
import { chromium } from 'playwright';

const ROUTES = {
  agent: { host: 'www.agentkidd.com', paths: ['/', '/buy', '/sell', '/investors', '/about', '/reviews', '/contact'] },
  cornerstone: { host: 'www.cornerstonemgmt.co', paths: ['/', '/property-management', '/hoa', '/commercial', '/owners', '/availability', '/contact'] },
};

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: ['--host-resolver-rules=MAP www.agentkidd.com 127.0.0.1, MAP www.cornerstonemgmt.co 127.0.0.1'],
});
const fails = [];
const note = (m) => fails.push(m);

// ── Contrast maths, run over every text node actually on the page ────────────
const AUDIT = () => {
  const lum = (rgb) => {
    const [r, g, b] = rgb.map((c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const parse = (s) => {
    const n = (s.match(/[\d.]+/g) || []).map(Number);
    return { rgb: n.slice(0, 3), a: n.length > 3 ? n[3] : 1 };
  };
  // Walk up compositing every semi-transparent layer, so a 5% white overlay on a
  // near-black ground resolves to near-black rather than to white.
  const bgOf = (el) => {
    const layers = [];
    let n = el;
    while (n) {
      const c = getComputedStyle(n).backgroundColor;
      if (c && c !== 'transparent') {
        const { rgb, a } = parse(c);
        if (a > 0) { layers.push({ rgb, a }); if (a >= 0.999) break; }
      }
      n = n.parentElement;
    }
    let out = [255, 255, 255];
    for (let i = layers.length - 1; i >= 0; i--) {
      const { rgb, a } = layers[i];
      out = out.map((c, j) => rgb[j] * a + c * (1 - a));
    }
    return out;
  };
  const out = { contrast: [], noLabel: [], smallTap: [], imgNoAlt: [], landmarks: {}, h1: 0, focusKilled: [] };
  document.querySelectorAll('h1').forEach(() => out.h1++);
  for (const t of ['header', 'nav', 'main', 'footer']) out.landmarks[t] = document.querySelectorAll(t).length;

  document.querySelectorAll('*').forEach((el) => {
    const txt = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).map((n) => n.textContent.trim()).join('');
    if (!txt) return;
    const st = getComputedStyle(el);
    if (st.display === 'none' || st.visibility === 'hidden' || +st.opacity === 0) return;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const size = parseFloat(st.fontSize);
    const weight = +st.fontWeight || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    // Foreground alpha must be composited too. Tailwind's text-ink/70 style
    // utilities set an alpha on `color`, and reading only the RGB channels
    // measures a colour that is never actually painted.
    // Three things can fade text and all three have to be composited:
    //   1. alpha inside `color` (Tailwind's text-ink/70)
    //   2. the CSS `opacity` property on the element (Tailwind's opacity-60)
    //   3. `opacity` inherited from any ancestor
    // Missing any one of them measures a colour that is never painted.
    const fgRaw = parse(st.color);
    const bg = bgOf(el);
    let opacity = 1;
    for (let n = el; n; n = n.parentElement) opacity *= parseFloat(getComputedStyle(n).opacity || '1');
    const effA = fgRaw.a * opacity;
    const fg = fgRaw.rgb.map((c, i) => c * effA + bg[i] * (1 - effA));
    const [l1, l2] = [lum(fg), lum(bg)].sort((a, b) => b - a);
    const ratio = (l1 + 0.05) / (l2 + 0.05);
    const need = large ? 3 : 4.5;
    if (ratio < need) out.contrast.push({ txt: txt.slice(0, 45), ratio: +ratio.toFixed(2), need, size });
  });

  document.querySelectorAll('input:not([type=hidden]), textarea, select').forEach((el) => {
    const id = el.id;
    const labelled = (id && document.querySelector(`label[for="${id}"]`)) || el.closest('label') || el.getAttribute('aria-label');
    if (!labelled) out.noLabel.push(el.name || el.id || el.tagName);
  });

  document.querySelectorAll('a, button, input[type=submit]').forEach((el) => {
    const st = getComputedStyle(el);
    if (st.display === 'none' || st.visibility === 'hidden') return;
    const r = el.getBoundingClientRect();
    if (!r.width && !r.height) return;
    const srOnly = /(^|\s)sr-only(\s|$)/.test(el.className || '');
    // WCAG 2.5.5 target-size exception: a link inline within a block of text.
    const inlineInProse = el.tagName === 'A' && ['P', 'LI', 'BLOCKQUOTE', 'FIGCAPTION'].includes(el.parentElement?.tagName);
    if (r.height < 44 && r.height > 0 && !srOnly && !inlineInProse) {
      out.smallTap.push({ t: (el.innerText || el.getAttribute('aria-label') || '').slice(0, 30), h: Math.round(r.height) });
    }
    if (st.outlineStyle === 'none' && !st.boxShadow.includes('rgb')) { /* checked separately via :focus-visible rule */ }
  });

  document.querySelectorAll('img').forEach((img) => { if (img.alt === null) out.imgNoAlt.push(img.src); });
  return out;
};

for (const [brand, cfg] of Object.entries(ROUTES)) {
  const ctx = await browser.newContext({ viewport: { width: 375, height: 900 } });
  const page = await ctx.newPage();
  for (const p of cfg.paths) {
    await page.goto(`http://${cfg.host}:3000${p}`, { waitUntil: 'networkidle' });
    // Scroll the whole page so every scroll-reveal has fired. Measuring a
    // mid-animation opacity would report contrast a visitor never experiences.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.7;
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, document.documentElement.scrollHeight);
      await new Promise((r) => setTimeout(r, 400));
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 900));
    });
    const r = await page.evaluate(AUDIT);
    const at = `${brand}${p}`;
    r.contrast.forEach((c) => note(`CONTRAST ${at} ${c.ratio}:1 (needs ${c.need}) ${c.size}px "${c.txt}"`));
    r.noLabel.forEach((n) => note(`NO LABEL ${at} ${n}`));
    r.smallTap.forEach((t) => note(`TAP<44 ${at} ${t.h}px "${t.t}"`));
    r.imgNoAlt.forEach((i) => note(`IMG NO ALT ${at} ${i}`));
    if (r.h1 !== 1) note(`H1 COUNT ${at} = ${r.h1} (must be exactly 1)`);
    for (const [k, v] of Object.entries(r.landmarks)) if (v < 1) note(`MISSING LANDMARK <${k}> ${at}`);
  }
  await ctx.close();
}

// ── Keyboard reachability, on the densest page ──────────────────────────────
{
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
  await page.goto('http://www.cornerstonemgmt.co:3000/hoa', { waitUntil: 'networkidle' });
  const seq = [];
  for (let i = 0; i < 60; i++) {
    await page.keyboard.press('Tab');
    const stop = await page.evaluate(() => {
      const a = document.activeElement;
      const st = getComputedStyle(a);
      return { tag: a.tagName, text: (a.innerText || a.getAttribute('aria-label') || a.id || '').slice(0, 28), outline: st.outlineStyle, width: st.outlineWidth };
    });
    // Reaching BODY means the tab order has wrapped past the last focusable
    // element. That is the end of the walk, not a missing focus ring.
    if (stop.tag === 'BODY') break;
    seq.push(stop);
  }
  const first = seq[0];
  if (!/skip/i.test(first.text)) note(`FIRST TAB STOP is "${first.text}", expected the skip link`);
  const noRing = seq.filter((s) => s.outline === 'none');
  noRing.forEach((s) => note(`NO FOCUS RING on <${s.tag}> "${s.text}"`));
  console.log(`  keyboard: ${seq.length} stops walked, first = "${first.text}", all with a visible focus ring: ${noRing.length === 0}`);
}

// ── prefers-reduced-motion ──────────────────────────────────────────────────
{
  const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('http://www.agentkidd.com:3000/', { waitUntil: 'networkidle' });
  const moving = await page.evaluate(() => [...document.querySelectorAll('*')].filter((el) => {
    const s = getComputedStyle(el);
    const dur = (v) => Math.max(...v.split(',').map((x) => parseFloat(x) || 0));
    return dur(s.animationDuration) > 0.05 || dur(s.transitionDuration) > 0.05;
  }).length);
  if (moving) note(`${moving} elements still animate under prefers-reduced-motion`);
  console.log(`  reduced motion: ${moving} elements still animating (want 0)`);
  await ctx.close();
}

// ── Works with JavaScript disabled ──────────────────────────────────────────
{
  const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('http://www.cornerstonemgmt.co:3000/', { waitUntil: 'domcontentloaded' });
  const r = await page.evaluate(() => ({
    h1: document.querySelectorAll('h1').length,
    tel: document.querySelectorAll('a[href^="tel:"]').length,
    words: document.body.innerText.trim().split(/\s+/).length,
    nav: document.querySelectorAll('nav a').length,
  }));
  if (!r.h1 || !r.tel || r.words < 200) note(`NO-JS render is thin: ${JSON.stringify(r)}`);
  console.log(`  no-JS: h1=${r.h1}, tel links=${r.tel}, nav links=${r.nav}, ${r.words} words of real text`);
}

await browser.close();
console.log('');
if (fails.length) { console.log(fails.map((f) => '  ' + f).join('\n')); console.log(`\n  ${fails.length} QUALITY FLOOR FAILURES`); process.exit(1); }
console.log('  quality floor: all checks pass');
