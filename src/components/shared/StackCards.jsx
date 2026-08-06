import { Eyebrow } from './Section';
import WordReveal from './WordReveal';

/**
 * THE STACKING DECK. A sequence of steps that pile up on top of each other as
 * you scroll, each one coming to rest slightly below the last, until the whole
 * process is sitting in front of you like a hand of cards.
 *
 * This is the single most striking effect on the site and it uses NO
 * JAVASCRIPT AT ALL. Every card is `position: sticky` with a `top` offset that
 * increases by a fixed step down the list — card one stops at the top, card two
 * stops 18px lower, card three 36px lower. Because they stop at different
 * heights, each new card slides up over the one before it and leaves that
 * card's header showing. The gap between them in normal flow is what gives the
 * browser room to do it.
 *
 * WHY THE OFFSETS ARE INLINE STYLE AND NOT TAILWIND CLASSES. The step depends
 * on the index, so the class name would have to be constructed at runtime —
 * `top-[${n}px]` — and Tailwind scans source text at build time, so a
 * constructed class name is never generated and every card would silently
 * stack at top: 0 with no offset at all. This is the most common way this
 * effect ships broken.
 *
 * IT DEGRADES INTO A LIST. `position: sticky` is ignored by anything that does
 * not support it, and the cards simply render one after another down the page —
 * still numbered, still in order, still readable. Under `prefers-reduced-motion`
 * the stickiness is switched off deliberately in globals.css, because a card
 * pinning itself to the top of the viewport IS motion to someone who asked for
 * none, even though no animation is declared.
 *
 * The last card must not have a bottom gap or the deck ends with a hole in it.
 */
export default function StackCards({ heading, eyebrow, body, items = [], tone = 'wash', step = 18 }) {
  if (items.length < 3) return null;
  const deep = tone === 'deep';

  return (
    <div>
      {eyebrow ? <Eyebrow tone={deep ? 'deep' : 'ink'}>{eyebrow}</Eyebrow> : null}
      {heading ? (
        <WordReveal className={`mt-4 block font-display text-[30px] font-bold leading-[1.08] tracking-[-0.02em] sm:text-[38px] lg:text-[46px] ${deep ? 'text-white' : 'text-ink'}`}>
          {heading}
        </WordReveal>
      ) : null}
      {body ? (
        <p className={`mt-5 max-w-prose text-[17px] leading-relaxed md:text-lg ${deep ? 'text-white/75' : 'text-ink/75'}`}>
          {body}
        </p>
      ) : null}

      {/* The deck. `list-none` because the numbers are drawn, not bulleted. */}
      <ol className="stack mt-12 list-none">
        {items.map((item, i) => (
          <li
            key={item.label}
            className="stack-card"
            // Each card rests one step lower than the one before it, which is
            // what leaves the previous card's header visible underneath.
            style={{ top: `calc(var(--stack-top) + ${i * step}px)`, zIndex: i + 1 }}
          >
            <div
              className={`flex flex-col gap-5 rounded-frame border p-7 sm:flex-row sm:gap-8 sm:p-10 ${
                deep
                  ? 'border-white/12 bg-[#1E2225] text-white shadow-[0_24px_60px_-28px_rgba(0,0,0,.8)]'
                  : 'border-line bg-surface text-ink shadow-[0_24px_60px_-30px_rgba(26,29,31,.45)]'
              }`}
            >
              <span
                aria-hidden="true"
                className={`shrink-0 font-mono text-[13px] tabular-nums tracking-[0.14em] ${deep ? 'text-accent-lift' : 'text-accent-ink'}`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-[22px] font-bold leading-tight tracking-[-0.015em] sm:text-[26px]">
                  {item.label}
                </h3>
                <p className={`mt-3 max-w-prose text-[16px] leading-relaxed sm:text-[17px] ${deep ? 'text-white/75' : 'text-ink/75'}`}>
                  {item.line}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
