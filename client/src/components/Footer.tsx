import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Image, Shield, Zap, Smartphone, FileImage, Lock } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export function Footer() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <footer className="border-t bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className={`grid grid-cols-1 md:grid-cols-5 gap-8 ${isRTL ? 'text-right' : ''}`}>
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
                to="/compress" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-footer-compress"
              >
                {t('tools.compress.navLabel', 'Compress Images')}
              </Link>
              <Link 
                to="/resize" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-footer-resize"
              >
                {t('tools.resize.navLabel', 'Resize Photos')}
              </Link>
              <Link 
                to="/convert" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-footer-convert"
              >
                {t('tools.convert.navLabel', 'Convert Format')}
              </Link>
              <Link 
                to="/crop" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-footer-crop"
              >
                {t('tools.crop.navLabel', 'Crop Images')}
              </Link>
              <Link 
                to="/enhance" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-footer-enhance"
              >
                {t('tools.enhance.navLabel', 'Enhance Photos')}
              </Link>
              <Link 
                to="/how-it-works" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-how-it-works"
              >
                {t('footer.howItWorks')}
              </Link>
            </nav>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-sm">{t('footer.company')}</h4>
            <nav className="flex flex-col gap-2">
              <Link 
                to="/about" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-about"
              >
                {t('footer.about')}
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
            <h4 className="font-medium text-sm">{t('footer.trustPerformance')}</h4>
            <ul className="space-y-2">
              <li className={`flex items-center gap-2 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse justify-end' : ''}`} data-testid="trust-browser-based">
                <Shield className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{t('footer.browserBased')}</span>
              </li>
              <li className={`flex items-center gap-2 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse justify-end' : ''}`} data-testid="trust-private">
                <Lock className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{t('footer.privateByDesign')}</span>
              </li>
              <li className={`flex items-center gap-2 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse justify-end' : ''}`} data-testid="trust-fast">
                <Zap className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{t('footer.fastCompression')}</span>
              </li>
              <li className={`flex items-center gap-2 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse justify-end' : ''}`} data-testid="trust-mobile">
                <Smartphone className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{t('footer.mobileDesktop')}</span>
              </li>
              <li className={`flex items-center gap-2 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse justify-end' : ''}`} data-testid="trust-formats">
                <FileImage className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{t('footer.supportedFormats')}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2025 CompressYourPhoto. {t('footer.allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
}
