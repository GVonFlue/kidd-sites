import { NextResponse } from 'next/server';
import { forms } from '@/content/shared/forms';
import { deliverLead, newLeadId } from '@/lib/leads';

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
    id: newLeadId(def.brand),
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

  // ── Delivery. One shared path with the chatbot, so both capture surfaces
  // write to the Sheet through exactly the same code.
  const status = await deliverLead(lead);

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
