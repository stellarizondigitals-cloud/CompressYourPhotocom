import { ImageCompressor } from '@/components/ImageCompressor';
import { SEOLandingPage } from '@/components/SEOLandingPage';

export default function ConvertWebpToJpg() {
  return (
    <SEOLandingPage
      slug="convertWebpToJpg"
      toolComponent={<ImageCompressor />}
      parentTool="convert"
      formats={['WebP', 'JPG']}
    />
  );
}
