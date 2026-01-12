import { useTranslation } from 'react-i18next';
import { Shield } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { ImageCompressor } from '@/components/ImageCompressor';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLanguage } from '@/hooks/useLanguage';
import { ToolPageSEO } from '@/components/ToolPageSEO';
import { RelatedTools } from '@/components/RelatedTools';
import { AboutTool } from '@/components/AboutTool';
import { PopularUseCases } from '@/components/PopularUseCases';

const formats = ['JPG', 'PNG', 'WebP', 'HEIC', 'GIF'];

export default function Compress() {
  const { t } = useTranslation();
  const { isRTL, currentLanguage } = useLanguage();

  return (
    <>
      <ToolPageSEO
        tool="compress"
        title={t('tools.compress.pageTitle', 'Compress Images Online Free | Reduce JPG PNG WebP Size | CompressYourPhoto')}
        description={t('tools.compress.metaDescription', 'Compress images online for free. Reduce JPG, PNG, WebP, HEIC, GIF file size by up to 90%. Fast, private, browser-based compression. No upload to servers.')}
      />
      <div className="flex-1">
        <section className="py-12 md:py-20 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className={`text-center mb-8 space-y-3 ${isRTL ? 'text-right md:text-center' : ''}`}>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                {t('tools.compress.title', 'Compress Your Photos')}
              </h1>
              <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('tools.compress.subtitle', 'Reduce image file size without losing quality. 100% private, processed in your browser.')}
              </p>
            </div>

            <div className="max-w-[800px] mx-auto mb-6">
              <ImageCompressor />
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
      </div>
      <AboutTool tool="compress" />
      <PopularUseCases tool="compress" />
      
      <section className="py-16 md:py-20 px-4 md:px-8 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            {t('compressFaq.title', 'Frequently Asked Questions About Image Compression')}
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="cq1">
              <AccordionTrigger data-testid="compress-faq-q1">
                {t('compressFaq.q1', 'Does compressing an image reduce its quality?')}
              </AccordionTrigger>
              <AccordionContent>
                {t('compressFaq.a1', 'Our smart compression algorithm reduces file size while preserving visual quality. At 80% quality setting, most images look identical to the original but are 50-70% smaller. You can adjust the quality slider to find the perfect balance for your needs.')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="cq2">
              <AccordionTrigger data-testid="compress-faq-q2">
                {t('compressFaq.q2', 'What is the maximum file size I can compress?')}
              </AccordionTrigger>
              <AccordionContent>
                {t('compressFaq.a2', 'Since all processing happens in your browser, there is no server limit. You can compress images up to 50MB or more, depending on your device\'s memory. Most photos from smartphones and cameras compress perfectly.')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="cq3">
              <AccordionTrigger data-testid="compress-faq-q3">
                {t('compressFaq.q3', 'Can I compress multiple images at once?')}
              </AccordionTrigger>
              <AccordionContent>
                {t('compressFaq.a3', 'Yes! You can upload and compress multiple images simultaneously. After compression, download them individually or all at once as a convenient ZIP file.')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="cq4">
              <AccordionTrigger data-testid="compress-faq-q4">
                {t('compressFaq.q4', 'Are my photos uploaded to any server?')}
              </AccordionTrigger>
              <AccordionContent>
                {t('compressFaq.a4', 'No, your photos never leave your device. All compression happens locally in your browser using JavaScript. We cannot see, access, or store any of your images. Your privacy is 100% protected.')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="cq5">
              <AccordionTrigger data-testid="compress-faq-q5">
                {t('compressFaq.q5', 'What image formats are supported for compression?')}
              </AccordionTrigger>
              <AccordionContent>
                {t('compressFaq.a5', 'We support JPG/JPEG, PNG, WebP, HEIC/HEIF (iPhone photos), GIF, and BMP formats. You can also convert between formats while compressing.')}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
      
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": t('compressFaq.q1', 'Does compressing an image reduce its quality?'),
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": t('compressFaq.a1', 'Our smart compression algorithm reduces file size while preserving visual quality. At 80% quality setting, most images look identical to the original but are 50-70% smaller. You can adjust the quality slider to find the perfect balance for your needs.')
                }
              },
              {
                "@type": "Question",
                "name": t('compressFaq.q2', 'What is the maximum file size I can compress?'),
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": t('compressFaq.a2', 'Since all processing happens in your browser, there is no server limit. You can compress images up to 50MB or more, depending on your device\'s memory. Most photos from smartphones and cameras compress perfectly.')
                }
              },
              {
                "@type": "Question",
                "name": t('compressFaq.q3', 'Can I compress multiple images at once?'),
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": t('compressFaq.a3', 'Yes! You can upload and compress multiple images simultaneously. After compression, download them individually or all at once as a convenient ZIP file.')
                }
              },
              {
                "@type": "Question",
                "name": t('compressFaq.q4', 'Are my photos uploaded to any server?'),
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": t('compressFaq.a4', 'No, your photos never leave your device. All compression happens locally in your browser using JavaScript. We cannot see, access, or store any of your images. Your privacy is 100% protected.')
                }
              },
              {
                "@type": "Question",
                "name": t('compressFaq.q5', 'What image formats are supported for compression?'),
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": t('compressFaq.a5', 'We support JPG/JPEG, PNG, WebP, HEIC/HEIF (iPhone photos), GIF, and BMP formats. You can also convert between formats while compressing.')
                }
              }
            ]
          })}
        </script>
      </Helmet>
      
      <RelatedTools currentTool="compress" />
    </>
  );
}
