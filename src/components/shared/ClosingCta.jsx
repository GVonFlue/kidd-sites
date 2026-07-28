import Button from './Button';
import { H2 } from './Section';
import Reveal from './Reveal';

/** Closing CTA before the footer, restating the primary action. Every route. */
export default function ClosingCta({ block, tone = 'deep' }) {
  if (!block) return null;
  const deep = tone === 'deep';
  return (
    <Reveal className="max-w-prose">
      <H2>{block.heading}</H2>
      {block.body ? (
        <p className={`mt-4 leading-relaxed ${deep ? 'text-white/80' : 'text-ink/80'}`}>{block.body}</p>
      ) : null}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button href={block.primaryCta?.href} level="primary" tone={deep ? 'deep' : 'light'}>
          {block.primaryCta?.label}
        </Button>
        <Button href={block.secondaryCta?.href} level="secondary" tone={deep ? 'deep' : 'light'}>
          {block.secondaryCta?.label}
        </Button>
      </div>
    </Reveal>
  );
}
