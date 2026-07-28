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
          Explicit dimensions through next/image, so there is no layout shift. */}
      {block.image?.src ? (
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
