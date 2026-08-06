'use client';
import { useEffect, useRef } from 'react';

/**
 * THE PARCEL GRID, LIT BY THE CURSOR.
 *
 * The grid is the one piece of this identity nobody else in Wichita has: a plat
 * drawing, because the man manages seven associations in subdivisions still
 * being surveyed. This makes it respond to the pointer — lots warm up in brass
 * as you move across them, and fade back down behind you, like a surveyor's
 * light passing over the block.
 *
 * It is the most distinctive effect on the site precisely because it is not a
 * generic web trick. Every agency site has smooth scroll. None of them have
 * this, because none of them are selling land.
 *
 * IT WRAPS THE EXISTING SVG RATHER THAN REPLACING IT. The grid is generated
 * deterministically on the server and must stay that way — same markup on both
 * sides, no hydration mismatch. This mounts over the top, finds the <rect>
 * elements already there, and drives their fill. If this component never runs,
 * the grid is exactly what it always was.
 *
 * COST CONTROL, because this is behind the hero on every page:
 *  - Rects are measured ONCE on mount and on resize, never per pointer move.
 *    Calling getBoundingClientRect in a mousemove handler on 60+ elements is
 *    how a decorative background comes to own the main thread.
 *  - Writes are batched into one requestAnimationFrame per frame.
 *  - Only the nearest few lots are touched per frame; the rest are left alone.
 *  - Desktop fine-pointer only. There is no cursor to follow on a phone, and
 *    the listeners would cost a battery for nothing.
 *
 * Purely decorative and already aria-hidden inside ParcelGrid, so there is
 * nothing here for a screen reader to miss.
 */
export default function LiveParcelGrid({ children, className = '' }) {
  const host = useRef(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const svg = el.querySelector('svg');
    if (!svg) return;
    const rects = [...svg.querySelectorAll('rect')];
    if (!rects.length) return;

    // One measurement pass. Everything after this is arithmetic.
    let boxes = [];
    const measure = () => {
      boxes = rects.map((r) => {
        const b = r.getBoundingClientRect();
        return { r, cx: b.left + b.width / 2, cy: b.top + b.height / 2 };
      });
    };
    measure();

    for (const r of rects) r.style.transition = 'fill-opacity .55s ease-out';

    let raf = 0;
    let mx = -9999;
    let my = -9999;
    let lit = [];

    const paint = () => {
      raf = 0;
      // Turn off whatever was lit last frame, then light the new set. Touching
      // only the changed lots keeps this to a handful of style writes a frame
      // instead of one per parcel.
      for (const r of lit) r.style.fillOpacity = '';
      lit = [];
      const radius = 240;
      for (const { r, cx, cy } of boxes) {
        const d = Math.hypot(cx - mx, cy - my);
        if (d > radius) continue;
        const strength = 1 - d / radius;
        r.style.fill = '#C2832A';
        r.style.fillOpacity = String(0.02 + strength * strength * 0.12);
        lit.push(r);
      }
    };

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const onLeave = () => {
      mx = -9999; my = -9999;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    // Scrolling moves the lots under a stationary cursor, so the measurements
    // have to be refreshed — otherwise the light stays where the page used to
    // be and the effect detaches from the pointer.
    const onScrollOrResize = () => { measure(); if (!raf) raf = requestAnimationFrame(paint); };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave, { passive: true });
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      for (const r of rects) { r.style.fillOpacity = ''; r.style.transition = ''; }
    };
  }, []);

  return (
    <div ref={host} className={className}>
      {children}
    </div>
  );
}
