import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { Shield, Lock, BarChart3, Megaphone, Link2, Cookie, Scale, Building } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useEffect } from 'react';

export default function PrivacyPolicy() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  useEffect(() => {
    document.title = `${t('privacy.title')} | CompressYourPhoto`;
  }, [t]);

  const sections = [
    { icon: Building, key: 'operator', showCompany: true },
    { icon: Lock, key: 'imageProcessing' },
    { icon: BarChart3, key: 'analytics' },
    { icon: Megaphone, key: 'advertising' },
    { icon: Link2, key: 'affiliates' },
    { icon: Cookie, key: 'cookies' },
    { icon: Scale, key: 'yourRights' },
  ];

  return (
    <div className="flex-1">
      <section className="py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className={`mb-10 ${isRTL ? 'text-right' : ''}`}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" data-testid="heading-privacy">
              {t('privacy.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('privacy.lastUpdated')}: January 2025
            </p>
          </div>

          <div className={`space-y-6 ${isRTL ? 'text-right' : ''}`}>
            {sections.map(({ icon: Icon, key, showCompany }) => (
              <Card key={key} className="p-6">
                <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-3">{t(`privacy.${key}.title`)}</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {t(`privacy.${key}.content`)}
                    </p>
                    {showCompany && (
                      <>
                        <p className="mt-2 font-medium">Stellarizon Digitals Ltd</p>
                        <p className="mt-1">
                          <a href="mailto:contact@compressyourphoto.com" className="text-primary hover:underline">
                            contact@compressyourphoto.com
                          </a>
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}

            <div className="pt-6 border-t">
              <h2 className="text-xl font-semibold mb-3">{t('privacy.contact.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('privacy.contact.content')}
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
