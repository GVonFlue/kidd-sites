/**
 * The Apps Script runs on Google's servers, not here, so it cannot be executed
 * in this repo. What CAN be checked is the thing most likely to break it: the
 * column mapping.
 *
 * `HEADERS` and the `appendRow` array have to stay the same length and the same
 * order. If they drift by one, every lead from that point on is filed under the
 * wrong heading — the phone number appears in the message column, the email in
 * the phone column — and nothing errors. It would be found weeks later by a
 * client trying to call someone back.
 */
import fs from 'node:fs';

const src = fs.readFileSync('deploy/leads-apps-script.gs', 'utf8');

const headers = src.match(/var HEADERS = \[([\s\S]*?)\];/)[1]
  .split('\n').map((l) => l.replace(/\/\/.*/, '')).join('\n')
  .split(',').map((x) => x.trim().replace(/^'|'$/g, '')).filter(Boolean);

const row = src.match(/var row = \[([\s\S]*?)\];/)[1]
  .split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('//'))
  .map((l) => l.replace(/,$/, ''));

// The upsert path writes the same array through setValues, so both writers must
// agree on the column count or an update would truncate the row.
if (!/sheet\.getRange\(updatedRow, 1, 1, row\.length\)\.setValues\(\[row\]\)/.test(src)) {
  console.log('  the update path does not write the full row');
  process.exit(1);
}
if (!/findRowById_/.test(src)) { console.log('  no upsert lookup'); process.exit(1); }

console.log(`\n  ${headers.length} headers, ${row.length} values\n`);
if (headers.length !== row.length) {
  console.log('  COLUMN COUNT MISMATCH — the sheet would be shifted.');
  process.exit(1);
}
headers.forEach((h, i) => console.log(`   ${String(i + 1).padStart(2)}  ${h.padEnd(22)} <- ${row[i]}`));

// The four the chatbot needs. Without them Mason's captures land in the sheet
// with the name and number but nothing about what the person actually wants.
const must = ['Intent', 'Timeline', 'Requested time', 'Captured by'];
const missing = must.filter((m) => !headers.includes(m));
console.log(missing.length ? `\n  MISSING: ${missing.join(', ')}` : '\n  column mapping aligned, all Mason columns present');
process.exitCode = missing.length ? 1 : 0;
