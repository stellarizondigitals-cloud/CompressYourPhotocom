import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { Building, Target, Lightbulb, Zap, Mail } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  useEffect(() => {
    document.title = `${t('about.title')} | CompressYourPhoto`;
  }, [t]);

  return (
    <div className="flex-1">
      <section className="py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className={`text-center mb-12 ${isRTL ? 'text-right md:text-center' : ''}`}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Building className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" data-testid="heading-about">
              {t('about.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('about.subtitle')}
            </p>
          </div>

          <div className={`space-y-6 ${isRTL ? 'text-right' : ''}`}>
            <Card className="p-6">
              <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-3">{t('about.mission.title')}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('about.mission.content')}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  <Lightbulb className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-3">{t('about.whyWeBuilt.title')}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('about.whyWeBuilt.content')}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-3">{t('about.howItWorks.title')}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('about.howItWorks.content')}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  <Building className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-3">{t('about.operator.title')}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('about.operator.content')}
                  </p>
                  <p className="mt-2 font-medium">Stellarizon Digitals Ltd</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-primary/5 border-primary/20">
              <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-3">{t('about.contact.title')}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {t('about.contact.content')}
                  </p>
                  <Button asChild>
                    <Link to="/contact" data-testid="button-contact-us">
                      <Mail className="w-4 h-4 mr-2" />
                      {t('footer.contact')}
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
