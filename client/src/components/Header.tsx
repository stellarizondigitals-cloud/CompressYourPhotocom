import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Image } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '@/hooks/useLanguage';

export function Header() {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  const homeLink = currentLanguage.code === 'en' ? '/' : `/${currentLanguage.code}`;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex h-14 items-center justify-between gap-4">
          <Link 
            to={homeLink}
            className="flex items-center gap-2 font-semibold text-lg"
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
