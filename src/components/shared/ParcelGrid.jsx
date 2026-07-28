/**
 * THE SIGNATURE ELEMENT — the parcel grid.
 *
 * A fine-ruled irregular grid derived from plat drawings: the survey language of
 * a subdivision being laid out. It comes from the one fact in this client's
 * intake that no competitor has, which is that he manages seven homeowner
 * associations in communities still being built.
 *
 * It also solves a real problem. There is no photography yet and the client
 * explicitly dislikes stock imagery, so the top of every page needs structure
 * that does not depend on a photograph arriving.
 *
 * Hand-authored SVG. No dependency. Deterministic, so server and client render
 * identically and there is no hydration mismatch. Purely decorative, so it is
 * aria-hidden and carries no alt text.
 *
 * Design-plan guard rails, from the Phase 0 self-critique:
 *  - Irregular parcels, never a uniform newsprint lattice.
 *  - Very low contrast. It is structure, not decoration.
 *  - No animation. There is nothing here that motion would improve.
 */

// Deterministic pseudo-random. Same input, same output, every render.
function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

/**
 * Recursively split a rectangle into irregular parcels, the way a plat divides
 * a block. Splits are off-centre and alternate direction, which is what keeps it
 * from reading as a grid of equal boxes.
 */
function subdivide(x, y, w, h, depth, rand, out, minW, minH) {
  if (depth === 0 || w < minW * 2 || h < minH * 2) {
    out.push({ x, y, w, h });
    return;
  }
  const vertical = w > h ? rand() > 0.25 : rand() > 0.75;
  const t = 0.32 + rand() * 0.36; // never a clean half

  if (vertical) {
    const cut = Math.round(w * t);
    subdivide(x, y, cut, h, depth - 1, rand, out, minW, minH);
    subdivide(x + cut, y, w - cut, h, depth - 1, rand, out, minW, minH);
  } else {
    const cut = Math.round(h * t);
    subdivide(x, y, w, cut, depth - 1, rand, out, minW, minH);
    subdivide(x, y + cut, w, h - cut, depth - 1, rand, out, minW, minH);
  }
}

export default function ParcelGrid({
  seed = 7, // seven associations
  depth = 6,
  className = '',
  tone = 'light', // 'light' on pale grounds, 'dark' on the deep ground
  variant = 'field', // 'field' fills a space, 'rule' is a thin section divider
}) {
  const W = 1200;
  const H = variant === 'rule' ? 64 : 720;
  const rand = rng(seed);
  const parcels = [];
  subdivide(0, 0, W, H, variant === 'rule' ? 3 : depth, rand, parcels, 90, 56);

  const stroke = tone === 'dark' ? '#FFFFFF' : '#1A1D1F';
  const strokeOpacity = tone === 'dark' ? 0.05 : 0.045;
  // One parcel is picked out in brass. A plat always has the lot you care about.
  // It is chosen from the right-hand side only, because the left is where the
  // headline sits and a filled rectangle behind type reads as a rendering fault
  // rather than as a marked lot.
  const candidates = parcels
    .map((p, i) => ({ ...p, i }))
    .filter((p) => p.x > W * 0.55 && p.w > 90 && p.h > 70);
  const marked = candidates.length
    ? candidates[Math.floor(candidates.length / 2)].i
    : parcels.length - 1;

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={className}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      role="presentation"
    >
      <g fill="none" stroke={stroke} strokeOpacity={strokeOpacity} strokeWidth="1" vectorEffect="non-scaling-stroke">
        {parcels.map((p, i) => (
          <rect key={i} x={p.x + 0.5} y={p.y + 0.5} width={p.w - 1} height={p.h - 1} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
      <rect
        x={parcels[marked].x + 0.5}
        y={parcels[marked].y + 0.5}
        width={parcels[marked].w - 1}
        height={parcels[marked].h - 1}
        fill="#C2832A"
        fillOpacity={tone === 'dark' ? 0.055 : 0.04}
        stroke="#C2832A"
        strokeOpacity={tone === 'dark' ? 0.22 : 0.16}
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
