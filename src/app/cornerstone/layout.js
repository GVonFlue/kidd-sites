import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import JsonLd from '@/components/shared/JsonLd';
import { getBrand } from '@/config';
import { nav, headerCta } from '@/content/cornerstone/nav';

const brand = getBrand('cornerstone');
const other = getBrand('agent');

export default function BrandLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <JsonLd brandKey="cornerstone" />
      <Header brand={brand} nav={nav} cta={headerCta} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer brand={brand} otherBrand={other} />
    </div>
  );
}
