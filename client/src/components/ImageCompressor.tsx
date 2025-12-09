import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import imageCompression from 'browser-image-compression';
import JSZip from 'jszip';
import { Upload, Download, Loader2, CheckCircle, AlertCircle, Trash2, Archive } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/hooks/useLanguage';

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
  
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState<string>('');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('keep');
  const [isCompressing, setIsCompressing] = useState(false);
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
    const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
    const newImageFiles: ImageFile[] = imageFiles.map(file => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      originalFile: file,
      compressedFile: null,
      status: 'pending',
      originalSize: file.size,
      compressedSize: null,
    }));
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

  const compressImages = async () => {
    if (files.length === 0) return;
    
    setIsCompressing(true);
    const pendingFiles = files.filter(f => f.status === 'pending' || f.status === 'error');
    
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
    
    setIsCompressing(false);
    setCurrentIndex(0);
  };

  const downloadFile = (file: ImageFile) => {
    if (!file.compressedFile) return;
    const url = URL.createObjectURL(file.compressedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.compressedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compressed-photos.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
                          onClick={() => downloadFile(file)}
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
        </>
      )}
    </div>
  );
}
