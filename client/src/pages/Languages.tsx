import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { Link } from 'react-router-dom';
import { Globe, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English', path: '/' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', path: '/es' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', path: '/pt' },
  { code: 'fr', name: 'French', nativeName: 'Français', path: '/fr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', path: '/de' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', path: '/hi' },
  { code: 'zh-cn', name: 'Chinese (Simplified)', nativeName: '简体中文', path: '/zh-cn' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', path: '/ar' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', path: '/id' },
];

export default function Languages() {
  const { t, i18n } = useTranslation();
  const { isRTL } = useLanguage();
  const currentLang = i18n.language;

  return (
    <div className="flex-1">
      <section className="py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className={`text-center mb-12 ${isRTL ? 'text-right md:text-center' : ''}`}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Globe className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {t('languages.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('languages.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {languages.map((lang) => {
              const isActive = currentLang === lang.code || 
                (currentLang === 'en' && lang.code === 'en') ||
                (currentLang.startsWith('zh') && lang.code === 'zh-cn');
              
              return (
                <Link key={lang.code} to={lang.path}>
                  <Card 
                    className={`p-4 hover-elevate cursor-pointer transition-all ${
                      isActive ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    <div className={`flex items-center justify-between gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={isRTL ? 'text-right' : ''}>
                        <p className="font-medium">{lang.nativeName}</p>
                        <p className="text-sm text-muted-foreground">{lang.name}</p>
                      </div>
                      {isActive && (
                        <div className="p-1.5 rounded-full bg-primary">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className={`mt-12 text-center ${isRTL ? 'text-right md:text-center' : ''}`}>
            <p className="text-muted-foreground mb-4">
              {t('languages.helpTranslate')}
            </p>
            <Button variant="outline" asChild>
              <a href="mailto:contact@stellarizondigitals.com">
                {t('languages.contactUs')}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
