import Image from 'next/image';
import ParcelGrid from './ParcelGrid';
import Parallax from './Parallax';
import HeroPortrait from './HeroPortrait';
import Button from './Button';
import { Eyebrow } from './Section';

/**
 * EYE PATH, in order:
 *   1. The headline. Largest thing on screen by a wide margin, tight tracking.
 *   2. The primary button. The only brass fill above the fold.
 *   3. The body paragraph, which substantiates the claim.
 *   4. His face, which is deliberately LAST in reading order and first in
 *      peripheral order — it holds the right side without competing for the
 *      first fixation.
 *
 * DEPTH, three planes moving at different rates:
 *   back   the parcel grid, drifting slowest, clipped to the section
 *   mid    the cutout figure, anchored to the section's bottom edge, sinking
 *   front  the text and buttons, moving with the page
 *
 * The figure is NOT in a card. It is a background-free PNG standing directly on
 * the parcel grid, and it is allowed to overflow the bottom of the section. The
 * section that follows is opaque and paints after it, so as you scroll he passes
 * behind the next block of content rather than scrolling away with it.
 *
 * That means `overflow-hidden` cannot be on the section at desktop widths. The
 * grid gets its own clipping wrapper instead, because it is scaled to 125% and
 * would otherwise spill.
 */
export default function Hero({ hero, tone = 'light', seed = 7 }) {
  const deep = tone === 'deep';
  // 'wash' is the back plane used under the cutout: it gives the section that
  // follows a visible edge to pass in front of. Type colour is unchanged, so it
  // carries the same contrast ratios as 'light'.
  const ground = deep ? 'bg-surface-deep text-white' : tone === 'wash' ? 'bg-wash text-ink' : 'bg-surface text-ink';
  const img = hero.image || {};
  const cutout = img.cutout;
  const avatar = img.avatar || img.src;
  const framed = !cutout && img.src;

  return (
    <section
      className={`relative overflow-hidden ${cutout ? 'lg:overflow-visible' : ''} ${ground}`}
    >
      {/* Plane 1 — the parcel grid. Own clipping wrapper so the section itself
          can stay unclipped for the figure. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Parallax speed={0.1} className="absolute inset-0">
          <ParcelGrid seed={seed} tone={deep ? 'dark' : 'light'} className="h-[125%] w-full" />
        </Parallax>
      </div>

      {/* Plane 2 — the figure. Bottom-anchored to the section edge so the cut
          across the chest lands exactly on the seam and is never visible. */}
      {cutout ? (
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          <div className="relative mx-auto h-full max-w-6xl px-5">
            {/* Sized to stay SECOND in the hierarchy. He has to hold the right
                side without out-weighing the headline, which is the first
                fixation and the thing making the claim. */}
            <HeroPortrait className="absolute bottom-0 right-5 w-[350px] xl:w-[420px]">
              {/* A soft brass ground so the cutout does not float on the grid. */}
              <div
                className="absolute inset-x-[-12%] bottom-[-5%] top-[24%] -z-10 rounded-[50%]"
                style={{
                  background:
                    'radial-gradient(closest-side, rgba(194,131,42,.16), rgba(194,131,42,.05) 62%, rgba(194,131,42,0) 100%)',
                }}
              />
              {/* Exactly one of the two images of him is ever in the
                  accessibility tree: the other is display:none at that width. */}
              {/* Square on purpose. The figure is padded with transparency
                  ABOVE the head so it stays anchored to the bottom edge, and a
                  1:1 source means every generated srcset width has an exact
                  integer height — otherwise the rounded-off small variants trip
                  an aspect-ratio mismatch. */}
              <Image
                src={cutout}
                alt={img.alt}
                width={960}
                height={960}
                priority
                sizes="(max-width: 1023px) 1px, (max-width: 1279px) 350px, 420px"
                className="block h-auto w-full select-none"
              />
            </HeroPortrait>
          </div>
        </div>
      ) : null}

      {/* Plane 3 — the words. Always on top of both. */}
      <div
        className={`relative mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-14 md:pb-28 md:pt-20 lg:items-center lg:gap-16 ${
          framed ? 'lg:grid-cols-[1fr_auto]' : ''
        }`}
      >
        <div className={cutout ? 'max-w-4xl lg:max-w-[560px] xl:max-w-[620px]' : 'max-w-4xl'}>
          <div data-reveal-hero className="flex items-center gap-4">
            {avatar ? (
              <Image
                src={avatar}
                alt={img.alt}
                width={440}
                height={440}
                priority
                // The 1px branch is not a typo. This element is display:none
                // above 1024px, but a browser still picks a candidate from the
                // srcset and downloads it. Telling it the box is 1px wide makes
                // that download the smallest variant instead of a full-size one.
                sizes="(min-width: 1024px) 1px, 88px"
                className="h-[88px] w-[88px] shrink-0 rounded-full object-cover object-top ring-2 ring-accent/30 lg:hidden"
              />
            ) : null}
            <Eyebrow tone={deep ? 'deep' : 'ink'}>{hero.eyebrow}</Eyebrow>
          </div>

          <h1 className="mt-5 font-display text-[32px] font-bold leading-[1.05] tracking-[-0.02em] sm:text-[40px] lg:text-[54px] lg:leading-[1.02] lg:tracking-[-0.025em] xl:text-[62px]">
            {hero.heading}
          </h1>
          {hero.body ? (
            <p className={`mt-5 max-w-prose text-[17px] leading-relaxed md:mt-6 md:text-lg ${deep ? 'text-white/80' : 'text-ink/80'}`}>
              {hero.body}
            </p>
          ) : null}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href={hero.primaryCta?.href} level="primary" tone={deep ? 'deep' : 'light'}>
              {hero.primaryCta?.label}
            </Button>
            <Button href={hero.secondaryCta?.href} level="secondary" tone={deep ? 'deep' : 'light'}>
              {hero.secondaryCta?.label}
            </Button>
          </div>
        </div>

        {framed ? (
          <Parallax speed={-0.06} className="hidden lg:block">
            <Image
              src={img.src}
              alt={img.alt}
              width={1000}
              height={1250}
              priority
              sizes="(max-width: 1023px) 1px, (max-width: 1279px) 300px, 360px"
              className="w-[300px] rounded-frame object-cover shadow-[0_28px_64px_-28px_rgba(26,29,31,.5)] xl:w-[360px]"
            />
          </Parallax>
        ) : null}
      </div>
    </section>
  );
}
