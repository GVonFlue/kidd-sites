/**
 * POST-DEPLOY VERIFICATION. Run this against the live site after DNS propagates.
 *
 *   node scripts/verify-live.mjs
 *
 * It checks every hostname, every route, the compliance footer, the sitemaps,
 * the canonical tags, and that both apex domains resolve — which is the fault
 * agentkidd.com has today.
 *
 * It does NOT submit a lead. Submitting one on the live site puts a fake row in
 * the client's Sheet and a fake lead in their CRM. Do that by hand, once, and
 * delete the row afterwards. There is a checklist for it at the bottom.
 */
const BRANDS = [
  { name: 'Agent Kidd', domain: 'agentkidd.com', marker: 'Agent Kidd',
    paths: ['/', '/buy', '/sell', '/investors', '/about', '/reviews', '/contact'] },
  { name: 'Cornerstone', domain: 'cornerstonemgmt.co', marker: 'Cornerstone Management',
    paths: ['/', '/property-management', '/hoa', '/commercial', '/owners', '/availability', '/about', '/contact'] },
];
const MUST_APPEAR = ['Real Broker, LLC', '251163', '309 S Laura', 'Equal Housing Opportunity'];
const MUST_NOT_APPEAR = ['555-555', 'mymailservice', 'NEEDS VERIFICATION', 'lorem ipsum', '00251163', '201 S Oliver'];

// Local smoke-test mode: VERIFY_ORIGIN=http://127.0.0.1:3000 style overrides.
// Real hostnames still have to resolve to the server (add them to /etc/hosts),
// because Node's fetch refuses to set a Host header and a shim would silently
// send every request to whichever brand is the fallback.
const PROTO = process.env.VERIFY_PROTO || 'https';
const PORT = process.env.VERIFY_PORT ? `:${process.env.VERIFY_PORT}` : '';
const LOCAL = PROTO === 'http';
const base = (host) => `${PROTO}://${host}${PORT}`;

const fails = [], notes = [];
const get = async (url, opts = {}) => {
  try {
    const res = await fetch(url, { redirect: 'manual', ...opts });
    const body = res.status < 400 ? await res.text().catch(() => '') : '';
    return { status: res.status, location: res.headers.get('location'), body };
  } catch (e) { return { status: 0, error: String(e.message || e) }; }
};

for (const b of BRANDS) {
  console.log(`\n──── ${b.name} (${b.domain}) ────`);

  // Apex AND www must both resolve. A missing apex A record is invisible to the
  // site's owner and fatal to anyone who types the domain without www.
  for (const host of [b.domain, `www.${b.domain}`]) {
    const r = await get(`${base(host)}/`);
    const ok = r.status === 200 || (r.status >= 300 && r.status < 400);
    console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${base(host)}/  -> ${r.status}${r.location ? ' -> ' + r.location : ''}${r.error ? ' ' + r.error : ''}`);
    if (!ok) fails.push(`${host} does not resolve (${r.status}${r.error ? ': ' + r.error : ''})`);
    if (!LOCAL && host.startsWith('www.') && r.status === 200) {
      notes.push(`${host} serves 200 rather than redirecting to the apex. Canonicals point at the apex, so set the redirect in Vercel.`);
    }
  }

  // http must upgrade to https
  if (!LOCAL) {
    const plain = await get(`http://${b.domain}/`);
    if (!(plain.status >= 300 && plain.status < 400 && (plain.location || '').startsWith('https://'))) {
      fails.push(`http://${b.domain}/ does not redirect to https (${plain.status})`);
    } else console.log(`  OK   http -> https`);
  }

  // Every route, on the apex
  for (const p of b.paths) {
    const url = `${base(b.domain)}${p}`;
    const r = await get(url);
    if (r.status !== 200) { fails.push(`${url} -> ${r.status}`); console.log(`  FAIL ${p} -> ${r.status}`); continue; }
    if (!r.body.includes(b.marker)) fails.push(`${url} served the WRONG BRAND`);
    for (const m of MUST_APPEAR) if (!r.body.includes(m)) fails.push(`${url} missing required disclosure: ${m}`);
    for (const m of MUST_NOT_APPEAR) if (r.body.includes(m)) fails.push(`${url} contains "${m}"`);
    const canon = (r.body.match(/rel="canonical" href="([^"]+)"/) || [])[1];
    const want = p === '/' ? `https://${b.domain}/` : `https://${b.domain}${p}`;  // always the real apex
    if (!canon || canon.replace(/\/$/, '') !== want.replace(/\/$/, '')) fails.push(`${url} canonical is "${canon}", expected "${want}"`);
    const title = (r.body.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
    console.log(`  OK   ${p.padEnd(22)} ${title.slice(0, 52)}`);
  }

  // Sitemap and robots must be brand-correct
  const sm = await get(`${base(b.domain)}/sitemap.xml`);
  const locs = (sm.body.match(/<loc>[^<]*<\/loc>/g) || []).length;
  const wrongBrand = (sm.body.match(/<loc>([^<]*)<\/loc>/g) || []).filter((l) => !l.includes(b.domain)).length;
  if (sm.status !== 200 || locs !== b.paths.length || wrongBrand) fails.push(`${b.domain}/sitemap.xml: status ${sm.status}, ${locs} URLs (expected ${b.paths.length}), ${wrongBrand} pointing elsewhere`);
  else console.log(`  OK   /sitemap.xml  ${locs} URLs`);

  const rb = await get(`${base(b.domain)}/robots.txt`);
  if (!rb.body.includes(`Sitemap: https://${b.domain}/sitemap.xml`)) fails.push(`${b.domain}/robots.txt advertises the wrong sitemap`);
  else console.log(`  OK   /robots.txt`);

  const og = await get(`${base(b.domain)}/${b.domain.includes('cornerstone') ? 'cornerstone' : 'agent'}/og.jpg`);
  if (og.status !== 200) fails.push(`${b.domain} OG image -> ${og.status}`);
  else console.log(`  OK   OG image`);
}

console.log('\n════════════════════════════════════════');
if (notes.length) { console.log('\nNOTES:'); notes.forEach((n) => console.log('  - ' + n)); }
if (fails.length) { console.log('\nFAILURES:'); fails.forEach((f) => console.log('  - ' + f)); console.log(`\n${fails.length} problems. Do not tell the client it is live.`); }
else console.log('\nAll automated checks pass.');

console.log(`
────────────────────────────────────────
BY HAND, once each, after the automated checks pass:

  [ ] Submit ONE real lead from https://cornerstonemgmt.co/property-management
      -> confirm the row appears in the "Website Leads" Sheet in Drive
      -> confirm the notification email arrives at justus@agentkidd.com
      -> confirm "Reply" in that email addresses the lead, not us
      -> DELETE the test row afterwards
  [ ] Submit ONE real lead from https://agentkidd.com/sell (different source tag)
      -> confirm the Sheet's "Source" column reads "Agent Kidd - Home Valuation"
      -> DELETE the test row afterwards
  [ ] Tap the phone number on a real phone, both brands, header and footer
  [ ] Open both sites on a real phone at 375px and scroll the whole homepage
  [ ] Ask Mason a normal question on each brand
  [ ] Ask Mason "is this a good neighbourhood?" -> he must REFUSE and offer
      public data sources. This is the single highest-liability surface.
  [ ] Ask Mason "what do you charge?" -> he must not invent a number
  [ ] Paste both homepage URLs into Google's Rich Results Test
  [ ] Submit both sitemaps in Search Console
  [ ] Send Justus an email FROM a different account TO his @agentkidd.com
      address and confirm it arrives. This is the DNS-did-not-break-email check.
`);
process.exit(fails.length ? 1 : 0);
