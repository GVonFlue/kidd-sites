// Lists every unconfirmed config field by name. Run before any checkpoint.
// Existence of this script is the enforcement of "never guess a value".
import { readFileSync } from 'node:fs';

const strip = (s) => s.replace(/^export (const|default) /gm, '');
for (const b of ['agent', 'cornerstone']) {
  const src = readFileSync(`src/config/${b}.config.js`, 'utf8');
  const nulls = [...src.matchAll(/^\s*([a-zA-Z]+):\s*null,/gm)].map((m) => m[1]);
  const empties = [...src.matchAll(/^\s*([a-zA-Z]+):\s*\[\],/gm)].map((m) => m[1] + ' (empty)');
  console.log(`\n${b}: ${nulls.length + empties.length} unconfirmed`);
  [...nulls, ...empties].forEach((n) => console.log('  - ' + n));
}
