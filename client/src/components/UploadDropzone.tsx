import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface UploadDropzoneProps {
  onFilesSelected: (files: File[]) => void;
}

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
    <div className="w-full">
      <label
        htmlFor="file-upload"
        className={`
          relative flex flex-col items-center justify-center
          w-full p-12 md:p-16
          border-2 border-dashed rounded-2xl
          cursor-pointer
          transition-all duration-200
          ${isDragging 
            ? 'border-primary bg-primary/5 scale-[1.02]' 
            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
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
            ${isDragging ? 'animate-bounce' : ''}
          `}>
            <Upload className="w-8 h-8 text-primary" />
          </div>
          
          <div className="space-y-2">
            <p className="text-lg font-medium">
              {t('hero.dropzone')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('hero.supportedFormats')}
            </p>
          </div>

          <div className={`flex items-center gap-3 mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <FormatBadge format="JPG" />
            <FormatBadge format="PNG" />
            <FormatBadge format="WebP" />
          </div>
        </div>
      </label>
    </div>
  );
}

function FormatBadge({ format }: { format: string }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted text-sm font-medium">
      <ImageIcon className="w-3.5 h-3.5" />
      <span>{format}</span>
    </div>
  );
}
