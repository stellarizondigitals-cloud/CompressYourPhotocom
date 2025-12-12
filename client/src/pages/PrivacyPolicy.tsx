import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { Shield, Lock, Eye, Server } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function PrivacyPolicy() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <div className="flex-1">
      <section className="py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className={`mb-10 ${isRTL ? 'text-right' : ''}`}>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {t('privacy.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('privacy.lastUpdated')}: January 2025
            </p>
          </div>

          <div className={`space-y-8 ${isRTL ? 'text-right' : ''}`}>
            <Card className="p-6">
              <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-3">{t('privacy.noDataCollection.title')}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacy.noDataCollection.content')}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-3">{t('privacy.clientSide.title')}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacy.clientSide.content')}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  <Server className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-3">{t('privacy.noServers.title')}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacy.noServers.content')}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-3">{t('privacy.cookies.title')}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacy.cookies.content')}
                  </p>
                </div>
              </div>
            </Card>

            <div className="pt-6 border-t">
              <h2 className="text-xl font-semibold mb-3">{t('privacy.contact.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('privacy.contact.content')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
