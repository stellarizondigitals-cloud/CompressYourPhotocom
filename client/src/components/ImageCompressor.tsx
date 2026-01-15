import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import imageCompression from 'browser-image-compression';
import JSZip from 'jszip';
import { Upload, Download, Loader2, CheckCircle, AlertCircle, Trash2, Archive, Cloud, Crown } from 'lucide-react';
import { triggerDownload } from '@/lib/download';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import { PremiumModal } from '@/components/PremiumModal';

const FREE_COMPRESSION_LIMIT = 5;
const FREE_FILE_LIMIT = 10;
const PRO_FILE_LIMIT = 50;

interface ImageFile {
  id: string;
  originalFile: File;
  compressedFile: File | null;
  status: 'pending' | 'compressing' | 'done' | 'error';
  originalSize: number;
  compressedSize: number | null;
  errorMessage?: string;
}

type OutputFormat = 'keep' | 'jpeg' | 'png' | 'webp';

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getOutputMimeType(format: OutputFormat, originalType: string): string | undefined {
  switch (format) {
    case 'jpeg': return 'image/jpeg';
    case 'png': return 'image/png';
    case 'webp': return 'image/webp';
    default: return undefined;
  }
}

function getFileExtension(format: OutputFormat, originalName: string): string {
  const baseName = originalName.replace(/\.[^/.]+$/, '');
  switch (format) {
    case 'jpeg': return `${baseName}.jpg`;
    case 'png': return `${baseName}.png`;
    case 'webp': return `${baseName}.webp`;
    default: return originalName;
  }
}

export function ImageCompressor() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { isPro } = useAuth();
  
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState<string>('');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('keep');
  const [isCompressing, setIsCompressing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [sessionCompressions, setSessionCompressions] = useState(0);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const fileLimit = isPro ? PRO_FILE_LIMIT : FREE_FILE_LIMIT;
  const hasReachedLimit = !isPro && sessionCompressions >= FREE_COMPRESSION_LIMIT;

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const addFiles = useCallback((newFiles: File[]) => {
    const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
    const remainingSlots = fileLimit - files.length;
    const filesToAdd = imageFiles.slice(0, Math.max(0, remainingSlots));
    
    if (filesToAdd.length < imageFiles.length && !isPro) {
      setShowPremiumModal(true);
    }
    
    const newImageFiles: ImageFile[] = filesToAdd.map(file => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      originalFile: file,
      compressedFile: null,
      status: 'pending',
      originalSize: file.size,
      compressedSize: null,
    }));
    setFiles(prev => [...prev, ...newImageFiles]);
  }, [fileLimit, files.length, isPro]);

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

  const compressImages = async () => {
    if (files.length === 0) return;
    
    if (hasReachedLimit) {
      setShowPremiumModal(true);
      return;
    }
    
    setIsCompressing(true);
    const pendingFiles = files.filter(f => f.status === 'pending' || f.status === 'error');
    let successCount = 0;
    
    for (let i = 0; i < pendingFiles.length; i++) {
      setCurrentIndex(i + 1);
      const file = pendingFiles[i];
      
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'compressing' } : f
      ));

      try {
        const options: Parameters<typeof imageCompression>[1] = {
          initialQuality: quality / 100,
          useWebWorker: true,
        };

        if (maxWidth && parseInt(maxWidth) > 0) {
          options.maxWidthOrHeight = parseInt(maxWidth);
        }

        const mimeType = getOutputMimeType(outputFormat, file.originalFile.type);
        if (mimeType) {
          options.fileType = mimeType;
        }

        const compressedBlob = await imageCompression(file.originalFile, options);
        const newFileName = getFileExtension(outputFormat, file.originalFile.name);
        const compressedFile = new File([compressedBlob], newFileName, { type: compressedBlob.type });

        setFiles(prev => prev.map(f => 
          f.id === file.id ? { 
            ...f, 
            status: 'done', 
            compressedFile,
            compressedSize: compressedFile.size 
          } : f
        ));
        successCount++;
      } catch (error) {
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { 
            ...f, 
            status: 'error', 
            errorMessage: t('compression.compressionFailed')
          } : f
        ));
      }
    }
    
    if (!isPro) {
      const newTotal = sessionCompressions + successCount;
      setSessionCompressions(newTotal);
      
      if (newTotal >= FREE_COMPRESSION_LIMIT) {
        setShowPremiumModal(true);
      }
    }
    
    setIsCompressing(false);
    setCurrentIndex(0);
  };

  const handleDownloadFile = (file: ImageFile) => {
    if (!file.compressedFile) return;
    triggerDownload(file.compressedFile, file.compressedFile.name);
  };

  const downloadAllAsZip = async () => {
    const completedFiles = files.filter(f => f.status === 'done' && f.compressedFile);
    if (completedFiles.length === 0) return;

    const zip = new JSZip();
    completedFiles.forEach(file => {
      if (file.compressedFile) {
        zip.file(file.compressedFile.name, file.compressedFile);
      }
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    triggerDownload(blob, 'compressed-photos.zip');
  };

  const clearAll = () => {
    setFiles([]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const pendingCount = files.filter(f => f.status === 'pending' || f.status === 'error').length;
  const completedCount = files.filter(f => f.status === 'done').length;
  const hasFiles = files.length > 0;

  return (
    <div className="w-full space-y-6">
      <label
        htmlFor="file-upload"
        className={`
          relative flex flex-col items-center justify-center
          w-full p-10 md:p-14
          border-2 border-dashed rounded-lg
          cursor-pointer
          transition-all duration-200
          ${isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-muted/20'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-testid="dropzone-upload"
      >
        <input
          id="file-upload"
          type="file"
          className="sr-only"
          accept="image/*"
          multiple
          onChange={handleFileInput}
          data-testid="input-file-upload"
        />
        
        <div className="flex flex-col items-center gap-4 text-center">
          <div className={`
            flex items-center justify-center
            w-16 h-16 rounded-full
            bg-primary/10
            transition-transform duration-200
            ${isDragging ? 'scale-105' : ''}
          `}>
            <Upload className="w-8 h-8 text-primary" />
          </div>
          
          <p className="text-lg font-medium">
            {t('hero.dropzone')}
          </p>
        </div>
      </label>

      {hasFiles && (
        <>
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <h3 className="font-semibold">{t('compression.quality')}</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearAll}
                  className="text-muted-foreground"
                  data-testid="button-clear-all"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('compression.clearAll')}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <Label>{t('compression.qualityLabel', { value: quality })}</Label>
                  <Slider
                    value={[quality]}
                    onValueChange={(v) => setQuality(v[0])}
                    min={10}
                    max={100}
                    step={5}
                    data-testid="slider-quality"
                  />
                </div>

                <div className="space-y-3">
                  <Label>{t('compression.maxWidth')}</Label>
                  <Input
                    type="number"
                    placeholder={t('compression.maxWidthPlaceholder')}
                    value={maxWidth}
                    onChange={(e) => setMaxWidth(e.target.value)}
                    min={0}
                    data-testid="input-max-width"
                  />
                </div>

                <div className="space-y-3">
                  <Label>{t('compression.outputFormat')}</Label>
                  <Select value={outputFormat} onValueChange={(v: OutputFormat) => setOutputFormat(v)}>
                    <SelectTrigger data-testid="select-output-format">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="keep">{t('compression.keepOriginal')}</SelectItem>
                      <SelectItem value="jpeg">JPG</SelectItem>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="webp">WebP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isCompressing && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {t('compression.compressing', { current: currentIndex, total: pendingCount })}
                  </p>
                  <Progress value={(currentIndex / pendingCount) * 100} />
                </div>
              )}

              <Button
                onClick={compressImages}
                disabled={isCompressing || pendingCount === 0}
                className="w-full"
                size="lg"
                data-testid="button-compress"
              >
                {isCompressing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('compression.compressing', { current: currentIndex, total: pendingCount })}
                  </>
                ) : (
                  t('compression.compressButton')
                )}
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <h3 className="font-semibold">{t('compression.results')} ({files.length})</h3>
                {completedCount > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadAllAsZip}
                    data-testid="button-download-all"
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    {t('compression.downloadAll')}
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className={`flex items-center gap-4 p-4 rounded-lg bg-muted/50 ${isRTL ? 'flex-row-reverse' : ''}`}
                    data-testid={`file-item-${file.id}`}
                  >
                    <div className="flex-shrink-0">
                      {file.status === 'pending' && (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <Upload className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                      {file.status === 'compressing' && (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Loader2 className="w-4 h-4 text-primary animate-spin" />
                        </div>
                      )}
                      {file.status === 'done' && (
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                      )}
                      {file.status === 'error' && (
                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </div>
                      )}
                    </div>

                    <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
                      <p className="font-medium truncate text-sm">{file.originalFile.name}</p>
                      <div className={`flex items-center gap-2 text-xs text-muted-foreground ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                        <span>{formatFileSize(file.originalSize)}</span>
                        {file.status === 'done' && file.compressedSize !== null && (
                          <>
                            <span>→</span>
                            <span className="text-green-600 dark:text-green-400 font-medium">
                              {formatFileSize(file.compressedSize)}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {Math.round((1 - file.compressedSize / file.originalSize) * 100)}% {t('compression.saved')}
                            </Badge>
                          </>
                        )}
                        {file.status === 'error' && (
                          <span className="text-red-600 dark:text-red-400">{file.errorMessage}</span>
                        )}
                      </div>
                    </div>

                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {file.status === 'done' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadFile(file)}
                          data-testid={`button-download-${file.id}`}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          {t('compression.download')}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(file.id)}
                        className="text-muted-foreground"
                        data-testid={`button-remove-${file.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {completedCount > 0 && !isPro && (
            <Card className="p-5 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
              <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  <Cloud className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 space-y-2">
                  <h4 className="font-semibold text-sm text-foreground">Secure your photos forever</h4>
                  <p className="text-sm text-muted-foreground">
                    Store your compressed images in pCloud's Lifetime storage. One-time payment, no monthly fees.
                  </p>
                  <div className={`flex items-center gap-3 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <a
                      href="https://partner.pcloud.com/r/153325"
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      data-testid="link-pcloud-affiliate"
                    >
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        Get Lifetime Storage
                      </Button>
                    </a>
                    <span className="text-xs text-muted-foreground">(Affiliate Link)</span>
                  </div>
                </div>
              </div>
            </Card>
          )}
          
          {!isPro && (
            <div className="text-center text-sm text-muted-foreground">
              <p>
                {t('premium.sessionUsage', '{{used}} of {{limit}} free compressions used this session', { 
                  used: sessionCompressions, 
                  limit: FREE_COMPRESSION_LIMIT 
                })}
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowPremiumModal(true)}
                className="text-primary hover:text-primary"
                data-testid="button-upgrade-pro"
              >
                <Crown className="w-4 h-4 mr-1" />
                {t('premium.upgradeLink', 'Upgrade to Pro for unlimited')}
              </Button>
            </div>
          )}
        </>
      )}
      
      <PremiumModal open={showPremiumModal} onOpenChange={setShowPremiumModal} />
    </div>
  );
}
