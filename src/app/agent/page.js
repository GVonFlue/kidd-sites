import { pageMetadata } from '@/lib/seo';
import Hero from '@/components/shared/Hero';
import Section from '@/components/shared/Section';
import StatStrip from '@/components/shared/StatStrip';
import BotPanel from '@/components/shared/BotPanel';
import LaneBand from '@/components/shared/LaneBand';
import Prose from '@/components/shared/Prose';
import Testimonial from '@/components/shared/Testimonial';
import LeadForm from '@/components/shared/LeadForm';
import CrossBrand from '@/components/shared/CrossBrand';
import Marquee from '@/components/shared/Marquee';
import ClosingCta from '@/components/shared/ClosingCta';
import { getBrand } from '@/config';
import { home } from '@/content/agent/home';
import { bot } from '@/content/agent/bot';
import { forms } from '@/content/shared/forms';
import { testimonials } from '@/content/shared/testimonials';
import { agentTicker } from '@/content/shared/ticker';

export const metadata = pageMetadata('agent', '/');

const brand = getBrand('agent');
const t = (id) => testimonials.find((x) => x.id === id);

export default function Page() {
  return (
    <>
      {/* `wash` is the back plane. The cutout of Justus stands on it and sinks
          behind the section below as you scroll, so the two grounds have to
          differ or the motion reads as a cropped photograph. */}
      <Hero hero={home.hero} tone="wash" seed={7} />

      {/* The credential band, in the position a logo bar occupies on a SaaS
          site: the first thing under the hero, where a visitor deciding whether
          to keep reading gets a second of evidence. Every line is verified —
          see content/shared/ticker.js. */}
      <Marquee items={agentTicker} tone="surface" label="Credentials" />

      {/* Bot in the TOP THIRD, per the conversion architecture minimums.
          `overlap` is what he passes behind. */}
      <Section tone="surface" overlap>
        <BotPanel bot={bot} brandKey="agent" enabled={brand.bot.enabled} tone="surface" actions={{ booking: '/contact' }} />
      </Section>

      <Section tone="deep">
        <StatStrip {...home.proof} tone="deep" />
      </Section>

      <Section tone="wash">
        <LaneBand {...home.lanes} tone="wash" />
      </Section>

      <Section tone="surface">
        {/* The statement writes itself in brass as you scroll — see ScrollFill. */}
        <Prose {...home.differentiator} fill />
        <div className="mt-12 max-w-2xl">
          <Testimonial item={t('metzger')} />
        </div>
      </Section>

      <Section tone="wash" id="guide">
        <LeadForm form={forms.buyerGuide} formKey="buyerGuide" id="home-guide" tone="wash" />
      </Section>

      <Section tone="deep">
        <CrossBrand block={home.crossBrand} tone="deep" />
      </Section>

      <Section tone="surface">
        <div className="max-w-2xl">
          <Testimonial item={t('vance-burns')} />
        </div>
        <div className="mt-12">
          <ClosingCta block={home.closing} tone="light" />
        </div>
      </Section>
    </>
  );
}
