import WordReveal from './WordReveal';

/**
 * Section wrapper. One place that owns vertical rhythm and ground colour, so
 * hierarchy stays consistent instead of being re-decided per page.
 * `tone`: 'surface' | 'wash' | 'deep'
 */
export default function Section({
  tone = 'surface',
  id,
  className = '',
  children,
  bleed = false,
  /**
   * `overlap` turns this section into a plane that visibly passes IN FRONT OF
   * whatever precedes it: rounded top corners and a shadow cast upward.
   *
   * It exists for the hero cutout. The figure there is anchored to the hero's
   * bottom edge and sinks on scroll, and without a legible edge to sink behind
   * the motion reads as the photograph being cropped rather than as depth.
   * This is that edge.
   */
  overlap = false,
}) {
  const grounds = {
    surface: 'bg-surface text-ink',
    wash: 'bg-wash text-ink',
    deep: 'bg-surface-deep text-white',
  };
  const lift = overlap
    ? 'z-10 rounded-t-[26px] shadow-[0_-16px_40px_-26px_rgba(26,29,31,.45)] md:rounded-t-[34px]'
    : '';
  return (
    <section id={id} className={`relative ${grounds[tone]} ${lift} ${className}`}>
      <div className={bleed ? '' : 'mx-auto max-w-6xl px-5 py-16 md:py-24'}>{children}</div>
    </section>
  );
}

/** Small mono eyebrow. Only ever a label, never a sentence. */
export function Eyebrow({ children, tone = 'ink' }) {
  if (!children) return null;
  return (
    <p className={`font-mono text-xs uppercase tracking-[0.08em] ${tone === 'deep' ? 'text-accent-lift' : 'text-accent-ink'}`}>
      {children}
    </p>
  );
}

/**
 * Every section heading on the site goes through here, which is why the
 * word-by-word reveal is applied HERE rather than page by page: one change and
 * the whole site gains it, and no page can be accidentally left out.
 *
 * WordReveal renders the heading plainly when its child is not a plain string,
 * so a heading carrying markup is safe and simply does not animate.
 */
export function H2({ children, className = '' }) {
  return (
    <WordReveal className={`font-display text-[26px] font-bold leading-[1.15] tracking-[-0.02em] sm:text-[30px] lg:text-[36px] ${className}`}>
      {children}
    </WordReveal>
  );
}
