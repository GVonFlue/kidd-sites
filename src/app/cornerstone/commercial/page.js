import { pageMetadata } from '@/lib/seo';
import Hero from '@/components/shared/Hero';
import Section from '@/components/shared/Section';
import Prose from '@/components/shared/Prose';
import LeadForm from '@/components/shared/LeadForm';
import ClosingCta from '@/components/shared/ClosingCta';
import { commercial } from '@/content/cornerstone/pages';
import { forms } from '@/content/shared/forms';

export const metadata = pageMetadata('cornerstone', '/commercial');
export default function Page() {
  return (<>
    <Hero hero={commercial.hero} tone="deep" seed={37} />
    {/* `available` is withheld until the client supplies the real space details.
        Prose filters [NEEDS VERIFICATION] rather than rendering a token. */}
    <Section tone="surface"><Prose {...commercial.available} /></Section>
    <Section tone="wash" id="inquiry"><LeadForm form={forms.commercialInquiry} formKey="commercialInquiry" id="comm-inquiry" tone="wash" /></Section>
    <Section tone="deep"><ClosingCta block={commercial.closing} tone="deep" /></Section>
  </>);
}
