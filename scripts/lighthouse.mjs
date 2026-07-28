import { chromium } from 'playwright';
import lighthouse from 'lighthouse';

const ROUTES = {
  agent: { host: 'agentkidd.com', paths: ['/', '/buy', '/sell', '/investors', '/about', '/reviews', '/contact'] },
  cornerstone: { host: 'cornerstonemgmt.co', paths: ['/', '/property-management', '/hoa', '/commercial', '/owners', '/availability', '/about', '/contact'] },
};
const PORT = 9222;
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: [`--remote-debugging-port=${PORT}`, '--host-resolver-rules=MAP agentkidd.com 127.0.0.1, MAP cornerstonemgmt.co 127.0.0.1', '--no-sandbox'],
});

const rows = [];
for (const [brand, cfg] of Object.entries(ROUTES)) {
  for (const p of cfg.paths) {
    const url = `http://${cfg.host}:3000${p}`;
    const res = await lighthouse(url, {
      port: PORT, output: 'json', logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false },
      formFactor: 'mobile',
    });
    const c = res.lhr.categories;
    const s = (k) => Math.round((c[k]?.score ?? 0) * 100);
    const failed = Object.values(res.lhr.audits)
      .filter((a) => a.score !== null && a.score < 1 && ['accessibility', 'seo'].some((cat) =>
        c[cat].auditRefs.some((r) => r.id === a.id)))
      .map((a) => a.id);
    rows.push({ at: `${brand}${p}`, perf: s('performance'), a11y: s('accessibility'), bp: s('best-practices'), seo: s('seo'), failed });
  }
}
await browser.close();

console.log('ROUTE                            PERF  A11Y  BEST  SEO');
for (const r of rows) {
  console.log(`  ${r.at.padEnd(30)} ${String(r.perf).padStart(4)}  ${String(r.a11y).padStart(4)}  ${String(r.bp).padStart(4)}  ${String(r.seo).padStart(3)}`);
}
const min = (k) => Math.min(...rows.map((r) => r[k]));
const avg = (k) => Math.round(rows.reduce((a, r) => a + r[k], 0) / rows.length);
console.log(`\n  lowest:   perf ${min('perf')}  a11y ${min('a11y')}  best ${min('bp')}  seo ${min('seo')}`);
console.log(`  average:  perf ${avg('perf')}  a11y ${avg('a11y')}  best ${avg('bp')}  seo ${avg('seo')}`);
console.log(`\n  Build Standard floor: Performance 90+, Accessibility 95+, SEO 100`);
console.log(`  ${min('perf') >= 90 ? 'PASS' : 'BELOW'} performance · ${min('a11y') >= 95 ? 'PASS' : 'BELOW'} accessibility · ${min('seo') >= 100 ? 'PASS' : 'BELOW'} SEO`);
const allFailed = [...new Set(rows.flatMap((r) => r.failed))];
if (allFailed.length) console.log(`\n  failing a11y/seo audits: ${allFailed.join(', ')}`);
