import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';

interface UploadDropzoneProps {
  onFilesSelected: (files: File[]) => void;
}

const formats = ['JPG', 'PNG', 'WebP', 'HEIC', 'GIF'];

export function UploadDropzone({ onFilesSelected }: UploadDropzoneProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    );
    if (files.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  return (
    <Card className="w-full p-8 md:p-12">
      <label
        htmlFor="file-upload"
        className={`
          relative flex flex-col items-center justify-center
          w-full p-12 md:p-16
          border-2 border-dashed rounded-xl
          cursor-pointer
          transition-all duration-200
          ${isDragging 
            ? 'border-primary bg-primary/5 scale-[1.01]' 
            : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30'
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
        
        <div className="flex flex-col items-center gap-6 text-center">
          <div className={`
            flex items-center justify-center
            w-20 h-20 rounded-full
            bg-primary/10
            transition-transform duration-200
            ${isDragging ? 'scale-110' : ''}
          `}>
            <Upload className="w-10 h-10 text-primary" />
          </div>
          
          <div className="space-y-2">
            <p className="text-xl font-medium">
              {t('hero.dropzone')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('hero.supportedFormats')}
            </p>
          </div>

          <div className={`flex flex-wrap items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {formats.map((format) => (
              <Badge key={format} variant="secondary" className="text-xs">
                {format}
              </Badge>
            ))}
          </div>
        </div>
      </label>
    </Card>
  );
}
