import { SEOLandingPage } from '@/components/SEOLandingPage';

export default function ResizePassportPhoto() {
  return (
    <SEOLandingPage
      slug="resizePassportPhoto"
      cta={{
        href: '/resize',
        labelKey: 'seoPages.resizePassportPhoto.ctaLabel',
        descriptionKey: 'seoPages.resizePassportPhoto.ctaDescription'
      }}
      parentTool="resize"
    />
  );
}
