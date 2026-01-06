import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { Upload, Settings, Download, Zap, Shield, FileImage } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

export default function HowItWorks() {
  const { t } = useTranslation();
  const { isRTL, currentLanguage } = useLanguage();

  useEffect(() => {
    document.title = `${t('howItWorks.title')} | CompressYourPhoto`;
  }, [t]);

  const steps = [
    { icon: Upload, step: 1 },
    { icon: Settings, step: 2 },
    { icon: Zap, step: 3 },
    { icon: Download, step: 4 },
  ];

  return (
    <div className="flex-1">
      <Helmet>
        <title>{t('howItWorks.title')} | CompressYourPhoto</title>
        <meta name="description" content={t('howItWorks.metaDescription', 'Learn how to compress, resize, convert, crop, and enhance your photos in 4 simple steps. 100% browser-based, private, and free.')} />
        <link rel="canonical" href={`https://www.compressyourphoto.com${currentLanguage.code === 'en' ? '' : `/${currentLanguage.code}`}/how-it-works`} />
      </Helmet>
      <section className="py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className={`text-center mb-12 ${isRTL ? 'text-right md:text-center' : ''}`}>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {t('howItWorks.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('howItWorks.subtitle')}
            </p>
          </div>

          <div className="space-y-6 mb-12">
            {steps.map(({ icon: Icon, step }) => (
              <Card key={step} className="p-6">
                <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                      {step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                      <Icon className="w-5 h-5 text-primary" />
                      <h2 className="text-xl font-semibold">
                        {t(`howItWorks.step${step}.title`)}
                      </h2>
                    </div>
                    <p className={`text-muted-foreground leading-relaxed ${isRTL ? 'text-right' : ''}`}>
                      {t(`howItWorks.step${step}.content`)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-3">{t('howItWorks.whyPrivate.title')}</h2>
                <p className={`text-muted-foreground leading-relaxed ${isRTL ? 'text-right' : ''}`}>
                  {t('howItWorks.whyPrivate.content')}
                </p>
              </div>
            </div>
          </Card>

          <div className="mt-12 text-center">
            <h2 className="text-xl font-semibold mb-4">{t('howItWorks.formats.title')}</h2>
            <div className={`flex flex-wrap items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {['JPG', 'PNG', 'WebP', 'HEIC', 'GIF'].map((format) => (
                <Badge key={format} variant="secondary" className="text-sm px-3 py-1">
                  <FileImage className="w-4 h-4 mr-1.5" />
                  {format}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
