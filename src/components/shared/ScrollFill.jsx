'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * A statement that WRITES ITSELF IN BRASS AS YOU SCROLL.
 *
 * The text starts as pale outline-grey and fills word by word, left to right,
 * tied directly to scroll position — scroll back up and it un-fills. This is
 * the signature move on the studio sites Garrett pointed at, and it is the one
 * effect on this build that makes people stop and scroll it twice.
 *
 * HOW IT WORKS. Two copies of the same sentence sit exactly on top of each
 * other: a pale one underneath, a full-brass one on top clipped by a
 * `clip-path` inset that opens from the left. Moving one number — the inset
 * percentage — wipes the brass copy across the pale one. No per-word elements,
 * no text splitting, so line wrapping stays exactly as the browser intended at
 * every width.
 *
 * WHY CLIP-PATH AND NOT background-clip: text. A gradient on the text would
 * have to be re-declared per line to wipe correctly, and a heading that wraps
 * to three lines would show three separate wipes running at once. Clipping the
 * whole block wipes the paragraph as one object, the way a person reads it.
 *
 * THE PROGRESS WINDOW. The fill runs while the element travels from the bottom
 * third of the viewport to the top third. Anchoring it to the element rather
 * than to the page means it behaves identically on a short page and a long one.
 *
 * ACCESSIBILITY. Only the under copy carries the real text; the brass overlay is
 * aria-hidden, so the sentence is announced once. With JavaScript off, or under
 * reduced motion, no clip is applied and the statement is simply legible.
 *
 * THE UNFILLED STATE MUST BE READABLE ON ITS OWN, AND THIS IS NOT NEGOTIABLE.
 * The first version used text-ink/25, which looks beautiful as a "not yet
 * written" state and measures 1.7:1 — the audit failed it and was right to.
 * "It fills in a moment" is not a defence: somebody landing on an anchor
 * halfway down the page, or reading with the scroll barely started, sees only
 * that state. It is now ink/65 (5.27:1), so the wipe is a shift from a
 * readable grey to brass rather than from invisible to visible. Less dramatic,
 * and the version that can actually ship. Never darken it back.
 */
export default function ScrollFill({ children, className = '', as: Tag = 'p' }) {
  const ref = useRef(null);
  const fillRef = useRef(null);
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const fill = fillRef.current;
    if (!el || !fill) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    setEnhanced(true);
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the top of the block is two-thirds down the screen,
      // 1 by the time it has reached one-fifth from the top.
      const start = vh * 0.72;
      const end = vh * 0.2;
      const p = Math.min(1, Math.max(0, (start - r.top) / (start - end)));
      fill.style.clipPath = `inset(0 ${(1 - p) * 100}% 0 0)`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <Tag ref={ref} className={`relative ${className}`}>
      {/* The readable copy. Muted only once the enhancement is live, so with no
          JavaScript it is ordinary ink-coloured text. ink/65 = 5.27:1 — see the
          note above before touching this value. */}
      <span className={enhanced ? 'text-ink/65 transition-colors' : ''}>{children}</span>
      {/* The brass copy, laid exactly on top and wiped in from the left.
          `inset-0` + identical type metrics is what keeps the two in register;
          any padding or margin here would show as a ghosted double image. */}
      <span
        ref={fillRef}
        aria-hidden="true"
        className="absolute inset-0 text-accent-ink"
        style={enhanced ? { clipPath: 'inset(0 100% 0 0)' } : undefined}
      >
        {children}
      </span>
    </Tag>
  );
}
