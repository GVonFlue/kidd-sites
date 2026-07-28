import { pageMetadata } from '@/lib/seo';
import Hero from '@/components/shared/Hero';
import Section from '@/components/shared/Section';
import Prose from '@/components/shared/Prose';
import Testimonial from '@/components/shared/Testimonial';
import ClosingCta from '@/components/shared/ClosingCta';
import { about } from '@/content/cornerstone/pages';
import { testimonials } from '@/content/shared/testimonials';

export const metadata = pageMetadata('cornerstone', '/about');
export default function Page() {
  return (<>
    <Hero hero={about.hero} tone="deep" seed={47} />
    <Section tone="surface"><Prose {...about.story} /></Section>
    <Section tone="wash"><Prose {...about.serviceArea} /></Section>
    <Section tone="surface">
      <div className="max-w-2xl"><Testimonial item={testimonials.find(t=>t.id===about.proofTestimonialId)} full /></div>
      <div className="mt-12"><ClosingCta block={about.closing} tone="light" /></div>
    </Section>
  </>);
}
