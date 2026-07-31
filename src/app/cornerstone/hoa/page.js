import { pageMetadata } from '@/lib/seo';
import PortalBar from '@/components/shared/PortalBar';
import { getBrand } from '@/config';
import Hero from '@/components/shared/Hero';
import Section from '@/components/shared/Section';
import ItemList from '@/components/shared/ItemList';
import Prose from '@/components/shared/Prose';
import Testimonial from '@/components/shared/Testimonial';
import LeadForm from '@/components/shared/LeadForm';
import { H2 } from '@/components/shared/Section';
import { hoa } from '@/content/cornerstone/hoa';
import { forms } from '@/content/shared/forms';
import { testimonials } from '@/content/shared/testimonials';

export const metadata = pageMetadata('cornerstone', '/hoa');
const brand = getBrand('cornerstone');

/**
 * PAGE ORDER IS DELIBERATELY INVERTED against normal conversion practice.
 * Client's hard constraint: value first, no pitching, only a small factual
 * credential block. The give comes first and carries no ask. The request for a
 * review is stated once, quietly, at the bottom.
 */
export default function Page() {
  return (<>
    <Hero hero={hoa.hero} tone="deep" seed={31} />

    {/* 1. THE GIVE. First. No ask attached. */}
    <Section tone="surface" id={hoa.give.id}>
      <LeadForm
        form={{ ...forms.hoaBoardGuide, valueStack: hoa.give.items, body: hoa.give.body, heading: hoa.give.heading, eyebrow: hoa.give.eyebrow }}
        formKey="hoaBoardGuide"
        id="hoa-guide"
        tone="surface"
      />
    </Section>

    {/* 2. Plain facts. No adjectives about ourselves. */}
    <Section tone="wash"><ItemList {...hoa.what} columns={2} /></Section>

    {/* 3. The small credential block. Two lines.
        The homeowner portal sits here, quietly, ahead of it. A homeowner in an
        association we already manage arrives on this page looking for a login,
        not a pitch, and making them read the whole give-first argument first is
        the same failure as burying it. It is a utility, not an ask, so it does
        not violate the no-pitching constraint. */}
    <Section tone="surface">
      <div className="mb-12">
        <PortalBar portals={brand.external.portals} only={['hoa']} heading={hoa.portal?.heading} note={hoa.portal?.note} />
      </div>
      <div className="max-w-prose border-l-2 border-line pl-6">
        <p className="font-mono text-xs uppercase tracking-[0.08em] text-ink/75">{hoa.credentials.heading}</p>
        {hoa.credentials.lines.map((l) => (
          <p key={l.slice(0, 30)} className="mt-3 text-sm leading-relaxed opacity-80">{l}</p>
        ))}
      </div>
    </Section>

    {/* 4. The ask. Once, quietly, at the bottom. */}
    <Section tone="wash" id={hoa.ask.id}>
      <div className="max-w-2xl"><Testimonial item={testimonials.find(t=>t.id===hoa.proofTestimonialId)} /></div>
      <div className="mt-14">
        <H2>{hoa.ask.heading}</H2>
        <p className="mt-4 max-w-prose leading-relaxed text-ink/80">{hoa.ask.body}</p>
      </div>
      <div className="mt-10">
        <LeadForm form={forms.hoaReview} formKey="hoaReview" id="hoa-review" tone="wash" />
      </div>
    </Section>
  </>);
}
