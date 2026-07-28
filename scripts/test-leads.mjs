/** Every conversion path, submitted for real, and checked for where it landed. */
const FORMS = [
  ['valuation',         'agent',       '/sell'],
  ['buyerGuide',        'agent',       '/buy'],
  ['investorAnalysis',  'agent',       '/investors'],
  ['contactAgent',      'agent',       '/contact'],
  ['rentAnalysis',      'cornerstone', '/property-management'],
  ['ownerGuide',        'cornerstone', '/property-management'],
  ['hoaBoardGuide',     'cornerstone', '/hoa'],
  ['hoaReview',         'cornerstone', '/hoa'],
  ['commercialInquiry', 'cornerstone', '/commercial'],
  ['contactCornerstone','cornerstone', '/contact'],
];
const post = (body, headers = {}) =>
  fetch('http://localhost:3000/api/lead', {
    method: 'POST', redirect: 'manual',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...headers },
    body: JSON.stringify(body),
  });

await fetch('http://localhost:4001/reset', { method: 'POST' });
const rows = [];
for (const [formKey, brand, path] of FORMS) {
  const r = await post({
    formKey, name: `Test ${formKey}`, email: `test+${formKey}@example.com`,
    phoneOptional: '3165550123', address: '123 Test St, Wichita', message: 'end to end test',
    associationName: 'Test Association', unitCount: '80', role: 'Board president',
    squareFeet: '2000', moveIn: 'October', units: '4',
    t: Date.now() - 9000, returnTo: path,
  });
  const j = await r.json().catch(() => ({}));
  rows.push({ formKey, brand, path, status: r.status, ok: j.ok === true, success: !!j.success?.heading });
  await new Promise((s) => setTimeout(s, 120));
}
const dump = await (await fetch('http://localhost:4001/dump')).json();
console.log('FORM                 BRAND        HTTP  ok   successCopy  sheet  crm  ghl');
for (const r of rows) {
  const inSheet = dump.sheet.filter((l) => l.source && l.source.includes(r.formKey === 'contactAgent' ? 'Contact' : '')).length;
  const s = dump.sheet.some((l) => l.name === `Test ${r.formKey}`);
  const c = dump.crm.some((l) => l.firstName === `Test ${r.formKey}`);
  const g = dump.ghl.some((l) => l.name === `Test ${r.formKey}`);
  console.log(`${r.formKey.padEnd(20)} ${r.brand.padEnd(12)} ${String(r.status).padEnd(5)} ${String(r.ok).padEnd(4)} ${String(r.success).padEnd(12)} ${s ? 'YES' : 'no '}    ${c ? 'YES' : 'no '}  ${g ? 'YES' : 'no '}`);
}
console.log(`\nsheet rows: ${dump.sheet.length}, crm rows: ${dump.crm.length}, ghl rows: ${dump.ghl.length}`);
console.log('\nsource tags recorded in the Sheet (this is how the client sees which page produces business):');
[...new Set(dump.sheet.map((l) => `${l.brand}  |  ${l.source}`))].sort().forEach((s) => console.log('  ' + s));
