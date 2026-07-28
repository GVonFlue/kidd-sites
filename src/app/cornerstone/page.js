import { pageMetadata } from '@/lib/seo';
import Hero from '@/components/shared/Hero';
import Section from '@/components/shared/Section';
import StatStrip from '@/components/shared/StatStrip';
import BotPanel from '@/components/shared/BotPanel';
import LaneBand from '@/components/shared/LaneBand';
import ItemList from '@/components/shared/ItemList';
import Prose from '@/components/shared/Prose';
import Testimonial from '@/components/shared/Testimonial';
import CrossBrand from '@/components/shared/CrossBrand';
import ClosingCta from '@/components/shared/ClosingCta';
import Button from '@/components/shared/Button';
import LeadForm from '@/components/shared/LeadForm';
import { getBrand } from '@/config';
import { home } from '@/content/cornerstone/home';
import { forms } from '@/content/shared/forms';
import { bot } from '@/content/cornerstone/bot';
import { testimonials } from '@/content/shared/testimonials';

export const metadata = pageMetadata('cornerstone', '/');

const brand = getBrand('cornerstone');
const t = (id) => testimonials.find((x) => x.id === id);

export default function Page() {
  return (
    <>
      {/* Cornerstone leads dark. That is the one confident visual decision on the
          client's existing sites and it is inherited equity, not a stylistic reach. */}
      <Hero hero={home.hero} tone="deep" seed={11} />

      <Section tone="deep" className="!pt-0">
        <BotPanel bot={bot} brandKey="cornerstone" tone="deep" actions={{ hoaReview: '/hoa#review' }} />
      </Section>

      <Section tone="surface">
        <StatStrip {...home.proof} tone="ink" />
      </Section>

      {/* Owners first, residents third. The rental search bar is deliberately not
          the front page: it served the lowest-value visitor first. */}
      <Section tone="wash">
        <LaneBand {...home.lanes} tone="wash" />
      </Section>

      <Section tone="surface">
        <ItemList {...home.services} columns={2} />
      </Section>

      <Section tone="wash">
        <div className="max-w-prose">
          <Prose heading={home.cost.heading} body={home.cost.body} />
          <div className="mt-8">
            <Button href={home.cost.cta.href} level="primary">{home.cost.cta.label}</Button>
          </div>
        </div>
        <div className="mt-12 max-w-2xl">
          <Testimonial item={t('julie-ryan')} />
        </div>
      </Section>

      {/* The lead magnet with its stacked value list. Give-first, and it is the
          door for an owner who is not ready to ask for anything yet. */}
      <Section tone="surface" id="owner-guide">
        <LeadForm form={forms.ownerGuide} formKey="ownerGuide" id="cs-owner-guide" tone="surface" />
      </Section>

      <Section tone="deep">
        <CrossBrand block={home.crossBrand} tone="deep" />
      </Section>

      <Section tone="surface">
        <div className="max-w-2xl">
          <Testimonial item={t('amanda-ryan')} />
        </div>
        <div className="mt-12">
          <ClosingCta block={home.closing} tone="light" />
        </div>
      </Section>
    </>
  );
}
