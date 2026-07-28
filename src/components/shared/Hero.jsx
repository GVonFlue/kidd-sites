import Image from 'next/image';
import ParcelGrid from './ParcelGrid';
import Parallax from './Parallax';
import Button from './Button';
import { Eyebrow } from './Section';

/**
 * EYE PATH, in order:
 *   1. The headline. Largest thing on screen by a wide margin, tight tracking.
 *   2. The primary button. The only brass fill above the fold.
 *   3. The body paragraph, which substantiates the claim.
 *
 * DEPTH. Three layers moving at different rates as you scroll:
 *   back   the parcel grid, drifting slowest
 *   mid    the photograph
 *   front  the text and buttons, moving with the page
 * The result is that content scrolls IN FRONT OF the photograph rather than
 * past it. Desktop only, and off entirely under prefers-reduced-motion.
 */
export default function Hero({ hero, tone = 'light', seed = 7 }) {
  const deep = tone === 'deep';
  return (
    <section className={`relative overflow-hidden ${deep ? 'bg-surface-deep text-white' : 'bg-surface text-ink'}`}>
      <Parallax speed={0.1} className="pointer-events-none absolute inset-0">
        <ParcelGrid seed={seed} tone={deep ? 'dark' : 'light'} className="h-[125%] w-full" />
      </Parallax>

      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-14 md:pb-28 md:pt-20 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
        <div className="max-w-4xl">
          <div data-reveal-hero className="flex items-center gap-4">
            {hero.image?.src ? (
              <Image
                src={hero.image.src}
                alt={hero.image.alt}
                width={200}
                height={200}
                priority
                sizes="88px"
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

        {hero.image?.src ? (
          <Parallax speed={-0.06} className="hidden lg:block">
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
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
