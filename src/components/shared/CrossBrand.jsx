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
    <div className="grid items-start gap-8 md:grid-cols-[1fr_auto] md:gap-16">
      <div className="max-w-prose">
        <Eyebrow tone={deep ? 'deep' : 'ink'}>{block.eyebrow}</Eyebrow>
        <H2 className="mt-4">{block.heading}</H2>
        <p className={`mt-5 leading-relaxed ${deep ? 'text-white/80' : 'text-ink/80'}`}>{block.body}</p>
        <div className="mt-8">
          <Button href={block.cta?.href} level="secondary" tone={deep ? 'deep' : 'light'}>
            {block.cta?.label}
          </Button>
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
