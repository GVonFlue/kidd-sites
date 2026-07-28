'use client';
import { useEffect, useRef } from 'react';

/**
 * THE HERO CUTOUT LAYER.
 *
 * The figure is a background-free PNG anchored to the BOTTOM EDGE of the hero
 * section. The section below it is opaque and paints after it in the document,
 * so anything that crosses that edge is hidden.
 *
 * On scroll the figure is translated DOWNWARD at a fraction of the scroll
 * distance. Because the page itself is moving up, the net effect is that he
 * lags the page and sinks behind the next section — content arrives in front
 * of him rather than merely past him.
 *
 * Why this is not the generic `Parallax` component: that one measures distance
 * from the centre of the viewport, which means at rest the offset is not zero.
 * A cutout has a hard cut across the bottom of the chest, and that cut is only
 * invisible while it sits exactly on the section edge. So this one is anchored
 * to scroll position, starts at exactly 0, and is CLAMPED so it can only ever
 * move down. He can never rise and expose the cut.
 *
 *   scrollY = 0     translate 0      cut sits on the seam, invisible
 *   scrolling down  translate + y    he sinks, the next section eats him
 *
 * Transform only, so it stays on the compositor. Reads batched into rAF, passive
 * listener. Off below 1024px and off entirely under prefers-reduced-motion —
 * and because the resting state is translate(0), "off" is also the correct
 * static composition rather than a fallback that looks broken.
 */
export default function HeroPortrait({ children, speed = 0.24, max = 280, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const wide = window.matchMedia('(min-width: 1024px)');

    let raf = 0;
    let last = null;

    const apply = () => {
      raf = 0;
      const active = wide.matches && !reduce.matches;
      const raw = active ? window.scrollY * speed : 0;
      const y = Math.round(Math.min(max, Math.max(0, raw)) * 10) / 10;
      if (y === last) return;
      el.style.transform = y ? `translate3d(0, ${y}px, 0)` : '';
      last = y;
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply); };

    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    reduce.addEventListener?.('change', onScroll);
    wide.addEventListener?.('change', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      reduce.removeEventListener?.('change', onScroll);
      wide.removeEventListener?.('change', onScroll);
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = '';
    };
  }, [speed, max]);

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
}
