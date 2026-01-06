import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '@/hooks/useLanguage';
import logoImage from '@assets/generated_images/compressyourphoto_logo_icon.png';

export function Header() {
  const { t } = useTranslation();
  const { currentLanguage, isRTL } = useLanguage();

  const homeLink = currentLanguage.code === 'en' ? '/' : `/${currentLanguage.code}`;

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className={`flex h-16 items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Link 
            to={homeLink}
            className={`flex items-center gap-2 font-semibold text-lg ${isRTL ? 'flex-row-reverse' : ''}`}
            data-testid="link-home"
          >
            <img src={logoImage} alt="CompressYourPhoto" className="h-8 w-8" />
            <span>{t('app.title')}</span>
          </Link>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
