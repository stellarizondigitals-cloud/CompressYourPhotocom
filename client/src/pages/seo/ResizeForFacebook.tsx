import { SEOLandingPage } from '@/components/SEOLandingPage';

export default function ResizeForFacebook() {
  return (
    <SEOLandingPage
      slug="resizeForFacebook"
      cta={{
        href: '/resize',
        labelKey: 'seoPages.resizeForFacebook.ctaLabel',
        descriptionKey: 'seoPages.resizeForFacebook.ctaDescription'
      }}
      parentTool="resize"
    />
  );
}
