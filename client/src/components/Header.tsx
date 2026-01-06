import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Minimize2, Maximize, RefreshCw, Crop } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import logoImage from '@assets/generated_images/compressyourphoto_logo_icon.png';

const navTools = [
  { key: 'compress', path: '/compress', icon: Minimize2 },
  { key: 'resize', path: '/resize', icon: Maximize },
  { key: 'convert', path: '/convert', icon: RefreshCw },
  { key: 'crop', path: '/crop', icon: Crop },
];

export function Header() {
  const { t } = useTranslation();
  const { currentLanguage, isRTL } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const homeLink = currentLanguage.code === 'en' ? '/' : `/${currentLanguage.code}`;
  
  const getLocalizedPath = (path: string) => {
    if (currentLanguage.code === 'en') return path;
    return `/${currentLanguage.code}${path}`;
  };

  const isActivePath = (path: string) => {
    const localizedPath = getLocalizedPath(path);
    return location.pathname === localizedPath || location.pathname === path;
  };

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
            <span className="hidden sm:inline">{t('app.title', 'CompressYourPhoto')}</span>
          </Link>

          <nav className={`hidden md:flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {navTools.map((tool) => {
              const Icon = tool.icon;
              const isActive = isActivePath(tool.path);
              return (
                <Link
                  key={tool.key}
                  to={getLocalizedPath(tool.path)}
                  data-testid={`nav-link-${tool.key}`}
                >
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="sm"
                    className={`gap-1.5 ${isActive ? 'bg-primary/10' : ''}`}
                  >
                    <Icon className="w-4 h-4" />
                    {t(`tools.${tool.key}.navLabel`, tool.key.charAt(0).toUpperCase() + tool.key.slice(1))}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className={`md:hidden py-4 border-t flex flex-col gap-1 ${isRTL ? 'items-end' : 'items-start'}`}>
            {navTools.map((tool) => {
              const Icon = tool.icon;
              const isActive = isActivePath(tool.path);
              return (
                <Link
                  key={tool.key}
                  to={getLocalizedPath(tool.path)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                  data-testid={`mobile-nav-link-${tool.key}`}
                >
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="sm"
                    className={`w-full justify-start gap-2 ${isActive ? 'bg-primary/10' : ''} ${isRTL ? 'flex-row-reverse justify-end' : ''}`}
                  >
                    <Icon className="w-4 h-4" />
                    {t(`tools.${tool.key}.navLabel`, tool.key.charAt(0).toUpperCase() + tool.key.slice(1))}
                  </Button>
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
