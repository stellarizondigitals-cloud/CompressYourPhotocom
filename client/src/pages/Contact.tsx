import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { Mail, MessageSquare, HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function Contact() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  useEffect(() => {
    document.title = `${t('contact.title')} | CompressYourPhoto`;
  }, [t]);

  return (
    <div className="flex-1">
      <section className="py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className={`text-center mb-12 ${isRTL ? 'text-right md:text-center' : ''}`}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {t('contact.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('contact.subtitle')}
            </p>
          </div>

          <Card className="p-8 text-center mb-8">
            <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">{t('contact.email.title')}</h2>
            <p className="text-muted-foreground mb-6">
              {t('contact.email.description')}
            </p>
            <a 
              href="mailto:contact@stellarizondigitals.com"
              className="text-2xl font-semibold text-primary hover:underline block mb-6"
              data-testid="link-contact-email"
            >
              contact@stellarizondigitals.com
            </a>
            <Button size="lg" asChild>
              <a href="mailto:contact@stellarizondigitals.com" data-testid="button-send-email">
                <Mail className="w-4 h-4 mr-2" />
                {t('contact.sendEmail')}
              </a>
            </Button>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className={`p-6 ${isRTL ? 'text-right' : ''}`}>
              <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  <HelpCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{t('contact.support.title')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('contact.support.content')}
                  </p>
                </div>
              </div>
            </Card>

            <Card className={`p-6 ${isRTL ? 'text-right' : ''}`}>
              <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{t('contact.feedback.title')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('contact.feedback.content')}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className={`mt-12 text-center text-sm text-muted-foreground ${isRTL ? 'text-right md:text-center' : ''}`}>
            <p>{t('contact.operator')}</p>
            <p className="font-medium">Stellarizon Digitals Ltd</p>
          </div>
        </div>
      </section>
    </div>
  );
}
