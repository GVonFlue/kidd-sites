/**
 * The hero can take a photograph behind it. The photograph is client-supplied,
 * so its brightness is unknown at build time — and the headline sits on top.
 *
 * A scrim that looks fine over a dusk skyline can fail completely over a bright
 * one, and the failure is invisible until the client swaps the picture months
 * later. So this proves the scrim holds WCAG AA over the WORST POSSIBLE image:
 * pure white on the deep hero, pure black on the light one.
 *
 * The gradient stops are parsed out of Hero.jsx rather than restated here. If
 * someone lightens the scrim to "let more of the photo through", this fails.
 */
import fs from 'node:fs';

const src = fs.readFileSync('src/components/shared/Hero.jsx', 'utf8');

/** Pull `rgba(r,g,b,a) <pct>%` stops out of a linear-gradient string. */
function stops(gradient) {
  return [...gradient.matchAll(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)\s*(\d+)%/g)]
    .map((m) => ({ r: +m[1], g: +m[2], b: +m[3], a: +m[4], at: +m[5] }));
}
/** Scrim alpha at a horizontal position, linearly interpolated between stops. */
function alphaAt(list, pct) {
  if (pct <= list[0].at) return list[0].a;
  for (let i = 1; i < list.length; i += 1) {
    if (pct <= list[i].at) {
      const a = list[i - 1], b = list[i];
      const t = (pct - a.at) / (b.at - a.at);
      return a.a + (b.a - a.a) * t;
    }
  }
  return list[list.length - 1].a;
}
const lin = (c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
const L = ({ r, g, b }) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const contrast = (x, y) => { const a = L(x) + 0.05, b = L(y) + 0.05; return a > b ? a / b : b / a; };
const over = (fg, alpha, bg) => ({
  r: fg.r * alpha + bg.r * (1 - alpha),
  g: fg.g * alpha + bg.g * (1 - alpha),
  b: fg.b * alpha + bg.b * (1 - alpha),
});

const gradients = [...src.matchAll(/linear-gradient\(100deg,([^']+)\)'/g)].map((m) => m[0]);
if (gradients.length < 2) {
  console.log('  could not find both hero scrims — did the markup change?');
  process.exit(1);
}

// The text column occupies roughly the left 45% on desktop and never runs past
// it, so that is the range the headline can actually sit over.
const SAMPLES = [0, 10, 20, 30, 40, 45];
const WHITE = { r: 255, g: 255, b: 255 };
const BLACK = { r: 0, g: 0, b: 0 };
const TEXT_ON_DEEP = WHITE;
const TEXT_ON_LIGHT = { r: 26, g: 29, b: 31 };
const BODY_ON_DEEP = { r: 213, g: 216, b: 218 };   // the muted body colour

const cases = [
  ['deep hero over a PURE WHITE photograph', stops(gradients[0]), WHITE, [['headline', TEXT_ON_DEEP], ['body', BODY_ON_DEEP]]],
  ['light hero over a PURE BLACK photograph', stops(gradients[1]), BLACK, [['headline', TEXT_ON_LIGHT]]],
];

let worst = Infinity;
let fails = 0;
for (const [label, list, photo, texts] of cases) {
  console.log(`\n  ${label}`);
  for (const [what, colour] of texts) {
    for (const pct of SAMPLES) {
      const a = alphaAt(list, pct);
      const bg = over({ r: list[0].r, g: list[0].g, b: list[0].b }, a, photo);
      const ratio = contrast(colour, bg);
      worst = Math.min(worst, ratio);
      const ok = ratio >= 4.5;
      if (!ok) fails += 1;
      console.log(`   ${what.padEnd(9)} at ${String(pct).padStart(2)}%  scrim ${a.toFixed(2)}  ${ratio.toFixed(2)}:1  ${ok ? 'pass' : 'FAIL'}`);
    }
  }
}

console.log(`\n  worst case ${worst.toFixed(2)}:1 against a 4.5:1 floor`);
if (fails) {
  console.log('  THE SCRIM IS TOO LIGHT. A client photograph could make the headline unreadable.');
  process.exitCode = 1;
} else {
  console.log('  the hero photograph cannot break the headline, whatever image is supplied');
}
