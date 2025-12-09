import { useTranslation } from 'react-i18next';
import { Image, Github } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export function Footer() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <footer className="border-t bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${isRTL ? 'text-right' : ''}`}>
          <div className="space-y-4">
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
              <Image className="h-6 w-6 text-primary" />
              <span className="font-semibold text-lg">{t('app.title')}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('app.tagline')}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Links</h4>
            <nav className="flex flex-col gap-2">
              <a 
                href="#" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-how-it-works"
              >
                {t('footer.howItWorks')}
              </a>
              <a 
                href="#" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-privacy"
              >
                {t('footer.privacy')}
              </a>
              <a 
                href="#" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-languages"
              >
                {t('footer.languages')}
              </a>
            </nav>
          </div>

          <div className="space-y-4">
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
              <Github className="h-5 w-5" />
              <a 
                href="#" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-github"
              >
                GitHub
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('footer.stats')}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CompressYourPhoto. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
