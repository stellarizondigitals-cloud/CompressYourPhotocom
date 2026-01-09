import { useTranslation } from 'react-i18next';
import { Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { ToolPageSEO } from '@/components/ToolPageSEO';
import { RelatedTools } from '@/components/RelatedTools';
import { useState } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

interface SEOLandingPageProps {
  slug: string;
  toolComponent: React.ReactNode;
  parentTool: 'compress' | 'resize' | 'convert' | 'crop' | 'enhance';
  formats?: string[];
}

const defaultFormats = ['JPG', 'PNG', 'WebP', 'HEIC', 'GIF'];

export function SEOLandingPage({ 
  slug, 
  toolComponent, 
  parentTool,
  formats = defaultFormats 
}: SEOLandingPageProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const title = t(`seoPages.${slug}.title`);
  const metaDescription = t(`seoPages.${slug}.metaDescription`);
  const h1 = t(`seoPages.${slug}.h1`);
  const subtitle = t(`seoPages.${slug}.subtitle`);
  const content = t(`seoPages.${slug}.content`);
  const faqs: FAQ[] = t(`seoPages.${slug}.faqs`, { returnObjects: true }) as FAQ[];

  return (
    <>
      <ToolPageSEO
        tool={parentTool}
        title={title}
        description={metaDescription}
      />
      <div className="flex-1">
        <section className="py-12 md:py-20 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className={`text-center mb-8 space-y-3 ${isRTL ? 'text-right md:text-center' : ''}`}>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                {h1}
              </h1>
              <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
                {subtitle}
              </p>
            </div>

            <div className="max-w-[800px] mx-auto mb-6">
              {toolComponent}
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

        <section className="py-12 px-4 md:px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <div className={`prose prose-sm md:prose-base max-w-none dark:prose-invert ${isRTL ? 'text-right' : ''}`}>
              <h2 className="text-2xl font-bold mb-6">{t(`seoPages.${slug}.contentTitle`, h1)}</h2>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {content}
              </div>
            </div>
          </div>
        </section>

        {Array.isArray(faqs) && faqs.length > 0 && (
          <section className="py-12 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">{t('common.faq', 'Frequently Asked Questions')}</h2>
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <Card key={index} className="overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className={`w-full p-4 flex items-center justify-between gap-4 text-left hover-elevate ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                      data-testid={`faq-question-${index}`}
                    >
                      <span className="font-medium">{faq.question}</span>
                      {openFaq === index ? (
                        <ChevronUp className="w-5 h-5 flex-shrink-0 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 flex-shrink-0 text-muted-foreground" />
                      )}
                    </button>
                    {openFaq === index && (
                      <CardContent className={`pt-0 pb-4 text-muted-foreground ${isRTL ? 'text-right' : ''}`}>
                        {faq.answer}
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
      <RelatedTools currentTool={parentTool} />
    </>
  );
}
