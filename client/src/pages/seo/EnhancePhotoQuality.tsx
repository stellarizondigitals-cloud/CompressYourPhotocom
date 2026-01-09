import { SEOLandingPage } from '@/components/SEOLandingPage';

export default function EnhancePhotoQuality() {
  return (
    <SEOLandingPage
      slug="enhancePhotoQuality"
      cta={{
        href: '/enhance',
        labelKey: 'seoPages.enhancePhotoQuality.ctaLabel',
        descriptionKey: 'seoPages.enhancePhotoQuality.ctaDescription'
      }}
      parentTool="enhance"
    />
  );
}
