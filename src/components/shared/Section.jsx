/**
 * Section wrapper. One place that owns vertical rhythm and ground colour, so
 * hierarchy stays consistent instead of being re-decided per page.
 * `tone`: 'surface' | 'wash' | 'deep'
 */
export default function Section({ tone = 'surface', id, className = '', children, bleed = false }) {
  const grounds = {
    surface: 'bg-surface text-ink',
    wash: 'bg-wash text-ink',
    deep: 'bg-surface-deep text-white',
  };
  return (
    <section id={id} className={`relative ${grounds[tone]} ${className}`}>
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

export function H2({ children, className = '' }) {
  return (
    <h2 className={`font-display text-[26px] font-bold leading-[1.15] tracking-[-0.02em] sm:text-[30px] lg:text-[36px] ${className}`}>
      {children}
    </h2>
  );
}
