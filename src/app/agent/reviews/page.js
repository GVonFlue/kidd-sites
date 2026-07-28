import { pageMetadata } from '@/lib/seo';
import Hero from '@/components/shared/Hero';
import Section from '@/components/shared/Section';
import Testimonial from '@/components/shared/Testimonial';
import Button from '@/components/shared/Button';
import ClosingCta from '@/components/shared/ClosingCta';
import { reviews } from '@/content/agent/pages';
import { testimonials } from '@/content/shared/testimonials';

export const metadata = pageMetadata('agent', '/reviews');
export default function Page() {
  return (<>
    <Hero hero={reviews.hero} seed={19} />
    <Section tone="surface">
      <ul className="space-y-14">
        {testimonials.map((t, i) => (
          <li key={t.id}>
            <Testimonial item={t} full />
            {/* Social proof adjacency: an ask beside every testimonial, not one at the end. */}
            <div className="mt-6 pl-6">
              <Button href={i % 2 ? '/sell#valuation' : 'tel:+13163902120'} level="secondary">
                {i % 2 ? 'Get a free home valuation' : 'Call or text (316) 390-2120'}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </Section>
    <Section tone="deep"><ClosingCta block={reviews.closing} tone="deep" /></Section>
  </>);
}
