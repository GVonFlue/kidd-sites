'use client';
import { useEffect } from 'react';

/**
 * Inertial scrolling, site-wide. This is the thing that makes a site feel
 * expensive without any single element looking different — the page carries a
 * little momentum instead of stopping dead with the wheel.
 *
 * FOUR WAYS THIS NORMALLY BREAKS A SITE, ALL HANDLED HERE:
 *
 * 1. ANCHOR LINKS STOP WORKING. Lenis takes over the scroll position, so the
 *    browser's native jump to `#valuation` fights it and usually loses — the
 *    single most valuable link on this site is a jump to a form. Anchor clicks
 *    are intercepted and handed to Lenis directly, and the same is done for a
 *    hash present on load.
 * 2. REDUCED MOTION. Smoothing IS motion. If it is not wanted, Lenis is never
 *    constructed at all — not started and stopped, never built.
 * 3. `scroll-behavior: smooth` IN CSS FIGHTS IT. The two run separate
 *    animations toward the same position and the result stutters. The CSS rule
 *    is switched off for as long as Lenis is alive, and restored on teardown.
 * 4. IT LOADS EAGERLY FOR NO REASON. The import is dynamic, so the library is
 *    not in the first-load bundle and a visitor who prefers reduced motion
 *    never downloads it at all.
 *
 * Renders nothing. It is a behaviour, not a component.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Coarse pointers already have momentum scrolling from the OS, and layering
    // a second inertia model on top of it feels wrong on a phone rather than
    // better. Desktop only, deliberately.
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let lenis;
    let raf = 0;
    let cancelled = false;
    const root = document.documentElement;
    const prevBehavior = root.style.scrollBehavior;

    const onAnchorClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest('a[href*="#"]');
      if (!a || !lenis) return;
      const url = new URL(a.href, window.location.href);
      if (url.pathname !== window.location.pathname || url.origin !== window.location.origin) return;
      const target = url.hash && document.querySelector(url.hash);
      if (!target) return;
      e.preventDefault();
      // The floating nav sits over the top of the page, so a target scrolled to
      // 0 would slide underneath it.
      lenis.scrollTo(target, { offset: -96 });
      history.pushState(null, '', url.hash);
    };

    import('lenis')
      .then(({ default: Lenis }) => {
        if (cancelled) return;
        lenis = new Lenis({ duration: 1.05, smoothWheel: true, touchMultiplier: 1.6 });
        root.style.scrollBehavior = 'auto';
        const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
        raf = requestAnimationFrame(loop);
        document.addEventListener('click', onAnchorClick);
        if (window.location.hash) {
          const el = document.querySelector(window.location.hash);
          if (el) requestAnimationFrame(() => lenis.scrollTo(el, { offset: -96, immediate: true }));
        }
      })
      // A CDN hiccup or a blocked chunk must cost the visitor nothing but the
      // smoothing. Native scrolling is still right there.
      .catch(() => {});

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      document.removeEventListener('click', onAnchorClick);
      root.style.scrollBehavior = prevBehavior;
      if (lenis) lenis.destroy();
    };
  }, []);

  return null;
}
