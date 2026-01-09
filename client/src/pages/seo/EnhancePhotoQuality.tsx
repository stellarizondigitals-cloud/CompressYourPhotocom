import { ImageCompressor } from '@/components/ImageCompressor';
import { SEOLandingPage } from '@/components/SEOLandingPage';

export default function EnhancePhotoQuality() {
  return (
    <SEOLandingPage
      slug="enhancePhotoQuality"
      toolComponent={<ImageCompressor />}
      parentTool="enhance"
    />
  );
}
