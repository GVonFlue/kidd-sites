/**
 * The buyer guide as an EDITABLE document.
 *
 * 8.5 x 11 portrait pages built with real text boxes, real tables and real
 * shapes — nothing flattened to an image except the parcel-grid background and
 * the photograph. Dropped into Google Drive it opens as Google Slides, where
 * every word, colour and box can be edited, and File > Download > PDF gives the
 * printable version back.
 *
 * That is the whole reason this exists rather than the PDF: the client asked
 * for something he could edit, and a PDF is not that.
 *
 * Words come from content.js. Colours and type come from the site.
 */
import fs from 'node:fs';
import sharp from 'sharp';
import pptxgen from 'pptxgenjs';
import { guide as g } from './content.js';
import { parcelGrid } from './brand.mjs';

const INK = '1A1D1F', DEEP = '16191B', WASH = 'F2F3F3', LINE = 'DCDEDF';
const ACCENT = 'C2832A', ACCENT_INK = '8A5C13', ACCENT_LIFT = 'D9A648';
const MUTED = '5C6266', FAINT = '8B9094';

const DISPLAY = 'Archivo';        // site display face
const BODY = 'IBM Plex Sans';     // site body face
const MONO = 'IBM Plex Mono';     // site eyebrow / figure face

const W = 8.5, H = 11;
const ML = 0.78, MT = 0.66, MR = W - 0.78, CW = W - 1.56;

// ── Parcel grid backgrounds, rasterised once per seed ────────────────────────
async function gridPng(seed, tone) {
  const svg = parcelGrid({ seed, w: 850, h: 1100, depth: 6, tone })
    .replace('<svg class="grid abs"', '<svg xmlns="http://www.w3.org/2000/svg" width="850" height="1100"');
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return 'image/png;base64,' + buf.toString('base64');
}

const cutout = 'image/png;base64,' + fs.readFileSync('justus-cutout.png').toString('base64');

const pres = new pptxgen();
pres.defineLayout({ name: 'LETTER', width: W, height: H });
pres.layout = 'LETTER';
pres.author = 'ProyTech';
pres.title = 'Agent Kidd — First-Time Homebuyer Resource Guide';

const GRIDS = {};
for (const [k, seed, tone] of [['cover', 7, 'dark'], ['a', 3, 'light'], ['b', 5, 'light'], ['c', 13, 'light'], ['d', 23, 'light'], ['e', 17, 'light'], ['deep', 31, 'dark']]) {
  GRIDS[k] = await gridPng(seed, tone);
}

let pageNo = 0;

/** A page. `grid` is a key into GRIDS; `tone` sets the ground. */
function newPage({ tone = 'light', grid = null, label = '', foot = true } = {}) {
  const s = pres.addSlide();
  s.background = { color: tone === 'deep' ? DEEP : tone === 'wash' ? WASH : 'FFFFFF' };
  if (grid) s.addImage({ data: GRIDS[grid], x: 0, y: 0, w: W, h: H });
  if (foot) {
    pageNo += 1;
    const c = tone === 'deep' ? 'FFFFFF' : FAINT;
    s.addShape(pres.ShapeType.line, { x: ML, y: H - 0.62, w: CW, h: 0, line: { color: tone === 'deep' ? '3A3F43' : LINE, width: 0.75 } });
    s.addText(
      [{ text: 'AGENT KIDD', options: { color: tone === 'deep' ? ACCENT_LIFT : ACCENT_INK, bold: true } },
       { text: '  ·  WICHITA EDITION', options: { color: c } }],
      { x: ML, y: H - 0.55, w: CW / 2, h: 0.2, fontFace: MONO, fontSize: 7, charSpacing: 1.2, margin: 0, valign: 'top' },
    );
    s.addText(`${label}${label ? '  ·  ' : ''}${String(pageNo).padStart(2, '0')}`,
      { x: ML + CW / 2, y: H - 0.55, w: CW / 2, h: 0.2, fontFace: MONO, fontSize: 7, charSpacing: 1.2, color: c, align: 'right', margin: 0, valign: 'top' });
  }
  return s;
}

const eyebrow = (s, text, y, o = {}) => s.addText(String(text).toUpperCase(), {
  x: ML, y, w: CW, h: 0.16, fontFace: MONO, fontSize: 7.5, bold: true, charSpacing: 1.6,
  color: o.deep ? ACCENT_LIFT : ACCENT_INK, margin: 0, valign: 'top', ...o,
});

const title = (s, text, y, o = {}) => s.addText(text, {
  x: ML, y, w: o.w || CW, h: o.h || 0.62, fontFace: DISPLAY, fontSize: o.fontSize || 26, bold: true,
  color: o.deep ? 'FFFFFF' : INK, charSpacing: -0.6, lineSpacing: 30, margin: 0, valign: 'top', ...o,
});

const rule = (s, y, o = {}) => s.addShape(pres.ShapeType.rect, {
  x: ML, y, w: 0.62, h: 0.032, fill: { color: o.deep ? ACCENT_LIFT : ACCENT }, line: { width: 0 },
});

/**
 * Eyebrow, title and brass rule as one unit, returning the y to continue at.
 *
 * `lines` is how many lines the title takes. It has to be declared rather than
 * measured, because the renderer here substitutes the brand fonts and a title
 * that fits on one line in this preview can wrap to two in Google Slides. Every
 * two-line title had the rule sitting on top of its second word until this
 * became explicit.
 */
function head(s, eyebrowText, titleText, y, { lines = 1, deep = false, fontSize = 26 } = {}) {
  eyebrow(s, eyebrowText, y, { deep });
  const th = lines * 0.42 + 0.06;
  title(s, titleText, y + 0.22, { deep, fontSize, h: th });
  const ry = y + 0.22 + th + 0.10;
  rule(s, ry, { deep });
  return ry + 0.22;
}

const lede = (s, text, y, o = {}) => s.addText(text, {
  x: ML, y, w: o.w || CW, h: o.h || 0.6, fontFace: BODY, fontSize: 11, color: o.deep ? 'D5D8DA' : '3A3F43',
  lineSpacing: 17, margin: 0, valign: 'top', ...o,
});

const body = (s, text, y, o = {}) => s.addText(text, {
  x: o.x ?? ML, y, w: o.w || CW, h: o.h || 0.4, fontFace: BODY, fontSize: o.fontSize || 9.5,
  color: o.color || INK, lineSpacing: o.lineSpacing || 14, margin: 0, valign: 'top', ...o,
});

/** A tinted callout. Used sparingly and never as an edge stripe. */
function callout(s, label, text, y, { dark = false, h = 0.78 } = {}) {
  s.addShape(pres.ShapeType.roundRect, {
    x: ML, y, w: CW, h, rectRadius: 0.06,
    fill: { color: dark ? DEEP : WASH }, line: { width: 0 },
  });
  s.addText(label.toUpperCase(), { x: ML + 0.18, y: y + 0.13, w: CW - 0.36, h: 0.15, fontFace: MONO, fontSize: 7, bold: true, charSpacing: 1.4, color: dark ? ACCENT_LIFT : ACCENT_INK, margin: 0, valign: 'top' });
  s.addText(text, { x: ML + 0.18, y: y + 0.3, w: CW - 0.36, h: h - 0.4, fontFace: BODY, fontSize: 9.5, color: dark ? 'FFFFFF' : INK, lineSpacing: 14, margin: 0, valign: 'top' });
}

/* ══ 01 Cover ═══════════════════════════════════════════════════════════════ */
{
  const s = newPage({ tone: 'deep', foot: false });
  s.addShape(pres.ShapeType.roundRect, { x: 0.34, y: 0.34, w: W - 0.68, h: H - 0.68, rectRadius: 0.24, fill: { color: DEEP }, line: { width: 0 } });
  s.addImage({ data: GRIDS.cover, x: 0.34, y: 0.34, w: W - 0.68, h: H - 0.68 });
  s.addImage({ data: cutout, x: 4.5, y: 6.55, w: 4.0, h: 4.0, sizing: { type: 'crop', x: 0, y: 0, w: 3.66, h: 4.0 } });

  s.addText('AGENT KIDD', { x: 1.0, y: 0.98, w: 3, h: 0.18, fontFace: MONO, fontSize: 7.5, bold: true, charSpacing: 1.6, color: ACCENT_LIFT, margin: 0, valign: 'top' });
  s.addText('A FREE RESOURCE\nFOR WICHITA BUYERS', { x: 4.5, y: 0.98, w: 3.0, h: 0.4, fontFace: MONO, fontSize: 7.5, charSpacing: 1.4, color: '9AA0A4', align: 'right', lineSpacing: 12, margin: 0, valign: 'top' });

  s.addText(g.cover.kicker, { x: 1.0, y: 2.55, w: 5, h: 0.18, fontFace: MONO, fontSize: 8, bold: true, charSpacing: 2, color: ACCENT_LIFT, margin: 0, valign: 'top' });
  s.addText([
    { text: g.cover.title, options: { bold: true, breakLine: true } },
    { text: g.cover.titleItalic, options: { bold: false, italic: true } },
  ], { x: 1.0, y: 2.78, w: 6.2, h: 1.5, fontFace: DISPLAY, fontSize: 42, color: 'FFFFFF', charSpacing: -1.4, lineSpacing: 44, margin: 0, valign: 'top' });
  s.addShape(pres.ShapeType.rect, { x: 1.0, y: 4.42, w: 0.62, h: 0.035, fill: { color: ACCENT_LIFT }, line: { width: 0 } });
  s.addText(g.cover.sub, { x: 1.0, y: 4.66, w: 3.6, h: 0.6, fontFace: BODY, fontSize: 12, color: 'C9CDCF', lineSpacing: 18, margin: 0, valign: 'top' });
  s.addText(g.edition, { x: 1.0, y: 5.32, w: 4, h: 0.18, fontFace: MONO, fontSize: 7.5, bold: true, charSpacing: 1.6, color: '9AA0A4', margin: 0, valign: 'top' });

  s.addText(g.name, { x: 1.0, y: 8.5, w: 3.4, h: 0.32, fontFace: DISPLAY, fontSize: 15, bold: true, color: 'FFFFFF', charSpacing: -0.3, margin: 0, valign: 'top' });
  s.addText(g.role, { x: 1.0, y: 8.84, w: 3.4, h: 0.18, fontFace: MONO, fontSize: 7.5, bold: true, charSpacing: 1.4, color: ACCENT_LIFT, margin: 0, valign: 'top' });
  s.addText(`${g.phone}\n${g.email}\n${g.city} · ${g.licence}`, { x: 1.0, y: 9.1, w: 3.4, h: 0.7, fontFace: MONO, fontSize: 8.5, color: 'A9AEB1', lineSpacing: 14, margin: 0, valign: 'top' });
}

/* ══ 02 Letter ══════════════════════════════════════════════════════════════ */
{
  const s = newPage({ label: 'A letter to start' });
  let y = head(s, g.letter.eyebrow, g.letter.heading, MT);
  // Generous fixed slots. The letter is the one page where a paragraph running
  // into the next one would be most obvious, and least forgivable.
  const SLOT = [0.86, 0.98, 0.98, 0.68, 0.68, 0.86, 0.32];
  g.letter.paras.forEach((p, i) => {
    const h = SLOT[i] ?? 0.8;
    if (i === 0) lede(s, p, y, { h });
    else body(s, p, y, { h, fontSize: 9.8, lineSpacing: 14.5 });
    y += h + 0.06;
  });
  s.addText(g.letter.sign, { x: ML, y: y + 0.05, w: 3, h: 0.4, fontFace: DISPLAY, fontSize: 19, bold: true, italic: true, color: INK, margin: 0, valign: 'top' });
}

/* ══ 03 Contents ════════════════════════════════════════════════════════════ */
{
  const s = newPage({ label: "What's inside" });
  const hy = head(s, 'The guide', "What's inside", MT);
  s.addTable(
    g.contents.map(([a, b, c]) => ([
      { text: a, options: { fontFace: MONO, fontSize: 9, bold: true, color: ACCENT_INK, valign: 'middle' } },
      { text: b, options: { fontFace: DISPLAY, fontSize: 11, bold: true, color: INK, valign: 'middle' } },
      { text: c, options: { fontFace: BODY, fontSize: 8.5, color: MUTED, align: 'right', valign: 'middle' } },
    ])),
    { x: ML, y: hy, w: CW, colW: [0.45, 4.0, CW - 4.45], rowH: 0.38, border: [{ type: 'none' }, { type: 'none' }, { pt: 0.5, color: LINE }, { type: 'none' }], margin: [4, 2, 4, 0] },
  );
  const py = hy + g.contents.length * 0.38 + 0.45;
  s.addShape(pres.ShapeType.rect, { x: ML, y: py, w: 0.035, h: 0.62, fill: { color: ACCENT }, line: { width: 0 } });
  s.addText('Read it, mark it up, bring your questions. That is the whole point.', { x: ML + 0.22, y: py, w: CW - 0.3, h: 0.62, fontFace: DISPLAY, fontSize: 14, color: INK, charSpacing: -0.3, lineSpacing: 20, margin: 0, valign: 'top' });
}

/* ══ 04-05 Section 01, the nine steps ═══════════════════════════════════════ */
/**
 * One step, in a FIXED slot.
 *
 * The first version computed each block's height from the character count. That
 * is a guess about the renderer's font metrics, and it was wrong often enough
 * that step bodies ran straight through the MISTAKE row below them. A fixed
 * slot cannot collide with the next one, and it also survives the client
 * editing the text in Slides, which the estimate never would have.
 */
const STEP_H = 1.6;
function stepBlock(s, [t, text, mistake, insider], i, y) {
  const x = ML + 0.46, w = CW - 0.46;
  s.addText(String(i + 1), { x: ML, y: y - 0.02, w: 0.4, h: 0.32, fontFace: DISPLAY, fontSize: 18, bold: true, color: ACCENT, charSpacing: -0.5, margin: 0, valign: 'top' });
  s.addText(t, { x, y, w, h: 0.2, fontFace: DISPLAY, fontSize: 11.5, bold: true, color: INK, charSpacing: -0.2, margin: 0, valign: 'top' });
  s.addText(text, { x, y: y + 0.23, w, h: 0.56, fontFace: BODY, fontSize: 9.4, color: INK, lineSpacing: 13.5, margin: 0, valign: 'top' });
  const rows = [['Mistake', mistake, '8A3A1F'], ['Insider', insider, '2B4C7E']].filter(([, v]) => v);
  rows.forEach(([k, v, col], r) => {
    const yy = y + 0.84 + r * 0.36;
    s.addText(k.toUpperCase(), { x, y: yy + 0.015, w: 0.62, h: 0.15, fontFace: MONO, fontSize: 6.6, bold: true, charSpacing: 1.1, color: col, margin: 0, valign: 'top' });
    s.addText(v, { x: x + 0.68, y: yy, w: w - 0.68, h: 0.34, fontFace: BODY, fontSize: 8.7, color: '3A3F43', lineSpacing: 12.5, margin: 0, valign: 'top' });
  });
  return y + STEP_H;
}
{
  const s = newPage({ label: 'The process', grid: 'a' });
  const hy = head(s, 'Section 01', 'Understanding the homebuying process', MT, { lines: 2 });
  lede(s, 'Nine steps. That is it. It feels like a hundred because they happen fast and the words are unfamiliar, but the path is the same for almost everyone. Here is exactly what happens, where people trip, and what I would tell you if I were standing next to you.', hy, { h: 0.72 });
  let y = hy + 0.82;
  g.steps.slice(0, 4).forEach((st, i) => { y = stepBlock(s, st, i, y); });
}
{
  const s = newPage({ label: 'The process' });
  let y = MT;
  g.steps.slice(4).forEach((st, i) => { y = stepBlock(s, st, i + 4, y); });
  callout(s, 'The whole thing', 'From pre-approval to keys, a smooth purchase usually runs thirty to forty-five days once you are under contract. It is a sprint with a few waiting rooms, and you do not run it alone.', y + 0.15, { dark: true, h: 0.82 });
}

/* ══ 06 Section 02, the numbers ═════════════════════════════════════════════ */
{
  const s = newPage({ label: 'The numbers', grid: 'b' });
  const hy = head(s, 'Section 02', 'The real cost of buying a home', MT, { lines: 2 });
  lede(s, 'The sticker price is the part everyone talks about. It is the costs around it that blindside people. Let us put all of them on the table so nothing surprises you at the worst possible moment.', hy, { h: 0.55 });
  s.addText('The money buckets', { x: ML, y: hy + 0.66, w: CW, h: 0.28, fontFace: DISPLAY, fontSize: 14, bold: true, color: INK, charSpacing: -0.3, margin: 0, valign: 'top' });
  s.addTable([
    [{ text: 'COST', options: { fontFace: MONO, fontSize: 6.8, bold: true, charSpacing: 1.2, color: MUTED } },
     { text: 'WHAT IT IS', options: { fontFace: MONO, fontSize: 6.8, bold: true, charSpacing: 1.2, color: MUTED } },
     { text: 'BALLPARK', options: { fontFace: MONO, fontSize: 6.8, bold: true, charSpacing: 1.2, color: MUTED, align: 'right' } }],
    ...g.costTable.map(([a, b, c]) => ([
      { text: a, options: { fontFace: BODY, fontSize: 9.4, bold: true, color: INK, valign: 'middle' } },
      { text: b, options: { fontFace: BODY, fontSize: 9.2, color: INK, valign: 'middle' } },
      { text: c, options: { fontFace: MONO, fontSize: 9.2, bold: true, color: INK, align: 'right', valign: 'middle' } },
    ])),
  ], { x: ML, y: hy + 1.02, w: CW, colW: [1.5, CW - 1.5 - 1.15, 1.15], rowH: 0.34, border: [{ type: 'none' }, { type: 'none' }, { pt: 0.5, color: LINE }, { type: 'none' }], margin: [4, 4, 4, 0] });
  const ty = hy + 1.02 + (g.costTable.length + 1) * 0.34 + 0.28;
  callout(s, 'A Wichita reality check', 'Wichita is one of the more affordable mid-size markets in the country, which is good news for a first purchase. Treat the figures above as planning ballparks. For real numbers on a specific house, text me and I will run them with you.', ty, { h: 0.92 });
  callout(s, 'The two myths that stop people', 'That you need twenty percent down, and that you need perfect credit. Neither is true. Plenty of buyers get in for far less, and we can often get the seller to help with closing costs as well.', ty + 1.06, { dark: true, h: 0.82 });
}

/* ══ 07 Section 03, the loans ═══════════════════════════════════════════════ */
{
  const s = newPage({ label: 'The loans' });
  const hy = head(s, 'Section 03', 'Mortgages made simple', MT);
  lede(s, 'Four main doors into a home loan. You only need to walk through one. Here is who each is built for, in plain English.', hy, { h: 0.4 });
  let y = hy + 0.54;
  for (const [name, tag, text, best] of g.loans) {
    const h = 1.52;
    s.addShape(pres.ShapeType.roundRect, { x: ML, y, w: CW, h, rectRadius: 0.06, fill: { color: 'FFFFFF' }, line: { color: LINE, width: 0.75 } });
    s.addText(name, { x: ML + 0.2, y: y + 0.14, w: 3, h: 0.28, fontFace: DISPLAY, fontSize: 13, bold: true, color: INK, charSpacing: -0.3, margin: 0, valign: 'top' });
    s.addText(tag.toUpperCase(), { x: MR - 2.4, y: y + 0.19, w: 2.2, h: 0.18, fontFace: MONO, fontSize: 6.6, bold: true, charSpacing: 1.2, color: ACCENT_INK, align: 'right', margin: 0, valign: 'top' });
    s.addText(text, { x: ML + 0.2, y: y + 0.46, w: CW - 0.4, h: 0.6, fontFace: BODY, fontSize: 9.2, color: INK, lineSpacing: 13, margin: 0, valign: 'top' });
    s.addText([{ text: 'BEST FOR   ', options: { fontFace: MONO, fontSize: 6.8, bold: true, charSpacing: 1.2, color: ACCENT_INK } },
               { text: best, options: { fontFace: BODY, fontSize: 8.8, color: '3A3F43' } }],
      { x: ML + 0.2, y: y + 1.1, w: CW - 0.4, h: 0.32, lineSpacing: 12, margin: 0, valign: 'top' });
    y += h + 0.16;
  }
}

/* ══ 08 Decoder ═════════════════════════════════════════════════════════════ */
{
  const s = newPage({ label: 'The words' });
  const hy = head(s, 'Decoder', 'The words that scare people', MT);
  const colW = (CW - 0.34) / 2;
  g.decoder.forEach(([term, def], i) => {
    const x = ML + (i % 2) * (colW + 0.34);
    const y = hy + Math.floor(i / 2) * 1.04;
    s.addText(term, { x, y, w: colW, h: 0.2, fontFace: DISPLAY, fontSize: 10.5, bold: true, color: INK, charSpacing: -0.2, margin: 0, valign: 'top' });
    s.addText(def, { x, y: y + 0.22, w: colW, h: 0.72, fontFace: BODY, fontSize: 8.8, color: MUTED, lineSpacing: 12.5, margin: 0, valign: 'top' });
  });
  const py = hy + Math.ceil(g.decoder.length / 2) * 1.04 + 0.28;
  s.addShape(pres.ShapeType.rect, { x: ML, y: py, w: 0.035, h: 0.66, fill: { color: ACCENT }, line: { width: 0 } });
  s.addText('You do not need to memorise any of this. You need someone who will explain it the night before you sign, and mean it.', { x: ML + 0.22, y: py, w: CW - 0.3, h: 0.66, fontFace: DISPLAY, fontSize: 14, color: INK, charSpacing: -0.3, lineSpacing: 20, margin: 0, valign: 'top' });
  callout(s, 'My honest take', 'The best loan is not a trophy. It is the one that fits your life, your cash and your timeline. We work that out together with a lender, and it costs nothing to ask the question.', py + 0.92, { h: 0.8 });
}

/* ══ 09 Section 04, the map ═════════════════════════════════════════════════ */
{
  const s = newPage({ label: 'The map', grid: 'c' });
  const hy = head(s, 'Section 04', 'Where you might look in Wichita', MT, { lines: 2 });
  lede(s, 'Where you live shapes your day more than the house does. Below is the factual version of each area: what the housing stock is like, roughly where it sits, and which district it is in.', hy, { h: 0.52 });
  callout(s, 'How to use this section', 'I am not going to tell you which area is "good", which schools are "great", or who lives where. Not because I am being cagey, but because those are exactly the statements a licensed agent is not permitted to make, and honestly they are opinions dressed as facts. What I will do is drive them with you, at rush hour and after dark, and point you at the public data so you can judge for yourself.', hy + 0.62, { h: 1.16 });
  s.addTable([
    [{ text: 'AREA', options: { fontFace: MONO, fontSize: 6.8, bold: true, charSpacing: 1.2, color: MUTED } },
     { text: 'WHAT IS THERE', options: { fontFace: MONO, fontSize: 6.8, bold: true, charSpacing: 1.2, color: MUTED } },
     { text: 'SCHOOL DISTRICT', options: { fontFace: MONO, fontSize: 6.8, bold: true, charSpacing: 1.2, color: MUTED } }],
    ...g.areas.map(([a, d, sc]) => ([
      { text: a, options: { fontFace: BODY, fontSize: 9.2, bold: true, color: INK, valign: 'top' } },
      { text: d, options: { fontFace: BODY, fontSize: 8.6, color: INK, valign: 'top' } },
      { text: sc, options: { fontFace: BODY, fontSize: 8.4, color: '3A3F43', valign: 'top' } },
    ])),
  ], { x: ML, y: hy + 1.94, w: CW, colW: [1.15, CW - 1.15 - 1.65, 1.65], rowH: 0.44, border: [{ type: 'none' }, { type: 'none' }, { pt: 0.5, color: LINE }, { type: 'none' }], margin: [5, 4, 5, 0] });
  s.addText('District boundaries do not follow city lines and can change. Confirm the district for any specific address before you make a decision based on it.', { x: ML, y: hy + 1.94 + 9 * 0.44 + 0.16, w: CW, h: 0.3, fontFace: BODY, fontSize: 8.4, italic: true, color: MUTED, lineSpacing: 12, margin: 0, valign: 'top' });
}

/* ══ 10 Section 05, the checklist ═══════════════════════════════════════════ */
{
  const s = newPage({ label: 'The checklist' });
  const hy = head(s, 'Section 05', 'My home tour checklist', MT);
  s.addText('PRINT ME', { x: ML, y: MT, w: CW, h: 0.16, fontFace: MONO, fontSize: 7.5, bold: true, charSpacing: 1.6, color: ACCENT_INK, align: 'right', margin: 0, valign: 'top' });
  lede(s, 'Print this page and bring it to every showing. It will not replace a real inspection, but it will help you spot the expensive things early. I built it out of the repairs I actually pay for across the properties I manage.', MT + 1.12, { h: 0.55 });
  const groups = Object.entries(g.checklist);
  const colW = (CW - 0.4) / 2;
  let y = [hy + 0.74, hy + 0.74];
  groups.forEach(([grp, items], i) => {
    const col = i % 2, x = ML + col * (colW + 0.4);
    s.addText(grp, { x, y: y[col], w: colW, h: 0.2, fontFace: DISPLAY, fontSize: 9.8, bold: true, color: INK, margin: 0, valign: 'top' });
    s.addShape(pres.ShapeType.line, { x, y: y[col] + 0.2, w: colW, h: 0, line: { color: LINE, width: 0.75 } });
    let yy = y[col] + 0.26;
    items.forEach((it) => {
      s.addShape(pres.ShapeType.rect, { x, y: yy + 0.045, w: 0.075, h: 0.075, fill: { color: 'FFFFFF' }, line: { color: ACCENT, width: 0.75 } });
      s.addText(it, { x: x + 0.16, y: yy, w: colW - 0.16, h: 0.17, fontFace: BODY, fontSize: 8.8, color: INK, margin: 0, valign: 'top' });
      yy += 0.175;
    });
    y[col] = yy + 0.17;
  });
}

/* ══ 11 Section 06, ownership ═══════════════════════════════════════════════ */
{
  const s = newPage({ label: 'The ownership cost', grid: 'd' });
  const hy = head(s, 'Section 06', g.ownership.heading, MT);
  lede(s, g.ownership.lede, hy, { h: 0.78 });
  let y = hy + 0.92;
  // Fixed slots, same reason as the steps: an estimated height is a guess about
  // font metrics, and the guess collides with the block underneath.
  for (const [h, txt] of g.ownership.points) {
    s.addText(h, { x: ML, y, w: CW, h: 0.2, fontFace: DISPLAY, fontSize: 11.2, bold: true, color: INK, charSpacing: -0.2, margin: 0, valign: 'top' });
    s.addText(txt, { x: ML, y: y + 0.23, w: CW, h: 0.6, fontFace: BODY, fontSize: 9.4, color: INK, lineSpacing: 13.5, margin: 0, valign: 'top' });
    y += 0.98;
  }
  callout(s, 'Why this section exists', 'Most buyer guides stop at closing day because most agents do. I manage more than 500 doors and seven homeowner associations in this city, so I see the second half of the story every month. That is the part I can tell you about that nobody else in this market can.', y + 0.05, { dark: true, h: 0.9 });
}

/* ══ 12 Section 07 ══════════════════════════════════════════════════════════ */
{
  const s = newPage({ label: 'Between the lines' });
  const hy = head(s, 'Section 07', 'Things nobody tells first-time buyers', MT, { lines: 2 });
  lede(s, 'The stuff that does not fit in a brochure but absolutely should. Read this twice.', hy, { h: 0.3 });
  let y = hy + 0.48;
  g.nobody.forEach(([h, txt], i) => {
    s.addText(String(i + 1).padStart(2, '0'), { x: ML, y: y - 0.02, w: 0.4, h: 0.3, fontFace: DISPLAY, fontSize: 15, bold: true, color: ACCENT, charSpacing: -0.4, margin: 0, valign: 'top' });
    s.addText(h, { x: ML + 0.46, y, w: CW - 0.46, h: 0.2, fontFace: DISPLAY, fontSize: 11.2, bold: true, color: INK, charSpacing: -0.2, margin: 0, valign: 'top' });
    s.addText(txt, { x: ML + 0.46, y: y + 0.23, w: CW - 0.46, h: 0.6, fontFace: BODY, fontSize: 9.2, color: '3A3F43', lineSpacing: 13.5, margin: 0, valign: 'top' });
    y += 1.0;
  });
}

/* ══ 13 Section 08, vendors ═════════════════════════════════════════════════ */
{
  const s = newPage({ label: 'Your team' });
  const hy = head(s, 'Section 08', 'Local resources I trust', MT);
  lede(s, 'You do not buy a house alone, you buy it with a team. These are the people I vouch for. We fill these in together and you have my whole bench in one place.', hy, { h: 0.5 });
  const colW = (CW - 0.32) / 2, cardH = 2.05;
  g.vendors.forEach(([label, fields], i) => {
    const x = ML + (i % 2) * (colW + 0.32);
    const y = hy + 0.7 + Math.floor(i / 2) * (cardH + 0.28);
    s.addShape(pres.ShapeType.roundRect, { x, y, w: colW, h: cardH, rectRadius: 0.06, fill: { color: 'FFFFFF' }, line: { color: LINE, width: 0.75 } });
    s.addText(label, { x: x + 0.18, y: y + 0.15, w: colW - 0.36, h: 0.16, fontFace: MONO, fontSize: 6.8, bold: true, charSpacing: 1.3, color: ACCENT_INK, margin: 0, valign: 'top' });
    fields.forEach((f, k) => {
      const fy = y + 0.42 + k * 0.31;
      s.addText(f.toUpperCase(), { x: x + 0.18, y: fy, w: 0.9, h: 0.14, fontFace: MONO, fontSize: 6.2, bold: true, charSpacing: 1, color: FAINT, margin: 0, valign: 'top' });
      s.addShape(pres.ShapeType.line, { x: x + 0.18, y: fy + 0.22, w: colW - 0.36, h: 0, line: { color: LINE, width: 0.75 } });
    });
  });
  callout(s, 'A quick word on referrals', 'These people are on this list because they do good work and treat my clients right. If one of them ever lets you down, I want to hear about it.', hy + 0.7 + 2 * (cardH + 0.28) + 0.12, { h: 0.72 });
}

/* ══ 14 Trades ══════════════════════════════════════════════════════════════ */
{
  const s = newPage({ label: 'Your team' });
  const hy = head(s, 'After you move in', 'The trades worth keeping on speed dial', MT, { lines: 2 });
  lede(s, 'The day something breaks you do not want to be reading reviews. This is the short list, and it is the most useful page in here once you own the place.', hy, { h: 0.5 });
  const colW = (CW - 0.44) / 3, cardH = 1.6;
  g.trades.forEach((tr, i) => {
    const x = ML + (i % 3) * (colW + 0.22);
    const y = hy + 0.68 + Math.floor(i / 3) * (cardH + 0.24);
    s.addShape(pres.ShapeType.roundRect, { x, y, w: colW, h: cardH, rectRadius: 0.06, fill: { color: 'FFFFFF' }, line: { color: LINE, width: 0.75 } });
    s.addText(tr, { x: x + 0.15, y: y + 0.14, w: colW - 0.3, h: 0.16, fontFace: MONO, fontSize: 6.8, bold: true, charSpacing: 1.3, color: ACCENT_INK, margin: 0, valign: 'top' });
    ['Name', 'Phone', 'Notes'].forEach((f, k) => {
      const fy = y + 0.42 + k * 0.37;
      s.addText(f.toUpperCase(), { x: x + 0.15, y: fy, w: 0.8, h: 0.14, fontFace: MONO, fontSize: 6.2, bold: true, charSpacing: 1, color: FAINT, margin: 0, valign: 'top' });
      s.addShape(pres.ShapeType.line, { x: x + 0.15, y: fy + 0.24, w: colW - 0.3, h: 0, line: { color: LINE, width: 0.75 } });
    });
  });
  callout(s, 'Why this matters', "A good agent's real value shows up after the sale. Anyone can unlock a door. The people in your corner when the furnace quits in January are the difference, and this list is yours to keep.", hy + 0.68 + 2 * (cardH + 0.24) + 0.2, { dark: true, h: 0.82 });
}

/* ══ 15 Section 09, moving ══════════════════════════════════════════════════ */
{
  const s = newPage({ label: 'Moving day' });
  const hy = head(s, 'Section 09', 'Moving day survival guide', MT);
  lede(s, 'The keys are yours. Now let us get you in without losing your mind.', hy, { h: 0.3 });
  s.addText('The timeline', { x: ML, y: hy + 0.44, w: CW, h: 0.26, fontFace: DISPLAY, fontSize: 13, bold: true, color: INK, margin: 0, valign: 'top' });
  g.moving.timeline.forEach(([when, what], i) => {
    const y = hy + 0.8 + i * 0.34;
    s.addText(when, { x: ML, y: y + 0.015, w: 1.2, h: 0.16, fontFace: MONO, fontSize: 6.8, bold: true, charSpacing: 1.1, color: ACCENT_INK, margin: 0, valign: 'top' });
    s.addText(what, { x: ML + 1.3, y, w: CW - 1.3, h: 0.3, fontFace: BODY, fontSize: 9.2, color: INK, lineSpacing: 13, margin: 0, valign: 'top' });
  });
  const colW = (CW - 0.4) / 2;
  const listY = hy + 0.8 + g.moving.timeline.length * 0.34 + 0.3;
  const drawList = (heading, items, x, y) => {
    s.addText(heading, { x, y, w: colW, h: 0.2, fontFace: DISPLAY, fontSize: 9.8, bold: true, color: INK, margin: 0, valign: 'top' });
    s.addShape(pres.ShapeType.line, { x, y: y + 0.2, w: colW, h: 0, line: { color: LINE, width: 0.75 } });
    items.forEach((it, k) => {
      const yy = y + 0.28 + k * 0.19;
      s.addShape(pres.ShapeType.rect, { x, y: yy + 0.045, w: 0.075, h: 0.075, fill: { color: 'FFFFFF' }, line: { color: ACCENT, width: 0.75 } });
      s.addText(it, { x: x + 0.16, y: yy, w: colW - 0.16, h: 0.18, fontFace: BODY, fontSize: 8.8, color: INK, margin: 0, valign: 'top' });
    });
    return y + 0.28 + items.length * 0.19 + 0.2;
  };
  const after = drawList('Utility transfers', g.moving.utilities, ML, listY);
  drawList('Packing', g.moving.packing, ML, after);
  drawList('Change of address', g.moving.address, ML + colW + 0.4, listY);
}

/* ══ 16 Why work with me ════════════════════════════════════════════════════ */
{
  const s = newPage({ label: 'The person', grid: 'e' });

  const hy = head(s, 'No pitch, just honest', g.why.heading, MT);
  lede(s, g.why.lede, hy, { h: 0.5 });
  const colW = (CW - 0.4) / 2;
  g.why.cols.forEach(([h, txt], i) => {
    const x = ML + (i % 2) * (colW + 0.4);
    const y = hy + 0.7 + Math.floor(i / 2) * 1.36;
    s.addText(h, { x, y, w: colW, h: 0.22, fontFace: DISPLAY, fontSize: 11.2, bold: true, color: INK, charSpacing: -0.2, margin: 0, valign: 'top' });
    s.addText(txt, { x, y: y + 0.26, w: colW, h: 0.98, fontFace: BODY, fontSize: 9.2, color: '3A3F43', lineSpacing: 13.5, margin: 0, valign: 'top' });
  });
  const py = hy + 0.7 + 2 * 1.36 + 0.12;
  s.addShape(pres.ShapeType.rect, { x: ML, y: py, w: 0.035, h: 0.66, fill: { color: ACCENT }, line: { width: 0 } });
  s.addText(g.why.pull, { x: ML + 0.22, y: py, w: CW - 0.3, h: 0.66, fontFace: DISPLAY, fontSize: 14, color: INK, charSpacing: -0.3, lineSpacing: 20, margin: 0, valign: 'top' });
  s.addText(g.why.close, { x: ML, y: py + 0.86, w: CW, h: 0.7, fontFace: BODY, fontSize: 9.6, color: INK, lineSpacing: 14, margin: 0, valign: 'top' });
}

/* ══ 17 Next move ══════════════════════════════════════════════════════════ */
{
  const s = newPage({ tone: 'deep', grid: 'deep', label: 'Your next move' });
  const hy = head(s, g.next.kicker, g.next.heading, MT, { deep: true, fontSize: 29, lines: 2 });
  lede(s, g.next.body, hy, { deep: true, w: 4.8, h: 0.6 });
  const colW = (CW - 0.5) / 3;
  g.next.steps.forEach(([h, txt], i) => {
    const x = ML + i * (colW + 0.25);
    s.addText(String(i + 1).padStart(2, '0'), { x, y: hy + 1.08, w: colW, h: 0.36, fontFace: DISPLAY, fontSize: 17, bold: true, color: ACCENT_LIFT, charSpacing: -0.5, margin: 0, valign: 'top' });
    s.addText(h, { x, y: hy + 1.48, w: colW, h: 0.22, fontFace: DISPLAY, fontSize: 11, bold: true, color: 'FFFFFF', margin: 0, valign: 'top' });
    s.addText(txt, { x, y: hy + 1.74, w: colW, h: 0.85, fontFace: BODY, fontSize: 8.8, color: 'B9BEC1', lineSpacing: 12.5, margin: 0, valign: 'top' });
  });
  s.addShape(pres.ShapeType.line, { x: ML, y: hy + 3.08, w: CW, h: 0, line: { color: '3A3F43', width: 0.75 } });
  s.addText(g.name, { x: ML, y: hy + 3.33, w: 4, h: 0.34, fontFace: DISPLAY, fontSize: 17, bold: true, color: 'FFFFFF', charSpacing: -0.3, margin: 0, valign: 'top' });
  s.addText(g.role, { x: ML, y: hy + 3.7, w: 4, h: 0.18, fontFace: MONO, fontSize: 7.5, bold: true, charSpacing: 1.4, color: ACCENT_LIFT, margin: 0, valign: 'top' });
  s.addText(`${g.phone}  ·  ${g.email}\n${g.city}  ·  ${g.licence}`, { x: ML, y: hy + 3.98, w: 5, h: 0.5, fontFace: MONO, fontSize: 9, color: 'A9AEB1', lineSpacing: 14, margin: 0, valign: 'top' });
  s.addText('Equal Housing Opportunity. Justus Kidd is a licensed real estate salesperson in Kansas, licence 251163, brokered by Real Broker, LLC. This guide is general information, not legal, tax or financial advice.',
    { x: ML, y: H - 1.15, w: CW, h: 0.4, fontFace: BODY, fontSize: 7.2, color: '787E82', lineSpacing: 10, margin: 0, valign: 'top' });
}

/* ══ 18 Before you publish ═════════════════════════════════════════════════ */
{
  const s = newPage({ tone: 'wash', label: 'Internal' });
  s.addText('INTERNAL — DELETE THIS PAGE BEFORE THIS GOES TO ANYONE', { x: ML, y: MT, w: CW, h: 0.18, fontFace: MONO, fontSize: 7.5, bold: true, charSpacing: 1.4, color: '8A3A1F', margin: 0, valign: 'top' });
  title(s, 'Before you publish', MT + 0.24);
  rule(s, MT + 0.94);
  lede(s, 'Nothing in this guide is invented, and nothing about Justus is claimed that the site does not already stand behind. These are the items that still need a human to confirm them.', MT + 1.14, { h: 0.5 });
  let y = MT + 1.8;
  g.verify.forEach((x, i) => {
    s.addText(String(i + 1).padStart(2, '0'), { x: ML, y, w: 0.4, h: 0.26, fontFace: DISPLAY, fontSize: 13, bold: true, color: ACCENT, margin: 0, valign: 'top' });
    s.addText(x, { x: ML + 0.46, y, w: CW - 0.46, h: 0.5, fontFace: BODY, fontSize: 9.2, color: INK, lineSpacing: 13.5, margin: 0, valign: 'top' });
    y += 0.62;
  });
}

await pres.writeFile({ fileName: 'AgentKidd_Homebuyer_Guide_EDITABLE.pptx' });
console.log('written');
