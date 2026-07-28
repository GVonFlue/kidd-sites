/**
 * The system prompt is what actually determines the bot's behaviour, so it is
 * asserted directly. Build Standard §9: the prompt must be built FROM config and
 * content so the bot cannot contradict the site. §11: fair housing is absolute.
 */
import agentCfg from '../src/config/agent.config.js';
import csCfg from '../src/config/cornerstone.config.js';
const getBrand = (k) => (k === 'agent' ? agentCfg : csCfg);
import { bot as agentBot } from '../src/content/agent/bot.js';
import { bot as csBot } from '../src/content/cornerstone/bot.js';

const results = [];
const check = (l, p, d = '') => results.push({ l, p, d });

for (const [key, bot] of [['agent', agentBot], ['cornerstone', csBot]]) {
  const b = getBrand(key);
  const p = bot.systemPrompt;
  const T = (label, cond, detail) => check(`[${key}] ${label}`, cond, detail);

  // Fair housing — the required prohibitions, each present.
  T('fair housing block present', /FAIR HOUSING\. THIS IS ABSOLUTE\./.test(p));
  T('refuses neighbourhood demographics', /demographics or composition/i.test(p));
  T('refuses school quality', /school quality or school rankings/i.test(p));
  T('refuses safety and crime', /safe, or anything about crime/i.test(p));
  T('forbids describing the desired occupant', /Never describe the desired occupant/i.test(p));
  T('requires refusing rather than partially answering', /do not answer even partially/i.test(p));
  T('points at public data sources instead', /census data/i.test(p));
  T('primary bedroom, not master', /master\s*\n?bedroom"?;\s*say primary bedroom/i.test(p.replace(/\n/g, ' ')) || /say primary bedroom/i.test(p));

  // never_say
  T('never_say list present', /NEVER SAY \(client prohibition list/.test(p));
  T('no profanity rule', /Never swear/.test(p));

  // Cannot invent
  T('forbids inventing a price or fee', /Never state a price/i.test(p));
  T('forbids inventing a timeframe or response time', /timeframe/i.test(p) && /response time/i.test(p));
  T('forbids inventing a guarantee', /guarantee/i.test(p));

  // Identity honesty
  T('states it is not Justus', /You are not Justus/.test(p));

  // Scope
  T('scope limits present', /SCOPE/.test(p));
  T('refuses legal and tax advice', /legal, tax/i.test(p));

  // The real phone number is in the prompt and matches config
  T('carries a phone number that matches config', p.includes(b.phone.display.replace(/[()]/g, '').trim()) || p.includes(b.phone.display));
  // No em-dashes in the bot's own instructions about its voice
  T('instructed never to use em-dashes', /Never use em-dashes/.test(p));
}

// Cornerstone-specific: maintenance triage
{
  const p = csBot.systemPrompt;
  check('[cornerstone] maintenance triage instructions', /MAINTENANCE/.test(p));
  check('[cornerstone] emergencies bypass screening', /Do not run screening questions on an emergency/.test(p));
  check('[cornerstone] does not promise a maintenance timeframe', /Do not promise a\s*\n?timeframe/.test(p));
  check('[cornerstone] screening criteria may be stated, outcomes may not',
    /you may state the criteria/i.test(p) && /never\s*\n?indicate how a particular person would fare/i.test(p.replace(/\s+/g, ' ')) || /never indicate how a particular person would fare/i.test(p.replace(/\s+/g, ' ')));
  check('[cornerstone] subsidized housing: describe the work, never the residents',
    /never describe or characterise the people who live in/i.test(p.replace(/\s+/g, ' ')));
  check('[cornerstone] third screening question is null, not invented',
    csBot.maintenance.screening.includes(null) && csBot.maintenance.screening.filter(Boolean).length === 2);
  check('[cornerstone] dispatch channel is iMessage, not WhatsApp', csCfg.bot.dispatchChannel === 'imessage', csCfg.bot.dispatchChannel);
}

// Chip structure, Build Standard §9: exactly three, two informational, one conversion.
for (const [key, bot] of [['agent', agentBot], ['cornerstone', csBot]]) {
  check(`[${key}] exactly three chips`, bot.chips.length === 3, `${bot.chips.length}`);
  check(`[${key}] two informational, one conversion`,
    bot.chips.filter((c) => c.kind === 'informational').length === 2 &&
    bot.chips.filter((c) => c.kind === 'conversion').length === 1);
  check(`[${key}] greeting is first person and one short paragraph`,
    /^Hi, I am /.test(bot.greeting) && bot.greeting.split(/\n\n/).length === 1);
  check(`[${key}] live status line`, /Live/.test(bot.statusLine));
}

console.log('');
let fails = 0;
for (const r of results) { if (!r.p) fails++; console.log(`  ${r.p ? 'PASS' : 'FAIL'}  ${r.l}${r.d ? ` (${r.d})` : ''}`); }
console.log(`\n  ${results.length - fails}/${results.length} passed`);
process.exit(fails ? 1 : 0);
