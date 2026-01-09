import { ImageCompressor } from '@/components/ImageCompressor';
import { SEOLandingPage } from '@/components/SEOLandingPage';

export default function ResizeForInstagram() {
  return (
    <SEOLandingPage
      slug="resizeForInstagram"
      toolComponent={<ImageCompressor />}
      parentTool="resize"
    />
  );
}
