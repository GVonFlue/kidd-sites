/**
 * Open Graph images, 1200x630, one per brand. Build Standard §12.
 * Drawn from the same parcel-grid motif and palette as the site, so a shared
 * link looks like the page it points at. No stock imagery.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BRANDS = [
  { key: 'agent', name: 'Agent Kidd', ground: '#FFFFFF', ink: '#1A1D1F', sub: 'rgba(26,29,31,.72)',
    line: 'rgba(26,29,31,.10)', title: 'Most agents sell houses.<br>I also manage five hundred of them.',
    strap: 'Justus Kidd · Wichita, Kansas · Real Broker, LLC', photo: '/agent/justus-portrait.jpg' },
  { key: 'cornerstone', name: 'Cornerstone Management', ground: '#16191B', ink: '#FFFFFF', sub: 'rgba(255,255,255,.75)',
    line: 'rgba(255,255,255,.12)', title: 'Five hundred doors<br>under management in Wichita.',
    strap: '170+ single family homes · 7 associations · 1,000+ residents', photo: null },
];

// Same subdivision algorithm as the site's ParcelGrid, so the motif matches.
function rng(seed) { let s = seed; return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; }; }
function subdivide(x, y, w, h, d, rand, out) {
  if (d === 0 || w < 180 || h < 110) { out.push({ x, y, w, h }); return; }
  const vertical = w > h ? rand() > 0.25 : rand() > 0.75;
  const t = 0.32 + rand() * 0.36;
  if (vertical) { const c = Math.round(w * t); subdivide(x, y, c, h, d - 1, rand, out); subdivide(x + c, y, w - c, h, d - 1, rand, out); }
  else { const c = Math.round(h * t); subdivide(x, y, w, c, d - 1, rand, out); subdivide(x, y + c, w, h - c, d - 1, rand, out); }
}

mkdirSync('public/agent', { recursive: true });
mkdirSync('public/cornerstone', { recursive: true });

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const b of BRANDS) {
  const parcels = [];
  subdivide(0, 0, 1200, 630, 5, rng(b.key === 'agent' ? 7 : 11), parcels);
  const marked = parcels.filter((p) => p.x > 700 && p.w > 130).slice(-2)[0] || parcels[parcels.length - 1];
  const rects = parcels.map((p) => `<rect x="${p.x + .5}" y="${p.y + .5}" width="${p.w - 1}" height="${p.h - 1}"/>`).join('');

  const html = `<!doctype html><meta charset="utf-8">
<link rel="stylesheet" href="http://localhost:3000/_next/static/css/${process.env.CSS || ''}">
<style>
 @font-face{font-family:AR;src:url('file://${process.cwd()}/node_modules/@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2') format('woff2');font-weight:100 900}
 @font-face{font-family:PM;src:url('file://${process.cwd()}/node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2') format('woff2')}
 *{margin:0;box-sizing:border-box}
 body{width:1200px;height:630px;background:${b.ground};color:${b.ink};position:relative;overflow:hidden;font-family:AR,sans-serif}
 svg{position:absolute;inset:0}
 .pad{position:relative;padding:74px 80px;height:100%;display:flex;flex-direction:column;justify-content:center}
 h1{font-size:64px;line-height:1.03;letter-spacing:-.025em;font-weight:700;max-width:${b.photo ? '740px' : '900px'}}
 .eyebrow{font-family:PM,monospace;font-size:19px;letter-spacing:.09em;text-transform:uppercase;color:#C2832A;margin-bottom:26px}
 .strap{font-family:PM,monospace;font-size:21px;color:${b.sub};margin-top:32px;letter-spacing:.01em}
 .bar{position:absolute;left:0;right:0;bottom:0;height:12px;background:#C2832A}
 img{position:absolute;right:80px;top:50%;transform:translateY(-50%);width:270px;height:338px;object-fit:cover;border-radius:10px}
</style>
<svg viewBox="0 0 1200 630"><g fill="none" stroke="${b.ink}" stroke-opacity="1" stroke-width="1" style="stroke:${b.line}">${rects}</g>
<rect x="${marked.x + .5}" y="${marked.y + .5}" width="${marked.w - 1}" height="${marked.h - 1}" fill="#C2832A" fill-opacity=".10" stroke="#C2832A" stroke-opacity=".30"/></svg>
${b.photo ? `<img src="file://${process.cwd()}/public${b.photo}">` : ''}
<div class="pad"><div class="eyebrow">${b.name}</div><h1>${b.title}</h1><div class="strap">${b.strap}</div></div>
<div class="bar"></div>`;

  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `public/${b.key}/og.png` });
  await page.close();
  console.log(`  public/${b.key}/og.png`);
}
await browser.close();
