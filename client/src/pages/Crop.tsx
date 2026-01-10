import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Cropper from 'react-easy-crop';
import type { Area, Point } from 'react-easy-crop';
import { Upload, Download, Loader2, Shield, Crop as CropIcon, RotateCcw } from 'lucide-react';
import { downloadFile } from '@/lib/download';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/hooks/useLanguage';
import { ToolPageSEO } from '@/components/ToolPageSEO';
import { RelatedTools } from '@/components/RelatedTools';
import { AboutTool } from '@/components/AboutTool';
import { PopularUseCases } from '@/components/PopularUseCases';

type AspectPreset = 'free' | '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | 'circle';

interface PresetOption {
  value: AspectPreset;
  label: string;
  aspect: number | undefined;
}

const presets: PresetOption[] = [
  { value: 'free', label: 'Free Crop', aspect: undefined },
  { value: '1:1', label: 'Square (1:1)', aspect: 1 },
  { value: '16:9', label: 'YouTube Thumbnail (16:9)', aspect: 16 / 9 },
  { value: '9:16', label: 'Instagram Story (9:16)', aspect: 9 / 16 },
  { value: '4:3', label: 'Standard (4:3)', aspect: 4 / 3 },
  { value: '3:4', label: 'Portrait (3:4)', aspect: 3 / 4 },
  { value: 'circle', label: 'Circle Avatar', aspect: 1 },
];

async function getCroppedImage(imageSrc: string, pixelCrop: Area, isCircle: boolean): Promise<Blob> {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => { image.onload = resolve; });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  if (isCircle) {
    ctx.beginPath();
    ctx.arc(pixelCrop.width / 2, pixelCrop.height / 2, pixelCrop.width / 2, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.clip();
  }

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create blob'));
      },
      isCircle ? 'image/png' : 'image/jpeg',
      0.92
    );
  });
}

export default function CropPage() {
  const { t } = useTranslation();
  const { isRTL, currentLanguage } = useLanguage();

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [aspectPreset, setAspectPreset] = useState<AspectPreset>('1:1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const currentPreset = presets.find(p => p.value === aspectPreset);
  const aspect = currentPreset?.aspect;
  const isCircle = aspectPreset === 'circle';

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const loadImage = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setOriginalFile(file);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(f => f.type.startsWith('image/'));
    if (imageFile) loadImage(imageFile);
  }, [loadImage]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadImage(file);
    e.target.value = '';
  }, [loadImage]);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCropAndDownload = async () => {
    if (!imageSrc || !croppedAreaPixels || !originalFile) return;
    setIsProcessing(true);

    try {
      const croppedBlob = await getCroppedImage(imageSrc, croppedAreaPixels, isCircle);
      const ext = isCircle ? 'png' : 'jpg';
      const newName = originalFile.name.replace(/\.[^/.]+$/, '') + `_cropped.${ext}`;
      downloadFile(croppedBlob, newName);
    } catch (error) {
      console.error('Crop failed:', error);
    }

    setIsProcessing(false);
  };

  const resetImage = () => {
    setImageSrc(null);
    setOriginalFile(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  return (
    <>
      <ToolPageSEO
        tool="crop"
        title={t('tools.crop.pageTitle', 'Crop Images Online Free | Instagram YouTube Cropper | CompressYourPhoto')}
        description={t('tools.crop.metaDescription', 'Free online image cropper. Crop photos for Instagram, YouTube thumbnails, Stories, or create circle avatars. Works on mobile and desktop.')}
      />
      <div className="flex-1">
        <section className="py-12 md:py-20 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className={`text-center mb-8 space-y-3 ${isRTL ? 'text-right md:text-center' : ''}`}>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                {t('tools.crop.title', 'Crop Your Photos')}
              </h1>
              <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('tools.crop.subtitle', 'Crop images with presets for social media or create circle avatars. 100% private.')}
              </p>
            </div>

            <div className="max-w-[800px] mx-auto space-y-6">
              {!imageSrc ? (
                <label
                  htmlFor="file-upload-crop"
                  className={`relative flex flex-col items-center justify-center w-full p-10 md:p-14 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-muted/20'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  data-testid="dropzone-crop"
                >
                  <input id="file-upload-crop" type="file" className="sr-only" accept="image/*" onChange={handleFileInput} data-testid="input-file-crop" />
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className={`flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 transition-transform duration-200 ${isDragging ? 'scale-105' : ''}`}>
                      <CropIcon className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-lg font-medium">{t('hero.dropzone', 'Drop images here or click to upload')}</p>
                  </div>
                </label>
              ) : (
                <>
                  <Card className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <h3 className="font-semibold">{t('tools.crop.options', 'Crop Options')}</h3>
                        <Button variant="ghost" size="sm" onClick={resetImage} className="text-muted-foreground" data-testid="button-reset-crop">
                          <RotateCcw className="w-4 h-4 mr-2" />{t('tools.crop.reset', 'Choose Another Image')}
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label>{t('tools.crop.aspectRatio', 'Aspect Ratio')}</Label>
                          <Select value={aspectPreset} onValueChange={(v: AspectPreset) => setAspectPreset(v)}>
                            <SelectTrigger data-testid="select-aspect-ratio"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {presets.map((p) => (
                                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <Label>{t('tools.crop.zoom', 'Zoom')} ({zoom.toFixed(1)}x)</Label>
                          <Slider value={[zoom]} onValueChange={(v) => setZoom(v[0])} min={1} max={3} step={0.1} data-testid="slider-zoom" />
                        </div>
                      </div>

                      <div className="relative w-full h-[400px] bg-muted rounded-lg overflow-hidden">
                        <Cropper
                          image={imageSrc}
                          crop={crop}
                          zoom={zoom}
                          aspect={aspect}
                          cropShape={isCircle ? 'round' : 'rect'}
                          onCropChange={setCrop}
                          onZoomChange={setZoom}
                          onCropComplete={onCropComplete}
                        />
                      </div>

                      <Button onClick={handleCropAndDownload} disabled={isProcessing || !croppedAreaPixels} className="w-full" size="lg" data-testid="button-crop-download">
                        {isProcessing ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t('tools.crop.processing', 'Processing')}...</>) : (<><Download className="w-4 h-4 mr-2" />{t('tools.crop.cropAndDownload', 'Crop & Download')}</>)}
                      </Button>
                    </div>
                  </Card>
                </>
              )}

              <div className={`flex flex-wrap items-center justify-center gap-2 md:gap-3 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`} data-testid="privacy-row-crop">
                <span className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Shield className="w-4 h-4 text-primary" />
                  {t('hero.clientSide', '100% Client-Side')}
                </span>
                <span className="text-muted-foreground/50">|</span>
                <span>{t('hero.noUpload', 'No Upload')}</span>
                <span className="text-muted-foreground/50">|</span>
                <span>{t('hero.privacyGuaranteed', 'Privacy Guaranteed')}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
      <AboutTool tool="crop" />
      <PopularUseCases tool="crop" />
      <RelatedTools currentTool="crop" />
    </>
  );
}
