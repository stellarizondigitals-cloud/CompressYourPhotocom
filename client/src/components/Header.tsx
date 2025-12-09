import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Image } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '@/hooks/useLanguage';

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
            <Image className="h-6 w-6 text-primary" />
            <span>{t('app.title')}</span>
          </Link>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
