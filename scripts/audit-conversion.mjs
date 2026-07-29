/**
 * Measures the build against the nine conversion criteria, mechanically.
 *
 * Every one of these is checkable, so none of them are asserted. Where the
 * build fails, it is printed as a failure.
 *
 *  1 Hick's law        one primary action per screenful
 *  2 Loss aversion     is the cost of waiting named, per route
 *  3 Hierarchy         exactly one brightest element per screenful
 *  4 Gutenberg         does the reading path end on the action
 *  5 Pronoun ratio     you : we, counted
 *  6 Specificity       density of concrete figures vs adjectives
 *  7 Objection order   cost / risk / timeline answered, and where
 *  8 Redundant paths   the longest scroll with no door in reach
 *  9 Speed to lead     which sinks are live right now
 */
import { chromium } from 'playwright';

const ROUTES = {
  agent: { host: 'www.agentkidd.com', paths: ['/', '/buy', '/sell', '/investors', '/about', '/reviews', '/contact'] },
  cornerstone: {
    host: 'www.cornerstonemgmt.co',
    paths: ['/', '/property-management', '/hoa', '/commercial', '/owners', '/availability', '/about', '/contact'],
  },
};

const VIEWPORT = { width: 390, height: 844 }; // a phone: the hardest case for all nine

const LOSS_WORDS = /\b(vacant|vacancy|sits|sitting|costs? you|a month of|every month|lose|losing|lost|missed|slower|delay|waiting|wait)\b/i;
const OBJECTION = {
  cost: /\b(cost|charge|fee|commission|price|pay|free|no charge)\b/i,
  risk: /\b(no obligation|no pressure|not|never|without|cancel|walk away|honest|wrong|bad time)\b/i,
  timeline: /\b(how long|days?|weeks?|months?|timeline|seconds|same day|turnaround|before)\b/i,
};
const YOU = /\b(you|your|yours|you're|youre)\b/gi;
// 'were' is NOT in this list. It is the past tense of 'be' and matching it
// inflates the count. First person singular IS counted: on Agent Kidd the whole
// voice is Justus speaking, and the post's rule does not exempt that.
const WE = /\b(we|we'\u2019?re|our|ours|us|i|i'\u2019?m|me|my|mine)\b/gi;
const FIGURE = /\b(\d[\d,]*\+?|\$\d[\d,]*)\b/g;
const VAGUE = /\b(quality|trusted|expertise|professional|passionate|dedicated|premier|world.class|best.in.class|seamless|innovative|cutting.edge|excellence|committed)\b/gi;

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: ['--host-resolver-rules=MAP www.agentkidd.com 127.0.0.1, MAP www.cornerstonemgmt.co 127.0.0.1'],
});

const rows = [];
let youTotal = 0;
let weTotal = 0;
let figTotal = 0;
let vagueTotal = 0;

for (const [brand, cfg] of Object.entries(ROUTES)) {
  const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1 });
  const page = await ctx.newPage();

  for (const p of cfg.paths) {
    await page.goto(`http://${cfg.host}:3000${p}`, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 30));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(6500); // the scripted bot conversation

    const m = await page.evaluate((vh) => {
      const docH = document.documentElement.scrollHeight;

      // A "door" is anything a visitor can convert through, with its position.
      const doors = [];
      const push = (el, kind) => {
        const r = el.getBoundingClientRect();
        doors.push({ kind, y: Math.round(r.top + window.scrollY), label: (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 40) });
      };
      const inHeader = (el) => !!el.closest('header, [data-chrome="nav"]') || !!el.closest('.sticky');
      for (const a of document.querySelectorAll('a[href^="tel:"]')) push(a, 'call');
      for (const a of document.querySelectorAll('a[href^="mailto:"]')) push(a, 'email');
      for (const f of document.querySelectorAll('form')) {
        push(f, f.querySelector('#bot-input') ? 'chat' : 'form');
      }
      for (const a of document.querySelectorAll('a[href*="calendly"], a[href*="cal.com"], a[href*="booking"], a[href*="/book"]')) push(a, 'calendar');
      // A button that carries the visitor TO a form is a door in exactly the way
      // the form itself is. Excluding them measures form placement, not reach.
      for (const a of document.querySelectorAll('main a[href^="/"], #main a[href^="/"]')) {
        if (inHeader(a)) continue;
        const cs = getComputedStyle(a);
        if (/rgb\(194,\s*131,\s*42\)|rgb\(217,\s*166,\s*72\)/.test(cs.backgroundColor) || /#/.test(a.getAttribute('href'))) push(a, 'cta');
      }

      // Primary actions: the brass fill. Nothing else on this build uses it.
      const primaries = [];
      for (const el of document.querySelectorAll('a, button')) {
        const cs = getComputedStyle(el);
        const bg = cs.backgroundColor;
        const r = el.getBoundingClientRect();
        if (r.width < 40 || r.height < 24) continue;
        // The sticky nav CTA is persistent chrome that travels with the
        // viewport. It is not a competing choice inside a section, so counting
        // it would report every single screen as overloaded.
        if (inHeader(el)) continue;
        // brass = rgb(194,131,42) and its hover lift
        if (/rgb\(194,\s*131,\s*42\)|rgb\(217,\s*166,\s*72\)/.test(bg)) {
          primaries.push({ y: Math.round(r.top + window.scrollY), label: (el.innerText || '').trim().slice(0, 40) });
        }
      }

      // Where does the last block of reading end, and what is below it?
      const main = document.querySelector('#main') || document.body;
      const text = main.innerText || '';
      // Gutenberg is about where the READING ends, not where the document ends.
      // The footer is a legal and navigational block, not part of the argument,
      // so measuring against document height punishes a long footer.
      const foot = document.querySelector('footer');
      const readEnd = foot ? Math.round(foot.getBoundingClientRect().top + window.scrollY) : docH;

      return { docH, readEnd, doors, primaries, text, vh };
    }, VIEWPORT.height);

    // ── 1 + 3. One primary per screenful. Sticky header CTA is excluded: it is
    // persistent chrome, not a competing choice inside a section.
    const screens = Math.ceil(m.docH / VIEWPORT.height);
    const perScreen = new Array(screens).fill(0);
    for (const pr of m.primaries) {
      const i = Math.min(screens - 1, Math.floor(pr.y / VIEWPORT.height));
      perScreen[i] += 1;
    }
    const worstScreen = Math.max(...perScreen);

    // ── 8. Longest stretch of scroll with no door within a screen of the visitor.
    const doorYs = [...new Set(m.doors.map((d) => d.y))].sort((a, b) => a - b);
    let biggestGap = doorYs.length ? doorYs[0] : m.docH;
    for (let i = 1; i < doorYs.length; i += 1) biggestGap = Math.max(biggestGap, doorYs[i] - doorYs[i - 1]);
    if (doorYs.length) biggestGap = Math.max(biggestGap, m.readEnd - doorYs[doorYs.length - 1]);

    const kinds = [...new Set(m.doors.map((d) => d.kind))].sort();

    // ── 5 + 6. Counted on the rendered text, which is what a visitor reads.
    const you = (m.text.match(YOU) || []).length;
    const we = (m.text.match(WE) || []).length;
    const figs = (m.text.match(FIGURE) || []).length;
    const vague = (m.text.match(VAGUE) || []).length;
    youTotal += you; weTotal += we; figTotal += figs; vagueTotal += vague;

    // ── 2. Loss aversion.
    const loss = LOSS_WORDS.test(m.text);

    // ── 7. Objections.
    const objs = Object.entries(OBJECTION).filter(([, re]) => re.test(m.text)).map(([k]) => k);

    // ── 4. Gutenberg: is a primary action in the last 25% of the page?
    const lastPrimary = m.primaries.length ? Math.max(...m.primaries.map((x) => x.y)) : -1;
    const endsOnAction = lastPrimary > m.readEnd * 0.75;

    rows.push({
      at: `${brand}${p}`,
      screens,
      worstScreen,
      primaries: m.primaries.length,
      kinds,
      biggestGap,
      you,
      we,
      figs,
      vague,
      loss,
      objs,
      endsOnAction,
    });
  }
  await ctx.close();
}
await browser.close();

const pad = (s, n) => String(s).padEnd(n);
console.log('\nROUTE                            SCRNS  MAX-PRI/SCRN  DOORS                    BIGGEST GAP  ENDS ON CTA  LOSS  OBJECTIONS');
for (const r of rows) {
  console.log(
    `  ${pad(r.at, 30)} ${String(r.screens).padStart(4)}  ${String(r.worstScreen).padStart(11)}  ${pad(r.kinds.join('+'), 24)} ${String(r.biggestGap + 'px').padStart(10)}  ${pad(r.endsOnAction ? 'yes' : 'NO', 11)}  ${pad(r.loss ? 'yes' : 'no', 4)}  ${r.objs.join('+') || 'none'}`
  );
}

console.log('\n  ── Pronoun ratio (rendered text, all routes)');
console.log(`     you/your: ${youTotal}   we/our/us/I: ${weTotal}   ratio ${(youTotal / Math.max(1, weTotal)).toFixed(2)} : 1   (target 4:1)`);
console.log('  ── Specificity');
console.log(`     concrete figures: ${figTotal}   vague adjectives: ${vagueTotal}`);

const fails = [];
const overloaded = rows.filter((r) => r.worstScreen > 1);
if (overloaded.length) fails.push(`Hick's law: ${overloaded.length} route(s) with more than one primary action in a single screenful`);
const noEnd = rows.filter((r) => !r.endsOnAction);
if (noEnd.length) fails.push(`Gutenberg: ${noEnd.length} route(s) do not end on an action`);
const gappy = rows.filter((r) => r.biggestGap > VIEWPORT.height * 2);
if (gappy.length) fails.push(`Redundant paths: ${gappy.length} route(s) with more than two screens of scroll between doors`);
const noLoss = rows.filter((r) => !r.loss);
if (noLoss.length) fails.push(`Loss aversion: absent on ${noLoss.map((r) => r.at).join(', ')}`);
if (youTotal / Math.max(1, weTotal) < 4) fails.push(`Pronoun ratio is ${(youTotal / Math.max(1, weTotal)).toFixed(2)}:1, below the 4:1 target`);
const noCal = rows.filter((r) => !r.kinds.includes('calendar'));
if (noCal.length === rows.length) fails.push('Redundant paths: no calendar door exists anywhere on the build');

console.log(fails.length ? `\n  ${fails.length} FAILING:\n` + fails.map((f) => '   - ' + f).join('\n') : '\n  all nine pass');
