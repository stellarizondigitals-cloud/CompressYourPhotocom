import { CheckCircle2 } from 'lucide-react';

interface Step {
  title: string;
  description: string;
}

interface HowToUseProps {
  tool: 'compress' | 'resize' | 'convert' | 'crop' | 'enhance';
}

const toolContent: Record<
  string,
  { heading: string; intro: string; steps: Step[]; tips: string[] }
> = {
  compress: {
    heading: 'How to Compress Images Online',
    intro:
      'Compressing an image reduces its file size without significantly affecting visual quality. Our tool uses smart lossy compression — it removes data your eye can\'t detect, making files 50–90% smaller while looking nearly identical.',
    steps: [
      {
        title: 'Upload your image',
        description:
          'Drag and drop your photo onto the upload area, or click to browse. You can add multiple images at once. Supported formats: JPG, PNG, WebP, HEIC, GIF.',
      },
      {
        title: 'Adjust the quality slider',
        description:
          'Set your desired quality level. 80% is the sweet spot for most photos — visually identical to the original but 60–75% smaller. Drop to 70% for smaller files, or raise to 90%+ for professional use.',
      },
      {
        title: 'Set a max width (optional)',
        description:
          'If your image is larger than you need (e.g. a 4000 px wide camera shot), set a max width like 1920 px. This further reduces file size by scaling down the resolution.',
      },
      {
        title: 'Compress and download',
        description:
          'Click "Compress Images". Each file shows the before/after size so you can see exactly how much was saved. Download individually or click "Download All" to get a ZIP file with all your compressed photos.',
      },
    ],
    tips: [
      'For web use, 75–80% quality is ideal — pages load faster and visitors won\'t notice any difference',
      'For email attachments, aim for under 1 MB per photo — set quality to 75% and max width to 1500 px',
      'Always compress from the original — each re-save of a JPG reduces quality slightly',
      'PNG files are lossless by default; if you\'re not using transparency, consider converting to JPG first for much smaller files',
      'HEIC files from iPhone compress extremely well — or convert to JPG first for better compatibility',
    ],
  },
  resize: {
    heading: 'How to Resize Images Online',
    intro:
      'Resizing changes an image\'s pixel dimensions — its width and height. This is different from compressing (which affects file size at the same dimensions). Resize when you need an image to fit a specific space, social media requirement, or display at a particular size.',
    steps: [
      {
        title: 'Upload your photos',
        description:
          'Drop your images onto the upload area or click to browse. You can resize multiple photos at the same time. Supported formats: JPG, PNG, WebP, HEIC, and more.',
      },
      {
        title: 'Choose your resize mode',
        description:
          'Select from three modes: By Dimensions (enter exact width/height in pixels), By Percentage (e.g. 50% to halve the size), or Social Media Presets (pre-set dimensions for Instagram, YouTube, LinkedIn, WhatsApp, and more).',
      },
      {
        title: 'Set dimensions or select a preset',
        description:
          'Enter your target width and/or height, or choose a preset. Enable "Keep aspect ratio" to prevent stretching — if you enter only width, the height adjusts automatically to maintain proportions.',
      },
      {
        title: 'Resize and download',
        description:
          'Click "Resize Images". Each result shows the new dimensions. Download individually or all at once as a ZIP file. Your originals are never modified.',
      },
    ],
    tips: [
      'For Instagram feed posts, use 1080 × 1080 px (square) or 1080 × 1350 px (portrait)',
      'For YouTube thumbnails, always use 1280 × 720 px (16:9 ratio)',
      'Enable "Keep aspect ratio" when entering only one dimension to avoid distortion',
      'After resizing, run the image through the Compress tool to further reduce file size',
      'For profile photos displayed as circles, crop to a square first, then resize',
    ],
  },
  convert: {
    heading: 'How to Convert Image Format Online',
    intro:
      'Different image formats have different strengths. JPG is universal. PNG is perfect for transparency. WebP is the modern web standard with better compression. HEIC is Apple\'s format but has poor compatibility. Converting between formats takes seconds with no quality loss when done right.',
    steps: [
      {
        title: 'Upload your images',
        description:
          'Drop your photos onto the upload area or click to browse. Our converter handles JPG, PNG, WebP, HEIC/HEIF, GIF, and BMP. You can convert multiple files at once.',
      },
      {
        title: 'Select output format',
        description:
          'Choose your target format: JPG (universal, great for photos), PNG (lossless, supports transparency), or WebP (modern format, smallest file size for web use).',
      },
      {
        title: 'Adjust quality (for JPG/WebP)',
        description:
          'If converting to JPG or WebP, set your desired quality. 90% is recommended for most uses. PNG is always lossless so has no quality slider.',
      },
      {
        title: 'Convert and download',
        description:
          'Click "Convert Images". Your files are converted instantly in your browser. Download individually or as a ZIP file. HEIC files from iPhone are supported directly.',
      },
    ],
    tips: [
      'Convert HEIC to JPG before sharing iPhone photos with Android users or uploading to websites',
      'Use WebP when uploading images to a website — it\'s 25–35% smaller than JPG at the same quality',
      'PNG to JPG conversion is great for reducing file size when you don\'t need transparency',
      'Converting from JPG to PNG doesn\'t add quality — start from a high-quality original for best results',
      'GIF to WebP conversion reduces file size significantly for animated images',
    ],
  },
  crop: {
    heading: 'How to Crop Images Online',
    intro:
      'Cropping removes the outer parts of an image to improve composition, focus on the subject, or fit a specific aspect ratio. Good cropping can transform a mediocre photo into a striking one — and is essential for social media where platforms have fixed aspect ratio requirements.',
    steps: [
      {
        title: 'Upload your image',
        description:
          'Click the upload area or drag and drop your photo. The Crop tool works with JPG, PNG, WebP, and HEIC. One image at a time for precise control.',
      },
      {
        title: 'Choose an aspect ratio',
        description:
          'Select a preset ratio for social media (1:1 for Instagram, 16:9 for YouTube, 9:16 for Stories) or choose Free Crop for unrestricted cropping. The Circle option creates a circular crop with transparent edges.',
      },
      {
        title: 'Position your crop area',
        description:
          'Drag the crop overlay to frame your subject perfectly. Use the zoom slider to see more detail. Drag from the edges or corners to resize the crop area.',
      },
      {
        title: 'Rotate if needed',
        description:
          'Use the rotation slider to straighten a wonky horizon or adjust the angle. This is especially useful for correcting photos taken at a slight tilt.',
      },
      {
        title: 'Crop and download',
        description:
          'Click "Crop Image" when you\'re happy with the framing. Circular crops are saved as PNG with transparent edges. All other formats maintain their original format.',
      },
    ],
    tips: [
      'For Instagram portrait posts, use 4:5 ratio — it takes up more screen space in the feed than square',
      'The rule of thirds: place your subject at one of the four intersection points of a 3×3 grid for more dynamic compositions',
      'For LinkedIn and Twitter profile photos, crop to 1:1 square — platforms will display them as circles',
      'When cropping people, avoid cutting at joints (ankles, wrists). Cut between joints for a natural look',
      'Circle crops are saved as PNG to preserve the transparent background',
    ],
  },
  enhance: {
    heading: 'How to Enhance Photo Quality Online',
    intro:
      'Photo enhancement adjusts the visual properties of your image — brightness, contrast, saturation and sharpness — to make it look its best. These four controls can rescue underexposed photos, add punch to flat images, and make colours pop. All without any software to install.',
    steps: [
      {
        title: 'Upload your photo',
        description:
          'Drop your image onto the upload area or click to browse. The Enhance tool works with JPG, PNG, WebP, and HEIC files. The original is shown for comparison.',
      },
      {
        title: 'Adjust Brightness',
        description:
          'Increase brightness for dark, underexposed photos. Decrease it for washed-out or overexposed ones. The preview updates instantly so you can see exactly what you\'re getting.',
      },
      {
        title: 'Set Contrast',
        description:
          'Contrast controls the difference between light and dark areas. Increasing contrast makes images look punchier and more defined. If you increased brightness, add a little contrast to compensate.',
      },
      {
        title: 'Adjust Saturation',
        description:
          'Saturation controls colour intensity. Increase it to make colours more vivid — great for landscapes, food and travel. Decrease it for a muted, moody look. Set to minimum for black and white.',
      },
      {
        title: 'Fine-tune Sharpness',
        description:
          'Sharpness enhances edge detail, making photos look crisper. Apply last. Don\'t over-sharpen — it creates a harsh, artificial look.',
      },
      {
        title: 'Apply and download',
        description:
          'Click "Apply Enhancements" when satisfied. You\'ll see the before/after at the bottom. Download your enhanced image — your original is never changed.',
      },
    ],
    tips: [
      'For dark indoor shots: Brightness +15–20, Contrast +10 is a good starting point',
      'For food and product photos: small increases to Contrast and Saturation (+15 each) make a big difference',
      'Be careful with Saturation on portraits — skin tones can quickly look unnatural above +20',
      'Apply Sharpness last, and keep it subtle — over-sharpened images look harsh and unnatural',
      'For a black-and-white conversion, drag Saturation to minimum, then adjust Brightness and Contrast',
    ],
  },
};

export function HowToUse({ tool }: HowToUseProps) {
  const content = toolContent[tool];
  if (!content) return null;

  return (
    <section className="py-16 md:py-20 px-4 md:px-8" data-testid={`how-to-use-${tool}`}>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">{content.heading}</h2>
        <p className="text-muted-foreground leading-relaxed mb-10">{content.intro}</p>

        <div className="space-y-6 mb-12">
          {content.steps.map((step, index) => (
            <div key={index} className="flex gap-4" data-testid={`how-to-step-${tool}-${index}`}>
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              </div>
              <div className="pt-0.5">
                <h3 className="font-semibold mb-1">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-muted/40 rounded-xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            Pro Tips
          </h3>
          <ul className="space-y-3">
            {content.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <span className="text-primary mt-0.5 flex-shrink-0">•</span>
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
