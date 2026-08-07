import { ImageCompressor } from '@/components/ImageCompressor';
import { SEOLandingPage } from '@/components/SEOLandingPage';

export default function CompressForWhatsapp() {
  return (
    <SEOLandingPage
      slug="compressForWhatsapp"
      toolComponent={<ImageCompressor />}
      parentTool="compress"
      formats={['JPG', 'PNG', 'WebP', 'HEIC']}
    />
  );
}
