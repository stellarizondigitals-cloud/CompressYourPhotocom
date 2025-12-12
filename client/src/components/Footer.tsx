import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Image, Github } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export function Footer() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <footer className="border-t bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-8 ${isRTL ? 'text-right' : ''}`}>
          <div className="space-y-3">
            <Link to="/" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
              <Image className="h-5 w-5 text-primary" />
              <span className="font-semibold">{t('app.title')}</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {t('app.tagline')}
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Stellarizon Digitals Ltd
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-sm">{t('footer.product')}</h4>
            <nav className="flex flex-col gap-2">
              <Link 
                to="/how-it-works" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-how-it-works"
              >
                {t('footer.howItWorks')}
              </Link>
              <Link 
                to="/languages" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-languages"
              >
                {t('footer.languages')}
              </Link>
              <Link 
                to="/contact" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-contact"
              >
                {t('footer.contact')}
              </Link>
            </nav>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-sm">{t('footer.legal')}</h4>
            <nav className="flex flex-col gap-2">
              <Link 
                to="/privacy-policy" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-privacy"
              >
                {t('footer.privacy')}
              </Link>
              <Link 
                to="/terms" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-terms"
              >
                {t('footer.terms')}
              </Link>
              <Link 
                to="/cookie-policy" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-cookie-policy"
              >
                {t('footer.cookiePolicy')}
              </Link>
              <Link 
                to="/disclaimer" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-disclaimer"
              >
                {t('footer.disclaimer')}
              </Link>
            </nav>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-sm">{t('footer.connect')}</h4>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
              <Github className="h-4 w-4" />
              <a 
                href="https://github.com/stellarizondigitals-cloud/CompressYourPhotocom"
                target="_blank"
                rel="noopener noreferrer"
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

        <div className="mt-10 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2025 CompressYourPhoto. {t('footer.allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
}
