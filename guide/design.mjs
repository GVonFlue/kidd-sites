/**
 * Lays the guide out page by page in the Agent Kidd identity and renders it to
 * PDF through headless Chromium.
 *
 * The words come from content.js and are unchanged. This file is only design.
 */
import fs from 'node:fs';
import { chromium } from 'playwright';
import { guide as g } from './content.js';
import { CSS, page, parcelGrid } from './brand.mjs';

const cutout = 'data:image/png;base64,' + fs.readFileSync('justus-cutout.png').toString('base64');
const P = [];
let n = 0;
const add = (inner, o = {}) => { n += 1; P.push(page(inner, { ...o, n })); };

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

/* ── 01 Cover ─────────────────────────────────────────────────────────────── */
P.push(`<section class="page cover">
  <div class="inner abs">
    ${parcelGrid({ seed: 7, w: 900, h: 1250, depth: 6, tone: 'dark', markOpacity: 0.09 })}
    <img class="cut" src="${cutout}" alt="">
  </div>
  <div class="pad abs" style="padding:.96in 1.0in">
    <div style="display:flex;justify-content:space-between;align-items:flex-start">
      <span class="eyebrow" style="color:#D9A648">Agent Kidd</span>
      <span class="eyebrow" style="color:rgba(255,255,255,.5);text-align:right">A free resource<br>for Wichita buyers</span>
    </div>
    <div style="margin-top:1.55in">
      <span class="eyebrow" style="color:#D9A648">${g.cover.kicker}</span>
      <h1>${g.cover.title}<br><em>${g.cover.titleItalic}</em></h1>
      <div class="rule"></div>
      <p class="sub">${esc(g.cover.sub)}</p>
      <p class="eyebrow" style="color:rgba(255,255,255,.55);margin-top:.16in">${g.edition}</p>
    </div>
    <div style="margin-top:auto;max-width:3.1in">
      <p style="font-family:'Archivo';font-weight:700;font-size:15pt;letter-spacing:-.02em;color:#fff;margin-bottom:.03in">${g.name}</p>
      <p class="eyebrow" style="color:#D9A648;margin-bottom:.07in">${g.role}</p>
      <p class="contact">${g.phone}<br>${g.email}<br>${g.city} · ${g.licence}</p>
    </div>
  </div>
</section>`);

/* ── 02 Letter ────────────────────────────────────────────────────────────── */
add(`
  <span class="eyebrow">${g.letter.eyebrow}</span>
  <h1>${esc(g.letter.heading)}</h1>
  <div class="rule"></div>
  ${g.letter.paras.map((x, i) => `<p${i === 0 ? ' class="lede"' : ''}>${esc(x)}</p>`).join('')}
  <p style="font-family:'Archivo';font-weight:600;font-size:19pt;letter-spacing:-.02em;margin-top:.16in">${g.letter.sign}</p>
`, { label: 'A letter to start' });

/* ── 03 Contents ──────────────────────────────────────────────────────────── */
add(`
  <span class="eyebrow">The guide</span>
  <h1>What&rsquo;s inside</h1>
  <div class="rule"></div>
  <table class="toc">${g.contents.map(([a, b, c]) => `<tr><td class="n">${a}</td><td class="t">${esc(b)}</td><td class="d">${esc(c)}</td></tr>`).join('')}</table>
  <div style="margin-top:.42in"><p class="pull">Read it, mark it up, bring your questions. That is the whole point.</p></div>
`, { label: "What's inside" });

/* ── 04-06 Section 01, the nine steps ─────────────────────────────────────── */
const stepHtml = ([title, text, mistake, insider], i) => `
  <div class="step">
    <div class="n">${i + 1}</div>
    <div>
      <h3>${esc(title)}</h3>
      <p style="font-size:9.8pt;margin-bottom:.04in">${esc(text)}</p>
      ${mistake ? `<div class="tag miss"><span class="k">Mistake</span><span class="v">${esc(mistake)}</span></div>` : ''}
      ${insider ? `<div class="tag ins"><span class="k">Insider</span><span class="v">${esc(insider)}</span></div>` : ''}
    </div>
  </div>`;

add(`
  <span class="eyebrow">Section 01</span>
  <h1>Understanding the homebuying process</h1>
  <div class="rule"></div>
  <p class="lede">Nine steps. That is it. It feels like a hundred because they happen fast and the words are unfamiliar, but the path is the same for almost everyone. Here is exactly what happens, where people trip, and what I would tell you if I were standing next to you.</p>
  ${g.steps.slice(0, 4).map(stepHtml).join('')}
`, { label: 'The process', grid: { seed: 3, w: 1200, h: 1550 } });

add(`
  ${g.steps.slice(4).map((s, i) => stepHtml(s, i + 4)).join('')}
  <div style="margin-top:.2in">
    <div class="callout dark">
      <span class="eyebrow">The whole thing</span>
      <p>From pre-approval to keys, a smooth purchase usually runs <strong>thirty to forty-five days</strong> once you are under contract. It is a sprint with a few waiting rooms, and you do not run it alone.</p>
    </div>
  </div>
`, { label: 'The process' });

/* ── 07 Section 02, cost ──────────────────────────────────────────────────── */
add(`
  <span class="eyebrow">Section 02</span>
  <h1>The real cost of buying a home</h1>
  <div class="rule"></div>
  <p class="lede">The sticker price is the part everyone talks about. It is the costs around it that blindside people. Let us put all of them on the table so nothing surprises you at the worst possible moment.</p>
  <h2>The money buckets</h2>
  <table>
    <tr><th>Cost</th><th>What it is</th><th class="num">Ballpark</th></tr>
    ${g.costTable.map(([a, b, c]) => `<tr><td class="k">${esc(a)}</td><td>${esc(b)}</td><td class="num">${esc(c)}</td></tr>`).join('')}
  </table>
  <div style="margin-top:.22in" class="callout">
    <span class="eyebrow">A Wichita reality check</span>
    <p>Wichita is one of the more affordable mid-size markets in the country, which is good news for a first purchase. Treat the figures above as planning ballparks. For real numbers on a specific house, text me and I will run them with you.</p>
  </div>
  <div style="margin-top:.14in" class="callout dark">
    <span class="eyebrow">The two myths that stop people</span>
    <p>That you need twenty percent down, and that you need perfect credit. Neither is true. Plenty of buyers get in for far less, and we can often get the seller to help with closing costs as well.</p>
  </div>
`, { label: 'The numbers', grid: { seed: 5, w: 1200, h: 1550 } });

/* ── 08 Section 03, loans ─────────────────────────────────────────────────── */
add(`
  <span class="eyebrow">Section 03</span>
  <h1>Mortgages made simple</h1>
  <div class="rule"></div>
  <p class="lede">Four main doors into a home loan. You only need to walk through one. Here is who each is built for, in plain English.</p>
  ${g.loans.map(([name, tag, text, best]) => `
    <div class="card" style="margin-bottom:.12in">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:.05in">
        <h3 style="margin:0;font-size:13pt">${esc(name)}</h3><span class="chip">${esc(tag)}</span>
      </div>
      <p style="font-size:9.5pt;margin-bottom:.06in">${esc(text)}</p>
      <p style="margin:0;font-size:9pt"><span class="eyebrow">Best for</span>&nbsp;&nbsp;${esc(best)}</p>
    </div>`).join('')}
`, { label: 'The loans' });

/* ── 09 Decoder ───────────────────────────────────────────────────────────── */
add(`
  <span class="eyebrow">Decoder</span>
  <h1>The words that scare people</h1>
  <div class="rule"></div>
  <div class="cols2">
    ${g.decoder.map(([term, def]) => `<div><h3 style="font-size:10.4pt">${esc(term)}</h3><p class="small" style="font-size:9pt;margin:0">${esc(def)}</p></div>`).join('')}
  </div>
  <div style="margin-top:.3in"><p class="pull">You do not need to memorise any of this. You need someone who will explain it the night before you sign, and mean it.</p></div>
  <div style="margin-top:.24in" class="callout">
    <span class="eyebrow">My honest take</span>
    <p>The best loan is not a trophy. It is the one that fits your life, your cash and your timeline. We work that out together with a lender, and it costs nothing to ask the question.</p>
  </div>
`, { label: 'The words' });

/* ── 10 Section 04, areas ─────────────────────────────────────────────────── */
add(`
  <span class="eyebrow">Section 04</span>
  <h1>Where you might look in Wichita</h1>
  <div class="rule"></div>
  <p class="lede">Where you live shapes your day more than the house does. Below is the factual version of each area: what the housing stock is like, roughly where it sits, and which district it is in.</p>
  <div class="callout" style="margin-bottom:.2in">
    <span class="eyebrow">How to use this section</span>
    <p style="font-size:9.4pt">I am not going to tell you which area is &ldquo;good&rdquo;, which schools are &ldquo;great&rdquo;, or who lives where. Not because I am being cagey, but because those are exactly the statements a licensed agent is not permitted to make, and honestly they are opinions dressed as facts. What I will do is drive them with you, at rush hour and after dark, and point you at the public data so you can judge for yourself.</p>
  </div>
  <table>
    <tr><th style="width:1.15in">Area</th><th>What is there</th><th style="width:1.55in">School district</th></tr>
    ${g.areas.map(([a, d, s]) => `<tr><td class="k" style="width:1.15in">${esc(a)}</td><td style="font-size:9.2pt">${esc(d)}</td><td style="width:1.55in;font-size:9pt">${esc(s)}</td></tr>`).join('')}
  </table>
  <p class="small" style="margin-top:.14in">District boundaries do not follow city lines and can change. Confirm the district for any specific address before you make a decision based on it.</p>
`, { label: 'The map', grid: { seed: 13, w: 1200, h: 1550 } });

/* ── 11 Section 05, checklist ─────────────────────────────────────────────── */
const groups = Object.entries(g.checklist);
add(`
  <div style="display:flex;justify-content:space-between;align-items:baseline">
    <span class="eyebrow">Section 05</span><span class="eyebrow">Print me</span>
  </div>
  <h1>My home tour checklist</h1>
  <div class="rule"></div>
  <p class="lede" style="margin-bottom:.18in">Print this page and bring it to every showing. It will not replace a real inspection, but it will help you spot the expensive things early. I built it out of the repairs I actually pay for across the properties I manage.</p>
  <div class="cols2">
    ${groups.map(([grp, items]) => `<div style="break-inside:avoid"><p class="grp">${esc(grp)}</p>${items.map((i) => `<div class="check"><i></i><span>${esc(i)}</span></div>`).join('')}</div>`).join('')}
  </div>
`, { label: 'The checklist' });

/* ── 12 Section 06, ownership ─────────────────────────────────────────────── */
add(`
  <span class="eyebrow">Section 06</span>
  <h1>${esc(g.ownership.heading)}</h1>
  <div class="rule"></div>
  <p class="lede">${esc(g.ownership.lede)}</p>
  ${g.ownership.points.map(([h, txt]) => `<h3 style="margin-top:.16in">${esc(h)}</h3><p style="font-size:9.8pt">${esc(txt)}</p>`).join('')}
  <div style="margin-top:.16in" class="callout dark">
    <span class="eyebrow">Why this section exists</span>
    <p>Most buyer guides stop at closing day because most agents do. I manage more than <strong>500 doors</strong> and <strong>seven homeowner associations</strong> in this city, so I see the second half of the story every month. That is the part I can tell you about that nobody else in this market can.</p>
  </div>
`, { label: 'The ownership cost', grid: { seed: 23, w: 1200, h: 1550 } });

/* ── 13 Section 07 ────────────────────────────────────────────────────────── */
add(`
  <span class="eyebrow">Section 07</span>
  <h1>Things nobody tells first-time buyers</h1>
  <div class="rule"></div>
  <p class="lede">The stuff that does not fit in a brochure but absolutely should. Read this twice.</p>
  ${g.nobody.map(([h, txt], i) => `
    <div class="step" style="margin-bottom:.12in">
      <div class="n" style="font-size:15pt">${String(i + 1).padStart(2, '0')}</div>
      <div><h3>${esc(h)}</h3><p style="font-size:9.6pt;margin:0">${esc(txt)}</p></div>
    </div>`).join('')}
`, { label: 'Between the lines' });

/* ── 14 Section 08, vendors ───────────────────────────────────────────────── */
add(`
  <span class="eyebrow">Section 08</span>
  <h1>Local resources I trust</h1>
  <div class="rule"></div>
  <p class="lede">You do not buy a house alone, you buy it with a team. These are the people I vouch for. We fill these in together and you have my whole bench in one place.</p>
  <div class="cols2" style="gap:.2in .3in">
    ${g.vendors.map(([label, fields]) => `
      <div class="card">
        <p class="eyebrow" style="margin-bottom:.09in">${esc(label)}</p>
        ${fields.map((f) => `<p class="fill-k" style="margin:0 0 .01in">${esc(f)}</p><div class="fill"></div>`).join('')}
      </div>`).join('')}
  </div>
  <div style="margin-top:.2in" class="callout">
    <span class="eyebrow">A quick word on referrals</span>
    <p>These people are on this list because they do good work and treat my clients right. If one of them ever lets you down, I want to hear about it.</p>
  </div>
`, { label: 'Your team' });

/* ── 15 Trades ────────────────────────────────────────────────────────────── */
add(`
  <span class="eyebrow">After you move in</span>
  <h1>The trades worth keeping on speed dial</h1>
  <div class="rule"></div>
  <p class="lede">The day something breaks you do not want to be reading reviews. This is the short list, and it is the most useful page in here once you own the place.</p>
  <div class="cols3" style="gap:.18in">
    ${g.trades.map((tr) => `
      <div class="card">
        <p class="eyebrow" style="margin-bottom:.09in">${esc(tr)}</p>
        <p class="fill-k" style="margin:0">Name</p><div class="fill"></div>
        <p class="fill-k" style="margin:0">Phone</p><div class="fill"></div>
        <p class="fill-k" style="margin:0">Notes</p><div class="fill"></div>
      </div>`).join('')}
  </div>
  <div style="margin-top:.26in" class="callout dark">
    <span class="eyebrow">Why this matters</span>
    <p>A good agent&rsquo;s real value shows up after the sale. Anyone can unlock a door. The people in your corner when the furnace quits in January are the difference, and this list is yours to keep.</p>
  </div>
`, { label: 'Your team' });

/* ── 16 Section 09, moving ────────────────────────────────────────────────── */
add(`
  <span class="eyebrow">Section 09</span>
  <h1>Moving day survival guide</h1>
  <div class="rule"></div>
  <p class="lede">The keys are yours. Now let us get you in without losing your mind.</p>
  <h2 style="margin-top:.1in">The timeline</h2>
  ${g.moving.timeline.map(([when, what]) => `
    <div style="display:grid;grid-template-columns:1.15in 1fr;gap:.12in;margin-bottom:.075in">
      <span class="eyebrow" style="padding-top:.02in">${esc(when)}</span>
      <span style="font-size:9.5pt">${esc(what)}</span>
    </div>`).join('')}
  <div class="cols2" style="margin-top:.2in">
    <div>
      <p class="grp">Utility transfers</p>
      ${g.moving.utilities.map((x) => `<div class="check"><i></i><span>${esc(x)}</span></div>`).join('')}
      <p class="grp" style="margin-top:.18in">Packing</p>
      ${g.moving.packing.map((x) => `<div class="check"><i></i><span>${esc(x)}</span></div>`).join('')}
    </div>
    <div>
      <p class="grp">Change of address</p>
      ${g.moving.address.map((x) => `<div class="check"><i></i><span>${esc(x)}</span></div>`).join('')}
    </div>
  </div>
`, { label: 'Moving day' });

/* ── 17 Why work with me ──────────────────────────────────────────────────── */
add(`
  <span class="eyebrow">No pitch, just honest</span>
  <h1>${esc(g.why.heading)}</h1>
  <div class="rule"></div>
  <p class="lede">${esc(g.why.lede)}</p>
  <div class="cols2" style="gap:.2in .3in;margin-top:.06in">
    ${g.why.cols.map(([h, txt]) => `<div><h3>${esc(h)}</h3><p style="font-size:9.5pt;margin:0">${esc(txt)}</p></div>`).join('')}
  </div>
  <div style="margin-top:.3in"><p class="pull">${esc(g.why.pull)}</p></div>
  <p style="margin-top:.26in">${esc(g.why.close)}</p>
`, { label: 'The person', grid: { seed: 17, w: 1200, h: 1550 } });

/* ── 18 Next move ─────────────────────────────────────────────────────────── */
P.push(`<section class="page deep">
  ${parcelGrid({ seed: 31, w: 1200, h: 1550, tone: 'dark' })}
  <span class="eyebrow">${g.next.kicker}</span>
  <h1 style="color:#fff;font-size:32pt">${esc(g.next.heading)}</h1>
  <div class="rule" style="background:#D9A648"></div>
  <p class="lede" style="max-width:4.6in">${esc(g.next.body)}</p>
  <div class="cols3" style="margin-top:.42in;gap:.24in">
    ${g.next.steps.map(([h, txt], i) => `
      <div>
        <p style="font-family:'Archivo';font-weight:700;font-size:17pt;color:#D9A648;letter-spacing:-.03em;margin-bottom:.05in">${String(i + 1).padStart(2, '0')}</p>
        <h3 style="color:#fff">${esc(h)}</h3>
        <p style="font-size:9.2pt;color:rgba(255,255,255,.72);margin:0">${esc(txt)}</p>
      </div>`).join('')}
  </div>
  <div style="margin-top:.5in;border-top:1px solid rgba(255,255,255,.16);padding-top:.26in">
    <p style="font-family:'Archivo';font-weight:700;font-size:17pt;letter-spacing:-.02em;color:#fff;margin-bottom:.04in">${g.name}</p>
    <p class="eyebrow" style="margin-bottom:.1in">${g.role}</p>
    <p class="contact" style="font-size:9.6pt">${g.phone} &nbsp;·&nbsp; ${g.email}<br>${g.city} &nbsp;·&nbsp; ${g.licence}</p>
  </div>
  <p class="small" style="position:absolute;left:.78in;right:.78in;bottom:.42in;font-size:7pt;color:rgba(255,255,255,.4)">
    Equal Housing Opportunity. Justus Kidd is a licensed real estate salesperson in Kansas, licence 251163, brokered by Real Broker, LLC.
    This guide is general information, not legal, tax or financial advice.
  </p>
</section>`);

/* ── 19 Internal verification page ────────────────────────────────────────── */
P.push(`<section class="page wash">
  <p class="eyebrow" style="color:#8A3A1F">Internal — delete this page before this goes to anyone</p>
  <h1>Before you publish</h1>
  <div class="rule"></div>
  <p class="lede">Nothing in this guide is invented, and nothing about Justus is claimed that the site does not already stand behind. These are the items that still need a human to confirm them.</p>
  ${g.verify.map((x, i) => `
    <div class="step" style="margin-bottom:.1in">
      <div class="n" style="font-size:14pt">${String(i + 1).padStart(2, '0')}</div>
      <div><p style="font-size:9.6pt;margin:0">${esc(x)}</p></div>
    </div>`).join('')}
</section>`);

const html = `<!doctype html><html><head><meta charset="utf-8"><title>Agent Kidd — First-Time Homebuyer Resource Guide</title><style>${CSS}</style></head><body>${P.join('\n')}</body></html>`;
fs.writeFileSync('guide-branded.html', html);

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
// Viewport pinned to the page box for the same reason.
const pg = await browser.newPage({ viewport: { width: 816, height: 1056 } });
await pg.setContent(html, { waitUntil: 'load' });
await pg.evaluate(() => document.fonts.ready);
// preferCSSPageSize makes Chromium honour the @page box instead of re-laying
// out to width/height parameters, which is what keeps each .page div aligned to
// exactly one PDF page. Without it the pages drift and every footer creeps up.
await pg.pdf({ path: 'AgentKidd_Homebuyer_Guide.pdf', printBackground: true, preferCSSPageSize: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
await browser.close();
console.log('pages', P.length);
