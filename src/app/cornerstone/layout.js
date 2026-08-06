import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import JsonLd from '@/components/shared/JsonLd';
import { getBrand } from '@/config';
import { nav, headerCta, siteLinks } from '@/content/cornerstone/nav';
import SmoothScroll from '@/components/shared/SmoothScroll';
import ScrollProgress from '@/components/shared/ScrollProgress';

const brand = getBrand('cornerstone');
const other = getBrand('agent');

export default function BrandLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <JsonLd brandKey="cornerstone" />
      {/* Inertial scrolling, desktop + full-motion only. Renders nothing. */}
      <SmoothScroll />
      {/* Hairline of brass across the top, filling as you read. */}
      <ScrollProgress />
      <Header brand={brand} nav={nav} cta={headerCta} />
      {/* Everything below the floating nav lives inside the frame: inset from
          the viewport on every side, rounded, and clipped. */}
      <div className="frame flex flex-1 flex-col">
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer brand={brand} otherBrand={other} nav={nav} siteLinks={siteLinks} />
      </div>
    </div>
  );
}
