/** Build Standard §12, checked against rendered HTML on every route. */
import { chromium } from 'playwright';
const ROUTES = {
  agent: { host: 'agentkidd.com', domain: 'agentkidd.com', paths: ['/', '/buy', '/sell', '/investors', '/about', '/reviews', '/contact'] },
  cornerstone: { host: 'cornerstonemgmt.co', domain: 'cornerstonemgmt.co', paths: ['/', '/property-management', '/hoa', '/commercial', '/owners', '/availability', '/about', '/contact'] },
};
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium',
  args: ['--host-resolver-rules=MAP agentkidd.com 127.0.0.1, MAP cornerstonemgmt.co 127.0.0.1'] });
const fails = [], titles = new Set(), descs = new Set();
const rows = [];
let ldNodes = [];

for (const [brand, cfg] of Object.entries(ROUTES)) {
  const p = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
  for (const path of cfg.paths) {
    await p.goto(`http://${cfg.host}:3000${path}`, { waitUntil: 'domcontentloaded' });
    const m = await p.evaluate(() => ({
      title: document.title,
      desc: document.querySelector('meta[name="description"]')?.content || '',
      canonical: document.querySelector('link[rel="canonical"]')?.href || '',
      ogTitle: document.querySelector('meta[property="og:title"]')?.content || '',
      ogImage: document.querySelector('meta[property="og:image"]')?.content || '',
      ogUrl: document.querySelector('meta[property="og:url"]')?.content || '',
      twCard: document.querySelector('meta[name="twitter:card"]')?.content || '',
      h1: [...document.querySelectorAll('h1')].map((h) => h.innerText.trim()),
      ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent),
      imgs: [...document.querySelectorAll('img')].map((i) => ({ src: i.getAttribute('src'), alt: i.getAttribute('alt') })),
    }));
    const at = `${brand}${path}`;
    const want = path === '/' ? `https://${cfg.domain}/` : `https://${cfg.domain}${path}`;

    if (!m.title) fails.push(`${at}: no <title>`);
    if (titles.has(m.title)) fails.push(`${at}: DUPLICATE title "${m.title}"`);
    titles.add(m.title);
    if (m.title.length > 70) fails.push(`${at}: title is ${m.title.length} chars, will truncate in results`);
    if (!m.desc) fails.push(`${at}: no meta description`);
    if (descs.has(m.desc)) fails.push(`${at}: DUPLICATE description`);
    descs.add(m.desc);
    if (m.desc.length > 175) fails.push(`${at}: description is ${m.desc.length} chars`);
    if (m.canonical.replace(/\/$/, '') !== want.replace(/\/$/, '')) fails.push(`${at}: canonical is "${m.canonical}", expected "${want}"`);
    if (!m.ogImage.includes('/og.jpg')) fails.push(`${at}: no OG image`);
    if (m.twCard !== 'summary_large_image') fails.push(`${at}: twitter card is "${m.twCard}"`);
    if (m.h1.length !== 1) fails.push(`${at}: ${m.h1.length} <h1> elements`);
    if (m.ld.length < 2) fails.push(`${at}: expected 2 JSON-LD blocks, found ${m.ld.length}`);
    m.imgs.forEach((i) => { if (i.alt === null) fails.push(`${at}: <img> with no alt: ${i.src}`); });
    if (path === '/') ldNodes = ldNodes.concat(m.ld.map((x) => JSON.parse(x)));
    rows.push({ at, title: m.title.slice(0, 58), canonical: m.canonical });
  }
}
await b.close();

console.log('ROUTE                              TITLE');
rows.forEach((r) => console.log(`  ${r.at.padEnd(32)} ${r.title}`));
console.log(`\n  ${titles.size} unique titles across ${rows.length} routes`);
console.log(`  ${descs.size} unique descriptions`);

console.log('\n──── JSON-LD emitted on the two homepages ────');
for (const n of ldNodes) {
  console.log(`\n  @type: ${n['@type']}  @id: ${n['@id']}`);
  for (const k of ['name', 'telephone', 'email', 'url']) if (n[k]) console.log(`    ${k}: ${n[k]}`);
  if (n.address) console.log(`    address: ${n.address.streetAddress}, ${n.address.addressLocality}, ${n.address.addressRegion} ${n.address.postalCode}`);
  if (n.sameAs) console.log(`    sameAs: ${n.sameAs.length} profiles`);
  if (n.hasCredential) console.log(`    licence: ${n.hasCredential.identifier} (${n.hasCredential.recognizedBy.name})`);
  if (n.contactPoint) console.log(`    contactPoints: ${n.contactPoint.map((c) => `${c.contactType} ${c.telephone}`).join(' | ')}`);
  // Nothing undefined or null should survive into the emitted JSON.
  const bad = JSON.stringify(n).match(/:null|:undefined/g);
  if (bad) fails.push(`JSON-LD ${n['@type']} contains ${bad.length} null/undefined values`);
}

console.log('');
if (fails.length) { fails.forEach((f) => console.log('  FAIL ' + f)); console.log(`\n  ${fails.length} SEO FAILURES`); process.exit(1); }
console.log('  SEO: all checks pass');
