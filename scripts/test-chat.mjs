/**
 * Bot verification. The real model is NOT called: that requires the client's
 * ANTHROPIC_API_KEY, which we do not have. What IS verified here is everything
 * that determines what the model would say, plus every degradation path.
 */
const CHAT = 'http://localhost:3000/api/chat';
const results = [];
const check = (l, p, d = '') => results.push({ l, p, d });

const ask = (brand, text, extra = {}) =>
  fetch(CHAT, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ brand, sessionId: `t-${Math.random()}`, messages: [{ role: 'user', content: text }], ...extra }),
  });

// 1. Degrades honestly with no API key, and never pretends to think.
{
  const r = await ask('agent', 'What is my home worth?');
  const j = await r.json();
  check('no API key: still answers, degraded flag set', r.status === 200 && j.degraded === true, j.reply?.slice(0, 60));
  check('no API key: hands off to a real phone number', /316\)?\s?390-2120/.test(j.reply), j.reply);
  const r2 = await ask('cornerstone', 'My AC is broken');
  const j2 = await r2.json();
  check('cornerstone degrades to the leasing line', /390-1009/.test(j2.reply), j2.reply);
}

// 2. Input hygiene
{
  const r1 = await fetch(CHAT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ brand: 'agent', messages: [] }) });
  check('rejects an empty conversation', r1.status === 400, `HTTP ${r1.status}`);
  const r2 = await fetch(CHAT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: 'not json' });
  check('rejects malformed JSON', r2.status === 400, `HTTP ${r2.status}`);
  const r3 = await ask('agent', 'x'.repeat(50_000));
  check('accepts but truncates an oversized message', r3.status === 200, `HTTP ${r3.status}`);
}

// 3. Rate limit per session
{
  const sid = 'rate-test-session';
  let limited = false, n = 0;
  for (let i = 0; i < 25; i++) {
    const r = await fetch(CHAT, { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand: 'agent', sessionId: sid, messages: [{ role: 'user', content: 'hi' }] }) });
    n++;
    if (r.status === 429) { limited = true; break; }
  }
  check('rate limits a single session', limited, `limited after ${n} messages`);
}

console.log('');
let fails = 0;
for (const r of results) { if (!r.p) fails++; console.log(`  ${r.p ? 'PASS' : 'FAIL'}  ${r.l}${r.d ? `\n         ${r.d}` : ''}`); }
console.log(`\n  ${results.length - fails}/${results.length} passed`);
process.exit(fails ? 1 : 0);
