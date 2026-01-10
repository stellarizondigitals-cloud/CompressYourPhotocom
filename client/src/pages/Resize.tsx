import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import JSZip from 'jszip';
import { Upload, Download, Loader2, CheckCircle, AlertCircle, Trash2, Archive, Shield, Maximize } from 'lucide-react';
import { downloadFile, downloadFileFromFile } from '@/lib/download';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/hooks/useLanguage';
import { ToolPageSEO } from '@/components/ToolPageSEO';
import { RelatedTools } from '@/components/RelatedTools';
import { AboutTool } from '@/components/AboutTool';
import { PopularUseCases } from '@/components/PopularUseCases';

interface ImageFile {
  id: string;
  originalFile: File;
  resizedFile: File | null;
  status: 'pending' | 'processing' | 'done' | 'error';
  originalSize: number;
  resizedSize: number | null;
  originalDimensions: { width: number; height: number } | null;
  newDimensions: { width: number; height: number } | null;
  errorMessage?: string;
}

type ResizeMode = 'dimensions' | 'percentage' | 'preset';

interface Preset {
  name: string;
  width: number;
  height: number;
}

const presets: Preset[] = [
  { name: 'Instagram Post', width: 1080, height: 1080 },
  { name: 'Instagram Story', width: 1080, height: 1920 },
  { name: 'YouTube Thumbnail', width: 1280, height: 720 },
  { name: 'LinkedIn', width: 1200, height: 627 },
  { name: 'WhatsApp DP', width: 500, height: 500 },
  { name: 'Passport Photo', width: 600, height: 600 },
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

async function resizeImage(file: File, targetWidth: number, targetHeight: number): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
            const newName = file.name.replace(/\.[^/.]+$/, '') + `_${targetWidth}x${targetHeight}.${ext}`;
            resolve(new File([blob], newName, { type: file.type || 'image/jpeg' }));
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        file.type || 'image/jpeg',
        0.92
      );
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

export default function Resize() {
  const { t } = useTranslation();
  const { isRTL, currentLanguage } = useLanguage();

  const [files, setFiles] = useState<ImageFile[]>([]);
  const [resizeMode, setResizeMode] = useState<ResizeMode>('dimensions');
  const [targetWidth, setTargetWidth] = useState<string>('');
  const [targetHeight, setTargetHeight] = useState<string>('');
  const [percentage, setPercentage] = useState<string>('50');
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const addFiles = useCallback(async (newFiles: File[]) => {
    const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
    const newImageFiles: ImageFile[] = await Promise.all(
      imageFiles.map(async (file) => {
        let dimensions = null;
        try {
          dimensions = await getImageDimensions(file);
        } catch {}
        return {
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          originalFile: file,
          resizedFile: null,
          status: 'pending' as const,
          originalSize: file.size,
          resizedSize: null,
          originalDimensions: dimensions,
          newDimensions: null,
        };
      })
    );
    setFiles(prev => [...prev, ...newImageFiles]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, [addFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    addFiles(selectedFiles);
    e.target.value = '';
  }, [addFiles]);

  const calculateNewDimensions = (original: { width: number; height: number }): { width: number; height: number } => {
    if (resizeMode === 'preset' && selectedPreset) {
      const preset = presets.find(p => p.name === selectedPreset);
      if (preset) return { width: preset.width, height: preset.height };
    }
    if (resizeMode === 'percentage') {
      const pct = parseInt(percentage) / 100;
      return {
        width: Math.round(original.width * pct),
        height: Math.round(original.height * pct),
      };
    }
    if (resizeMode === 'dimensions') {
      const w = parseInt(targetWidth) || original.width;
      const h = parseInt(targetHeight) || original.height;
      if (keepAspectRatio && targetWidth && !targetHeight) {
        return { width: w, height: Math.round((w / original.width) * original.height) };
      }
      if (keepAspectRatio && targetHeight && !targetWidth) {
        return { width: Math.round((h / original.height) * original.width), height: h };
      }
      return { width: w, height: h };
    }
    return original;
  };

  const resizeImages = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    const pendingFiles = files.filter(f => f.status === 'pending' || f.status === 'error');

    for (let i = 0; i < pendingFiles.length; i++) {
      setCurrentIndex(i + 1);
      const file = pendingFiles[i];
      setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'processing' } : f));

      try {
        if (!file.originalDimensions) throw new Error('Cannot get image dimensions');
        const newDims = calculateNewDimensions(file.originalDimensions);
        const resizedFile = await resizeImage(file.originalFile, newDims.width, newDims.height);
        setFiles(prev => prev.map(f =>
          f.id === file.id ? {
            ...f,
            status: 'done',
            resizedFile,
            resizedSize: resizedFile.size,
            newDimensions: newDims,
          } : f
        ));
      } catch (error) {
        setFiles(prev => prev.map(f =>
          f.id === file.id ? { ...f, status: 'error', errorMessage: 'Resize failed' } : f
        ));
      }
    }
    setIsProcessing(false);
    setCurrentIndex(0);
  };

  const handleDownloadFile = (file: ImageFile) => {
    if (!file.resizedFile) return;
    downloadFileFromFile(file.resizedFile);
  };

  const downloadAllAsZip = async () => {
    const completedFiles = files.filter(f => f.status === 'done' && f.resizedFile);
    if (completedFiles.length === 0) return;
    const zip = new JSZip();
    completedFiles.forEach(file => {
      if (file.resizedFile) zip.file(file.resizedFile.name, file.resizedFile);
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    downloadFile(blob, 'resized-photos.zip');
  };

  const clearAll = () => setFiles([]);
  const removeFile = (id: string) => setFiles(prev => prev.filter(f => f.id !== id));

  const pendingCount = files.filter(f => f.status === 'pending' || f.status === 'error').length;
  const completedCount = files.filter(f => f.status === 'done').length;
  const hasFiles = files.length > 0;

  return (
    <>
      <ToolPageSEO
        tool="resize"
        title={t('tools.resize.pageTitle', 'Resize Images Online Free | Photo Resizer for Instagram YouTube | CompressYourPhoto')}
        description={t('tools.resize.metaDescription', 'Free online image resizer. Resize photos by pixels, percentage, or social media presets (Instagram, YouTube, LinkedIn). Works on any device.')}
      />
      <div className="flex-1">
        <section className="py-12 md:py-20 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className={`text-center mb-8 space-y-3 ${isRTL ? 'text-right md:text-center' : ''}`}>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                {t('tools.resize.title', 'Resize Your Photos')}
              </h1>
              <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('tools.resize.subtitle', 'Resize images by pixels, percentage, or preset sizes. 100% private.')}
              </p>
            </div>

            <div className="max-w-[800px] mx-auto space-y-6">
              <label
                htmlFor="file-upload-resize"
                className={`relative flex flex-col items-center justify-center w-full p-10 md:p-14 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-muted/20'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                data-testid="dropzone-resize"
              >
                <input id="file-upload-resize" type="file" className="sr-only" accept="image/*" multiple onChange={handleFileInput} data-testid="input-file-resize" />
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className={`flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 transition-transform duration-200 ${isDragging ? 'scale-105' : ''}`}>
                    <Maximize className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-lg font-medium">{t('hero.dropzone', 'Drop images here or click to upload')}</p>
                </div>
              </label>

              {hasFiles && (
                <>
                  <Card className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <h3 className="font-semibold">{t('tools.resize.options', 'Resize Options')}</h3>
                        <Button variant="ghost" size="sm" onClick={clearAll} className="text-muted-foreground" data-testid="button-clear-all-resize">
                          <Trash2 className="w-4 h-4 mr-2" />{t('compression.clearAll', 'Clear All')}
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label>{t('tools.resize.mode', 'Resize Mode')}</Label>
                          <Select value={resizeMode} onValueChange={(v: ResizeMode) => setResizeMode(v)}>
                            <SelectTrigger data-testid="select-resize-mode"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dimensions">{t('tools.resize.byDimensions', 'By Dimensions')}</SelectItem>
                              <SelectItem value="percentage">{t('tools.resize.byPercentage', 'By Percentage')}</SelectItem>
                              <SelectItem value="preset">{t('tools.resize.byPreset', 'Social Media Presets')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {resizeMode === 'dimensions' && (
                          <>
                            <div className="space-y-3">
                              <Label>{t('tools.resize.width', 'Width (px)')}</Label>
                              <Input type="number" placeholder="1920" value={targetWidth} onChange={(e) => setTargetWidth(e.target.value)} data-testid="input-width" />
                            </div>
                            <div className="space-y-3">
                              <Label>{t('tools.resize.height', 'Height (px)')}</Label>
                              <Input type="number" placeholder="1080" value={targetHeight} onChange={(e) => setTargetHeight(e.target.value)} data-testid="input-height" />
                            </div>
                            <div className="flex items-center gap-2">
                              <Checkbox id="aspect" checked={keepAspectRatio} onCheckedChange={(c) => setKeepAspectRatio(!!c)} data-testid="checkbox-aspect-ratio" />
                              <Label htmlFor="aspect">{t('tools.resize.keepAspect', 'Keep aspect ratio')}</Label>
                            </div>
                          </>
                        )}

                        {resizeMode === 'percentage' && (
                          <div className="space-y-3">
                            <Label>{t('tools.resize.percentage', 'Percentage')} ({percentage}%)</Label>
                            <Input type="number" min="1" max="200" value={percentage} onChange={(e) => setPercentage(e.target.value)} data-testid="input-percentage" />
                          </div>
                        )}

                        {resizeMode === 'preset' && (
                          <div className="space-y-3">
                            <Label>{t('tools.resize.preset', 'Preset')}</Label>
                            <Select value={selectedPreset} onValueChange={setSelectedPreset}>
                              <SelectTrigger data-testid="select-preset"><SelectValue placeholder={t('tools.resize.selectPreset', 'Select a preset')} /></SelectTrigger>
                              <SelectContent>
                                {presets.map((p) => (
                                  <SelectItem key={p.name} value={p.name}>{p.name} ({p.width}x{p.height})</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>

                      {isProcessing && (
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">{t('tools.resize.processing', 'Processing')} {currentIndex}/{pendingCount}</p>
                          <Progress value={(currentIndex / pendingCount) * 100} />
                        </div>
                      )}

                      <Button onClick={resizeImages} disabled={isProcessing || pendingCount === 0} className="w-full" size="lg" data-testid="button-resize">
                        {isProcessing ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t('tools.resize.processing', 'Processing')}...</>) : t('tools.resize.resizeButton', 'Resize Images')}
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <h3 className="font-semibold">{t('compression.results', 'Results')} ({files.length})</h3>
                        {completedCount > 1 && (
                          <Button variant="outline" size="sm" onClick={downloadAllAsZip} data-testid="button-download-all-resize">
                            <Archive className="w-4 h-4 mr-2" />{t('compression.downloadAll', 'Download All')}
                          </Button>
                        )}
                      </div>
                      <div className="space-y-3">
                        {files.map((file) => (
                          <div key={file.id} className={`flex items-center gap-4 p-4 rounded-lg bg-muted/50 ${isRTL ? 'flex-row-reverse' : ''}`} data-testid={`file-item-resize-${file.id}`}>
                            <div className="flex-shrink-0">
                              {file.status === 'pending' && <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"><Upload className="w-4 h-4 text-muted-foreground" /></div>}
                              {file.status === 'processing' && <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><Loader2 className="w-4 h-4 text-primary animate-spin" /></div>}
                              {file.status === 'done' && <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"><CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" /></div>}
                              {file.status === 'error' && <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center"><AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" /></div>}
                            </div>
                            <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
                              <p className="font-medium truncate text-sm">{file.originalFile.name}</p>
                              <div className={`flex items-center gap-2 text-xs text-muted-foreground ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                                {file.originalDimensions && <span>{file.originalDimensions.width}x{file.originalDimensions.height}</span>}
                                {file.status === 'done' && file.newDimensions && (<><span>-&gt;</span><span className="text-green-600 dark:text-green-400 font-medium">{file.newDimensions.width}x{file.newDimensions.height}</span></>)}
                              </div>
                            </div>
                            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              {file.status === 'done' && (<Button variant="outline" size="sm" onClick={() => handleDownloadFile(file)} data-testid={`button-download-resize-${file.id}`}><Download className="w-4 h-4 mr-1" />{t('compression.download', 'Download')}</Button>)}
                              <Button variant="ghost" size="icon" onClick={() => removeFile(file.id)} className="text-muted-foreground" data-testid={`button-remove-resize-${file.id}`}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </>
              )}

              <div className={`flex flex-wrap items-center justify-center gap-2 md:gap-3 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`} data-testid="privacy-row-resize">
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
      <AboutTool tool="resize" />
      <PopularUseCases tool="resize" />
      <RelatedTools currentTool="resize" />
    </>
  );
}
