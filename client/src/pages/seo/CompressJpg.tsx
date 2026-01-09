import { ImageCompressor } from '@/components/ImageCompressor';
import { SEOLandingPage } from '@/components/SEOLandingPage';

export default function CompressJpg() {
  return (
    <SEOLandingPage
      slug="compressJpg"
      toolComponent={<ImageCompressor />}
      parentTool="compress"
      formats={['JPG', 'JPEG']}
    />
  );
}
