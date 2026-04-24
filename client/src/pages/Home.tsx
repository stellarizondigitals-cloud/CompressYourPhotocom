import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Shield, Zap, Globe, Minimize2, Maximize, RefreshCw, Crop, Sparkles, Check, Crown, ArrowRight, Eraser, Type, ZoomIn, FileText } from 'lucide-react';
import { FeatureCard } from '@/components/FeatureCard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { useLocation } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PremiumModal } from '@/components/PremiumModal';
import { AdBanner } from '@/components/AdBanner';

const tools = [
  { key: 'compress', icon: Minimize2, path: '/compress', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  { key: 'resize', icon: Maximize, path: '/resize', color: 'bg-green-500/10 text-green-600 dark:text-green-400' },
  { key: 'convert', icon: RefreshCw, path: '/convert', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
  { key: 'crop', icon: Crop, path: '/crop', color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
  { key: 'enhance', icon: Sparkles, path: '/enhance', color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400' },
  { key: 'remove-background', icon: Eraser, path: '/remove-background', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
  { key: 'alt-text', icon: Type, path: '/alt-text-generator', color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
  { key: 'image-upscaler', icon: ZoomIn, path: '/image-upscaler', color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400', label: 'Upscaler', desc: 'Enlarge photos 2×–8×' },
  { key: 'image-to-pdf', icon: FileText, path: '/image-to-pdf', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', label: 'Image to PDF', desc: 'Convert & extract pages' },
];

const formats = ['JPG', 'PNG', 'WebP', 'HEIC', 'GIF'];

export default function Home() {
  const { t } = useTranslation();
  const { isRTL, currentLanguage } = useLanguage();
  const { pathname } = useLocation();
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const getLocalizedPath = (path: string) => {
    if (currentLanguage.code === 'en') return path;
    return `/${currentLanguage.code}${path}`;
  };

  // Derive canonical from URL path, not i18n state, to avoid browser-language
  // detection causing /fr to appear as canonical for the English home page.
  const pathSegment = pathname.split('/')[1];
  const nonEnglishLangs = ['es', 'pt', 'fr', 'de', 'hi', 'zh-cn', 'ar', 'id'];
  const langFromPath = nonEnglishLangs.includes(pathSegment) ? pathSegment : 'en';
  const canonicalUrl = langFromPath === 'en'
    ? 'https://www.compressyourphoto.com/'
    : `https://www.compressyourphoto.com/${langFromPath}`;

  return (
    <div className="flex-1">
      <Helmet>
        <title>{t('app.homePageTitle', 'Free Online Image Tools — Compress, Resize, Convert, Upscale, PDF & More | CompressYourPhoto')}</title>
        <meta name="description" content={t('app.homeMetaDescription', 'Free online image tools: compress, resize, convert, crop, enhance, remove background, upscale photos, and convert images to PDF. 100% private — files never leave your browser.')} />
        <link rel="canonical" href={canonicalUrl} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "CompressYourPhoto",
          "url": "https://www.compressyourphoto.com",
          "applicationCategory": "MultimediaApplication",
          "operatingSystem": "Any (web browser)",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "GBP" },
          "description": "Free online image tools: compress, resize, convert, crop, enhance, remove background, upscale photos & convert images to PDF — 100% private, no upload.",
          "featureList": "Compress images, Resize images, Convert image formats, Crop images, Enhance images, Remove image background, AI Alt Text Generator, Image Upscaler (2x 4x 8x), Image to PDF converter, PDF to images",
          "screenshot": "https://www.compressyourphoto.com/og-image-v4.png"
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "Is CompressYourPhoto really free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. All 7 core tools — compress, resize, convert, crop, enhance, remove backgrounds, upscale images, and convert images to PDF — are free with no hidden fees, no signup required, and no watermarks." } },
            { "@type": "Question", "name": "Can I upscale an image online for free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Free users get 3 shared uses across all tools, including the Image Upscaler at 2× scale. Pro users get unlimited upscales at 2×, 4×, and 8×." } },
            { "@type": "Question", "name": "Can I convert images to PDF for free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Free users can use the Image to PDF tool within the shared 3-use allowance. Pro users get unlimited images per PDF and unlimited page extraction." } },
            { "@type": "Question", "name": "Can I remove the background from an image for free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Background removal is free within the shared 3-use allowance. Upgrade to Pro for unlimited background removals." } },
            { "@type": "Question", "name": "Are my photos uploaded to a server?", "acceptedAnswer": { "@type": "Answer", "text": "No. Your photos never leave your device. All processing — including upscaling, PDF conversion, and background removal — happens locally in your browser." } },
            { "@type": "Question", "name": "What image formats are supported?", "acceptedAnswer": { "@type": "Answer", "text": "We support JPG/JPEG, PNG, WebP, HEIC/HEIF (iPhone photos), GIF, and BMP formats across all tools." } },
            { "@type": "Question", "name": "Does it work on mobile phones?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, CompressYourPhoto works on all modern mobile browsers including iPhone Safari and Android Chrome." } },
            { "@type": "Question", "name": "What is the 7-day Pro trial?", "acceptedAnswer": { "@type": "Answer", "text": "For £0.99 you get full Pro access for 7 days. After the trial, you are automatically billed £1.99/month. You can cancel any time from your account page with no fees or penalties." } }
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
              {t('hero.subheadlineExpanded', 'Compress, resize, convert, crop, enhance, remove backgrounds, upscale photos & convert to PDF — fast, private, and free.')}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto mb-10">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const label = (tool as any).label || t(`tools.${tool.key}.cardTitle`, tool.key.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
              const desc = (tool as any).desc || t(`tools.${tool.key}.cardDescription`, `${tool.key.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} your images`);
              return (
                <Link 
                  key={tool.key} 
                  to={getLocalizedPath(tool.path)}
                  className="block"
                  data-testid={`link-tool-${tool.key}`}
                >
                  <Card className="p-4 h-full hover-elevate cursor-pointer transition-all duration-200">
                    <div className="flex flex-col items-center text-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tool.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm md:text-base mb-0.5">{label}</h3>
                        <p className="text-xs text-muted-foreground leading-snug">{desc}</p>
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

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-4">
        <AdBanner slot="9182736450" format="horizontal" fullWidth />
      </div>

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

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6">
        <AdBanner slot="8273645019" format="horizontal" fullWidth />
      </div>

      <section className="py-12 md:py-16 px-4 md:px-8 bg-gradient-to-br from-primary/5 via-background to-yellow-500/5">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4 text-xs">Simple, transparent pricing</Badge>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Free tools. Optional Pro upgrade.
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-sm md:text-base">
            Get 3 free uses across all 9 tools — no account needed. Upgrade to Pro for unlimited use and bigger batches.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-6">
            <Card className="p-5 text-left">
              <p className="font-semibold mb-1">Free</p>
              <p className="text-2xl font-bold mb-3">£0 <span className="text-sm font-normal text-muted-foreground">/ forever</span></p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {['3 free uses across all 9 tools', 'No account needed', '100% private processing', 'No watermarks', 'No hidden fees'].map(f => (
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
              <p className="text-2xl font-bold mb-1 text-primary">£0.99 <span className="text-sm font-normal text-muted-foreground">/ 7-day trial</span></p>
              <p className="text-xs text-muted-foreground mb-3">Then £1.99/month · Cancel any time · £24.99 lifetime</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {['Unlimited all 9 tools', '50 images at once', 'Image Upscaler 4× & 8×', 'Unlimited PDF pages', '100% private processing'].map(f => (
                  <li key={f} className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />{f}</li>
                ))}
              </ul>
              <Button size="sm" className="w-full mt-4" onClick={() => setShowPremiumModal(true)} data-testid="btn-home-get-pro">
                <Crown className="w-3.5 h-3.5 mr-1.5" />Try Pro for £0.99
              </Button>
            </Card>
          </div>
          <Link to="/pricing" className="inline-flex items-center text-sm text-primary hover:underline" data-testid="link-home-see-pricing">
            See full pricing & plan comparison
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6">
        <AdBanner slot="7364501928" format="horizontal" fullWidth />
      </div>

      <section className="py-16 md:py-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            {t('faq.title', 'Frequently Asked Questions')}
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger data-testid="faq-q1">Is CompressYourPhoto really free?</AccordionTrigger>
              <AccordionContent>Yes. You get 3 free uses across all 9 tools — compress, resize, convert, crop, enhance, remove backgrounds, upscale, convert to PDF, and AI alt text. No sign-up, no watermarks. Upgrade to Pro for unlimited use and 4×/8× upscaling.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q1b">
              <AccordionTrigger data-testid="faq-q1b">Can I upscale images for free?</AccordionTrigger>
              <AccordionContent>Yes — free users can upscale using the shared 3-use allowance at 2× scale. Pro users get unlimited upscales at 2×, 4×, and 8× with smart sharpening for crisp, clear results.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q1c">
              <AccordionTrigger data-testid="faq-q1c">Can I convert images to PDF for free?</AccordionTrigger>
              <AccordionContent>Yes. Free users can use the Image to PDF tool within the shared 3-use allowance. Pro users get unlimited images per PDF and unlimited page extraction.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger data-testid="faq-q2">{t('faq.q2', 'Are my photos uploaded to a server?')}</AccordionTrigger>
              <AccordionContent>No. Your photos never leave your device. All processing — including upscaling, PDF conversion, and background removal — happens locally in your browser.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger data-testid="faq-q3">{t('faq.q3', 'What image formats are supported?')}</AccordionTrigger>
              <AccordionContent>{t('faq.a3', 'We support JPG/JPEG, PNG, WebP, HEIC/HEIF (iPhone photos), GIF, and BMP formats.')}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger data-testid="faq-q4">What is the 7-day Pro trial?</AccordionTrigger>
              <AccordionContent>For £0.99 you get full Pro access for 7 days. After the trial ends, you're automatically charged £1.99/month. You can cancel any time from your account page — no fees, no questions asked.</AccordionContent>
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
              <AccordionTrigger data-testid="faq-q7">Can I get a refund?</AccordionTrigger>
              <AccordionContent>Yes. Email us at <a href="mailto:contact@compressyourphoto.com" className="text-primary underline">contact@compressyourphoto.com</a> within 7 days and we'll issue a full refund — no questions asked.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q8">
              <AccordionTrigger data-testid="faq-q8">How do I cancel my Pro subscription?</AccordionTrigger>
              <AccordionContent>Sign in to your account and click "Manage Subscription" — it takes one click. Your Pro access continues until the end of your billing period. No hidden fees, no penalties.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-4">
        <AdBanner slot="6450192837" format="horizontal" fullWidth />
      </div>

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
