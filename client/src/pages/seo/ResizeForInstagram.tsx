import { SEOLandingPage } from '@/components/SEOLandingPage';

export default function ResizeForInstagram() {
  return (
    <SEOLandingPage
      slug="resizeForInstagram"
      cta={{
        href: '/resize',
        labelKey: 'seoPages.resizeForInstagram.ctaLabel',
        descriptionKey: 'seoPages.resizeForInstagram.ctaDescription'
      }}
      parentTool="resize"
    />
  );
}
