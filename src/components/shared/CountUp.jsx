'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * A number that counts up to itself when it scrolls into view.
 *
 * Justus's strongest asset on this site is four figures — 500+ doors, 1,000+
 * residents, 7 associations, 4 years. A number that lands is read; a number
 * that climbs is watched. This is the highest return on effort available on
 * the page, because the content is already the good part.
 *
 * IT PARSES THE STRING RATHER THAN TAKING A NUMBER. The content files hold
 * '500+' and '1,000+' as written, complete with their separators and suffixes,
 * because that is what has to appear on screen and an editor should not have to
 * split a figure into three fields to change it. Prefix and suffix are
 * preserved exactly; only the digits animate. A figure with no digits at all is
 * rendered untouched.
 *
 * THE SEPARATOR IS RE-APPLIED FROM THE SOURCE, NOT ASSUMED. '1,000+' counts
 * through 1,000 with the comma; a figure written without one counts without
 * one. Inventing a thousands separator that the author did not write is the
 * kind of small wrongness that makes a site feel machine-made.
 *
 * `tabular-nums` on the element is what stops the layout juddering as digits
 * change width mid-count — without it every tick reflows the row.
 *
 * Reduced motion and no-JS both land on the final value immediately. The
 * number is never a thing the visitor has to wait for.
 */
export default function CountUp({ value, duration = 1500, className = '' }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const match = String(value).match(/^(\D*)([\d,]+)(.*)$/);
    if (!match) return;
    const [, prefix, digits, suffix] = match;
    const target = Number(digits.replace(/,/g, ''));
    if (!Number.isFinite(target) || target === 0) return;
    const grouped = digits.includes(',');
    const fmt = (n) => prefix + (grouped ? n.toLocaleString('en-US') : String(n)) + suffix;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') return;

    let raf = 0;
    let started = false;
    const run = () => {
      if (started) return;
      started = true;
      const t0 = performance.now();
      // easeOutExpo: fast at the start, long settle. A linear count looks like
      // a loading spinner; this looks like a number arriving.
      const ease = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
      const tick = (now) => {
        const t = Math.min(1, (now - t0) / duration);
        setDisplay(fmt(Math.round(target * ease(t))));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    setDisplay(fmt(0));
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { run(); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el);
    // If the observer never fires, the real figure must still be on screen.
    const failsafe = setTimeout(() => { io.disconnect(); if (!started) setDisplay(value); }, 3000);

    return () => { io.disconnect(); cancelAnimationFrame(raf); clearTimeout(failsafe); };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
