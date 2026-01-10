import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Download, Loader2, Shield, Sparkles, RotateCcw, Sun, Contrast, Palette, Focus } from 'lucide-react';
import { triggerDownload } from '@/lib/download';
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface EnhanceSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  sharpness: number;
}

const defaultSettings: EnhanceSettings = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  sharpness: 0,
};

const autoEnhanceSettings: EnhanceSettings = {
  brightness: 10,
  contrast: 15,
  saturation: 10,
  sharpness: 20,
};

type QuickFilter = 'none' | 'bw' | 'sepia' | 'vivid';

function applySharpness(ctx: CanvasRenderingContext2D, width: number, height: number, amount: number) {
  if (amount <= 0) return;
  
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const factor = amount / 100;
  
  const kernel = [
    0, -factor, 0,
    -factor, 1 + 4 * factor, -factor,
    0, -factor, 0
  ];
  
  const tempData = new Uint8ClampedArray(data);
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4 + c;
            sum += tempData[idx] * kernel[(ky + 1) * 3 + (kx + 1)];
          }
        }
        data[(y * width + x) * 4 + c] = Math.min(255, Math.max(0, sum));
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}

export default function EnhancePage() {
  const { t } = useTranslation();
  const { isRTL, currentLanguage } = useLanguage();

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [settings, setSettings] = useState<EnhanceSettings>(defaultSettings);
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('none');
  const [outputFormat, setOutputFormat] = useState<'jpeg' | 'png'>('jpeg');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

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
      setSettings(defaultSettings);
      setQuickFilter('none');
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

  useEffect(() => {
    if (!imageSrc) return;
    
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      
      if (originalCanvasRef.current) {
        const canvas = originalCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
        }
      }
      
      updatePreview();
    };
    img.src = imageSrc;
  }, [imageSrc]);

  const updatePreview = useCallback(() => {
    if (!imageRef.current || !previewCanvasRef.current) return;
    
    const img = imageRef.current;
    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = img.width;
    canvas.height = img.height;
    
    let filterString = '';
    
    if (quickFilter === 'bw') {
      filterString = 'grayscale(100%)';
    } else if (quickFilter === 'sepia') {
      filterString = 'sepia(100%)';
    } else if (quickFilter === 'vivid') {
      filterString = `saturate(${150 + settings.saturation}%) contrast(${110 + settings.contrast}%)`;
    } else {
      const brightness = 100 + settings.brightness;
      const contrast = 100 + settings.contrast;
      const saturation = 100 + settings.saturation;
      filterString = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    }
    
    ctx.filter = filterString;
    ctx.drawImage(img, 0, 0);
    ctx.filter = 'none';
    
    if (settings.sharpness > 0 && quickFilter === 'none') {
      applySharpness(ctx, canvas.width, canvas.height, settings.sharpness);
    }
  }, [settings, quickFilter]);

  useEffect(() => {
    updatePreview();
  }, [settings, quickFilter, updatePreview]);

  const handleAutoEnhance = () => {
    setSettings(autoEnhanceSettings);
    setQuickFilter('none');
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setQuickFilter('none');
  };

  const handleQuickFilter = (filter: QuickFilter) => {
    setQuickFilter(filter);
    if (filter !== 'none') {
      setSettings(defaultSettings);
    }
  };

  const handleDownload = async () => {
    if (!previewCanvasRef.current || !originalFile) return;
    setIsProcessing(true);

    try {
      const canvas = previewCanvasRef.current;
      const mimeType = outputFormat === 'png' ? 'image/png' : 'image/jpeg';
      const quality = outputFormat === 'png' ? undefined : 0.92;
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const ext = outputFormat === 'png' ? 'png' : 'jpg';
            const newName = originalFile.name.replace(/\.[^/.]+$/, '') + `_enhanced.${ext}`;
            triggerDownload(blob, newName);
          }
          setIsProcessing(false);
        },
        mimeType,
        quality
      );
    } catch (error) {
      console.error('Enhancement failed:', error);
      setIsProcessing(false);
    }
  };

  const resetImage = () => {
    setImageSrc(null);
    setOriginalFile(null);
    setSettings(defaultSettings);
    setQuickFilter('none');
  };

  return (
    <>
      <ToolPageSEO
        tool="enhance"
        title={t('tools.enhance.pageTitle', 'Enhance Photo Online | Free Image Quality Enhancer | CompressYourPhoto')}
        description={t('tools.enhance.metaDescription', 'Improve your photo quality instantly. Adjust brightness, contrast, saturation, and sharpness for free. 100% private and client-side.')}
      />
      <div className="flex-1">
        <section className="py-12 md:py-20 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className={`text-center mb-8 space-y-3 ${isRTL ? 'text-right md:text-center' : ''}`}>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                {t('tools.enhance.title', 'Enhance Your Photos')}
              </h1>
              <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('tools.enhance.subtitle', 'Improve brightness, contrast, saturation, and sharpness. 100% private.')}
              </p>
            </div>

            <div className="max-w-[1000px] mx-auto space-y-6">
              {!imageSrc ? (
                <label
                  htmlFor="file-upload-enhance"
                  className={`relative flex flex-col items-center justify-center w-full p-10 md:p-14 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-muted/20'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  data-testid="dropzone-enhance"
                >
                  <input id="file-upload-enhance" type="file" className="sr-only" accept="image/jpeg,image/png,image/webp" onChange={handleFileInput} data-testid="input-file-enhance" />
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className={`flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 transition-transform duration-200 ${isDragging ? 'scale-105' : ''}`}>
                      <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-lg font-medium">{t('hero.dropzone', 'Drop images here or click to upload')}</p>
                    <p className="text-sm text-muted-foreground">{t('tools.enhance.supportedFormats', 'Supports JPG, PNG, WebP')}</p>
                  </div>
                </label>
              ) : (
                <>
                  <Card className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <h3 className="font-semibold">{t('tools.enhance.options', 'Enhancement Options')}</h3>
                        <Button variant="ghost" size="sm" onClick={resetImage} className="text-muted-foreground" data-testid="button-reset-enhance">
                          <RotateCcw className="w-4 h-4 mr-2" />{t('tools.enhance.chooseAnother', 'Choose Another Image')}
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button onClick={handleAutoEnhance} variant="default" data-testid="button-auto-enhance">
                          <Sparkles className="w-4 h-4 mr-2" />
                          {t('tools.enhance.autoEnhance', 'Auto-Enhance')}
                        </Button>
                        <Button onClick={() => handleQuickFilter('bw')} variant={quickFilter === 'bw' ? 'secondary' : 'outline'} data-testid="button-filter-bw">
                          {t('tools.enhance.blackWhite', 'Black & White')}
                        </Button>
                        <Button onClick={() => handleQuickFilter('sepia')} variant={quickFilter === 'sepia' ? 'secondary' : 'outline'} data-testid="button-filter-sepia">
                          {t('tools.enhance.sepia', 'Sepia')}
                        </Button>
                        <Button onClick={() => handleQuickFilter('vivid')} variant={quickFilter === 'vivid' ? 'secondary' : 'outline'} data-testid="button-filter-vivid">
                          {t('tools.enhance.vivid', 'Vivid')}
                        </Button>
                        <Button onClick={handleReset} variant="outline" data-testid="button-reset-filters">
                          {t('tools.enhance.reset', 'Reset')}
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Sun className="w-4 h-4 text-muted-foreground" />
                            <Label>{t('tools.enhance.brightness', 'Brightness')}: {settings.brightness}</Label>
                          </div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Slider 
                                value={[settings.brightness]} 
                                onValueChange={(v) => setSettings(s => ({ ...s, brightness: v[0] }))} 
                                min={-100} 
                                max={100} 
                                step={1}
                                disabled={quickFilter !== 'none'}
                                data-testid="slider-brightness" 
                              />
                            </TooltipTrigger>
                            <TooltipContent>{t('tools.enhance.brightnessTooltip', 'Make your photo lighter or darker')}</TooltipContent>
                          </Tooltip>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Contrast className="w-4 h-4 text-muted-foreground" />
                            <Label>{t('tools.enhance.contrast', 'Contrast')}: {settings.contrast}</Label>
                          </div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Slider 
                                value={[settings.contrast]} 
                                onValueChange={(v) => setSettings(s => ({ ...s, contrast: v[0] }))} 
                                min={-100} 
                                max={100} 
                                step={1}
                                disabled={quickFilter !== 'none'}
                                data-testid="slider-contrast" 
                              />
                            </TooltipTrigger>
                            <TooltipContent>{t('tools.enhance.contrastTooltip', 'Increase or decrease the difference between light and dark areas')}</TooltipContent>
                          </Tooltip>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Palette className="w-4 h-4 text-muted-foreground" />
                            <Label>{t('tools.enhance.saturation', 'Saturation')}: {settings.saturation}</Label>
                          </div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Slider 
                                value={[settings.saturation]} 
                                onValueChange={(v) => setSettings(s => ({ ...s, saturation: v[0] }))} 
                                min={-100} 
                                max={100} 
                                step={1}
                                disabled={quickFilter !== 'none'}
                                data-testid="slider-saturation" 
                              />
                            </TooltipTrigger>
                            <TooltipContent>{t('tools.enhance.saturationTooltip', 'Make colors more or less vibrant')}</TooltipContent>
                          </Tooltip>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Focus className="w-4 h-4 text-muted-foreground" />
                            <Label>{t('tools.enhance.sharpness', 'Sharpness')}: {settings.sharpness}</Label>
                          </div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Slider 
                                value={[settings.sharpness]} 
                                onValueChange={(v) => setSettings(s => ({ ...s, sharpness: v[0] }))} 
                                min={0} 
                                max={100} 
                                step={1}
                                disabled={quickFilter !== 'none'}
                                data-testid="slider-sharpness" 
                              />
                            </TooltipTrigger>
                            <TooltipContent>{t('tools.enhance.sharpnessTooltip', 'Enhance edge definition and clarity')}</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">{t('compression.original', 'Original')}</Label>
                          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                            <canvas ref={originalCanvasRef} className="max-w-full max-h-full object-contain" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">{t('tools.enhance.enhanced', 'Enhanced')}</Label>
                          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                            <canvas ref={previewCanvasRef} className="max-w-full max-h-full object-contain" />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <Label className="text-sm mb-2 block">{t('tools.enhance.outputFormat', 'Output Format')}</Label>
                          <Select value={outputFormat} onValueChange={(v: 'jpeg' | 'png') => setOutputFormat(v)}>
                            <SelectTrigger data-testid="select-output-format"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="jpeg">JPG</SelectItem>
                              <SelectItem value="png">PNG</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex-1 flex items-end">
                          <Button onClick={handleDownload} disabled={isProcessing} className="w-full" size="lg" data-testid="button-download-enhanced">
                            {isProcessing ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t('tools.enhance.processing', 'Processing')}...</>) : (<><Download className="w-4 h-4 mr-2" />{t('tools.enhance.download', 'Download Enhanced Photo')}</>)}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </>
              )}

              <div className={`flex flex-wrap items-center justify-center gap-2 md:gap-3 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`} data-testid="privacy-row-enhance">
                <span className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Shield className="w-4 h-4 text-primary" />
                  {t('hero.clientSide', '100% Browser-Based')}
                </span>
                <span className="text-muted-foreground/50">|</span>
                <span>{t('hero.noUpload', 'No Server Upload')}</span>
                <span className="text-muted-foreground/50">|</span>
                <span>{t('hero.privacyGuaranteed', 'Your Privacy Protected')}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
      <AboutTool tool="enhance" />
      <PopularUseCases tool="enhance" />
      <RelatedTools currentTool="enhance" />
    </>
  );
}
