import { pageMetadata } from '@/lib/seo';
import Hero from '@/components/shared/Hero';
import Section from '@/components/shared/Section';
import Testimonial from '@/components/shared/Testimonial';
import ClosingCta from '@/components/shared/ClosingCta';
import { H2 } from '@/components/shared/Section';
import { owners } from '@/content/cornerstone/pages';
import { testimonials } from '@/content/shared/testimonials';
import PortalBar from '@/components/shared/PortalBar';
import { getBrand } from '@/config';

export const metadata = pageMetadata('cornerstone', '/owners');
const brand = getBrand('cornerstone');

export default function Page() {
  return (<>
    <Hero hero={owners.hero} tone="deep" seed={41} />
    <Section tone="surface">
      {/* The portal is the first thing an existing owner came here for.
          Renders only once the AppFolio URLs are in config. */}
      <div className="mb-12">
        <PortalBar portals={brand.external.portals} only={['owner']} heading={owners.portalHelp.portalHeading} />
      </div>
      <H2>{owners.portalHelp.heading}</H2>
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {owners.portalHelp.items.map((i) => (<li key={i} className="border-t border-line pt-4 leading-relaxed">{i}</li>))}
      </ul>
    </Section>
    <Section tone="wash"><div className="max-w-2xl"><Testimonial item={testimonials.find(t=>t.id===owners.proofTestimonialId)} /></div></Section>
    <Section tone="surface"><ClosingCta block={owners.closing} tone="light" /></Section>
  </>);
}
