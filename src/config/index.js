import agent from './agent.config';
import cornerstone from './cornerstone.config';

export const BRANDS = { agent, cornerstone };

export function getBrand(key) {
  const b = BRANDS[key];
  if (!b) throw new Error(`Unknown brand "${key}". Expected one of: ${Object.keys(BRANDS).join(', ')}`);
  return b;
}

/**
 * Every null field, by name, across both brands.
 * Used by the checkpoint report and by `npm run audit:nulls` so nothing
 * unconfirmed can quietly ship as an invented value.
 */
export function nullFields(obj, path = []) {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    const p = [...path, k];
    if (v === null) out.push(p.join('.'));
    else if (Array.isArray(v)) {
      if (v.length === 0) out.push(`${p.join('.')} (empty)`);
      else v.forEach((item, i) => { if (item === null) out.push(`${p.join('.')}[${i}]`); });
    } else if (v && typeof v === 'object') out.push(...nullFields(v, p));
  }
  return out;
}
