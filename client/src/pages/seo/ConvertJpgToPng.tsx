import { SEOLandingPage } from '@/components/SEOLandingPage';

export default function ConvertJpgToPng() {
  return (
    <SEOLandingPage
      slug="convertJpgToPng"
      cta={{
        href: '/convert',
        labelKey: 'seoPages.convertJpgToPng.ctaLabel',
        descriptionKey: 'seoPages.convertJpgToPng.ctaDescription'
      }}
      parentTool="convert"
      formats={['JPG', 'PNG']}
    />
  );
}
