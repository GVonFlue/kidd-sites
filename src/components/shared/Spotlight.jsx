'use client';
import { useEffect, useRef } from 'react';

/**
 * A soft highlight that tracks the cursor across a surface.
 *
 * On the primary buttons it reads as light catching brass; on a card it reads
 * as the card being picked up. It is the difference between a button that
 * changes colour on hover and a button that feels like an object.
 *
 * THE POSITION IS TWO CSS VARIABLES, WRITTEN TO THE ELEMENT. No React state, no
 * re-render, one style write per frame. The gradient that consumes them lives
 * in globals.css, so the paint is entirely the browser's business.
 *
 * COORDINATES ARE ELEMENT-RELATIVE AND MEASURED PER ENTER, NOT PER MOVE.
 * getBoundingClientRect inside a mousemove handler is a layout read on every
 * frame; the rect is cached on pointerenter and only refreshed when the pointer
 * enters again, which is the only moment it can have changed meaningfully.
 *
 * Desktop fine-pointer only. On a touch screen there is no hover state to
 * express, and a highlight that appears on tap and stays lit afterwards looks
 * like a rendering fault.
 *
 * Purely decorative: the highlight layer is aria-hidden and pointer-events-none,
 * so it can never intercept the click on the button it is decorating. That
 * matters more here than anywhere else on the site — this wraps the primary
 * CTA, and a decoration that eats the conversion is not a decoration.
 */
export default function Spotlight({ children, className = '', radius = 180 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let rect = null;
    let raf = 0;
    let x = 0;
    let y = 0;

    const write = () => {
      raf = 0;
      el.style.setProperty('--spot-x', `${x}px`);
      el.style.setProperty('--spot-y', `${y}px`);
    };
    const onEnter = () => {
      rect = el.getBoundingClientRect();
      el.style.setProperty('--spot-o', '1');
    };
    const onMove = (e) => {
      if (!rect) rect = el.getBoundingClientRect();
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
      if (!raf) raf = requestAnimationFrame(write);
    };
    const onLeave = () => {
      el.style.setProperty('--spot-o', '0');
      rect = null;
    };

    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <span
      ref={ref}
      className={`spotlight relative inline-block ${className}`}
      style={{ '--spot-r': `${radius}px` }}
    >
      {children}
    </span>
  );
}
