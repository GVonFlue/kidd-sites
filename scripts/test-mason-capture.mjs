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

// ── THE VALUE GATE. A cold opener with no request to be contacted, and no
// prior answers, must NOT produce a captured lead however eager the model is.
await fetch('http://localhost:4001/reset', { method: 'POST' });
const early = await fetch('http://localhost:3000/api/chat', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    brand: 'agent', sessionId: 'test-gate-1',
    messages: [{ role: 'user', content: 'what is a good time of year to buy?' }],
  }),
});
const earlyJson = await early.json();
const earlyDump = await (await fetch('http://localhost:4001/dump')).json();
check('cold opener does not capture', earlyDump.sheet.length === 0, `${earlyDump.sheet.length} row(s)`);
check('cold opener still gets an answer', Boolean(earlyJson.reply), String(earlyJson.reply || '').slice(0, 50));
check('cold opener not reported as captured', earlyJson.captured !== true, `captured=${earlyJson.captured}`);

// ── Same cold opener, but the visitor ASKED to be contacted. Now it must pass:
// gating someone who said "call me" is obstruction, not restraint.
await fetch('http://localhost:4001/reset', { method: 'POST' });
const asked = await fetch('http://localhost:3000/api/chat', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    brand: 'agent', sessionId: 'test-gate-2',
    messages: [{ role: 'user', content: 'Can Justus call me? Dana Reed, 316-555-0134.' }],
  }),
});
await asked.json();
const askedDump = await (await fetch('http://localhost:4001/dump')).json();
check('an explicit "call me" is captured immediately', askedDump.sheet.length === 1, `${askedDump.sheet.length} row(s)`);

// ── ALWAYS TRY FOR BOTH.
// A phone-only capture must chase the email, and the follow-up must UPDATE the
// same record rather than creating a second one. Two rows for one person is
// worse than one row with a missing field: the client calls one and emails the
// other and looks disorganised to a lead he has not spoken to yet.
await fetch('http://localhost:4001/reset', { method: 'POST' });
const SESSION = 'test-both-1';
const first = await fetch('http://localhost:3000/api/chat', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ brand: 'agent', sessionId: SESSION,
    messages: [{ role: 'user', content: 'Can Justus call me Thursday morning? Dana Reed, 316-555-0134.' }] }),
});
const firstJson = await first.json();
check('phone-only capture still saves', firstJson.captured === true, `captured=${firstJson.captured}`);
check('and asks for the email', /email/i.test(firstJson.reply || ''), String(firstJson.reply || '').slice(-60));

const second = await fetch('http://localhost:3000/api/chat', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ brand: 'agent', sessionId: SESSION,
    messages: [
      { role: 'user', content: 'Can Justus call me Thursday morning? Dana Reed, 316-555-0134.' },
      { role: 'assistant', content: 'What email should he send the valuation to?' },
      { role: 'user', content: 'dana@example.com' },
    ] }),
});
await second.json();
const bothDump = await (await fetch('http://localhost:4001/dump')).json();
const rows = bothDump.sheet;
check('two captures, two payloads sent', rows.length === 2, `${rows.length}`);
check('same lead id both times, so the sheet updates in place', rows.length === 2 && rows[0].id === rows[1].id, rows.map((r) => r.id).join(' | '));
check('the id is derived from the session, not random', String(rows[0]?.id || '').includes(SESSION), rows[0]?.id);
check('upsert flag set for the sheet', rows.every((r) => r.upsert === true));
check('the second payload carries BOTH details', Boolean(rows[1]?.email) && Boolean(rows[1]?.phone), `${rows[1]?.email} / ${rows[1]?.phone}`);
check('the follow-up did not blank the earlier phone', rows[1]?.phone === rows[0]?.phone, `${rows[0]?.phone} -> ${rows[1]?.phone}`);
check('the follow-up kept the requested time', /Thursday/.test(rows[1]?.meta?.preferredTime || ''), rows[1]?.meta?.preferredTime);

const bad = await fetch('http://localhost:3000/api/chat', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ brand: 'cornerstone', sessionId: 'test-capture-2', messages: [{ role: 'user', content: 'hello' }] }),
});
check('second brand also answers', bad.status === 200, `HTTP ${bad.status}`);

for (const p of pass) console.log('  PASS ', p);
for (const f of fail) console.log('  FAIL ', f);
console.log(`\n  ${pass.length}/${pass.length + fail.length} passed`);
if (fail.length) process.exitCode = 1;
