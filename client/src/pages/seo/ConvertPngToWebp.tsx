import { SEOLandingPage } from '@/components/SEOLandingPage';

export default function ConvertPngToWebp() {
  return (
    <SEOLandingPage
      slug="convertPngToWebp"
      cta={{
        href: '/convert',
        labelKey: 'seoPages.convertPngToWebp.ctaLabel',
        descriptionKey: 'seoPages.convertPngToWebp.ctaDescription'
      }}
      parentTool="convert"
      formats={['PNG', 'WebP']}
    />
  );
}
