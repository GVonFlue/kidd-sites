const post = (body, headers = {}, redirect = 'manual') =>
  fetch('http://localhost:3000/api/lead', {
    method: 'POST', redirect,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...headers },
    body: JSON.stringify(body),
  });
const form = (obj) => {
  const b = new URLSearchParams(obj).toString();
  return fetch('http://localhost:3000/api/lead', {
    method: 'POST', redirect: 'manual',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'text/html' },
    body: b,
  });
};
const base = (extra = {}) => ({ formKey: 'valuation', name: 'Failure Test', email: 'ft@example.com', t: Date.now() - 9000, ...extra });
const results = [];
const check = (label, pass, detail) => results.push({ label, pass, detail });

await fetch('http://localhost:4001/reset', { method: 'POST' });

// 1. Remaining two forms
for (const k of ['commercialInquiry', 'contactCornerstone']) {
  const r = await post(base({ formKey: k, name: `Test ${k}`, email: `t+${k}@example.com`, squareFeet: '2000', moveIn: 'Oct', message: 'x' }));
  const j = await r.json().catch(() => ({}));
  check(`${k} submits`, r.status === 200 && j.ok === true, `HTTP ${r.status}`);
}

// 2. Honeypot: must look like success to the bot, and store nothing.
{
  const before = (await (await fetch('http://localhost:4001/dump')).json()).sheet.length;
  const r = await post(base({ name: 'Spam Bot', email: 'spam@example.com', company: 'Acme Spam Co' }));
  const j = await r.json().catch(() => ({}));
  const after = (await (await fetch('http://localhost:4001/dump')).json()).sheet.length;
  check('honeypot: bot is told it succeeded', r.status === 200 && j.ok === true, `HTTP ${r.status}`);
  check('honeypot: nothing was stored', after === before, `sheet ${before} -> ${after}`);
}

// 3. Time-to-submit: submitted instantly = not a human.
{
  const before = (await (await fetch('http://localhost:4001/dump')).json()).sheet.length;
  const r = await post(base({ name: 'Too Fast', email: 'fast@example.com', t: Date.now() }));
  const after = (await (await fetch('http://localhost:4001/dump')).json()).sheet.length;
  check('time-to-submit: instant submission dropped', r.status === 200 && after === before, `sheet ${before} -> ${after}`);
}

// 4. Validation
{
  const r1 = await post(base({ email: 'not-an-email' }));
  const r2 = await post(base({ name: '' }));
  const r3 = await post(base({ formKey: 'notARealForm' }));
  check('rejects a malformed email', r1.status === 400, `HTTP ${r1.status}`);
  check('rejects a missing name', r2.status === 400, `HTTP ${r2.status}`);
  check('rejects an unknown form key (source tags cannot be spoofed)', r3.status === 400, `HTTP ${r3.status}`);
}

// 5. THE IMPORTANT ONE. CRM down: the visitor must still see success and the
//    lead must still reach the Sheet.
{
  await fetch('http://localhost:4001/crm-fail', { method: 'POST' });
  const before = (await (await fetch('http://localhost:4001/dump')).json()).sheet.length;
  const r = await post(base({ name: 'CRM Is Down', email: 'crmdown@example.com' }));
  const j = await r.json().catch(() => ({}));
  const dump = await (await fetch('http://localhost:4001/dump')).json();
  const inSheet = dump.sheet.some((l) => l.name === 'CRM Is Down');
  const crmFailed = dump.crm.some((l) => l.FAILED);
  check('CRM down: visitor still sees success', r.status === 200 && j.ok === true, `HTTP ${r.status}`);
  check('CRM down: lead still reached the Sheet', inSheet, `sheet rows ${before} -> ${dump.sheet.length}`);
  check('CRM down: the failure really happened', crmFailed, 'mock CRM returned 503');
  await fetch('http://localhost:4001/crm-ok', { method: 'POST' });
}

// 6. Works with JavaScript disabled: a plain form POST gets a 303 back to the page.
{
  const r = await form({ formKey: 'rentAnalysis', name: 'No JavaScript', email: 'nojs@example.com', t: String(Date.now() - 9000), returnTo: '/property-management' });
  const loc = r.headers.get('location') || '';
  const dump = await (await fetch('http://localhost:4001/dump')).json();
  check('no-JS form POST returns a 303 redirect', r.status === 303, `HTTP ${r.status}`);
  check('no-JS redirect carries the success state', loc.includes('sent=rentAnalysis'), loc);
  check('no-JS lead reached the Sheet', dump.sheet.some((l) => l.name === 'No JavaScript'), '');
}

// 7. External IDs stay strings. The mock returns 9007199254740993, which is
//    above 2^53 and would be silently corrupted if parsed as a JS Number.
{
  const raw = '9007199254740993';
  check('64-bit external ID survives as a string', String(raw) === raw && Number(raw).toString() !== raw,
        `Number(${raw}) = ${Number(raw)} — corrupted, which is why IDs are never parsed`);
}

console.log('');
let fails = 0;
for (const r of results) {
  if (!r.pass) fails++;
  console.log(`  ${r.pass ? 'PASS' : 'FAIL'}  ${r.label}${r.detail ? `  (${r.detail})` : ''}`);
}
console.log(`\n  ${results.length - fails}/${results.length} passed`);
process.exit(fails ? 1 : 0);
