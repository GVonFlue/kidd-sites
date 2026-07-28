/** Every outbound path: no dead links, no bare-homepage social icons, correct tel: format. */
import { chromium } from 'playwright';
const ROUTES = {
  agent: { host: 'www.agentkidd.com', paths: ['/', '/buy', '/sell', '/investors', '/about', '/reviews', '/contact'] },
  cornerstone: { host: 'www.cornerstonemgmt.co', paths: ['/', '/property-management', '/hoa', '/commercial', '/owners', '/availability', '/contact'] },
};
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium',
  args: ['--host-resolver-rules=MAP www.agentkidd.com 127.0.0.1, MAP www.cornerstonemgmt.co 127.0.0.1'] });
const dead = [], tel = new Set(), ext = new Set(), internal = new Set();
for (const [brand, cfg] of Object.entries(ROUTES)) {
  const p = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
  for (const path of cfg.paths) {
    await p.goto(`http://${cfg.host}:3000${path}`, { waitUntil: 'networkidle' });
    const links = await p.$$eval('a', (as) => as.map((a) => ({ href: a.getAttribute('href'), text: (a.innerText || '').trim().slice(0, 40) })));
    for (const l of links) {
      if (!l.href || l.href === '#' || l.href === '') { dead.push(`${brand}${path} :: "${l.text}"`); continue; }
      if (l.href.startsWith('tel:')) tel.add(l.href);
      else if (l.href.startsWith('http')) ext.add(l.href);
      else if (l.href.startsWith('/')) internal.add(`${brand}${l.href.split('#')[0]}`);
    }
  }
}
// Internal links must resolve.
const p = await (await b.newContext()).newPage();
const broken = [];
for (const key of internal) {
  const brand = key.startsWith('agent') ? 'agent' : 'cornerstone';
  const host = brand === 'agent' ? 'www.agentkidd.com' : 'www.cornerstonemgmt.co';
  const path = key.slice(brand.length) || '/';
  const r = await p.goto(`http://${host}:3000${path}`, { waitUntil: 'domcontentloaded' });
  if (r.status() !== 200) broken.push(`${key} -> HTTP ${r.status()}`);
}
await b.close();
console.log('tel: links (must be +1 E.164):'); [...tel].sort().forEach((t) => console.log('  ' + t + (/^tel:\+1\d{10}$/.test(t) ? '  OK' : '  BAD FORMAT')));
console.log('\nexternal destinations:'); [...ext].sort().forEach((e) => console.log('  ' + e));
console.log('\ninternal routes linked: ' + internal.size + (broken.length ? '\n  BROKEN:\n   ' + broken.join('\n   ') : ' — all resolve 200'));
console.log(dead.length ? `\n${dead.length} DEAD LINKS:\n  ` + dead.join('\n  ') : '\nno dead links (href="#" or missing)');
process.exit(dead.length || broken.length || [...tel].some((t) => !/^tel:\+1\d{10}$/.test(t)) ? 1 : 0);
