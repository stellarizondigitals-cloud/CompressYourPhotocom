import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Zap, Globe } from 'lucide-react';
import { UploadDropzone } from '@/components/UploadDropzone';
import { FeatureCard } from '@/components/FeatureCard';
import { useLanguage } from '@/hooks/useLanguage';

export default function Home() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFilesSelected = useCallback((files: File[]) => {
    setSelectedFiles(files);
    console.log('Files ready for compression:', files.map(f => f.name));
  }, []);

  return (
    <div className="flex-1">
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className={`text-center mb-12 space-y-4 ${isRTL ? 'text-right md:text-center' : ''}`}>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {t('hero.headline')}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('hero.subheadline')}
            </p>
          </div>

          <div className="max-w-3xl mx-auto mb-8">
            <UploadDropzone onFilesSelected={handleFilesSelected} />
          </div>

          <div className={`flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              100% client-side
            </span>
            <span className="hidden sm:block">•</span>
            <span>No upload required</span>
            <span className="hidden sm:block">•</span>
            <span>Privacy guaranteed</span>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={Shield}
              title={t('features.privacy.title')}
              description={t('features.privacy.description')}
            />
            <FeatureCard
              icon={Zap}
              title={t('features.speed.title')}
              description={t('features.speed.description')}
            />
            <FeatureCard
              icon={Globe}
              title={t('features.multilingual.title')}
              description={t('features.multilingual.description')}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
