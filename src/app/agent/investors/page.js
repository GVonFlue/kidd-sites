import { pageMetadata } from '@/lib/seo';
import Hero from '@/components/shared/Hero';
import Section from '@/components/shared/Section';
import Prose from '@/components/shared/Prose';
import Testimonial from '@/components/shared/Testimonial';
import LeadForm from '@/components/shared/LeadForm';
import CrossBrand from '@/components/shared/CrossBrand';
import ClosingCta from '@/components/shared/ClosingCta';
import { investors } from '@/content/agent/pages';
import { forms } from '@/content/shared/forms';
import { testimonials } from '@/content/shared/testimonials';

export const metadata = pageMetadata('agent', '/investors');
export default function Page() {
  return (<>
    <Hero hero={investors.hero} seed={13} />
    <Section tone="surface"><Prose {...investors.edge} /></Section>
    <Section tone="wash" id="analysis"><LeadForm form={forms.investorAnalysis} formKey="investorAnalysis" id="inv-analysis" tone="wash" /></Section>
    <Section tone="surface"><div className="max-w-2xl"><Testimonial item={testimonials.find(t=>t.id===investors.proofTestimonialId)} /></div></Section>
    <Section tone="deep"><CrossBrand block={{...investors.crossBrand, image: undefined}} tone="deep" /></Section>
    <Section tone="surface"><ClosingCta block={investors.closing} tone="light" /></Section>
  </>);
}
