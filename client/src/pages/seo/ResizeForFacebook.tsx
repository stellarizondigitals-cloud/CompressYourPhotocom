import { ImageCompressor } from '@/components/ImageCompressor';
import { SEOLandingPage } from '@/components/SEOLandingPage';

export default function ResizeForFacebook() {
  return (
    <SEOLandingPage
      slug="resizeForFacebook"
      toolComponent={<ImageCompressor />}
      parentTool="resize"
    />
  );
}
