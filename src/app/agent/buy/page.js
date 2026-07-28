import { pageMetadata } from '@/lib/seo';
import Hero from '@/components/shared/Hero';
import Section from '@/components/shared/Section';
import ItemList from '@/components/shared/ItemList';
import Testimonial from '@/components/shared/Testimonial';
import LeadForm from '@/components/shared/LeadForm';
import ClosingCta from '@/components/shared/ClosingCta';
import { buy } from '@/content/agent/pages';
import { forms } from '@/content/shared/forms';
import { testimonials } from '@/content/shared/testimonials';

export const metadata = pageMetadata('agent', '/buy');
export default function Page() {
  return (<>
    <Hero hero={buy.hero} seed={3} />
    <Section tone="wash"><ItemList {...buy.process} numbered columns={3} /></Section>
    <Section tone="surface">
      <ItemList {...buy.alsoCovers} columns={2} />
      <div className="mt-12 max-w-2xl"><Testimonial item={testimonials.find(t=>t.id===buy.proofTestimonialId)} /></div>
    </Section>
    <Section tone="wash" id="guide"><LeadForm form={forms.buyerGuide} formKey="buyerGuide" id="buy-guide" tone="wash" /></Section>
    <Section tone="deep"><ClosingCta block={buy.closing} tone="deep" /></Section>
  </>);
}
