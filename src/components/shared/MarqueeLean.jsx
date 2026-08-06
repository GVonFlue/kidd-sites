'use client';
import { useEffect, useRef } from 'react';

/**
 * Makes the credential band lean with the scroll.
 *
 * While the page is moving the ticker skews and stretches slightly in the
 * direction of travel, then settles when you stop. It is a small thing and it
 * is the difference between a band that is looping and a band that is part of
 * the page — the eye reads the shear as weight.
 *
 * SCROLL VELOCITY IS DERIVED PER FRAME, NOT PER EVENT. Scroll events fire in
 * uneven bursts, so differencing positions between events produces spikes that
 * look like a glitch. Sampling once per animation frame gives a stable number
 * from a jittery input.
 *
 * The result is CLAMPED HARD. Uncapped velocity turns a flick-scroll on a
 * trackpad into a 40-degree shear, which reads as a broken page rather than as
 * momentum. Six degrees is the point where it is felt and not seen.
 *
 * Decay is what makes it settle rather than snap: the lean eases back toward
 * zero every frame it is not being fed, so stopping the scroll produces a
 * spring rather than a jump cut.
 */
export default function MarqueeLean({ children, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let last = window.scrollY;
    let lean = 0;
    let raf = 0;
    let idle = 0;

    const frame = () => {
      const y = window.scrollY;
      const v = y - last;
      last = y;

      // Feed toward the new velocity, then decay. Both together give the
      // settle; either alone gives a jump.
      const target = Math.max(-6, Math.min(6, v * 0.22));
      lean += (target - lean) * 0.18;
      lean *= 0.94;

      if (Math.abs(lean) < 0.02) {
        lean = 0;
        el.style.transform = '';
        // Nothing is moving and nothing is left to settle: stop the loop
        // entirely rather than run a rAF forever behind a static band.
        if (++idle > 30) { raf = 0; return; }
      } else {
        idle = 0;
        el.style.transform = `skewX(${(-lean).toFixed(2)}deg) scaleX(${(1 + Math.abs(lean) * 0.006).toFixed(4)})`;
      }
      raf = requestAnimationFrame(frame);
    };

    // `last` is DELIBERATELY NOT RESET HERE. The first version set it to the
    // current position on every kick, which meant the very first frame after
    // the loop had gone idle always measured a velocity of exactly zero — so a
    // short scroll produced no lean at all, and the whole effect only appeared
    // during long continuous scrolls. Leaving the previous value in place means
    // the first frame measures the real distance travelled; the clamp keeps a
    // stale baseline from ever producing more than the six-degree maximum.
    const kick = () => { if (!raf) { idle = 0; raf = requestAnimationFrame(frame); } };
    window.addEventListener('scroll', kick, { passive: true });
    return () => {
      window.removeEventListener('scroll', kick);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className={`marquee-lean ${className}`}>
      {children}
    </div>
  );
}
