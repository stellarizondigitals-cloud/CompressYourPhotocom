import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useEffect } from 'react';

export default function Terms() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  useEffect(() => {
    document.title = `${t('terms.title')} | CompressYourPhoto`;
  }, [t]);

  return (
    <div className="flex-1">
      <section className="py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className={`mb-10 ${isRTL ? 'text-right' : ''}`}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {t('terms.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('terms.lastUpdated')}: January 2025
            </p>
          </div>

          <div className={`space-y-8 ${isRTL ? 'text-right' : ''}`}>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-3">{t('terms.acceptance.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('terms.acceptance.content')}
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-3">{t('terms.service.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('terms.service.content')}
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-3">{t('terms.intellectual.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('terms.intellectual.content')}
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-3">{t('terms.liability.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('terms.liability.content')}
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-3">{t('terms.changes.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('terms.changes.content')}
              </p>
            </Card>

            <div className="pt-6 border-t">
              <h2 className="text-xl font-semibold mb-3">{t('terms.contact.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('terms.contact.content')}
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
