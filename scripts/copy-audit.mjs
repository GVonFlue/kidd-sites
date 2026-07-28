/**
 * Copy audit. Walks ONLY user-facing string fields in the content modules and
 * applies the fair housing (§11), voice (§7) and invented-claim rules.
 * Excludes system prompts (which legitimately QUOTE the banned terms in order to
 * forbid them), internal lead-source tags, and Phase 1 stub metadata.
 */
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SKIP_KEYS = new Set(['systemPrompt', 'source', 'purpose', 'paths', 'principle', 'note']);

const FAIR_HOUSING = [
  [/great for families|family[- ]friendly|perfect for (young )?(professionals|couples)|ideal for retirees|for families/i, 'familial status / age'],
  [/safe (neighborhood|neighbourhood|area)|low crime|crime[- ]free/i, 'safety as a race proxy'],
  [/good schools?|school (district|rating|quality)|top schools/i, 'schools as a race proxy'],
  [/up[- ]and[- ]coming|transitional (neighborhood|area)|improving area|desirable area|nice area/i, 'area characterisation'],
  [/walking distance to (a )?(church|synagogue|mosque|temple)/i, 'religious institution as a selling point'],
  [/master (bedroom|bath|suite)/i, 'use "primary"'],
  [/handicap(ped)? accessible/i, 'use "accessible" and describe features'],
  [/quality (residents|tenants)|good (residents|tenants)|the right kind of/i, 'describes the desired occupant'],
];

const VOICE = [
  [/—/, 'em-dash in client-facing copy'],
  [/^Submit$/i, 'button states the mechanism, not the outcome'],
];

const CLAIMS = [
  [/within \d+ (hour|minute|day)|in under \d+|24[- ]hour|same[- ]day (response|reply)/i, 'response-time claim the client never supplied'],
  [/\bguarantee(d|s)?\b/i, 'guarantee'],
  [/decades of experience|years of experience/i, 'experience claim (4 years in business)'],
  [/\b(#1|number one|best in|top[- ]rated|fastest)\b/i, 'unverifiable superlative'],
];

const files = [];
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    statSync(p).isDirectory() ? walk(p) : p.endsWith('.js') && files.push(p);
  }
})('src/content');

let issues = 0, strings = 0;
for (const f of files) {
  const mod = await import('../' + f);
  const seen = [];
  (function collect(v, path) {
    if (typeof v === 'string') { seen.push([path, v]); return; }
    if (Array.isArray(v)) return v.forEach((x, i) => collect(x, `${path}[${i}]`));
    if (v && typeof v === 'object')
      for (const [k, val] of Object.entries(v)) {
        if (SKIP_KEYS.has(k)) continue;
        collect(val, path ? `${path}.${k}` : k);
      }
  })(mod, '');

  for (const [path, s] of seen) {
    strings++;
    for (const [rx, why] of [...FAIR_HOUSING, ...VOICE, ...CLAIMS]) {
      if (rx.test(s)) { issues++; console.log(`  FAIL ${f} ${path}\n       ${why}\n       "${s.slice(0, 110)}"`); }
    }
  }
}
console.log(`\n  ${strings} user-facing strings checked across ${files.length} content modules`);
console.log(issues ? `  ${issues} ISSUES` : '  0 issues — fair housing, voice and claim passes all clean');
process.exit(issues ? 1 : 0);
