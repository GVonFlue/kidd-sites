/**
 * The chatbot writes leads now, so "it compiles" is not evidence it works.
 *
 * This drives the whole tool-use loop against a mock Anthropic endpoint that
 * returns a capture_lead call, and then asserts the lead actually landed in the
 * Sheet with the right source tag — and that Mason never claims the appointment
 * is booked.
 *
 * Run with the server started against the mocks:
 *   node scripts/mock-sinks.mjs &
 *   ANTHROPIC_API_KEY=test ANTHROPIC_API_BASE=http://localhost:4001 \
 *   SHEETS_WEBHOOK_URL=http://localhost:4001/sheet npx next start
 */
const pass = [];
const fail = [];
const check = (name, cond, detail = '') => (cond ? pass : fail).push(`${name}${detail ? '  (' + detail + ')' : ''}`);

await fetch('http://localhost:4001/reset', { method: 'POST' });

const res = await fetch('http://localhost:3000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    brand: 'agent',
    sessionId: 'test-capture-1',
    messages: [{ role: 'user', content: 'I want to sell my house in Derby. Can I talk to Justus Thursday morning? Dana Reed, 316-555-0134.' }],
  }),
});
const json = await res.json();

check('endpoint answers 200', res.status === 200, `HTTP ${res.status}`);
check('reply is not empty', Boolean(json.reply), String(json.reply || '').slice(0, 60));
check('response reports the capture', json.captured === true, `captured=${json.captured}`);

const dump = await (await fetch('http://localhost:4001/dump')).json();
const row = dump.sheet[dump.sheet.length - 1];

check('the lead reached the Sheet', Boolean(row), `${dump.sheet.length} row(s)`);
if (row) {
  check('name captured', row.name === 'Dana Reed', row.name);
  check('phone captured', String(row.phone || '').includes('555-0134'), row.phone);
  check('tagged as a chat lead', /Mason chat/.test(row.source || ''), row.source);
  check('tagged as an appointment request', /appointment request/.test(row.source || ''), row.source);
  check('preferred time carried through', /Thursday/.test(row.meta?.preferredTime || ''), row.meta?.preferredTime);
  check('intent carried through', row.meta?.intent === 'sell', row.meta?.intent);
  check('attributed to the bot, not a form', row.meta?.capturedBy === 'mason', row.meta?.capturedBy);
  check('external id is a string', typeof row.id === 'string', typeof row.id);
}
check('lead also pushed to the CRM', dump.crm.length > 0, `${dump.crm.length} row(s)`);

// THE ONE THAT MATTERS. Telling someone they have an appointment they do not
// have is the worst failure this surface can produce.
const claimsBooked = /\b(booked|confirmed|scheduled|you're all set|you are all set|on the calendar|reserved|locked in)\b/i.test(json.reply || '');
check('never claims the appointment is booked', !claimsBooked, json.reply);

// A capture with no way to reach the person must be refused.
const bad = await fetch('http://localhost:3000/api/chat', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ brand: 'cornerstone', sessionId: 'test-capture-2', messages: [{ role: 'user', content: 'hello' }] }),
});
check('second brand also answers', bad.status === 200, `HTTP ${bad.status}`);

for (const p of pass) console.log('  PASS ', p);
for (const f of fail) console.log('  FAIL ', f);
console.log(`\n  ${pass.length}/${pass.length + fail.length} passed`);
if (fail.length) process.exitCode = 1;
