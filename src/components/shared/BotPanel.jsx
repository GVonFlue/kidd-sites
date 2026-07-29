import BotClient from './BotClient';
import Reveal from './Reveal';
import { Eyebrow, H2 } from './Section';

/**
 * Mason — the conversational surface. Build Standard §9.
 *
 * Rebuilt in the ProyTech / gvonflue idiom. Three things changed, each for a
 * reason:
 *
 * 1. IT HAS A SECTION, not just a panel. An eyebrow, a headline that names it,
 *    three chips stating its job. A bare input box asks the visitor to invent a
 *    question; a named agent with a stated job tells them what to ask.
 * 2. IT OPENS ON A CONVERSATION, not an empty box. A short scripted exchange
 *    shows what it is good at before anyone types. On Cornerstone the sample is
 *    a maintenance call resolved without a technician, because keeping those off
 *    Justus's phone is the actual product.
 * 3. IT LOOKS LIVE. Status dot, sender labels, a timing note on the reply.
 *
 * The sample is visibly labelled as a sample and is replaced the moment a real
 * conversation starts. Nothing is presented as a real customer exchange.
 *
 * Still embedded in the page body in the top third, never a floating corner
 * bubble. The bot is a feature, not an interruption.
 */
export default function BotPanel({ bot, brandKey, enabled = true, tone = 'surface', actions = {} }) {
  if (!bot || !bot.greeting) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('BotPanel: no greeting. Bot copy comes from content, not config.');
    }
    return null;
  }
  if (enabled === false) return null;

  const deep = tone === 'deep';
  const s = bot.section || {};
  const initial = (bot.name || 'M').charAt(0);

  return (
    /**
     * `min-w-0` on the grid AND on both children is load-bearing, not tidiness.
     *
     * A grid track defaults to `minmax(auto, ...)`, and `auto` as a minimum
     * means MIN-CONTENT. One nowrap string anywhere inside — the status line
     * below was the culprit — sets the min-content width of the whole track,
     * and the track then grows past the viewport. Because the page frame is
     * `overflow: hidden`, that does not produce a scrollbar. It silently CLIPS,
     * so the card loses its left and right edges and nothing reports an error.
     */
    <div className="grid min-w-0 items-start gap-10 lg:items-center lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
      <Reveal className="min-w-0">
        <Eyebrow tone={deep ? 'deep' : 'ink'}>{s.eyebrow}</Eyebrow>
        <H2 className="mt-4">{s.heading}</H2>
        {s.body ? (
          <p className={`mt-5 max-w-prose leading-relaxed ${deep ? 'text-white/80' : 'text-ink/80'}`}>
            {s.body}
          </p>
        ) : null}
        {s.chips?.length ? (
          <ul className="mt-7 flex flex-wrap gap-2">
            {s.chips.map((c) => (
              <li
                key={c}
                className={`inline-flex items-center gap-2 rounded-pill border px-3.5 py-2 text-sm ${
                  deep ? 'border-white/20 text-white/80' : 'border-line text-ink/75'
                }`}
              >
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
                {c}
              </li>
            ))}
          </ul>
        ) : null}
      </Reveal>

      <Reveal delay={90} className="min-w-0">
        <div
          className={`min-w-0 overflow-hidden rounded-frame border shadow-[0_20px_50px_-24px_rgba(26,29,31,.45)] ${
            deep ? 'border-white/15 bg-white/[0.06]' : 'border-line bg-wash'
          }`}
        >
          <div className={`flex min-w-0 items-center gap-3 border-b px-4 py-3.5 sm:px-5 sm:py-4 ${deep ? 'border-white/10' : 'border-line'}`}>
            <span
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent font-display text-base font-bold text-ink sm:h-10 sm:w-10"
            >
              {initial}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-display text-[15px] font-semibold sm:text-base">{bot.name}</span>
              {/* This line WRAPS on a phone rather than truncating. It was the
                  source of the min-content blowout, and "Agent Kidd front desk ·
                  Live · answers in seconds" ending in "answers in second" is a
                  worse read than two short lines. */}
              <span className="flex min-w-0 items-start gap-1.5 text-[11px] leading-snug opacity-75 sm:items-center sm:text-xs">
                <span aria-hidden="true" className="relative mt-[5px] flex h-2 w-2 shrink-0 sm:mt-0">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-70 motion-safe:animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                <span className="min-w-0">
                  {s.statusLabel ? `${s.statusLabel} · ` : ''}
                  {bot.statusLine}
                </span>
              </span>
            </span>
          </div>

          <BotClient
            brand={brandKey}
            botName={bot.name}
            chips={bot.chips}
            greeting={bot.greeting}
            demo={bot.demo || []}
            tone={tone}
            actions={actions}
          />
        </div>
      </Reveal>
    </div>
  );
}
