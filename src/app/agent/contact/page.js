import { pageMetadata } from '@/lib/seo';
import Hero from '@/components/shared/Hero';
import Section from '@/components/shared/Section';
import LeadForm from '@/components/shared/LeadForm';
import BotPanel from '@/components/shared/BotPanel';
import ClosingCta from '@/components/shared/ClosingCta';
import { contact } from '@/content/agent/pages';
import { forms } from '@/content/shared/forms';
import { bot } from '@/content/agent/bot';

export const metadata = pageMetadata('agent', '/contact');
export default function Page() {
  return (<>
    <Hero hero={contact.hero} seed={23} />
    <Section tone="wash"><LeadForm form={forms.contactAgent} formKey="contactAgent" id="contact" tone="wash" /></Section>
    <Section tone="surface"><BotPanel bot={bot} brandKey="agent" tone="surface" actions={{ booking: '/contact' }} /></Section>
    <Section tone="deep"><ClosingCta block={contact.closing} tone="deep" /></Section>
  </>);
}
