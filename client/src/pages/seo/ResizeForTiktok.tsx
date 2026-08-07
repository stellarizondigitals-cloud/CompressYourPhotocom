import { SEOLandingPage } from '@/components/SEOLandingPage';

export default function ResizeForTiktok() {
  return (
    <SEOLandingPage
      slug="resizeForTiktok"
      cta={{
        href: '/resize',
        labelKey: 'seoPages.resizeForTiktok.ctaLabel',
        descriptionKey: 'seoPages.resizeForTiktok.ctaDescription'
      }}
      parentTool="resize"
    />
  );
}
