/**
 * ONE DELIVERY PATH FOR EVERY LEAD, whatever produced it.
 *
 * This used to live inside the form endpoint. It was lifted out the moment the
 * chatbot started capturing leads, because two capture surfaces writing to the
 * Sheet through two different code paths is how one of them quietly stops
 * writing and nobody notices for a month.
 *
 * Delivery order and failure behaviour are unchanged and are the whole point:
 *   1. Google Sheet   <- SOURCE OF TRUTH, client-visible. Its result alone
 *                        decides what the visitor is told.
 *   2. CRM            <- explicit source tag, failures logged and swallowed
 *   3. GHL            <- skipped silently when unset
 *
 * A downstream failure is never surfaced to the visitor and never loses the
 * lead: if nothing durable accepted it, the full payload goes to the server log
 * where it is recoverable from Vercel.
 */

/** External record IDs are ALWAYS strings. Several real estate CRMs use 64-bit
 *  integers, which JavaScript silently corrupts above 2^53. Never parse one. */
export const asId = (v) => (v === null || v === undefined ? null : String(v));

export async function postJson(url, body, timeoutMs = 8000, headers = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
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

async function toSheet(lead) {
  const url = process.env.SHEETS_WEBHOOK_URL;
  if (!url) return { skipped: true, reason: 'SHEETS_WEBHOOK_URL not set' };
  return postJson(url, lead);
}

/**
 * CRM. The source tag is set EXPLICITLY, because most CRMs default unattributed
 * API leads to "Other", which destroys the reporting that proves ROI.
 *
 * FALLBACK IF THE KEY NEVER ARRIVES: the Sheet remains the record and the Apps
 * Script emails the lead to Justus on arrival, which Lofty can parse. That is
 * why the notification exists rather than being a nicety.
 */
async function toCrm(lead) {
  const key = process.env.CRM_API_KEY;
  const url = process.env.CRM_ENDPOINT_URL;
  if (!key || !url) return { skipped: true, reason: 'CRM_API_KEY or CRM_ENDPOINT_URL not set' };
  // Lofty authenticates with a HEADER, not a body field: `Authorization: token
  // <key>`. The first version put the key in the JSON body, which every CRM
  // would have rejected as unauthenticated while still returning a 2xx-looking
  // page on some endpoints. Base URL is https://api.lofty.com; the exact leads
  // path is set in CRM_ENDPOINT_URL so it can be corrected without a deploy.
  return postJson(url, {
    firstName: lead.name,
    email: lead.email,
    phone: lead.phone || null,
    note: lead.message || null,
    source: lead.source,
    sourceDetail: lead.brand,
    externalId: asId(lead.id),
  }, 8000, { Authorization: `token ${key}` });
}

async function toGhl(lead) {
  const url = process.env.GHL_WEBHOOK_URL;
  if (!url) return { skipped: true, reason: 'GHL_WEBHOOK_URL not set' };
  return postJson(url, lead);
}

export function newLeadId(brand) {
  return `${brand}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

/**
 * Deliver a lead. Returns { persisted, sheet, crm, ghl }.
 * `persisted` is true only if the Sheet accepted it.
 */
export async function deliverLead(lead) {
  const sheet = await toSheet(lead);
  const [crm, ghl] = await Promise.all([toCrm(lead), toGhl(lead)]);

  if (crm && !crm.ok && !crm.skipped) console.error('[lead] CRM push failed', lead.id, crm.status, crm.body);
  if (ghl && !ghl.ok && !ghl.skipped) console.error('[lead] GHL push failed', lead.id, ghl.status, ghl.body);

  const persisted = sheet.ok === true;
  if (!persisted) {
    // Last line of defence against a lost lead.
    console.error('[lead] NOT PERSISTED — recover from this log line:', JSON.stringify(lead));
  }

  console.log('[lead]', lead.id, lead.source, JSON.stringify({
    persisted,
    sheet: sheet.skipped ? 'skipped' : sheet.ok,
    crm: crm.skipped ? 'skipped' : crm.ok,
    ghl: ghl.skipped ? 'skipped' : ghl.ok,
  }));

  return { persisted, sheet, crm, ghl };
}
