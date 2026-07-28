'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * Scroll-triggered reveal. Content fades up as it enters the viewport, with an
 * optional stagger so a group arrives in sequence rather than all at once.
 *
 * Three rules this obeys, in order of importance:
 *
 * 1. THE CONTENT IS ALWAYS IN THE DOM AND ALWAYS READABLE. The animation is a
 *    CSS class applied after mount. With JavaScript disabled, or if the observer
 *    never fires, everything is simply visible. Animation must never be the
 *    thing that decides whether a visitor can read a page.
 * 2. `prefers-reduced-motion` is honoured by skipping the animation entirely,
 *    not by shortening it.
 * 3. It uses IntersectionObserver, not a scroll listener. One callback per
 *    element per crossing, rather than work on every frame of every scroll.
 */
export default function Reveal({ children, delay = 0, as: Tag = 'div', className = '' }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') { setShown(true); return; }

    // Already on screen at load: show immediately rather than animating the
    // hero after the visitor is already looking at it.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) { setShown(true); return; }

    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setShown(true); io.disconnect(); } },
      // Fires as soon as any part of the element enters. A negative bottom
      // margin looks nicer mid-page but can leave the last block before the
      // footer permanently unrevealed, which is a far worse trade.
      { rootMargin: '0px 0px -4% 0px', threshold: 0.01 },
    );
    io.observe(el);

    // Failsafe. If the observer has not fired within three seconds for any
    // reason at all, show the content. Nothing on this site is ever allowed to
    // stay invisible because an animation did not run.
    const failsafe = setTimeout(() => { setShown(true); io.disconnect(); }, 3000);

    return () => { io.disconnect(); clearTimeout(failsafe); };
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal={shown ? 'in' : 'out'}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
