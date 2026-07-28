import { chromium } from 'playwright';
import lighthouse from 'lighthouse';
const PORT = 9223;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium',
  args: [`--remote-debugging-port=${PORT}`, '--host-resolver-rules=MAP agentkidd.com 127.0.0.1', '--no-sandbox'] });
const res = await lighthouse('http://agentkidd.com:3000/', { port: PORT, output: 'json', logLevel: 'error',
  onlyCategories: ['performance','accessibility','best-practices','seo'], formFactor: 'mobile',
  screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false } });
await browser.close();
const a = res.lhr.audits;
console.log('── best-practices failures ──');
for (const ref of res.lhr.categories['best-practices'].auditRefs) {
  const x = a[ref.id];
  if (x && x.score !== null && x.score < 1) console.log(`  ${ref.id}: ${x.title}\n     ${(x.description||'').slice(0,110)}`);
}
console.log('\n── accessibility failures ──');
for (const ref of res.lhr.categories.accessibility.auditRefs) {
  const x = a[ref.id];
  if (x && x.score !== null && x.score < 1) {
    console.log(`  ${ref.id}: ${x.title}`);
    (x.details?.items || []).slice(0,4).forEach(i => console.log(`     ${(i.node?.snippet||'').slice(0,140)}`));
    (x.details?.items || []).slice(0,4).forEach(i => { if (i.node?.explanation) console.log(`     -> ${i.node.explanation.slice(0,160)}`); });
  }
}
console.log('\n── performance opportunities ──');
for (const ref of res.lhr.categories.performance.auditRefs) {
  const x = a[ref.id];
  if (x && x.score !== null && x.score < 0.9 && x.details?.overallSavingsMs > 40) console.log(`  ${ref.id}: saves ~${Math.round(x.details.overallSavingsMs)}ms  ${x.title}`);
}
for (const k of ['largest-contentful-paint','total-blocking-time','cumulative-layout-shift','first-contentful-paint','speed-index']) {
  if (a[k]) console.log(`  ${k}: ${a[k].displayValue}  (score ${Math.round(a[k].score*100)})`);
}
