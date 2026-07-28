/** Placeholder sweep and conversion audit, against rendered HTML. Build Standard §16. */
import { chromium } from 'playwright';
const ROUTES = {
  agent: { host: 'agentkidd.com', paths: ['/', '/buy', '/sell', '/investors', '/about', '/reviews', '/contact'] },
  cornerstone: { host: 'cornerstonemgmt.co', paths: ['/', '/property-management', '/hoa', '/commercial', '/owners', '/availability', '/about', '/contact'] },
};
const BAD = [
  [/555[- )]?555/, 'dummy phone'], [/lorem ipsum/i, 'lorem ipsum'],
  [/mymailservice|example\.com|test@|your-?email/i, 'dummy email'],
  [/\bTBD\b|\bTODO\b|\bFIXME\b|XXX|PLACEHOLDER/i, 'placeholder marker'],
  [/NEEDS VERIFICATION/i, 'unresolved verification token'],
  [/yahoo\.com|kw\.com/i, 'stale email from the old site'],
  [/00251163/, 'old licence format'], [/201 S Oliver/i, 'old address'],
  [/Coming soon|coming soon/, 'coming soon'],
  [/undefined|NaN|\[object Object\]/, 'rendering fault'],
];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium',
  args: ['--host-resolver-rules=MAP agentkidd.com 127.0.0.1, MAP cornerstonemgmt.co 127.0.0.1'] });
const fails = [], conv = [];
for (const [brand, cfg] of Object.entries(ROUTES)) {
  const p = await (await b.newContext({ viewport: { width: 375, height: 900 } })).newPage();
  for (const path of cfg.paths) {
    await p.goto(`http://${cfg.host}:3000${path}`, { waitUntil: 'networkidle' });
    const text = await p.evaluate(() => document.body.innerText);
    for (const [rx, why] of BAD) { const m = text.match(rx); if (m) fails.push(`${brand}${path}: ${why} — "${m[0]}"`); }
    const c = await p.evaluate(() => {
      const inMain = (s) => [...document.querySelectorAll('main ' + s)];
      return {
        navCta: !!document.querySelector('header a[href]:last-of-type'),
        headerPhone: !!document.querySelector('header a[href^="tel:"]'),
        footerPhone: !!document.querySelector('footer a[href^="tel:"]'),
        forms: inMain('form').filter(f => f.querySelector('input[name="formKey"]')).length,
        bot: !!document.querySelector('#bot-input'),
        distinctPaths: new Set([
          ...inMain('a[href^="tel:"]').map(() => 'phone'),
          ...inMain('form').filter(f => f.querySelector('input[name="formKey"]')).map(f => 'form:' + f.querySelector('input[name="formKey"]').value),
          ...(document.querySelector('#bot-input') ? ['bot'] : []),
          ...inMain('a[href*="#"]').map(a => 'anchor'),
        ]).size,
        closing: !!inMain('a').slice(-6).find(a => /valuation|analysis|call|text|guide|review|requirements/i.test(a.innerText)),
      };
    });
    conv.push({ at: `${brand}${path}`, ...c });
    if (c.distinctPaths < 2) fails.push(`${brand}${path}: only ${c.distinctPaths} conversion path(s), minimum is 2`);
    if (!c.headerPhone) fails.push(`${brand}${path}: no tappable phone in header`);
    if (!c.footerPhone) fails.push(`${brand}${path}: no tappable phone in footer`);
    if (!c.closing) fails.push(`${brand}${path}: no closing CTA before the footer`);
  }
}
await b.close();
console.log('ROUTE                            PATHS  FORMS  BOT  HDR-PH  FTR-PH  CLOSE');
conv.forEach(function (c) {
  var yn = function (v) { return v ? 'YES' : 'no '; };
  console.log('  ' + c.at.padEnd(30) + String(c.distinctPaths).padStart(5) + '  ' +
    String(c.forms).padStart(5) + '  ' + yn(c.bot) + '  ' + yn(c.headerPhone) + '     ' +
    yn(c.footerPhone) + '     ' + yn(c.closing));
});
console.log('');
if (fails.length) { fails.forEach(f => console.log('  FAIL ' + f)); console.log(`\n  ${fails.length} FAILURES`); process.exit(1); }
console.log('  placeholder sweep clean · conversion minimums met on every route');
