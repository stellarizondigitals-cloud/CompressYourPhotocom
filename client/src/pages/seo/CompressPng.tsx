import { ImageCompressor } from '@/components/ImageCompressor';
import { SEOLandingPage } from '@/components/SEOLandingPage';

export default function CompressPng() {
  return (
    <SEOLandingPage
      slug="compressPng"
      toolComponent={<ImageCompressor />}
      parentTool="compress"
      formats={['PNG']}
    />
  );
}
