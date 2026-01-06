import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { Cookie, Info, Settings, BarChart3, Megaphone, Globe, Sliders, CheckCircle } from 'lucide-react';
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
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" data-testid="heading-cookie-policy">
              {t('cookies.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('cookies.lastUpdated')}: January 2026
            </p>
          </div>

          <div className={`space-y-6 ${isRTL ? 'text-right' : ''}`}>
            <Card className="p-6">
              <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  <Info className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-3">{t('cookies.what.title')}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('cookies.what.content')}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  <Settings className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-3">{t('cookies.usage.title')}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('cookies.usage.content')}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">{t('cookies.types.title')}</h2>
              <div className="space-y-4">
                <div className={`flex items-start gap-3 p-4 bg-muted/50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Cookie className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-1">{t('cookies.types.essential.title')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('cookies.types.essential.content')}
                    </p>
                  </div>
                </div>
                <div className={`flex items-start gap-3 p-4 bg-muted/50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <BarChart3 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-1">{t('cookies.types.analytics.title')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('cookies.types.analytics.content')}
                    </p>
                  </div>
                </div>
                <div className={`flex items-start gap-3 p-4 bg-muted/50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Megaphone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-1">{t('cookies.types.advertising.title')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('cookies.types.advertising.content')}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-3">{t('cookies.thirdParty.title')}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('cookies.thirdParty.content')}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  <Sliders className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-3">{t('cookies.control.title')}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('cookies.control.content')}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-3">{t('cookies.consent.title')}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('cookies.consent.content')}
                  </p>
                </div>
              </div>
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
