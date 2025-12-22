import { useTranslation } from 'react-i18next';
import { Shield, Zap, Globe } from 'lucide-react';
import { ImageCompressor } from '@/components/ImageCompressor';
import { FeatureCard } from '@/components/FeatureCard';
import { RecommendedTools } from '@/components/RecommendedTools';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';

const formats = ['JPG', 'PNG', 'WebP', 'HEIC', 'GIF'];

export default function Home() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <div className="flex-1">
      <section className="py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-8 space-y-3 ${isRTL ? 'text-right md:text-center' : ''}`}>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              {t('hero.headline')}
            </h1>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('hero.subheadline')}
            </p>
          </div>

          <div className="max-w-[800px] mx-auto mb-6">
            <ImageCompressor />
          </div>

          <div className="max-w-[800px] mx-auto text-center space-y-4 mb-8">
            <p className="text-sm text-muted-foreground" data-testid="text-supported-formats">
              {t('hero.supportedFormats')}
            </p>
            <div className={`flex flex-wrap items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {formats.map((format) => (
                <Badge key={format} variant="secondary" className="text-xs" data-testid={`badge-format-${format}`}>
                  {format}
                </Badge>
              ))}
            </div>
          </div>

          <div className={`flex flex-wrap items-center justify-center gap-2 md:gap-3 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`} data-testid="privacy-row">
            <span className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Shield className="w-4 h-4 text-primary" />
              {t('hero.clientSide')}
            </span>
            <span className="text-muted-foreground/50">•</span>
            <span>{t('hero.noUpload')}</span>
            <span className="text-muted-foreground/50">•</span>
            <span>{t('hero.privacyGuaranteed')}</span>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-[#f7f7f7] dark:bg-muted/30">
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

      <RecommendedTools />
    </div>
  );
}
