import { SEOLandingPage } from '@/components/SEOLandingPage';

export default function ConvertWebpToJpg() {
  return (
    <SEOLandingPage
      slug="convertWebpToJpg"
      cta={{
        href: '/convert',
        labelKey: 'seoPages.convertWebpToJpg.ctaLabel',
        descriptionKey: 'seoPages.convertWebpToJpg.ctaDescription'
      }}
      parentTool="convert"
      formats={['WebP', 'JPG']}
    />
  );
}
