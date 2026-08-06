import { pageMetadata } from '@/lib/seo';
import Hero from '@/components/shared/Hero';
import Section from '@/components/shared/Section';
import ItemList from '@/components/shared/ItemList';
import Testimonial from '@/components/shared/Testimonial';
import LeadForm from '@/components/shared/LeadForm';
import ClosingCta from '@/components/shared/ClosingCta';
import StackCards from '@/components/shared/StackCards';
import { buy } from '@/content/agent/pages';
import { forms } from '@/content/shared/forms';
import { testimonials } from '@/content/shared/testimonials';

export const metadata = pageMetadata('agent', '/buy');
export default function Page() {
  return (<>
    <Hero hero={buy.hero} seed={3} />
    {/* THE STACKING DECK. Six steps that pile up as you scroll — the most
        striking thing on the site, and no JavaScript in it at all. This block
        used to be a flat three-column list, which is exactly the content that
        benefits: a genuine sequence, where the order is the point. */}
    <Section tone="wash"><StackCards {...buy.process} items={buy.process.steps} tone="wash" /></Section>
    <Section tone="surface">
      <ItemList {...buy.alsoCovers} columns={2} />
      <div className="mt-12 max-w-2xl"><Testimonial item={testimonials.find(t=>t.id===buy.proofTestimonialId)} /></div>
    </Section>
    <Section tone="wash" id="guide"><LeadForm form={forms.buyerGuide} formKey="buyerGuide" id="buy-guide" tone="wash" /></Section>
    <Section tone="deep"><ClosingCta block={buy.closing} tone="deep" /></Section>
  </>);
}
