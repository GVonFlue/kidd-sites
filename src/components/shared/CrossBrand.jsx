import Image from 'next/image';
import Button from './Button';
import { Eyebrow, H2 } from './Section';

/**
 * Cross-brand block. Committed scope from the discovery call: a property
 * management block on the agent site, and an agent block with his face and story
 * on the management site. The two sites currently do not reference each other
 * at all.
 */
export default function CrossBrand({ block, tone = 'deep' }) {
  if (!block) return null;
  const deep = tone === 'deep';
  return (
    <div className="grid items-center gap-10 md:grid-cols-[1fr_auto] md:gap-16">
      <div className="max-w-prose">
        <Eyebrow tone={deep ? 'deep' : 'ink'}>{block.eyebrow}</Eyebrow>
        {/* Deliberately larger than a normal H2. This is the one place on the
            agent site that has to carry a second brand, and at section-heading
            size it read as a footnote about a side project rather than as half
            the business. */}
        <H2 className="mt-4 !text-[30px] sm:!text-[36px] lg:!text-[44px]">{block.heading}</H2>
        <p className={`mt-5 text-[17px] leading-relaxed md:text-lg ${deep ? 'text-white/80' : 'text-ink/80'}`}>{block.body}</p>

        {/* The numbers are the argument. Saying "he also manages property" is a
            claim; 500 doors and seven associations is evidence, and it is the
            same evidence the Cornerstone site leads with. */}
        {block.stats?.length ? (
          <dl className={`mt-9 grid grid-cols-3 gap-5 border-t pt-7 ${deep ? 'border-white/15' : 'border-line'}`}>
            {block.stats.map((s) => (
              <div key={s.label}>
                <dt className={`font-display text-[26px] font-bold tabular-nums tracking-[-0.02em] sm:text-[32px] ${deep ? 'text-accent-lift' : 'text-accent-ink'}`}>
                  {s.figure}
                </dt>
                <dd className={`mt-1 text-[13px] leading-snug ${deep ? 'text-white/70' : 'text-ink/70'}`}>{s.label}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button href={block.cta?.href} level="primary" tone={deep ? 'deep' : 'light'}>
            {block.cta?.label}
          </Button>
          {block.secondaryCta ? (
            <Button href={block.secondaryCta.href} level="secondary" tone={deep ? 'deep' : 'light'}>
              {block.secondaryCta.label}
            </Button>
          ) : null}
        </div>
      </div>
      {/* A real photograph of Justus. No stock imagery anywhere on this build.
          Explicit dimensions through next/image, so there is no layout shift.

          `cutout` is the background-free studio PNG, the same asset as the
          Agent Kidd hero. On the deep ground it needs no card: he stands
          directly on it, which is both better looking and consistent with the
          other site. The bottom of the cutout is a hard cut across the chest, so
          it is faded out with a mask rather than left to end mid-air. */}
      {/* The width below is DEFINITE, not w-full. The grid column is `auto`, so
          a percentage width there resolves against nothing, the figure collapses
          to zero, and the photograph silently vanishes on desktop. */}
      {block.image?.cutout ? (
        <div className="relative w-[210px] justify-self-center sm:w-[250px] md:w-[290px] md:justify-self-end">
          <div
            aria-hidden="true"
            className="absolute inset-x-[-14%] bottom-[-4%] top-[18%] rounded-[50%]"
            style={{
              background: deep
                ? 'radial-gradient(closest-side, rgba(217,166,72,.16), rgba(217,166,72,.04) 62%, rgba(217,166,72,0) 100%)'
                : 'radial-gradient(closest-side, rgba(194,131,42,.14), rgba(194,131,42,.04) 62%, rgba(194,131,42,0) 100%)',
            }}
          />
          <Image
            src={block.image.cutout}
            alt={block.image.alt}
            width={960}
            height={960}
            sizes="(max-width: 768px) 60vw, 280px"
            className="relative block h-auto w-full select-none"
            style={{
              maskImage: 'linear-gradient(to bottom, #000 88%, transparent 99%)',
              WebkitMaskImage: 'linear-gradient(to bottom, #000 88%, transparent 99%)',
            }}
          />
        </div>
      ) : block.image?.src ? (
        <Image
          src={block.image.src}
          alt={block.image.alt}
          width={720}
          height={900}
          sizes="(max-width: 768px) 60vw, 260px"
          className="w-full max-w-[260px] rounded-lg object-cover"
        />
      ) : block.image !== undefined ? (
        <div
          className={`flex aspect-[4/5] w-full max-w-[260px] items-end rounded-lg border p-4 ${deep ? 'border-white/15 bg-white/5' : 'border-line bg-wash'}`}
        >
          <span className="font-mono text-xs uppercase leading-relaxed tracking-[0.08em] text-ink/70">
            Photograph to be supplied
          </span>
        </div>
      ) : null}
    </div>
  );
}
