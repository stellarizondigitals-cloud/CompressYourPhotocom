import { SEOLandingPage } from '@/components/SEOLandingPage';

export default function ResizeForYoutube() {
  return (
    <SEOLandingPage
      slug="resizeForYoutube"
      cta={{
        href: '/resize',
        labelKey: 'seoPages.resizeForYoutube.ctaLabel',
        descriptionKey: 'seoPages.resizeForYoutube.ctaDescription'
      }}
      parentTool="resize"
    />
  );
}
