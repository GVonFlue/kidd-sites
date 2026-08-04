import { pageMetadata } from '@/lib/seo';
import Hero from '@/components/shared/Hero';
import Section from '@/components/shared/Section';
import Prose from '@/components/shared/Prose';
import Testimonial from '@/components/shared/Testimonial';
import ClosingCta from '@/components/shared/ClosingCta';
import { about } from '@/content/agent/pages';
import { testimonials } from '@/content/shared/testimonials';

export const metadata = pageMetadata('agent', '/about');
export default function Page() {
  return (<>
    {/* tone="wash", matching the home hero. The cutout is bottom-anchored and
        passes BEHIND the section below it on scroll — that effect only reads if
        the section below is a different colour, otherwise the seam he crosses is
        invisible and he simply appears to be cut off. The default 'light' tone
        is the same bg as the section that follows. */}
    <Hero hero={about.hero} tone="wash" seed={17} />
    <Section tone="surface"><Prose {...about.story} /></Section>
    <Section tone="wash">
      <h2 className="font-display text-xl font-bold tracking-[-0.02em] md:text-2xl">{about.credentials.heading}</h2>
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {about.credentials.items.map((c) => (
          <li key={c} className="border-t border-line pt-4 leading-relaxed">{c}</li>
        ))}
      </ul>
    </Section>
    <Section tone="surface"><div className="max-w-2xl"><Testimonial item={testimonials.find(t=>t.id===about.proofTestimonialId)} full /></div></Section>
    <Section tone="deep"><ClosingCta block={about.closing} tone="deep" /></Section>
  </>);
}
