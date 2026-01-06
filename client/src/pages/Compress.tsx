import { useTranslation } from 'react-i18next';
import { Shield } from 'lucide-react';
import { ImageCompressor } from '@/components/ImageCompressor';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { Helmet } from 'react-helmet-async';

const formats = ['JPG', 'PNG', 'WebP', 'HEIC', 'GIF'];

export default function Compress() {
  const { t } = useTranslation();
  const { isRTL, currentLanguage } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{t('tools.compress.pageTitle', 'Compress Your Photos | Free Online Image Compressor')}</title>
        <meta name="description" content={t('tools.compress.metaDescription', 'Compress JPG, PNG, WebP, HEIC, and GIF images for free. Fast, private, client-side compression.')} />
        <link rel="canonical" href={`https://www.compressyourphoto.com${currentLanguage.code === 'en' ? '' : `/${currentLanguage.code}`}/compress`} />
      </Helmet>
      <div className="flex-1">
        <section className="py-12 md:py-20 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className={`text-center mb-8 space-y-3 ${isRTL ? 'text-right md:text-center' : ''}`}>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                {t('tools.compress.title', 'Compress Your Photos')}
              </h1>
              <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('tools.compress.subtitle', 'Reduce image file size without losing quality. 100% private, processed in your browser.')}
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
              <span className="text-muted-foreground/50">|</span>
              <span>{t('hero.noUpload')}</span>
              <span className="text-muted-foreground/50">|</span>
              <span>{t('hero.privacyGuaranteed')}</span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
