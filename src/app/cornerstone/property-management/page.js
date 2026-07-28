import { pageMetadata } from '@/lib/seo';
import Hero from '@/components/shared/Hero';
import Section from '@/components/shared/Section';
import Prose from '@/components/shared/Prose';
import ItemList from '@/components/shared/ItemList';
import Testimonial from '@/components/shared/Testimonial';
import LeadForm from '@/components/shared/LeadForm';
import ClosingCta from '@/components/shared/ClosingCta';
import { propertyManagement as pm } from '@/content/cornerstone/pages';
import { forms } from '@/content/shared/forms';
import { testimonials } from '@/content/shared/testimonials';

export const metadata = pageMetadata('cornerstone', '/property-management');
export default function Page() {
  return (<>
    <Hero hero={pm.hero} tone="deep" seed={29} />
    <Section tone="wash"><Prose {...pm.cost} /></Section>
    <Section tone="surface" id="analysis"><LeadForm form={forms.rentAnalysis} formKey="rentAnalysis" id="pm-analysis" tone="surface" /></Section>
    <Section tone="wash">
      <ItemList {...pm.included} columns={2} />
      <div className="mt-14"><Prose {...pm.placementOnly} /></div>
    </Section>
    <Section tone="deep"><Prose {...pm.subsidized} tone="deep" /></Section>
    <Section tone="surface">
      <div className="max-w-2xl"><Testimonial item={testimonials.find(t=>t.id===pm.proofTestimonialId)} /></div>
      <div className="mt-12"><ClosingCta block={pm.closing} tone="light" /></div>
    </Section>
  </>);
}
