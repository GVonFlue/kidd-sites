import { NextResponse } from 'next/server';
import { forms } from '@/content/shared/forms';

/**
 * ONE ENDPOINT, EVERY FORM, BOTH BRANDS. Build Standard §8.
 *
 * Delivery order and failure behaviour:
 *   1. Validate + honeypot + time-to-submit
 *   2. Append to the Google Sheet   <- SOURCE OF TRUTH, client-visible
 *   3. Push to the CRM              <- with an explicit source tag
 *   4. Push to GHL                  <- skipped silently when unset
 *   5. Return success if step 2 succeeded
 *
 * THE RULE THAT MATTERS: a downstream failure is never surfaced to the visitor
 * and never loses the lead. The client would far rather have a lead in a
 * spreadsheet than a visitor who saw an error and left.
 *
 * Works with JavaScript disabled. A normal form POST is answered with a redirect
 * to the page's success state; a fetch POST is answered with JSON.
 */

export const runtime = 'nodejs';

const MIN_SECONDS_ON_FORM = 3; // faster than this is a bot, not a person
const MAX_FIELD = 5000;

// ── In-memory rate limit. Per instance, which is the right scope for a
// serverless deployment: it caps a single abusive client without needing a store.
//
// The limit is deliberately generous. Several people submitting from one office
// wifi, or from behind a single NAT at an open house, share an IP — and on a
// lead-capture site, blocking a real lead is a far worse outcome than accepting
// a few junk ones, which the honeypot and the timing check catch anyway.
// Tunable, because the right number depends on the client's traffic shape.
const RATE_LIMIT = Number(process.env.LEAD_RATE_LIMIT || 20);

const hits = new Map();
function rateLimited(ip, limit = RATE_LIMIT, windowMs = 60_000) {
  const now = Date.now();
  const rec = hits.get(ip) || { n: 0, reset: now + windowMs };
  if (now > rec.reset) { rec.n = 0; rec.reset = now + windowMs; }
  rec.n += 1;
  hits.set(ip, rec);
  if (hits.size > 5000) hits.clear();
  return rec.n > limit;
}

const isEmail = (s) => typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());

/** External record IDs are ALWAYS strings. Several real estate CRMs use 64-bit
 *  integers, which JavaScript silently corrupts above 2^53. Never parse one. */
const asId = (v) => (v === null || v === undefined ? null : String(v));

async function postJson(url, body, timeoutMs = 8000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    const text = await res.text().catch(() => '');
    return { ok: res.ok, status: res.status, body: text.slice(0, 500) };
  } catch (e) {
    return { ok: false, status: 0, body: String(e && e.message ? e.message : e) };
  } finally {
    clearTimeout(t);
  }
}

// ── Step 2. Source of truth ─────────────────────────────────────────────────
async function toSheet(lead) {
  const url = process.env.SHEETS_WEBHOOK_URL;
  if (!url) return { skipped: true, reason: 'SHEETS_WEBHOOK_URL not set' };
  return postJson(url, lead);
}

// ── Step 3. CRM. Source tag set EXPLICITLY, because most CRMs default
// unattributed API leads to "Other", which destroys the reporting that proves
// ROI at the 60-day case study.
//
// Lofty (formerly Chime): the Open API is NOT gated behind a plan tier. The
// client gets their own key from Settings > Integrations > API in Lofty. A
// developer account with a risk assessment is only needed to publish a public
// integration, which this is not.
//
// FALLBACK IF THE KEY NEVER ARRIVES (Build Standard §8 requires one to be
// identified up front): the Google Sheet remains the record, and the Apps
// Script emails the lead to justus@agentkidd.com on arrival. Lofty can ingest
// leads by parsing that email, so the lead reaches the CRM either way. That is
// the reason the notification exists rather than being a nicety. ────────────
async function toCrm(lead) {
  const key = process.env.CRM_API_KEY;
  const url = process.env.CRM_ENDPOINT_URL;
  if (!key || !url) return { skipped: true, reason: 'CRM_API_KEY or CRM_ENDPOINT_URL not set' };
  const res = await postJson(url, {
    apiKey: key,
    firstName: lead.name,
    email: lead.email,
    phone: lead.phone || null,
    note: lead.message || null,
    source: lead.source,          // distinct per brand AND per form
    sourceDetail: lead.brand,
    externalId: asId(lead.id),
  });
  return res;
}

// ── Step 4. GHL. Skipped silently until it is live. ─────────────────────────
async function toGhl(lead) {
  const url = process.env.GHL_WEBHOOK_URL;
  if (!url) return { skipped: true, reason: 'GHL_WEBHOOK_URL not set' };
  return postJson(url, lead);
}

function parseBody(raw, contentType) {
  if (contentType.includes('application/json')) return JSON.parse(raw);
  const out = {};
  new URLSearchParams(raw).forEach((v, k) => { out[k] = v; });
  return out;
}

export async function POST(request) {
  const contentType = request.headers.get('content-type') || '';
  const wantsJson =
    contentType.includes('application/json') ||
    (request.headers.get('accept') || '').includes('application/json');

  const fail = (message, status = 400, redirect = null) =>
    wantsJson
      ? NextResponse.json({ ok: false, error: message }, { status })
      : NextResponse.redirect(redirect || new URL('/?error=1', request.url), 303);

  let data;
  try {
    data = parseBody(await request.text(), contentType);
  } catch {
    return fail('Could not read that submission.');
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  // ── Anti-spam. Honeypot plus a minimum time on the form. No CAPTCHA:
  // at this traffic volume it costs more conversions than it saves.
  if (data.company) {
    // A bot filled the hidden field. Answer exactly as if it succeeded, so it
    // learns nothing, and drop the submission.
    return wantsJson
      ? NextResponse.json({ ok: true })
      : NextResponse.redirect(new URL(data.returnTo || '/', request.url), 303);
  }

  const renderedAt = Number(data.t || 0);
  if (renderedAt && (Date.now() - renderedAt) / 1000 < MIN_SECONDS_ON_FORM) {
    return wantsJson
      ? NextResponse.json({ ok: true })
      : NextResponse.redirect(new URL(data.returnTo || '/', request.url), 303);
  }

  if (rateLimited(ip)) return fail('Too many submissions. Try again in a minute.', 429);

  // ── Validation. The form definition is the schema, so a source tag cannot be
  // spoofed into something that is not a real form on this site.
  const formKey = String(data.formKey || '');
  const def = forms[formKey];
  if (!def) return fail('Unknown form.');

  const name = String(data.name || '').trim().slice(0, MAX_FIELD);
  const email = String(data.email || '').trim().slice(0, MAX_FIELD);
  if (!name) return fail('Add your name so he knows who he is replying to.');
  if (!isEmail(email)) return fail('That email address is missing something. Check for a typo.');

  const meta = {};
  for (const f of def.fields) {
    if (['name', 'email'].includes(f)) continue;
    const v = data[f];
    if (v !== undefined && v !== null && String(v).trim() !== '') {
      meta[f] = String(v).trim().slice(0, MAX_FIELD);
    }
  }

  const lead = {
    id: `${def.brand}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
    brand: def.brand,                 // which site
    source: def.source,               // which form, human-readable
    name,
    email,
    phone: meta.phoneOptional || meta.phone || null,
    message: meta.message || null,
    meta,
    receivedAt: new Date().toISOString(),
    userAgent: (request.headers.get('user-agent') || '').slice(0, 300),
  };

  // ── Delivery. Sheet first, and its result alone decides what the visitor sees.
  const sheet = await toSheet(lead);

  // CRM and GHL run after, and their failures are logged and swallowed.
  const [crm, ghl] = await Promise.all([toCrm(lead), toGhl(lead)]);
  if (crm && !crm.ok && !crm.skipped) console.error('[lead] CRM push failed', lead.id, crm.status, crm.body);
  if (ghl && !ghl.ok && !ghl.skipped) console.error('[lead] GHL push failed', lead.id, ghl.status, ghl.body);

  const persisted = sheet.ok === true;
  if (!persisted) {
    // Nothing durable accepted this lead. The visitor must still be told it
    // worked, so the full payload goes to the server log where it is recoverable
    // from Vercel. This line is the last line of defence against a lost lead.
    console.error('[lead] NOT PERSISTED — recover from this log line:', JSON.stringify(lead));
  }

  const status = { persisted, sheet, crm, ghl };
  console.log('[lead]', lead.id, lead.source, JSON.stringify({
    persisted, sheet: sheet.skipped ? 'skipped' : sheet.ok, crm: crm.skipped ? 'skipped' : crm.ok, ghl: ghl.skipped ? 'skipped' : ghl.ok,
  }));

  // The visitor sees success either way. Build Standard §8: never surface an
  // integration failure to the end user.
  if (wantsJson) return NextResponse.json({ ok: true, success: def.success, _status: process.env.NODE_ENV === 'production' ? undefined : status });

  const back = new URL(data.returnTo || '/', request.url);
  back.searchParams.set('sent', formKey);
  return NextResponse.redirect(back, 303);
}

export async function GET() {
  return NextResponse.json({ ok: false, error: 'POST only' }, { status: 405 });
}
