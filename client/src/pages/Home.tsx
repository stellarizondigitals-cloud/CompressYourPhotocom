import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Shield, Zap, Globe, Minimize2, Maximize, RefreshCw, Crop, Sparkles, Check, Crown, ArrowRight, Eraser } from 'lucide-react';
import { FeatureCard } from '@/components/FeatureCard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PremiumModal } from '@/components/PremiumModal';

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
  {
    key: 'remove-background',
    icon: Eraser,
    path: '/remove-background',
    color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  },
];

const formats = ['JPG', 'PNG', 'WebP', 'HEIC', 'GIF'];

export default function Home() {
  const { t } = useTranslation();
  const { isRTL, currentLanguage } = useLanguage();
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const getLocalizedPath = (path: string) => {
    if (currentLanguage.code === 'en') return path;
    return `/${currentLanguage.code}${path}`;
  };

  const canonicalUrl = currentLanguage.code === 'en' 
    ? 'https://www.compressyourphoto.com/' 
    : `https://www.compressyourphoto.com/${currentLanguage.code}`;

  return (
    <div className="flex-1">
      <Helmet>
        <title>{t('app.homePageTitle', 'Compress, Resize, Convert, Crop & Enhance Images Free Online | CompressYourPhoto')}</title>
        <meta name="description" content={t('app.homeMetaDescription', 'Free online photo tools. Compress, resize, convert, crop, and enhance images instantly in your browser. 100% private—your photos never leave your device.')} />
        <link rel="canonical" href={canonicalUrl} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "Is CompressYourPhoto really free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, CompressYourPhoto is 100% free with no hidden fees, no signup required, and no watermarks." } },
            { "@type": "Question", "name": "Are my photos uploaded to a server?", "acceptedAnswer": { "@type": "Answer", "text": "No, your photos never leave your device. All processing happens locally in your browser." } },
            { "@type": "Question", "name": "What image formats are supported?", "acceptedAnswer": { "@type": "Answer", "text": "We support JPG/JPEG, PNG, WebP, HEIC/HEIF (iPhone photos), GIF, and BMP formats." } },
            { "@type": "Question", "name": "How much can I reduce my image size?", "acceptedAnswer": { "@type": "Answer", "text": "Typically 50-90% reduction while maintaining good visual quality." } },
            { "@type": "Question", "name": "Can I process multiple images at once?", "acceptedAnswer": { "@type": "Answer", "text": "Yes! Upload multiple images and process them all together. Download individually or as a ZIP file." } },
            { "@type": "Question", "name": "Does it work on mobile phones?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, CompressYourPhoto works on all modern mobile browsers including iPhone Safari and Android Chrome." } }
          ]
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.compressyourphoto.com/" }]
        })}</script>
      </Helmet>
      <section className="py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-10 space-y-4 ${isRTL ? 'text-right md:text-center' : ''}`}>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              {t('hero.headline', 'Compress Your Photo')}
            </h1>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('hero.subheadlineExpanded', 'Compress, resize, convert, crop, and remove backgrounds—fast, private, and free.')}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto mb-10">
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

      <section className="py-12 md:py-16 px-4 md:px-8 bg-gradient-to-br from-primary/5 via-background to-yellow-500/5">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4 text-xs">Simple, transparent pricing</Badge>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Free tools. Optional Pro upgrade.
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-sm md:text-base">
            All 5 tools are completely free — no account needed. Upgrade to Pro to remove limits and ads.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-6">
            <Card className="p-5 text-left">
              <p className="font-semibold mb-1">Free</p>
              <p className="text-2xl font-bold mb-3">£0 <span className="text-sm font-normal text-muted-foreground">/ forever</span></p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {['All 5 tools', 'Up to 5 images/session', 'No sign-up required', '100% private processing'].map(f => (
                  <li key={f} className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />{f}</li>
                ))}
              </ul>
              <Link to="/compress">
                <Button variant="outline" size="sm" className="w-full mt-4" data-testid="btn-home-start-free">Start free</Button>
              </Link>
            </Card>
            <Card className="p-5 text-left border-primary/30 bg-primary/[0.02]">
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-4 h-4 text-yellow-500" />
                <p className="font-semibold">Pro</p>
              </div>
              <p className="text-2xl font-bold mb-1 text-primary">from £0.99 <span className="text-sm font-normal text-muted-foreground">/ 7 days</span></p>
              <p className="text-xs text-muted-foreground mb-3">or £1.99/month · £24.99 lifetime</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {['Up to 50 images at once', 'Completely ad-free', 'Unlimited sessions', 'Priority speed'].map(f => (
                  <li key={f} className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />{f}</li>
                ))}
              </ul>
              <Button size="sm" className="w-full mt-4" onClick={() => setShowPremiumModal(true)} data-testid="btn-home-get-pro">
                <Crown className="w-3.5 h-3.5 mr-1.5" />Get Pro
              </Button>
            </Card>
          </div>
          <Link to="/pricing" className="inline-flex items-center text-sm text-primary hover:underline" data-testid="link-home-see-pricing">
            See full pricing & plan comparison
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
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
              <AccordionContent>All 6 tools are completely free to use with no sign-up required and no watermarks. There is also an optional Pro upgrade (from £0.99) for users who need unlimited usage and an ad-free experience.</AccordionContent>
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
            <AccordionItem value="q7">
              <AccordionTrigger data-testid="faq-q7">Can I get a refund on a Pro purchase?</AccordionTrigger>
              <AccordionContent>Yes. If you're not satisfied, email us at <a href="mailto:contact@compressyourphoto.com" className="text-primary underline">contact@compressyourphoto.com</a> within 7 days of purchase and we'll issue a full refund — no questions asked.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q8">
              <AccordionTrigger data-testid="faq-q8">How do I cancel my monthly subscription?</AccordionTrigger>
              <AccordionContent>Sign in to your account and click "Manage Subscription" to cancel any time via our self-service portal. Your Pro access continues until the end of your billing period. No hidden fees, no penalties.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-muted/30 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`flex items-center justify-center gap-2 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="text-xl md:text-2xl font-semibold">
              {t('home.supportedLanguages', 'Available in 9 Languages')}
            </h2>
          </div>
          <p className="text-muted-foreground mb-6 text-sm md:text-base">
            {t('home.languagesDescription', 'Use CompressYourPhoto in your preferred language. All tools available worldwide.')}
          </p>
          <div className={`flex flex-wrap items-center justify-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Link 
              to="/" 
              className="px-4 py-2 rounded-lg bg-background border hover:bg-muted transition-colors text-sm font-medium"
              data-testid="link-home-lang-en"
              hrefLang="en"
            >
              English
            </Link>
            <Link 
              to="/es" 
              className="px-4 py-2 rounded-lg bg-background border hover:bg-muted transition-colors text-sm font-medium"
              data-testid="link-home-lang-es"
              hrefLang="es"
            >
              Español
            </Link>
            <Link 
              to="/pt" 
              className="px-4 py-2 rounded-lg bg-background border hover:bg-muted transition-colors text-sm font-medium"
              data-testid="link-home-lang-pt"
              hrefLang="pt"
            >
              Português
            </Link>
            <Link 
              to="/fr" 
              className="px-4 py-2 rounded-lg bg-background border hover:bg-muted transition-colors text-sm font-medium"
              data-testid="link-home-lang-fr"
              hrefLang="fr"
            >
              Français
            </Link>
            <Link 
              to="/de" 
              className="px-4 py-2 rounded-lg bg-background border hover:bg-muted transition-colors text-sm font-medium"
              data-testid="link-home-lang-de"
              hrefLang="de"
            >
              Deutsch
            </Link>
            <Link 
              to="/hi" 
              className="px-4 py-2 rounded-lg bg-background border hover:bg-muted transition-colors text-sm font-medium"
              data-testid="link-home-lang-hi"
              hrefLang="hi"
            >
              हिन्दी
            </Link>
            <Link 
              to="/zh-cn" 
              className="px-4 py-2 rounded-lg bg-background border hover:bg-muted transition-colors text-sm font-medium"
              data-testid="link-home-lang-zh"
              hrefLang="zh-CN"
            >
              中文
            </Link>
            <Link 
              to="/ar" 
              className="px-4 py-2 rounded-lg bg-background border hover:bg-muted transition-colors text-sm font-medium"
              data-testid="link-home-lang-ar"
              hrefLang="ar"
            >
              العربية
            </Link>
            <Link 
              to="/id" 
              className="px-4 py-2 rounded-lg bg-background border hover:bg-muted transition-colors text-sm font-medium"
              data-testid="link-home-lang-id"
              hrefLang="id"
            >
              Bahasa Indonesia
            </Link>
          </div>
        </div>
      </section>

      <PremiumModal open={showPremiumModal} onOpenChange={setShowPremiumModal} />
    </div>
  );
}
