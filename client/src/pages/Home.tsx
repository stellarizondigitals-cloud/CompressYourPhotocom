import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Shield, Zap, Globe, Minimize2, Maximize, RefreshCw, Crop, Sparkles } from 'lucide-react';
import { FeatureCard } from '@/components/FeatureCard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const tools = [
  { 
    key: 'compress',
    icon: Minimize2,
    path: '/compress',
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  { 
    key: 'resize',
    icon: Maximize,
    path: '/resize',
    color: 'bg-green-500/10 text-green-600 dark:text-green-400',
  },
  { 
    key: 'convert',
    icon: RefreshCw,
    path: '/convert',
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  },
  { 
    key: 'crop',
    icon: Crop,
    path: '/crop',
    color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  },
  { 
    key: 'enhance',
    icon: Sparkles,
    path: '/enhance',
    color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
  },
];

const formats = ['JPG', 'PNG', 'WebP', 'HEIC', 'GIF'];

export default function Home() {
  const { t } = useTranslation();
  const { isRTL, currentLanguage } = useLanguage();

  const getLocalizedPath = (path: string) => {
    if (currentLanguage.code === 'en') return path;
    return `/${currentLanguage.code}${path}`;
  };

  return (
    <div className="flex-1">
      <section className="py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-10 space-y-4 ${isRTL ? 'text-right md:text-center' : ''}`}>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              {t('hero.headline', 'Compress Your Photo')}
            </h1>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('hero.subheadlineExpanded', 'Compress, resize, convert, and crop your photos—fast, private, and free.')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-5xl mx-auto mb-10">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link 
                  key={tool.key} 
                  to={getLocalizedPath(tool.path)}
                  className="block"
                  data-testid={`link-tool-${tool.key}`}
                >
                  <Card className="p-6 h-full hover-elevate cursor-pointer transition-all duration-200">
                    <div className="flex flex-col items-center text-center gap-4">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${tool.color}`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          {t(`tools.${tool.key}.cardTitle`, tool.key.charAt(0).toUpperCase() + tool.key.slice(1))}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {t(`tools.${tool.key}.cardDescription`, `${tool.key.charAt(0).toUpperCase() + tool.key.slice(1)} your images`)}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="max-w-[800px] mx-auto text-center space-y-4 mb-8">
            <p className="text-sm text-muted-foreground" data-testid="text-supported-formats">
              {t('hero.supportedFormats', 'Supported formats')}
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
              {t('hero.clientSide', '100% Client-Side')}
            </span>
            <span className="text-muted-foreground/50">|</span>
            <span>{t('hero.noUpload', 'No Upload')}</span>
            <span className="text-muted-foreground/50">|</span>
            <span>{t('hero.privacyGuaranteed', 'Privacy Guaranteed')}</span>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-[#f7f7f7] dark:bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={Shield}
              title={t('features.privacy.title', '100% Private')}
              description={t('features.privacy.description', 'All processing happens in your browser. Your files never leave your device.')}
            />
            <FeatureCard
              icon={Zap}
              title={t('features.speed.title', 'Lightning Fast')}
              description={t('features.speed.description', 'Instant results with no waiting for uploads or downloads.')}
            />
            <FeatureCard
              icon={Globe}
              title={t('features.multilingual.title', 'Multilingual')}
              description={t('features.multilingual.description', 'Available in 9 languages including RTL support.')}
            />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            {t('faq.title', 'Frequently Asked Questions')}
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger data-testid="faq-q1">{t('faq.q1', 'Is CompressYourPhoto really free?')}</AccordionTrigger>
              <AccordionContent>{t('faq.a1', 'Yes, CompressYourPhoto is 100% free with no hidden fees, no signup required, and no watermarks.')}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger data-testid="faq-q2">{t('faq.q2', 'Are my photos uploaded to a server?')}</AccordionTrigger>
              <AccordionContent>{t('faq.a2', 'No, your photos never leave your device. All processing happens locally in your browser.')}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger data-testid="faq-q3">{t('faq.q3', 'What image formats are supported?')}</AccordionTrigger>
              <AccordionContent>{t('faq.a3', 'We support JPG/JPEG, PNG, WebP, HEIC/HEIF (iPhone photos), GIF, and BMP formats.')}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger data-testid="faq-q4">{t('faq.q4', 'How much can I reduce my image size?')}</AccordionTrigger>
              <AccordionContent>{t('faq.a4', 'Typically 50-90% reduction while maintaining good visual quality.')}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger data-testid="faq-q5">{t('faq.q5', 'Can I process multiple images at once?')}</AccordionTrigger>
              <AccordionContent>{t('faq.a5', 'Yes! Upload multiple images and process them all together. Download individually or as a ZIP file.')}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q6">
              <AccordionTrigger data-testid="faq-q6">{t('faq.q6', 'Does it work on mobile phones?')}</AccordionTrigger>
              <AccordionContent>{t('faq.a6', 'Yes, CompressYourPhoto works on all modern mobile browsers including iPhone Safari and Android Chrome.')}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

    </div>
  );
}
