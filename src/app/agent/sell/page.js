import { pageMetadata } from '@/lib/seo';
import Hero from '@/components/shared/Hero';
import Section from '@/components/shared/Section';
import Prose from '@/components/shared/Prose';
import StackCards from '@/components/shared/StackCards';
import Testimonial from '@/components/shared/Testimonial';
import LeadForm from '@/components/shared/LeadForm';
import ClosingCta from '@/components/shared/ClosingCta';
import { sell } from '@/content/agent/pages';
import { forms } from '@/content/shared/forms';
import { testimonials } from '@/content/shared/testimonials';

export const metadata = pageMetadata('agent', '/sell');

/**
 * ORDER IS THE WHOLE POINT OF THIS PAGE.
 *
 * It used to run hero -> valuation form -> an explanation of the form. The ask
 * was the second thing a seller saw, before the page had given them anything at
 * all. That converts the people who arrived already decided and nobody else —
 * and most sellers land here months before they list, which is exactly the
 * visitor a valuation is meant to win.
 *
 * The six steps now come first. Somebody who is ready is not slowed down by a
 * single scroll: the hero's primary button is an anchor straight to #valuation.
 * Somebody who is not ready has a reason to still be on the page when they are.
 *
 * The buyer's page already worked this way. This one did not, and there was no
 * reason for the difference beyond the order they happened to be built in.
 */
export default function Page() {
  return (<>
    <Hero hero={sell.hero} tone="wash" seed={5} />

    {/* Value first. The stacking deck, matching the buyer's process. */}
    <Section tone="surface">
      <StackCards {...sell.process} items={sell.process.steps} tone="surface" />
    </Section>

    <Section tone="wash">
      <Prose {...sell.what} />
    </Section>

    {/* The ask, after the page has earned it. */}
    <Section tone="surface" id="valuation">
      <LeadForm form={forms.valuation} formKey="valuation" id="sell-valuation" tone="surface" />
      <div className="mt-12 max-w-2xl">
        <Testimonial item={testimonials.find((t) => t.id === sell.proofTestimonialId)} />
      </div>
    </Section>

    <Section tone="deep"><ClosingCta block={sell.closing} tone="deep" /></Section>
  </>);
}
