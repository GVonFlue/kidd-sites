import { pageMetadata } from '@/lib/seo';
import Hero from '@/components/shared/Hero';
import Section from '@/components/shared/Section';
import LeadForm from '@/components/shared/LeadForm';
import BotPanel from '@/components/shared/BotPanel';
import ClosingCta from '@/components/shared/ClosingCta';
import { contact } from '@/content/cornerstone/pages';
import { forms } from '@/content/shared/forms';
import { bot } from '@/content/cornerstone/bot';

export const metadata = pageMetadata('cornerstone', '/contact');
export default function Page() {
  return (<>
    <Hero hero={contact.hero} tone="deep" seed={53} />
    <Section tone="surface"><LeadForm form={forms.contactCornerstone} formKey="contactCornerstone" id="cs-contact" tone="surface" /></Section>
    <Section tone="wash"><BotPanel bot={bot} brandKey="cornerstone" tone="wash" actions={{ hoaReview: '/hoa#review' }} /></Section>
    <Section tone="deep"><ClosingCta block={contact.closing} tone="deep" /></Section>
  </>);
}
