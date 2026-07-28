import { NextResponse } from 'next/server';
import { getBrand } from '@/config';
import { bot as agentBot } from '@/content/agent/bot';
import { bot as cornerstoneBot } from '@/content/cornerstone/bot';
import { home as agentHome } from '@/content/agent/home';
import { home as cornerstoneHome } from '@/content/cornerstone/home';

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
const MAX_TOKENS = 400;              // capped: two to four sentences, never a wall
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

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
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
        messages,                            // full history: the API is stateless
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error('[chat] upstream error', res.status, detail.slice(0, 400));
      return NextResponse.json({
        reply: `Something went wrong on my end. Call or text ${b.phone.display} and you will get a person.`,
        degraded: true,
      });
    }

    const json = await res.json();
    const reply = (json.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('').trim();
    return NextResponse.json({
      reply: reply || `I am not sure about that one. Call or text ${b.phone.display} and Justus can answer it properly.`,
    });
  } catch (e) {
    console.error('[chat] request failed', e);
    return NextResponse.json({
      reply: `I could not reach my end just then. Call or text ${b.phone.display}.`,
      degraded: true,
    });
  }
}
