import { ImageCompressor } from '@/components/ImageCompressor';
import { SEOLandingPage } from '@/components/SEOLandingPage';

export default function ResizeForLinkedin() {
  return (
    <SEOLandingPage
      slug="resizeForLinkedin"
      toolComponent={<ImageCompressor />}
      parentTool="resize"
    />
  );
}
