/**
 * The Agent Kidd design system, applied to a document instead of a screen.
 *
 * Same tokens as the site, not approximations of them: the ink, the wash, the
 * brass, Archivo for display, IBM Plex Sans for body, IBM Plex Mono for
 * eyebrows and figures, and the parcel grid as the signature element. The fonts
 * are the same self-hosted files the site ships, embedded here so the PDF is
 * portable and does not depend on anything being installed.
 *
 * Pagination is EXPLICIT. Every page is a fixed-height box rather than a
 * paragraph flow with page-break hints, because a guide with an orphaned
 * heading at the bottom of a page reads as sloppy no matter how good the words
 * are.
 */
import fs from 'node:fs';

const b64 = (f) => fs.readFileSync(f).toString('base64');

export const TOKENS = {
  ink: '#1A1D1F',
  deep: '#16191B',
  surface: '#FFFFFF',
  wash: '#F2F3F3',
  line: '#DCDEDF',
  accent: '#C2832A',
  accentInk: '#8A5C13',
  accentLift: '#D9A648',
};

/* ── The parcel grid ──────────────────────────────────────────────────────────
   Lifted from src/components/shared/ParcelGrid.jsx so the document carries the
   same signature mark as the website, generated the same deterministic way
   rather than redrawn by eye. */
function rng(seed) {
  let s = seed;
  return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
}
function subdivide(x, y, w, h, depth, rand, out, minW, minH) {
  if (depth === 0 || w < minW * 2 || h < minH * 2) { out.push({ x, y, w, h }); return; }
  const vertical = w > h ? rand() > 0.25 : rand() > 0.75;
  const tt = 0.32 + rand() * 0.36;
  if (vertical) {
    const cut = Math.round(w * tt);
    subdivide(x, y, cut, h, depth - 1, rand, out, minW, minH);
    subdivide(x + cut, y, w - cut, h, depth - 1, rand, out, minW, minH);
  } else {
    const cut = Math.round(h * tt);
    subdivide(x, y, w, cut, depth - 1, rand, out, minW, minH);
    subdivide(x, y + cut, w, h - cut, depth - 1, rand, out, minW, minH);
  }
}
export function parcelGrid({ seed = 7, w = 1200, h = 1550, depth = 6, tone = 'light', markOpacity } = {}) {
  const rand = rng(seed);
  const parcels = [];
  subdivide(0, 0, w, h, depth, rand, parcels, 110, 80);
  const stroke = tone === 'dark' ? '#FFFFFF' : '#1A1D1F';
  const so = tone === 'dark' ? 0.055 : 0.05;
  const cands = parcels.map((pp, i) => ({ ...pp, i })).filter((pp) => pp.x > w * 0.5 && pp.w > 110 && pp.h > 90);
  const marked = cands.length ? cands[Math.floor(cands.length / 2)].i : parcels.length - 1;
  const m = parcels[marked];
  const mo = markOpacity ?? (tone === 'dark' ? 0.07 : 0.05);
  return `<svg class="grid abs" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g fill="none" stroke="${stroke}" stroke-opacity="${so}" stroke-width="1.1">
      ${parcels.map((pp) => `<rect x="${pp.x + 0.5}" y="${pp.y + 0.5}" width="${pp.w - 1}" height="${pp.h - 1}"/>`).join('')}
    </g>
    <rect x="${m.x + 0.5}" y="${m.y + 0.5}" width="${m.w - 1}" height="${m.h - 1}"
      fill="${TOKENS.accent}" fill-opacity="${mo}"
      stroke="${TOKENS.accent}" stroke-opacity="${tone === 'dark' ? 0.3 : 0.2}" stroke-width="1.1"/>
  </svg>`;
}

export const CSS = `
@font-face { font-family:'Archivo'; src:url(data:font/woff2;base64,${b64('fonts/archivo-latin-wght-normal.woff2')}) format('woff2-variations'); font-weight:100 900; font-display:block; }
@font-face { font-family:'Plex'; src:url(data:font/woff2;base64,${b64('fonts/ibm-plex-sans-latin-400-normal.woff2')}) format('woff2'); font-weight:400; }
@font-face { font-family:'Plex'; src:url(data:font/woff2;base64,${b64('fonts/ibm-plex-sans-latin-500-normal.woff2')}) format('woff2'); font-weight:500; }
@font-face { font-family:'Plex'; src:url(data:font/woff2;base64,${b64('fonts/ibm-plex-sans-latin-600-normal.woff2')}) format('woff2'); font-weight:600; }
@font-face { font-family:'PlexMono'; src:url(data:font/woff2;base64,${b64('fonts/ibm-plex-mono-latin-400-normal.woff2')}) format('woff2'); font-weight:400; }
@font-face { font-family:'PlexMono'; src:url(data:font/woff2;base64,${b64('fonts/ibm-plex-mono-latin-500-normal.woff2')}) format('woff2'); font-weight:500; }

:root{
  --ink:${TOKENS.ink}; --deep:${TOKENS.deep}; --wash:${TOKENS.wash};
  --line:${TOKENS.line}; --accent:${TOKENS.accent}; --accent-ink:${TOKENS.accentInk};
  --accent-lift:${TOKENS.accentLift};
}
*{box-sizing:border-box;margin:0;padding:0;}
@page{ size:8.5in 11in; margin:0; }
/* The document must be EXACTLY one page wide. Left at the default viewport the
   body is wider than the page box, and Chromium's print layout shrinks the whole
   document to fit, which silently compresses every page vertically. */
html,body{ -webkit-print-color-adjust:exact; print-color-adjust:exact; width:8.5in; }
body{ font-family:'Plex',system-ui,sans-serif; color:var(--ink); font-size:10.6pt; line-height:1.55; }

.page{
  position:relative; width:8.5in; height:11in; overflow:hidden;
  padding:0.72in 0.78in 0.62in; background:#fff; page-break-after:always;
}
.page:last-child{ page-break-after:auto; }
.page.deep{ background:var(--deep); color:#fff; }
.page.wash{ background:var(--wash); }
.grid{ position:absolute; inset:0; width:100%; height:100%; z-index:0; }
/* Page content sits above the grid, so it has to be positioned. This rule is a
   specificity trap: chaining :not() to exempt each absolutely positioned child
   raised its score above the very rules it was meant to defer to, and it
   silently un-absoluted them one by one. The grid dropped into flow and pushed
   the page down; then the footer floated up off the bottom; then the cover's
   dark panel collapsed.
   So absolute children are marked with a class instead. One exemption, scored
   once, and adding a new absolute element cannot re-break the page. */
.page > *:not(.abs){ position:relative; z-index:1; }

/* ── type ─────────────────────────────────────────────────────────── */
.eyebrow{ font-family:'PlexMono',monospace; font-size:7.6pt; font-weight:500;
  letter-spacing:.14em; text-transform:uppercase; color:var(--accent-ink); }
.deep .eyebrow{ color:var(--accent-lift); }
h1{ font-family:'Archivo',sans-serif; font-weight:700; font-size:27pt; line-height:1.06;
  letter-spacing:-.025em; margin:.10in 0 .16in; }
h2{ font-family:'Archivo',sans-serif; font-weight:700; font-size:15pt; line-height:1.18;
  letter-spacing:-.018em; margin:.24in 0 .09in; }
h3{ font-family:'Archivo',sans-serif; font-weight:600; font-size:11.6pt; line-height:1.25;
  letter-spacing:-.012em; margin:0 0 .045in; }
p{ margin:0 0 .105in; }
.lede{ font-size:11.4pt; line-height:1.6; color:#3A3F43; margin-bottom:.2in; }
.deep .lede{ color:rgba(255,255,255,.78); }
.small{ font-size:9pt; color:#5C6266; }
.deep .small{ color:rgba(255,255,255,.62); }
strong{ font-weight:600; }
em{ font-style:italic; }

.rule{ height:2.5px; background:var(--accent); width:.62in; margin:.14in 0 .18in; border-radius:2px; }

/* ── footer ───────────────────────────────────────────────────────── */
.foot{ position:absolute; left:.78in; right:.78in; bottom:.4in; z-index:1;
  display:flex; justify-content:space-between; align-items:baseline;
  font-family:'PlexMono',monospace; font-size:7pt; letter-spacing:.12em;
  text-transform:uppercase; color:#8B9094; border-top:1px solid var(--line); padding-top:.09in; }
.deep .foot{ color:rgba(255,255,255,.45); border-color:rgba(255,255,255,.14); }
.foot b{ color:var(--accent-ink); font-weight:500; }
.deep .foot b{ color:var(--accent-lift); }

/* ── cover ────────────────────────────────────────────────────────── */
.cover{ padding:0; }
.cover .inner{ position:absolute; inset:.34in; border-radius:24px; overflow:hidden;
  background:var(--deep); z-index:1; }
.cover .pad{ position:absolute; inset:0; padding:.62in .66in; z-index:2;
  display:flex; flex-direction:column; }
.cover .cut{ position:absolute; right:-.18in; bottom:0; width:3.85in; z-index:1; opacity:.97; }
.cover h1{ font-size:45pt; line-height:.99; letter-spacing:-.035em; margin:.06in 0 0; color:#fff; }
.cover h1 em{ font-weight:400; }
.cover .sub{ font-size:12pt; line-height:1.45; color:rgba(255,255,255,.72); max-width:3.5in; }
.contact{ font-family:'PlexMono',monospace; font-size:8.4pt; letter-spacing:.02em;
  color:rgba(255,255,255,.66); line-height:1.75; }

/* ── components ───────────────────────────────────────────────────── */
.card{ border:1px solid var(--line); border-radius:12px; padding:.15in .18in; background:#fff; }
.deep .card{ border-color:rgba(255,255,255,.16); background:rgba(255,255,255,.05); }

.callout{ border-radius:12px; padding:.16in .19in; background:var(--wash);
  border-left:3px solid var(--accent); }
.callout.dark{ background:var(--deep); color:#fff; border-left-color:var(--accent-lift); }
.callout .eyebrow{ display:block; margin-bottom:.055in; }
.callout.dark .eyebrow{ color:var(--accent-lift); }
.callout p:last-child{ margin-bottom:0; }

.pull{ border-left:3px solid var(--accent); padding-left:.2in;
  font-family:'Archivo',sans-serif; font-size:14pt; font-weight:500; line-height:1.35;
  letter-spacing:-.015em; }

.step{ display:grid; grid-template-columns:.42in 1fr; gap:.14in; margin-bottom:.14in; }
.step .n{ font-family:'Archivo',sans-serif; font-weight:700; font-size:19pt; color:var(--accent);
  line-height:1; letter-spacing:-.03em; }
.tag{ display:grid; grid-template-columns:.62in 1fr; gap:.1in; align-items:start;
  font-size:9pt; line-height:1.42; margin-top:.05in; }
.tag .k{ font-family:'PlexMono',monospace; font-size:6.8pt; font-weight:500; letter-spacing:.12em;
  text-transform:uppercase; padding:.022in 0 0; }
.tag.miss .k{ color:#8A3A1F; }
.tag.ins  .k{ color:#2B4C7E; }
.tag .v{ color:#3A3F43; }

table{ width:100%; border-collapse:collapse; }
th{ font-family:'PlexMono',monospace; font-size:6.9pt; font-weight:500; letter-spacing:.13em;
  text-transform:uppercase; color:#6B7175; text-align:left; padding:0 .1in .06in 0;
  border-bottom:1.5px solid var(--ink); }
td{ padding:.075in .1in .075in 0; border-bottom:1px solid var(--line); vertical-align:top;
  font-size:9.6pt; line-height:1.42; }
td.k{ font-weight:600; width:1.5in; }
td.num{ font-family:'PlexMono',monospace; font-weight:500; text-align:right;
  font-variant-numeric:tabular-nums; white-space:nowrap; width:1.05in; padding-right:0; }
th.num{ text-align:right; padding-right:0; }

.cols2{ display:grid; grid-template-columns:1fr 1fr; gap:.14in .32in; }
.cols3{ display:grid; grid-template-columns:1fr 1fr 1fr; gap:.14in .2in; }

.check{ font-size:9.1pt; line-height:1.5; display:flex; gap:.085in; align-items:baseline;
  margin-bottom:.035in; }
.check i{ width:7px; height:7px; border:1.2px solid var(--accent); border-radius:1.5px;
  flex:0 0 auto; transform:translateY(1px); }
.grp{ font-family:'Archivo',sans-serif; font-weight:600; font-size:9.6pt; letter-spacing:-.005em;
  color:var(--ink); border-bottom:1px solid var(--line); padding-bottom:.035in;
  margin:0 0 .06in; }

.fill{ border-bottom:1px solid var(--line); height:.235in; }
.fill-k{ font-family:'PlexMono',monospace; font-size:6.8pt; font-weight:500; letter-spacing:.12em;
  text-transform:uppercase; color:#8B9094; }

.toc{ width:100%; border-collapse:collapse; }
.toc td{ border-bottom:1px solid var(--line); padding:.085in 0; vertical-align:baseline; }
.toc .n{ font-family:'PlexMono',monospace; font-weight:500; color:var(--accent-ink);
  width:.42in; font-size:9pt; }
.toc .t{ font-family:'Archivo',sans-serif; font-weight:600; font-size:11pt; letter-spacing:-.012em; }
.toc .d{ text-align:right; font-size:8.4pt; color:#6B7175; }

.chip{ display:inline-block; font-family:'PlexMono',monospace; font-size:6.9pt; font-weight:500;
  letter-spacing:.12em; text-transform:uppercase; color:var(--accent-ink);
  border:1px solid var(--accent); border-radius:99px; padding:.02in .09in; vertical-align:2px; }
.deep .chip{ color:var(--accent-lift); border-color:rgba(217,166,72,.5); }
`;

export function page(inner, { cls = '', grid = null, foot = true, n = null, label = '' } = {}) {
  return `<section class="page ${cls}">
    ${grid ? parcelGrid(grid) : ''}
    ${inner}
    ${foot ? `<div class="foot abs"><span><b>Agent Kidd</b> · Wichita Edition</span><span>${label}${n !== null ? ` · ${String(n).padStart(2, '0')}` : ''}</span></div>` : ''}
  </section>`;
}
