'use client';
import { useEffect, useRef } from 'react';

/**
 * Depth on scroll: the wrapped element drifts slower than the page, so content
 * scrolling past appears to move in front of it.
 *
 * Driven by `transform` only — never `top` or `margin` — so it stays on the
 * compositor and does not force layout on every frame. Reads are batched into a
 * rAF and the listener is passive, so scrolling is never blocked.
 *
 * Disabled entirely under `prefers-reduced-motion`, and disabled below 1024px
 * where the effect costs more in jank than it returns in polish.
 */
export default function Parallax({ children, speed = 0.18, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(max-width: 1023px)').matches) return;

    let raf = 0;
    let last = null;

    const apply = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      // How far this element's centre is from the viewport centre, normalised.
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
      const y = Math.round(offset * 10) / 10;
      if (y !== last) { el.style.transform = `translate3d(0, ${y}px, 0)`; last = y; }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply); };

    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = '';
    };
  }, [speed]);

  return <div ref={ref} className={className} style={{ willChange: 'transform' }}>{children}</div>;
}
