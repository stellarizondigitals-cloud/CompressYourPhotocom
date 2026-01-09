import { ImageCompressor } from '@/components/ImageCompressor';
import { SEOLandingPage } from '@/components/SEOLandingPage';

export default function CompressForEmail() {
  return (
    <SEOLandingPage
      slug="compressForEmail"
      toolComponent={<ImageCompressor />}
      parentTool="compress"
    />
  );
}
