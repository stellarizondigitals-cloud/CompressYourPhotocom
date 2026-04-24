import { useState, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Upload, Download, ZoomIn, Sparkles, Crown, Check, X, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { AdBanner } from '@/components/AdBanner';
import { PremiumModal } from '@/components/PremiumModal';
import { useAuth } from '@/contexts/AuthContext';
import { useGlobalUsage } from '@/hooks/useGlobalUsage';

const SCALE_OPTIONS = [
  { value: 2, label: '2×', description: 'Double the size', free: true },
  { value: 4, label: '4×', description: '4× larger', free: false },
  { value: 8, label: '8×', description: '8× largest', free: false },
];

function applyUnsharpMask(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  amount = 0.65,
  radius = 1
): void {
  const blurred = new Uint8ClampedArray(data.length);
  // Simple box blur pass
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, count = 0;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const ny = y + dy, nx = x + dx;
          if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
            const i = (ny * width + nx) * 4;
            r += data[i]; g += data[i + 1]; b += data[i + 2]; count++;
          }
        }
      }
      const i = (y * width + x) * 4;
      blurred[i] = r / count; blurred[i + 1] = g / count; blurred[i + 2] = b / count; blurred[i + 3] = data[i + 3];
    }
  }
  // Apply unsharp mask: result = original + amount * (original - blurred)
  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      const diff = data[i + c] - blurred[i + c];
      data[i + c] = Math.min(255, Math.max(0, data[i + c] + amount * diff));
    }
  }
}

async function upscaleImageCanvas(file: File, scale: number): Promise<{ blob: Blob; objectUrl: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const srcUrl = URL.createObjectURL(file);
    img.onload = () => {
      const outW = Math.round(img.naturalWidth * scale);
      const outH = Math.round(img.naturalHeight * scale);

      const canvas = document.createElement('canvas');
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext('2d')!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, outW, outH);

      const imageData = ctx.getImageData(0, 0, outW, outH);
      applyUnsharpMask(imageData.data, outW, outH);
      ctx.putImageData(imageData, 0, 0);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(srcUrl);
          if (!blob) { reject(new Error('Canvas export failed')); return; }
          const objectUrl = URL.createObjectURL(blob);
          resolve({ blob, objectUrl, width: outW, height: outH });
        },
        'image/png'
      );
    };
    img.onerror = () => { URL.revokeObjectURL(srcUrl); reject(new Error('Failed to load image')); };
    img.src = srcUrl;
  });
}

const nonEnglishLangs = ['es', 'pt', 'fr', 'de', 'hi', 'zh-cn', 'ar', 'id'];

export default function ImageUpscaler() {
  const { isPro } = useAuth();
  const { canUse, usesRemaining, recordUse } = useGlobalUsage();
  const { pathname } = useLocation();
  const langPrefix = nonEnglishLangs.includes(pathname.split('/')[1]) ? `/${pathname.split('/')[1]}` : '';
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultDimensions, setResultDimensions] = useState<{ w: number; h: number } | null>(null);
  const [scale, setScale] = useState(2);
  const [processing, setProcessing] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleFileChange = useCallback((f: File) => {
    if (!f.type.startsWith('image/')) { setError('Please upload an image file.'); return; }
    if (f.size > 50 * 1024 * 1024) { setError('File too large. Max 50MB.'); return; }
    setError(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setResultUrl(null);
    setResultDimensions(null);
    setSliderPos(50);
  }, [previewUrl, resultUrl]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFileChange(f);
  }, [handleFileChange]);

  const handleUpscale = async () => {
    if (!file) return;

    const needsPro = !isPro && scale > 2;
    if (!canUse || needsPro) { setShowPremiumModal(true); return; }

    setProcessing(true);
    setError(null);
    try {
      const result = await upscaleImageCanvas(file, scale);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(result.objectUrl);
      setResultDimensions({ w: result.width, h: result.height });
      setSliderPos(50);
      recordUse();
    } catch (err: any) {
      setError(err.message || 'Failed to upscale. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = file.name.replace(/\.[^.]+$/, '') + `_${scale}x_upscaled.png`;
    a.click();
  };

  const handleSliderMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    const move = (e: MouseEvent | TouchEvent) => handleSliderMove(e);
    const up = () => setIsDragging(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchend', up);
    };
  }, [isDragging, handleSliderMove]);

  const remainingFree = usesRemaining;
  const canUpscale = !!file && !processing;
  const originalDims = file ? { w: 0, h: 0 } : null;

  return (
    <div className="flex-1">
      <Helmet>
        <title>Image Upscaler — Enlarge Photos Without Losing Quality | CompressYourPhoto</title>
        <meta name="description" content="Free online image upscaler. Enlarge photos 2x, 4x or 8x with smart sharpening technology. No quality loss, 100% private — files never leave your browser. Free 3 uses." />
        <link rel="canonical" href={`https://www.compressyourphoto.com${langPrefix}/image-upscaler`} />
        <meta property="og:title" content="Image Upscaler — Enlarge Photos Without Losing Quality" />
        <meta property="og:description" content="Upscale images 2x, 4x or 8x online for free. Smart sharpening keeps your photos crisp. 100% private, no upload needed." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Image Upscaler — CompressYourPhoto",
          "url": "https://www.compressyourphoto.com/image-upscaler",
          "applicationCategory": "MultimediaApplication",
          "operatingSystem": "Any (web browser)",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "GBP" },
          "description": "Enlarge images 2x, 4x or 8x with smart sharpening. 100% client-side, no upload."
        })}</script>
      </Helmet>

      {/* Hero */}
      <section className="py-10 md:py-14 px-4 md:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <Badge variant="secondary" className="mb-3 text-xs">Free · No upload · 100% private</Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Image Upscaler
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            Enlarge your photos 2×, 4×, or 8× with smart sharpening that keeps images crisp and clear. 
            All processing happens in your browser — your files never leave your device.
          </p>
          {!isPro && (
            <p className="text-xs text-muted-foreground mt-3">
              Free: {remainingFree} of 3 uses remaining (2× only) ·{' '}
              <button onClick={() => setShowPremiumModal(true)} className="text-primary underline">Upgrade for 4× & 8× unlimited</button>
            </p>
          )}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-4">
        <AdBanner slot="1234567890" format="horizontal" fullWidth />
      </div>

      {/* Main tool */}
      <section className="px-4 md:px-8 pb-10">
        <div className="max-w-4xl mx-auto">

          {/* Scale selector */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {SCALE_OPTIONS.map((opt) => {
              const locked = !isPro && !opt.free;
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    if (locked) { setShowPremiumModal(true); return; }
                    setScale(opt.value);
                    setResultUrl(null);
                  }}
                  className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                    scale === opt.value && !locked
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-background hover:border-primary/40'
                  } ${locked ? 'opacity-60 cursor-pointer' : ''}`}
                  data-testid={`btn-scale-${opt.value}x`}
                >
                  {opt.label} {locked && <Crown className="w-3 h-3 inline ml-1 text-yellow-500" />}
                  <span className="block text-xs text-muted-foreground font-normal">{opt.description}</span>
                </button>
              );
            })}
          </div>

          {/* Upload area */}
          {!file ? (
            <div
              className="border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-primary/40 hover:bg-muted/20 transition-all"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              data-testid="upload-area-upscaler"
            >
              <ZoomIn className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
              <p className="font-semibold text-base mb-1">Drop an image here or click to upload</p>
              <p className="text-sm text-muted-foreground">JPG, PNG, WebP, GIF — max 50MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                data-testid="input-file-upscaler"
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Before / After comparison */}
              {resultUrl ? (
                <Card className="overflow-hidden">
                  <div className="p-3 border-b flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <ArrowLeftRight className="w-3.5 h-3.5" /> Drag the slider to compare before & after
                    </span>
                    {resultDimensions && (
                      <span className="text-xs text-muted-foreground">{resultDimensions.w} × {resultDimensions.h}px</span>
                    )}
                  </div>
                  <div
                    ref={sliderRef}
                    className="relative select-none overflow-hidden"
                    style={{ cursor: 'ew-resize', maxHeight: '420px' }}
                    onMouseDown={() => setIsDragging(true)}
                    onTouchStart={() => setIsDragging(true)}
                    data-testid="comparison-slider"
                  >
                    {/* After (upscaled) — full width underneath */}
                    <img src={resultUrl} alt="Upscaled" className="w-full h-auto object-contain" style={{ maxHeight: '420px' }} />
                    {/* Before (original) — clipped to left portion */}
                    <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
                      <img src={previewUrl!} alt="Original" className="w-full h-auto object-contain" style={{ width: `${100 / sliderPos * 100}%`, maxWidth: 'none', maxHeight: '420px' }} />
                    </div>
                    {/* Divider line */}
                    <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg" style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                        <ArrowLeftRight className="w-4 h-4 text-gray-600" />
                      </div>
                    </div>
                    {/* Labels */}
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">Before</div>
                    <div className="absolute top-2 right-2 bg-primary/80 text-white text-xs px-2 py-0.5 rounded">After {scale}×</div>
                  </div>
                </Card>
              ) : (
                <Card className="overflow-hidden">
                  <div className="p-3 border-b flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Original image</span>
                    <button onClick={() => { if (previewUrl) URL.revokeObjectURL(previewUrl); setFile(null); setPreviewUrl(null); setResultUrl(null); }} className="text-muted-foreground hover:text-foreground">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <img src={previewUrl!} alt="Original" className="w-full h-auto object-contain" style={{ maxHeight: '420px' }} />
                </Card>
              )}

              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 text-sm text-red-700 dark:text-red-400" data-testid="upscaler-error">{error}</div>
              )}

              <div className="flex gap-3 flex-wrap">
                <Button
                  onClick={handleUpscale}
                  disabled={!canUpscale}
                  className="flex-1 min-w-[160px]"
                  data-testid="btn-upscale"
                >
                  {processing ? (
                    <><Sparkles className="w-4 h-4 mr-2 animate-pulse" />Upscaling…</>
                  ) : (
                    <><Sparkles className="w-4 h-4 mr-2" />Upscale {scale}×</>
                  )}
                </Button>
                {resultUrl && (
                  <Button variant="outline" onClick={handleDownload} data-testid="btn-download-upscaled">
                    <Download className="w-4 h-4 mr-2" />Download
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (previewUrl) URL.revokeObjectURL(previewUrl);
                    if (resultUrl) URL.revokeObjectURL(resultUrl);
                    setFile(null); setPreviewUrl(null); setResultUrl(null);
                  }}
                >
                  <Upload className="w-4 h-4 mr-2" />New image
                </Button>
              </div>

              {!isPro && !processing && (
                <p className="text-xs text-muted-foreground text-center">
                  {remainingFree > 0
                    ? `${remainingFree} free use${remainingFree > 1 ? 's' : ''} remaining this session`
                    : 'Free limit reached — '}
                  {remainingFree === 0 && (
                    <button onClick={() => setShowPremiumModal(true)} className="text-primary underline">upgrade to Pro for unlimited</button>
                  )}
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-8">
        <AdBanner slot="2345678901" format="rectangle" />
      </div>

      {/* How to use */}
      <section className="py-12 md:py-16 bg-muted/30 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">How to Upscale Your Image</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Upload Your Image', desc: 'Drag and drop or click to upload any JPG, PNG, WebP, or GIF image up to 50MB.' },
              { step: '2', title: 'Choose Your Scale', desc: 'Select 2× (free), 4×, or 8×. Pro users get all scales with unlimited uses.' },
              { step: '3', title: 'Download Upscaled', desc: 'Click Upscale and download your crisp, enlarged image. No sign-up required.' },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-lg flex items-center justify-center mx-auto mb-3">{s.step}</div>
                <h3 className="font-semibold mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>

          <Card className="mt-8 p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" />Pro Tips for Best Results</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />Start with the highest quality original — upscaling works best on sharp source images.</li>
              <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />Use 2× for most purposes (web, social media, printing). Use 4× or 8× for very small thumbnails or extreme enlargement.</li>
              <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />PNG output preserves the highest quality — perfect for logos, graphics, and images with text.</li>
              <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />Use the before/after slider to judge quality before downloading.</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Free vs Pro */}
      <section className="py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Free vs Pro</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-5">
              <p className="font-semibold mb-3">Free</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {['3 upscales per session', '2× scale only', 'PNG output', 'No sign-up required'].map(f => (
                  <li key={f} className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />{f}</li>
                ))}
              </ul>
            </Card>
            <Card className="p-5 border-primary/30 bg-primary/[0.02]">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-4 h-4 text-yellow-500" />
                <p className="font-semibold">Pro</p>
                <Badge variant="secondary" className="text-xs ml-auto">from £0.99 trial</Badge>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {['Unlimited upscales', '2×, 4×, and 8× scale', 'PNG output', 'All 9 Pro tools included', '100% private processing'].map(f => (
                  <li key={f} className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />{f}</li>
                ))}
              </ul>
              <Button size="sm" className="w-full mt-4" onClick={() => setShowPremiumModal(true)} data-testid="btn-upscaler-get-pro">
                <Crown className="w-3.5 h-3.5 mr-1.5" />Try Pro — £0.99 for 7 days
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-muted/30 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'Will upscaling make my image blurry?', a: 'No — our smart sharpening technology applies an unsharp mask filter after scaling to keep edges crisp and details clear. Results are noticeably sharper than standard browser scaling.' },
              { q: 'What is the maximum image size I can upscale?', a: 'You can upload images up to 50MB. Note that very large images upscaled 8× will create very large output files (e.g. a 2000×2000 image becomes 16000×16000 at 8×) which may take a moment to process.' },
              { q: 'Are my photos uploaded to a server?', a: 'No. All upscaling happens entirely in your browser using JavaScript and the HTML5 Canvas API. Your images never leave your device.' },
              { q: 'What format is the output?', a: 'All upscaled images are saved as PNG for maximum quality and lossless output, regardless of the input format.' },
              { q: 'How many images can I upscale for free?', a: 'Free users get 3 upscales per session at 2× scale. Upgrade to Pro for unlimited upscales at 2×, 4×, and 8×.' },
            ].map((item, i) => (
              <Card key={i} className="p-4">
                <p className="font-semibold text-sm mb-1">{item.q}</p>
                <p className="text-sm text-muted-foreground">{item.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <AdBanner slot="3456789012" format="horizontal" fullWidth />
      </div>

      <PremiumModal open={showPremiumModal} onOpenChange={setShowPremiumModal} />
    </div>
  );
}
