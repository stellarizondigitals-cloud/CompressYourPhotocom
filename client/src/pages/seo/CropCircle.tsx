import { ImageCompressor } from '@/components/ImageCompressor';
import { SEOLandingPage } from '@/components/SEOLandingPage';

export default function CropCircle() {
  return (
    <SEOLandingPage
      slug="cropCircle"
      toolComponent={<ImageCompressor />}
      parentTool="crop"
    />
  );
}
