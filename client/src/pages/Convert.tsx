import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import JSZip from 'jszip';
import { Upload, Download, Loader2, CheckCircle, AlertCircle, Trash2, Archive, Shield, RefreshCw } from 'lucide-react';
import { downloadFile, downloadFileFromFile } from '@/lib/download';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
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
  convertedFile: File | null;
  status: 'pending' | 'processing' | 'done' | 'error';
  originalSize: number;
  convertedSize: number | null;
  originalFormat: string;
  errorMessage?: string;
}

type OutputFormat = 'jpeg' | 'png' | 'webp';

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getFormatFromMime(mime: string): string {
  if (mime.includes('jpeg') || mime.includes('jpg')) return 'JPG';
  if (mime.includes('png')) return 'PNG';
  if (mime.includes('webp')) return 'WebP';
  if (mime.includes('heic') || mime.includes('heif')) return 'HEIC';
  if (mime.includes('gif')) return 'GIF';
  if (mime.includes('bmp')) return 'BMP';
  return 'Unknown';
}

async function convertImage(file: File, outputFormat: OutputFormat, quality: number): Promise<File> {
  let imageToProcess = file;

  if (file.type.includes('heic') || file.type.includes('heif') || file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')) {
    const heic2any = (await import('heic2any')).default;
    const convertedBlob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.92 });
    const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
    imageToProcess = new File([blob], file.name.replace(/\.heic$/i, '.jpg').replace(/\.heif$/i, '.jpg'), { type: 'image/jpeg' });
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0);

      const mimeType = outputFormat === 'jpeg' ? 'image/jpeg' : outputFormat === 'png' ? 'image/png' : 'image/webp';
      const ext = outputFormat === 'jpeg' ? 'jpg' : outputFormat;

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const newName = file.name.replace(/\.[^/.]+$/, '') + '.' + ext;
            resolve(new File([blob], newName, { type: mimeType }));
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        mimeType,
        outputFormat === 'jpeg' || outputFormat === 'webp' ? quality / 100 : undefined
      );
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(imageToProcess);
  });
}

export default function Convert() {
  const { t } = useTranslation();
  const { isRTL, currentLanguage } = useLanguage();

  const [files, setFiles] = useState<ImageFile[]>([]);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('jpeg');
  const [quality, setQuality] = useState(90);
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

  const addFiles = useCallback((newFiles: File[]) => {
    const imageFiles = newFiles.filter(file => file.type.startsWith('image/') || file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif'));
    const newImageFiles: ImageFile[] = imageFiles.map(file => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      originalFile: file,
      convertedFile: null,
      status: 'pending',
      originalSize: file.size,
      convertedSize: null,
      originalFormat: getFormatFromMime(file.type) || file.name.split('.').pop()?.toUpperCase() || 'Unknown',
    }));
    setFiles(prev => [...prev, ...newImageFiles]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  }, [addFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files || []));
    e.target.value = '';
  }, [addFiles]);

  const convertImages = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    const pendingFiles = files.filter(f => f.status === 'pending' || f.status === 'error');

    for (let i = 0; i < pendingFiles.length; i++) {
      setCurrentIndex(i + 1);
      const file = pendingFiles[i];
      setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'processing' } : f));

      try {
        const convertedFile = await convertImage(file.originalFile, outputFormat, quality);
        setFiles(prev => prev.map(f =>
          f.id === file.id ? { ...f, status: 'done', convertedFile, convertedSize: convertedFile.size } : f
        ));
      } catch (error) {
        setFiles(prev => prev.map(f =>
          f.id === file.id ? { ...f, status: 'error', errorMessage: 'Conversion failed' } : f
        ));
      }
    }
    setIsProcessing(false);
    setCurrentIndex(0);
  };

  const handleDownloadFile = (file: ImageFile) => {
    if (!file.convertedFile) return;
    downloadFileFromFile(file.convertedFile);
  };

  const downloadAllAsZip = async () => {
    const completedFiles = files.filter(f => f.status === 'done' && f.convertedFile);
    if (completedFiles.length === 0) return;
    const zip = new JSZip();
    completedFiles.forEach(file => {
      if (file.convertedFile) zip.file(file.convertedFile.name, file.convertedFile);
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    downloadFile(blob, 'converted-photos.zip');
  };

  const clearAll = () => setFiles([]);
  const removeFile = (id: string) => setFiles(prev => prev.filter(f => f.id !== id));

  const pendingCount = files.filter(f => f.status === 'pending' || f.status === 'error').length;
  const completedCount = files.filter(f => f.status === 'done').length;
  const hasFiles = files.length > 0;

  return (
    <>
      <ToolPageSEO
        tool="convert"
        title={t('tools.convert.pageTitle', 'Convert HEIC to JPG Free | PNG to WebP Converter Online | CompressYourPhoto')}
        description={t('tools.convert.metaDescription', 'Free image format converter. Convert HEIC to JPG, PNG to WebP, JPG to PNG online. Perfect for iPhone photos. No upload required.')}
      />
      <div className="flex-1">
        <section className="py-12 md:py-20 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className={`text-center mb-8 space-y-3 ${isRTL ? 'text-right md:text-center' : ''}`}>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                {t('tools.convert.title', 'Convert Image Format')}
              </h1>
              <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('tools.convert.subtitle', 'Convert between JPG, PNG, WebP, and HEIC. 100% private.')}
              </p>
            </div>

            <div className="max-w-[800px] mx-auto space-y-6">
              <label
                htmlFor="file-upload-convert"
                className={`relative flex flex-col items-center justify-center w-full p-10 md:p-14 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-muted/20'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                data-testid="dropzone-convert"
              >
                <input id="file-upload-convert" type="file" className="sr-only" accept="image/*,.heic,.heif" multiple onChange={handleFileInput} data-testid="input-file-convert" />
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className={`flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 transition-transform duration-200 ${isDragging ? 'scale-105' : ''}`}>
                    <RefreshCw className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-lg font-medium">{t('hero.dropzone', 'Drop images here or click to upload')}</p>
                  <p className="text-sm text-muted-foreground">{t('tools.convert.supportedInput', 'Supports JPG, PNG, WebP, HEIC, GIF, BMP')}</p>
                </div>
              </label>

              {hasFiles && (
                <>
                  <Card className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <h3 className="font-semibold">{t('tools.convert.options', 'Conversion Options')}</h3>
                        <Button variant="ghost" size="sm" onClick={clearAll} className="text-muted-foreground" data-testid="button-clear-all-convert">
                          <Trash2 className="w-4 h-4 mr-2" />{t('compression.clearAll', 'Clear All')}
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label>{t('tools.convert.outputFormat', 'Output Format')}</Label>
                          <Select value={outputFormat} onValueChange={(v: OutputFormat) => setOutputFormat(v)}>
                            <SelectTrigger data-testid="select-output-format-convert"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="jpeg">JPG</SelectItem>
                              <SelectItem value="png">PNG</SelectItem>
                              <SelectItem value="webp">WebP</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {(outputFormat === 'jpeg' || outputFormat === 'webp') && (
                          <div className="space-y-3">
                            <Label>{t('tools.convert.quality', 'Quality')} ({quality}%)</Label>
                            <Slider value={[quality]} onValueChange={(v) => setQuality(v[0])} min={10} max={100} step={5} data-testid="slider-quality-convert" />
                          </div>
                        )}
                      </div>

                      {isProcessing && (
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">{t('tools.convert.converting', 'Converting')} {currentIndex}/{pendingCount}</p>
                          <Progress value={(currentIndex / pendingCount) * 100} />
                        </div>
                      )}

                      <Button onClick={convertImages} disabled={isProcessing || pendingCount === 0} className="w-full" size="lg" data-testid="button-convert">
                        {isProcessing ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t('tools.convert.converting', 'Converting')}...</>) : t('tools.convert.convertButton', 'Convert Images')}
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <h3 className="font-semibold">{t('compression.results', 'Results')} ({files.length})</h3>
                        {completedCount > 1 && (
                          <Button variant="outline" size="sm" onClick={downloadAllAsZip} data-testid="button-download-all-convert">
                            <Archive className="w-4 h-4 mr-2" />{t('compression.downloadAll', 'Download All')}
                          </Button>
                        )}
                      </div>
                      <div className="space-y-3">
                        {files.map((file) => (
                          <div key={file.id} className={`flex items-center gap-4 p-4 rounded-lg bg-muted/50 ${isRTL ? 'flex-row-reverse' : ''}`} data-testid={`file-item-convert-${file.id}`}>
                            <div className="flex-shrink-0">
                              {file.status === 'pending' && <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"><Upload className="w-4 h-4 text-muted-foreground" /></div>}
                              {file.status === 'processing' && <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><Loader2 className="w-4 h-4 text-primary animate-spin" /></div>}
                              {file.status === 'done' && <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"><CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" /></div>}
                              {file.status === 'error' && <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center"><AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" /></div>}
                            </div>
                            <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
                              <p className="font-medium truncate text-sm">{file.originalFile.name}</p>
                              <div className={`flex items-center gap-2 text-xs text-muted-foreground ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                                <Badge variant="outline" className="text-xs">{file.originalFormat}</Badge>
                                {file.status === 'done' && (<><span>-&gt;</span><Badge variant="secondary" className="text-xs">{outputFormat.toUpperCase()}</Badge></>)}
                              </div>
                            </div>
                            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              {file.status === 'done' && (<Button variant="outline" size="sm" onClick={() => handleDownloadFile(file)} data-testid={`button-download-convert-${file.id}`}><Download className="w-4 h-4 mr-1" />{t('compression.download', 'Download')}</Button>)}
                              <Button variant="ghost" size="icon" onClick={() => removeFile(file.id)} className="text-muted-foreground" data-testid={`button-remove-convert-${file.id}`}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </>
              )}

              <div className={`flex flex-wrap items-center justify-center gap-2 md:gap-3 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`} data-testid="privacy-row-convert">
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
      <AboutTool tool="convert" />
      <PopularUseCases tool="convert" />
      <RelatedTools currentTool="convert" />
    </>
  );
}
