'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * A heading that arrives one word at a time.
 *
 * The difference between this and the ordinary block fade is that the eye
 * follows it. A block that fades in is a thing that appeared; a line that
 * assembles left to right is a thing being said. It is the single cheapest way
 * to make a page feel authored.
 *
 * THE TEXT IS NEVER SPLIT IN THE ACCESSIBILITY TREE. Wrapping each word in its
 * own element makes some screen readers announce them individually — "Start.
 * With. What. It. Is. Worth." — which is a genuinely worse experience than no
 * animation. So the real sentence is rendered once, visually hidden, and the
 * per-word spans are `aria-hidden`. One reads it, the other animates it.
 *
 * SPACES ARE PART OF THE SPAN, NOT BETWEEN THEM. `display: inline-block` on a
 * word collapses the whitespace either side of it, so the trailing space has to
 * live inside the element or every word runs together the moment the animation
 * class applies.
 *
 * Everything else follows Reveal.jsx: hidden state scoped to `.js`, reduced
 * motion skips it outright, IntersectionObserver rather than a scroll handler,
 * and a three-second failsafe so a heading can never be left invisible.
 */
export default function WordReveal({ children, as: Tag = 'h2', className = '', stagger = 46 }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  const text = typeof children === 'string' ? children : '';

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') { setShown(true); return; }
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) { setShown(true); return; }

    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
    );
    io.observe(el);
    const failsafe = setTimeout(() => { setShown(true); io.disconnect(); }, 3000);
    return () => { io.disconnect(); clearTimeout(failsafe); };
  }, []);

  // Not a string (an accented headline, say) — render it plainly rather than
  // half-animating something we cannot safely split.
  if (!text) return <Tag className={className}>{children}</Tag>;

  const words = text.split(' ');

  return (
    <Tag ref={ref} className={`word-reveal ${className}`} data-shown={shown ? 'true' : 'false'}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <span
            key={`${w}-${i}`}
            data-word
            style={{ transitionDelay: `${i * stagger}ms` }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </span>
    </Tag>
  );
}
