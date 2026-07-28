import { pageMetadata } from '@/lib/seo';
import Hero from '@/components/shared/Hero';
import Section from '@/components/shared/Section';
import Testimonial from '@/components/shared/Testimonial';
import ClosingCta from '@/components/shared/ClosingCta';
import { H2 } from '@/components/shared/Section';
import { owners } from '@/content/cornerstone/pages';
import { testimonials } from '@/content/shared/testimonials';

export const metadata = pageMetadata('cornerstone', '/owners');
export default function Page() {
  return (<>
    <Hero hero={owners.hero} tone="deep" seed={41} />
    <Section tone="surface">
      <H2>{owners.portalHelp.heading}</H2>
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {owners.portalHelp.items.map((i) => (<li key={i} className="border-t border-line pt-4 leading-relaxed">{i}</li>))}
      </ul>
    </Section>
    <Section tone="wash"><div className="max-w-2xl"><Testimonial item={testimonials.find(t=>t.id===owners.proofTestimonialId)} /></div></Section>
    <Section tone="surface"><ClosingCta block={owners.closing} tone="light" /></Section>
  </>);
}
