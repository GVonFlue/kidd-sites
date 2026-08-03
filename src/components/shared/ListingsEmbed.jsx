'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * THE APPFOLIO LISTINGS WIDGET.
 *
 * AppFolio hosts the vacancies. There is no public feed to render natively:
 * `/listings.json` and `/listings.rss` are both disallowed by AppFolio's
 * robots.txt, and scraping the HTML page would be both fragile and rude. The
 * supported route for a third-party site is the embed snippet AppFolio
 * generates inside the account.
 *
 * That snippet is a `<script>` plus a container, and it differs between
 * accounts, so this takes the RAW SNIPPET from config rather than trying to
 * reconstruct it from parts. Whatever AppFolio hands over is pasted in and
 * works. It is our own config, not visitor input, so injecting it is not an
 * XSS surface.
 *
 * `dangerouslySetInnerHTML` does NOT execute injected script tags — the browser
 * ignores them by design. So each one is re-created as a real element, which is
 * the only way an injected third-party widget actually boots.
 *
 * IT NEVER LEAVES A HOLE. If the widget is not configured, or fails to load, or
 * is blocked by a tracking blocker, the fallback below it is still on the page
 * and still gets the visitor to the listings. A blank rectangle where the
 * rentals should be is the worst outcome on this page.
 */
export default function ListingsEmbed({ html, minHeight = 520 }) {
  const ref = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = ref.current;
    if (!host || !html) return;

    host.innerHTML = html;

    // Re-create every script so the browser actually runs it.
    const scripts = [...host.querySelectorAll('script')];
    let pending = scripts.length;
    for (const old of scripts) {
      const s = document.createElement('script');
      for (const { name, value } of old.attributes) s.setAttribute(name, value);
      s.textContent = old.textContent;
      if (old.src) {
        s.onerror = () => setFailed(true);
        s.onload = () => { pending -= 1; };
      } else {
        pending -= 1;
      }
      old.replaceWith(s);
    }

    // If nothing has rendered after a reasonable wait, treat it as failed and
    // let the fallback carry the page rather than leaving an empty box.
    const t = setTimeout(() => {
      if (host.getBoundingClientRect().height < 80) setFailed(true);
    }, 6000);
    return () => clearTimeout(t);
  }, [html]);

  if (!html) return null;

  return (
    <div
      ref={ref}
      // Height is reserved so the rest of the page does not jump when a
      // third-party widget we do not control finally paints.
      style={failed ? undefined : { minHeight }}
      className={failed ? 'hidden' : ''}
    />
  );
}
