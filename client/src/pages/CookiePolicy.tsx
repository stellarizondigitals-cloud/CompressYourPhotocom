import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { Cookie } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useEffect } from 'react';

export default function CookiePolicy() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  useEffect(() => {
    document.title = `${t('cookies.title')} | CompressYourPhoto`;
  }, [t]);

  return (
    <div className="flex-1">
      <section className="py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className={`mb-10 ${isRTL ? 'text-right' : ''}`}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Cookie className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {t('cookies.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('cookies.lastUpdated')}: January 2025
            </p>
          </div>

          <div className={`space-y-8 ${isRTL ? 'text-right' : ''}`}>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-3">{t('cookies.what.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('cookies.what.content')}
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-3">{t('cookies.usage.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('cookies.usage.content')}
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-3">{t('cookies.types.title')}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">{t('cookies.types.essential.title')}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {t('cookies.types.essential.content')}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">{t('cookies.types.preference.title')}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {t('cookies.types.preference.content')}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-3">{t('cookies.thirdParty.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('cookies.thirdParty.content')}
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-3">{t('cookies.control.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('cookies.control.content')}
              </p>
            </Card>

            <div className="pt-6 border-t">
              <h2 className="text-xl font-semibold mb-3">{t('cookies.contact.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('cookies.contact.content')}
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
