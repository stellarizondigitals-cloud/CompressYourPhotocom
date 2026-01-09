import { SEOLandingPage } from '@/components/SEOLandingPage';

export default function ResizeForLinkedin() {
  return (
    <SEOLandingPage
      slug="resizeForLinkedin"
      cta={{
        href: '/resize',
        labelKey: 'seoPages.resizeForLinkedin.ctaLabel',
        descriptionKey: 'seoPages.resizeForLinkedin.ctaDescription'
      }}
      parentTool="resize"
    />
  );
}
