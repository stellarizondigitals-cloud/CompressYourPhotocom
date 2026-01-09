import { ImageCompressor } from '@/components/ImageCompressor';
import { SEOLandingPage } from '@/components/SEOLandingPage';

export default function ConvertHeicToJpg() {
  return (
    <SEOLandingPage
      slug="convertHeicToJpg"
      toolComponent={<ImageCompressor />}
      parentTool="convert"
      formats={['HEIC', 'HEIF', 'JPG']}
    />
  );
}
