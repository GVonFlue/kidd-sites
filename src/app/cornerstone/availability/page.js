import { pageMetadata } from '@/lib/seo';
import Hero from '@/components/shared/Hero';
import Section from '@/components/shared/Section';
import ItemList from '@/components/shared/ItemList';
import BotPanel from '@/components/shared/BotPanel';
import ClosingCta from '@/components/shared/ClosingCta';
import { H2 } from '@/components/shared/Section';
import { availability } from '@/content/cornerstone/pages';
import { bot } from '@/content/cornerstone/bot';
import { getBrand } from '@/config';

export const metadata = pageMetadata('cornerstone', '/availability');
const brand = getBrand('cornerstone');

export default function Page() {
  return (<>
    <Hero hero={availability.hero} tone="deep" seed={43} portals={brand.external.portals} />
    {/* Maintenance and leasing questions go to Mason first, which is the whole
        point: it takes load off the phone rather than adding to it. */}
    <Section tone="surface"><BotPanel bot={bot} brandKey="cornerstone" tone="surface" actions={{ hoaReview: '/hoa#review' }} /></Section>
    <Section tone="wash">
      <H2>{availability.screening.heading}</H2>
      <p className="mt-4 max-w-prose leading-relaxed text-ink/80">{availability.screening.body}</p>
      <ul className="mt-6 space-y-3">
        {availability.screening.items.map((i) => (
          <li key={i} className="flex gap-3"><span aria-hidden="true" className="mt-[9px] h-[6px] w-[6px] shrink-0 bg-accent" />{i}</li>
        ))}
      </ul>
      <p className="mt-8 max-w-prose border-l-2 border-accent pl-5 text-sm leading-relaxed opacity-80">{availability.screening.note}</p>
    </Section>
    <Section tone="surface">
      <ItemList {...availability.residents} columns={3} />
    </Section>
    <Section tone="deep"><ClosingCta block={availability.closing} tone="deep" /></Section>
  </>);
}
