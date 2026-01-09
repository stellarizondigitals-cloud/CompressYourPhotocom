import { SEOLandingPage } from '@/components/SEOLandingPage';

export default function ConvertHeicToJpg() {
  return (
    <SEOLandingPage
      slug="convertHeicToJpg"
      cta={{
        href: '/convert',
        labelKey: 'seoPages.convertHeicToJpg.ctaLabel',
        descriptionKey: 'seoPages.convertHeicToJpg.ctaDescription'
      }}
      parentTool="convert"
      formats={['HEIC', 'HEIF', 'JPG']}
    />
  );
}
