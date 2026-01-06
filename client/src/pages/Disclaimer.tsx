import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useEffect } from 'react';

export default function Disclaimer() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  useEffect(() => {
    document.title = `${t('disclaimer.title')} | CompressYourPhoto`;
  }, [t]);

  return (
    <div className="flex-1">
      <section className="py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className={`mb-10 ${isRTL ? 'text-right' : ''}`}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <AlertTriangle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {t('disclaimer.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('disclaimer.lastUpdated')}: January 2026
            </p>
          </div>

          <div className={`space-y-8 ${isRTL ? 'text-right' : ''}`}>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-3">{t('disclaimer.general.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('disclaimer.general.content')}
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-3">{t('disclaimer.noWarranty.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('disclaimer.noWarranty.content')}
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-3">{t('disclaimer.accuracy.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('disclaimer.accuracy.content')}
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-3">{t('disclaimer.external.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('disclaimer.external.content')}
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-3">{t('disclaimer.limitation.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('disclaimer.limitation.content')}
              </p>
            </Card>

            <div className="pt-6 border-t">
              <h2 className="text-xl font-semibold mb-3">{t('disclaimer.contact.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('disclaimer.contact.content')}
              </p>
              <p className="mt-2">
                <a href="mailto:contact@compressyourphoto.com" className="text-primary hover:underline">
                  contact@compressyourphoto.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
