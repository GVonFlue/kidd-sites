import { pageMetadata } from '@/lib/seo';
import Hero from '@/components/shared/Hero';
import Section from '@/components/shared/Section';
import Prose from '@/components/shared/Prose';
import Testimonial from '@/components/shared/Testimonial';
import LeadForm from '@/components/shared/LeadForm';
import ClosingCta from '@/components/shared/ClosingCta';
import { sell } from '@/content/agent/pages';
import { forms } from '@/content/shared/forms';
import { testimonials } from '@/content/shared/testimonials';

export const metadata = pageMetadata('agent', '/sell');
export default function Page() {
  return (<>
    <Hero hero={sell.hero} seed={5} />
    <Section tone="wash" id="valuation"><LeadForm form={forms.valuation} formKey="valuation" id="sell-valuation" tone="wash" /></Section>
    <Section tone="surface">
      <Prose {...sell.what} />
      <div className="mt-12 max-w-2xl"><Testimonial item={testimonials.find(t=>t.id===sell.proofTestimonialId)} /></div>
    </Section>
    <Section tone="deep"><ClosingCta block={sell.closing} tone="deep" /></Section>
  </>);
}
