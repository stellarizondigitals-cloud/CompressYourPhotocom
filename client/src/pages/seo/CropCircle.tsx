import { SEOLandingPage } from '@/components/SEOLandingPage';

export default function CropCircle() {
  return (
    <SEOLandingPage
      slug="cropCircle"
      cta={{
        href: '/crop',
        labelKey: 'seoPages.cropCircle.ctaLabel',
        descriptionKey: 'seoPages.cropCircle.ctaDescription'
      }}
      parentTool="crop"
    />
  );
}
