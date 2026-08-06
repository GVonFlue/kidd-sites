'use client';
import { useEffect, useRef } from 'react';

/**
 * A hairline of brass across the very top of the window that fills as you read.
 *
 * The cheapest orientation cue there is, and on a long page it is the thing
 * that tells someone they are two-thirds of the way through rather than lost.
 * It is also the only motion on the site that is visible at every single moment
 * of every single scroll, which is why it is one pixel of brass and not a bar.
 *
 * THE WIDTH IS A TRANSFORM, NOT A WIDTH. Animating `width` re-runs layout on
 * every frame of every scroll — the single most expensive thing you can attach
 * to a scroll handler. `scaleX` on a full-width element runs on the compositor
 * and never touches layout at all.
 *
 * The state is written straight to the DOM node rather than through React
 * state: a setState per scroll frame would re-render the tree sixty times a
 * second to move one line. requestAnimationFrame coalesces bursts of scroll
 * events into one write per frame.
 *
 * Fixed to the viewport, above the frame, `pointer-events: none` so it can
 * never swallow a click on the nav sitting directly beneath it.
 */
export default function ScrollProgress() {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      // A page shorter than the viewport has no progress to report, and
      // dividing by zero would paint a full bar on a page nobody has scrolled.
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el.style.transform = `scaleX(${p})`;
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
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]">
      <div
        ref={ref}
        className="h-full origin-left bg-gradient-to-r from-accent-ink via-accent to-accent-lift"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}
