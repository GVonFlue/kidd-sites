import { NextResponse } from 'next/server';
import { getBrand } from '@/config';
import { bot as agentBot } from '@/content/agent/bot';
import { bot as cornerstoneBot } from '@/content/cornerstone/bot';
import { home as agentHome } from '@/content/agent/home';
import { home as cornerstoneHome } from '@/content/cornerstone/home';
import { deliverLead, newLeadId } from '@/lib/leads';

/**
 * The chatbot endpoint. Build Standard §9.
 *
 * The system prompt is BUILT FROM the brand config and the content files, so the
 * bot physically cannot contradict the site: the facts it is given are the same
 * objects the pages render from. If a phone number changes in config, it changes
 * in the bot's mouth in the same commit.
 *
 * Fair housing and scope limits are written into every prompt (Build Standard
 * §11). This is the highest-liability surface on a real estate site, because a
 * chatbot will answer a question a human would deflect.
 */

export const runtime = 'nodejs';

const MODEL = 'claude-haiku-4-5';
// Overridable so the tool-use loop can be exercised end to end against a mock
// in tests. This code writes leads, so "it compiles" is not evidence it works.
const API_BASE = process.env.ANTHROPIC_API_BASE || 'https://api.anthropic.com';
const MAX_TOKENS = 500;              // capped: two to four sentences, never a wall
const MAX_MESSAGE_CHARS = 1500;
const MAX_HISTORY = 24;
const RATE_LIMIT = 20;               // per session per window
const WINDOW_MS = 5 * 60_000;

const BOTS = { agent: agentBot, cornerstone: cornerstoneBot };
const HOMES = { agent: agentHome, cornerstone: cornerstoneHome };

const sessions = new Map();
function rateLimited(sessionId) {
  const now = Date.now();
  const rec = sessions.get(sessionId) || { n: 0, reset: now + WINDOW_MS };
  if (now > rec.reset) { rec.n = 0; rec.reset = now + WINDOW_MS; }
  rec.n += 1;
  sessions.set(sessionId, rec);
  if (sessions.size > 5000) sessions.clear();
  return rec.n > RATE_LIMIT;
}

/** Facts, assembled from the same config and content the pages use. */
function factSheet(brandKey) {
  const b = getBrand(brandKey);
  const home = HOMES[brandKey];
  const lines = [
    `Brand: ${b.name}${b.legalName ? ` (${b.legalName})` : ''}`,
    `Website: ${b.domain}`,
    `Address: ${b.address.street}, ${b.address.city}, ${b.address.state} ${b.address.zip}`,
    `${b.phone.label}: ${b.phone.display}`,
    b.altPhone ? `${b.altPhone.label}: ${b.altPhone.display}` : null,
    b.email ? `Email: ${b.email}` : null,
    `Licence: ${b.compliance.licenseState} ${b.compliance.licenseId}, brokered by ${b.compliance.brokerage}`,
    '',
    'VERIFIED FIGURES. Use these exactly. Do not round them differently, do not',
    'extrapolate from them, and do not state any figure that is not on this list.',
    ...Object.entries(b.stats || {}).map(([k, v]) => `  ${k}: ${v}`),
    b.subsidizedPrograms ? `  subsidized programmes administered: ${b.subsidizedPrograms.join(', ')}` : null,
    b.awards?.length ? `  awards: ${b.awards.join('; ')}` : null,
    '',
    'WHAT THE SITE SAYS ABOUT ITSELF (do not contradict this):',
    `  ${home.hero.heading}`,
    `  ${home.hero.body}`,
  ];
  return lines.filter(Boolean).join('\n');
}

function buildSystemPrompt(brandKey) {
  const bot = BOTS[brandKey];
  const b = getBrand(brandKey);
  const parts = [bot.systemPrompt, '', '--- VERIFIED FACTS ---', factSheet(brandKey)];

  if (bot.maintenance) {
    const screening = bot.maintenance.screening.filter(Boolean);
    parts.push(
      '',
      '--- MAINTENANCE SCREENING ---',
      screening.length
        ? `Ask these in order before escalating:\n${screening.map((q, i) => `  ${i + 1}. ${q}`).join('\n')}`
        : 'No screening questions are configured. Escalate directly.',
      bot.maintenance.screening.includes(null)
        ? 'One further screening question exists but has not been supplied yet. Do not invent it.'
        : null,
      `Emergencies: ${bot.maintenance.emergencyCopy}`,
    );
  }

  if (!b.external.booking) {
    parts.push(
      '',
      'BOOKING: no calendar link is configured yet. If someone wants to book, give',
      `them the phone number (${b.phone.display}) rather than claiming a calendar exists.`,
    );
  }
  return parts.filter(Boolean).join('\n');
}


/**
 * THE CAPTURE TOOL. This is the difference between a chatbot and a front desk.
 *
 * Mason used to end conversations by handing out the phone number, which puts
 * the entire burden of following up on a stranger who is already hesitating.
 * Now he collects the details himself and writes them to the same Google Sheet
 * the forms write to, through the same code path, with a distinct source tag so
 * the client can see how much business the bot produces.
 *
 * It is a TOOL rather than a parsing step for one reason: parsing a name and a
 * phone number out of free text is guesswork, and a lead captured wrong is
 * worse than one not captured. A tool call is structured, validated, and either
 * happens or does not.
 *
 * IT CANNOT CONFIRM AN APPOINTMENT. There is no calendar connected yet, so
 * `preferredTime` is a REQUEST, and the tool result says so in words the model
 * then has to relay. The moment a booking link exists this becomes a real
 * confirmation; until then Mason is forbidden from implying a slot is held.
 */
const CAPTURE_TOOL = {
  name: 'capture_lead',
  description:
    'Record a visitor\'s contact details so Justus can follow up, and optionally request an appointment time. ' +
    'DO NOT call this early. Help them first. It is only appropriate once EITHER the visitor has asked to be ' +
    'contacted, booked, called, texted or sent something, OR you have already given them at least two ' +
    'substantive, useful answers and they are still engaged. ' +
    'Requires a name AND at least one of email or phone, but ALWAYS TRY FOR BOTH. ' +
    'Call it again with the same person once you have the missing one, and the record is updated in place ' +
    'rather than duplicated. Do not call it with placeholder or invented values.',
  input_schema: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'The visitor\'s name, exactly as they gave it.' },
      email: { type: 'string', description: 'Email address. Always try to get this, even if you already have a phone number.' },
      phone: { type: 'string', description: 'Phone number. Always try to get this, even if you already have an email.' },
      intent: {
        type: 'string',
        enum: ['buy', 'sell', 'invest', 'rent', 'owner', 'hoa', 'maintenance', 'other'],
        description: 'What they are trying to do.',
      },
      timeline: { type: 'string', description: 'When they are looking to act, in their words. Omit if not said.' },
      preferredTime: {
        type: 'string',
        description: 'A day and time window they asked for, in their words. Omit unless they asked for one.',
      },
      notes: { type: 'string', description: 'One or two sentences on what they actually want. No speculation.' },
    },
    required: ['name', 'intent'],
  },
};

const SOURCE_LABEL = {
  agent: 'Agent Kidd - Mason chat',
  cornerstone: 'Cornerstone - Mason chat',
};

/**
 * Has the visitor actually asked to be contacted? Then capture is welcome at any
 * point and gating it would be obstructive.
 */
const ASKED_FOR_CONTACT =
  /\b(call me|text me|email me|contact me|reach me|get in touch|book|booking|schedule|appointment|set up a time|meet|come see|send (me|it)|sign me up|talk to (justus|someone|a person|him)|speak to)\b/i;

/**
 * THE VALUE GATE.
 *
 * The prompt tells Mason to help before he asks. This enforces it, because a
 * prompt is a preference and a visitor who gets asked for their phone number in
 * the first reply closes the tab. A bot that trades an answer for a contact
 * detail on turn one is a form with extra steps, and the entire premise of the
 * panel is "no form, no pressure".
 *
 * Two ways through:
 *   - the visitor asked to be contacted, booked or sent something, or
 *   - Mason has already given at least two substantive answers.
 *
 * When it blocks, it tells the model exactly what to do instead, so the visitor
 * never sees a stall.
 */
function tooEarly(messages) {
  const asked = messages.some((m) => m.role === 'user' && ASKED_FOR_CONTACT.test(m.content));
  if (asked) return null;

  // A greeting is not an answer. Count only replies with real substance.
  const substantive = messages.filter((m) => m.role === 'assistant' && m.content.trim().length > 120).length;
  if (substantive >= 2) return null;

  return (
    'TOO EARLY. You have given this person ' + substantive + ' substantive answer(s) and they have not asked ' +
    'to be contacted. Do not ask for their details yet. Answer what they asked properly, then offer them ' +
    'something useful they did not think to ask for. Ask a question about their situation. Only take details ' +
    'once you have actually helped, or once they ask you to.'
  );
}

/**
 * What has already been captured this session, so a follow-up that adds the
 * missing email updates the record instead of creating a second one.
 *
 * Best-effort: serverless instances do not share memory, so a second request can
 * land somewhere that has never seen this session. That is why the lead id is
 * DERIVED FROM THE SESSION rather than generated — the id is identical either
 * way, and the sheet upserts on it, so a lost cache costs nothing.
 */
const captured = new Map();

async function runCapture(brandKey, input, sessionId) {
  const b = getBrand(brandKey);
  const name = String(input.name || '').trim().slice(0, 200);
  const email = String(input.email || '').trim().slice(0, 200);
  const phone = String(input.phone || '').trim().slice(0, 60);

  // A lead with no way to reach the person is not a lead. Refuse, and tell the
  // model exactly what is missing so it asks for that and only that.
  if (!name) return { ok: false, message: 'No name was supplied. Ask for their name before calling this again.' };
  if (!email && !phone) {
    return { ok: false, message: 'No email and no phone. Ask for whichever they prefer, then call this again.' };
  }

  // Merge with anything already taken this session, so a second call that only
  // carries the email does not blank out the phone number from the first.
  const prior = captured.get(sessionId) || {};
  const merged = {
    email: email || prior.email || null,
    phone: phone || prior.phone || null,
    intent: input.intent || prior.intent || 'other',
    timeline: String(input.timeline || '').slice(0, 200) || prior.timeline || '',
    preferredTime: String(input.preferredTime || '').slice(0, 200) || prior.preferredTime || '',
    notes: String(input.notes || '').slice(0, 2000) || prior.notes || '',
    name: name || prior.name,
  };
  const isUpdate = Boolean(prior.name);

  const wantsAppointment = Boolean(merged.preferredTime);
  const lead = {
    // Derived, not random: the same visitor in the same session always produces
    // the same id, so the sheet can update the row rather than append a twin.
    id: `${brandKey}-chat-${sessionId}`.slice(0, 120),
    brand: brandKey,
    source: `${SOURCE_LABEL[brandKey]}${wantsAppointment ? ' (appointment request)' : ''}`,
    name: merged.name,
    email: merged.email,
    phone: merged.phone,
    message: merged.notes || null,
    upsert: true,               // the Apps Script updates the row with this id
    meta: {
      intent: merged.intent,
      timeline: merged.timeline || undefined,
      preferredTime: merged.preferredTime || undefined,
      capturedBy: 'mason',
      sessionId,
    },
    receivedAt: new Date().toISOString(),
  };

  const status = await deliverLead(lead);
  captured.set(sessionId, merged);
  if (captured.size > 5000) captured.clear();

  // ── Chase the missing one. An email and a phone are worth far more together:
  // a phone number alone cannot be sent the guide, and an email alone cannot be
  // called back the same afternoon. Ask ONCE, with a reason, then let it go.
  const missing = !merged.email ? 'email' : !merged.phone ? 'phone' : null;
  const chase = missing === 'email'
    ? ` You still do not have an email address for them. Ask for it ONCE, and give a reason: it is how Justus sends the valuation, the guide or anything in writing. If they decline, drop it and do not ask again. When you get it, call capture_lead again with the same details plus the email.`
    : missing === 'phone'
      ? ` You still do not have a phone number for them. Ask for it ONCE, and give a reason: it is the fastest way for Justus to reach them. If they decline, drop it and do not ask again. When you get it, call capture_lead again with the same details plus the number.`
      : '';

  // What comes back here is what the model will paraphrase to the visitor, so
  // it must be literally true. When nothing persisted, the visitor is still
  // told it worked (the payload is recoverable from the log) because telling
  // them to try again loses the lead outright.
  const verb = isUpdate ? 'Updated' : 'Saved';
  if (wantsAppointment) {
    return {
      ok: true,
      message:
        `${verb} for ${merged.name}. The requested time "${merged.preferredTime}" has been passed to Justus as a REQUEST, not a booking. ` +
        `Tell the visitor Justus will confirm the time directly. Do NOT tell them the appointment is booked or held. ` +
        `They can also reach him now on ${b.phone.display}.` + chase,
    };
  }
  return {
    ok: true,
    message:
      `${verb} for ${merged.name}. Tell them Justus will follow up on ${merged.email || merged.phone}. ` +
      `Do not promise a response time. They can also reach him now on ${b.phone.display}.` + chase,
  };
}

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 });
  }

  const brandKey = payload.brand === 'cornerstone' ? 'cornerstone' : 'agent';
  const sessionId = String(payload.sessionId || '').slice(0, 80) || 'anon';

  if (rateLimited(sessionId)) {
    const b = getBrand(brandKey);
    return NextResponse.json(
      { reply: `I have hit my limit for now. Call or text ${b.phone.display} and you will get a person.`, limited: true },
      { status: 429 },
    );
  }

  const incoming = Array.isArray(payload.messages) ? payload.messages : [];
  if (!incoming.length) return NextResponse.json({ error: 'No message.' }, { status: 400 });

  // Reject oversized input rather than paying to process it.
  const messages = incoming
    .slice(-MAX_HISTORY)
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }));
  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    return NextResponse.json({ error: 'No message.' }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  const b = getBrand(brandKey);
  if (!apiKey) {
    // Graceful, honest degradation. Never pretend to be thinking.
    return NextResponse.json({
      reply: `I am not connected yet. Call or text ${b.phone.display} and you will get a person straight away.`,
      degraded: true,
    });
  }

  const callClaude = (msgs) =>
    fetch(`${API_BASE}/v1/messages`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,                 // server side only, never in the bundle
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: buildSystemPrompt(brandKey),
        tools: [CAPTURE_TOOL],
        messages: msgs,                      // full history: the API is stateless
      }),
    });

  const textOf = (json) =>
    (json.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('').trim();

  try {
    // Up to two turns: one to call the tool, one to speak after the result.
    // Bounded deliberately. A loop here is a loop on the client's API bill.
    let convo = messages;
    let captured = false;

    for (let turn = 0; turn < 2; turn += 1) {
      const res = await callClaude(convo);
      if (!res.ok) {
        const detail = await res.text().catch(() => '');
        console.error('[chat] upstream error', res.status, detail.slice(0, 400));
        return NextResponse.json({
          reply: `Something went wrong on my end. Call or text ${b.phone.display} and you will get a person.`,
          degraded: true,
        });
      }

      const json = await res.json();
      const toolUse = (json.content || []).find((c) => c.type === 'tool_use' && c.name === 'capture_lead');

      if (!toolUse) {
        const reply = textOf(json);
        return NextResponse.json({
          reply: reply || `I am not sure about that one. Call or text ${b.phone.display} and Justus can answer it properly.`,
          captured,
        });
      }

      const early = tooEarly(convo);
      const result = early
        ? { ok: false, message: early }
        : await runCapture(brandKey, toolUse.input || {}, sessionId);
      captured = captured || result.ok === true;

      convo = [
        ...convo,
        { role: 'assistant', content: json.content },
        { role: 'user', content: [{ type: 'tool_result', tool_use_id: toolUse.id, content: result.message }] },
      ];
    }

    // Two turns used and still no plain answer. Say something true rather than
    // nothing, and let the visitor know the details are in.
    return NextResponse.json({
      reply: captured
        ? `I have got that down and passed it to Justus. If you would rather not wait, he is on ${b.phone.display}.`
        : `Let me get Justus on this one. He is on ${b.phone.display}.`,
      captured,
    });
  } catch (e) {
    console.error('[chat] request failed', e);
    return NextResponse.json({
      reply: `I could not reach my end just then. Call or text ${b.phone.display}.`,
      degraded: true,
    });
  }
}
