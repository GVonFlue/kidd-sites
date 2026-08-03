'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * The brand chip in the header: the logo when there is one, the wordmark when
 * there is not.
 *
 * THIS EXISTS BECAUSE A MISSING LOGO IS NOT A COSMETIC FAILURE. The config
 * pointed at /cornerstone/CornerstoneLogo.png before the file had been supplied.
 * A broken <img> does not collapse — it lays out at the intrinsic width of its
 * alt text. "Cornerstone Management" measured 259px inside a `shrink-0` chip,
 * which pushed the menu button to 380 inside a 375 viewport and gave EVERY
 * Cornerstone page a sideways scroll on a phone.
 *
 * So the fallback is real, not defensive dressing: if the logo 404s in
 * production the header shows the wordmark and the bar keeps its shape. The
 * width cap below is the second belt — it holds even with JavaScript disabled,
 * where this error handler never runs.
 */
export default function BrandMark({ src, name, fallback }) {
  const [broken, setBroken] = useState(false);
  const ref = useRef(null);

  // onError ALONE IS NOT ENOUGH. The <img> is server-rendered, so the browser
  // has usually already tried and failed to load it before React hydrates and
  // attaches the handler — the error event has been and gone, and the broken
  // image just sits there. So on mount we ask the element directly: a finished
  // load with zero natural width is a failed load.
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setBroken(true);
  }, [src]);

  if (!src || broken) return <span className="truncate">{fallback || name}</span>;

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      ref={ref}
      src={src}
      alt={name}
      onError={() => setBroken(true)}
      className="h-7 w-auto max-w-full object-contain md:h-8"
    />
  );
}
