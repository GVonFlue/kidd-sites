import Image from 'next/image';
import ParcelGrid from './ParcelGrid';
import Button from './Button';
import { Eyebrow } from './Section';

/**
 * EYE PATH, designed deliberately:
 *   1. The headline. Largest thing on the screen by a wide margin, tight tracking.
 *   2. The primary button. The only brass fill above the fold.
 *   3. The body paragraph, which is where the claim gets substantiated.
 * The parcel grid sits behind everything at ~10% opacity so it gives the block
 * structure without ever competing for attention.
 */
export default function Hero({ hero, tone = 'light', seed = 7 }) {
  const deep = tone === 'deep';
  return (
    <section className={`relative overflow-hidden ${deep ? 'bg-surface-deep text-white' : 'bg-surface text-ink'}`}>
      <ParcelGrid
        seed={seed}
        tone={deep ? 'dark' : 'light'}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-14 md:pb-28 md:pt-24 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
        <div className="max-w-4xl">
          <div className="flex items-center gap-4">
            {hero.image?.src ? (
              <Image
                src={hero.image.src}
                alt={hero.image.alt}
                width={160}
                height={160}
                priority
                sizes="80px"
                className="h-20 w-20 shrink-0 rounded-full object-cover object-top lg:hidden"
              />
            ) : null}
            <Eyebrow tone={deep ? 'deep' : 'ink'}>{hero.eyebrow}</Eyebrow>
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold leading-[1.02] tracking-[-0.025em] md:text-4xl">
            {hero.heading}
          </h1>
          {hero.body ? (
            <p className={`mt-6 max-w-prose text-lg leading-relaxed ${deep ? 'text-white/80' : 'text-ink/80'}`}>
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
          <Image
            src={hero.image.src}
            alt={hero.image.alt}
            width={720}
            height={900}
            priority
            sizes="300px"
            className="hidden w-[300px] rounded-lg object-cover lg:block"
          />
        ) : null}
      </div>
    </section>
  );
}
