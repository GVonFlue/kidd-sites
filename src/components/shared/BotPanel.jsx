import BotClient from './BotClient';

/**
 * The conversational agent, Build Standard §9 house pattern.
 *
 * Placement is the point: embedded in the page body in the TOP THIRD, not a
 * floating corner bubble. The bot is a headline feature, not an interruption.
 *
 * This is the Phase 3 shell. Phase 4 wires it to /api/chat. The greeting, the
 * chips and the status line are real and come from content, so what is on screen
 * here is what will be on screen when it is live.
 *
 * Why it matters more than usual on this build: the client is supply constrained
 * and his phone is the bottleneck. On Cornerstone this surface is also the
 * maintenance intake, so its job is to take load OFF the phone rather than
 * generate more calls into it.
 */
export default function BotPanel({ bot, brandKey, enabled = true, tone = 'surface', actions = {} }) {
  // Fail loudly in development if the panel is asked to render without copy,
  // rather than silently disappearing from the page.
  if (!bot || !bot.greeting) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('BotPanel: no greeting. Bot copy comes from content, not config.');
    }
    return null;
  }
  if (enabled === false) return null;
  const deep = tone === 'deep';
  const initial = (bot.name || 'M').charAt(0);

  return (
    <div className={`rounded-lg border ${deep ? 'border-white/15 bg-white/5' : 'border-line bg-wash'}`}>
      <div className={`flex items-center gap-3 border-b px-5 py-4 ${deep ? 'border-white/10' : 'border-line'}`}>
        <span
          aria-hidden="true"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-accent font-display text-base font-bold text-ink"
        >
          {initial}
        </span>
        <span>
          <span className="block font-display text-base font-semibold">{bot.name}</span>
          <span className="flex items-center gap-1.5 text-xs opacity-70">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
            {bot.statusLine}
          </span>
        </span>
      </div>

      <BotClient
        brand={brandKey}
        botName={bot.name}
        chips={bot.chips}
        greeting={bot.greeting}
        tone={tone}
        actions={actions}
      />
    </div>
  );
}
