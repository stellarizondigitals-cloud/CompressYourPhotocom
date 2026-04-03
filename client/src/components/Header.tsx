import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Minimize2, Maximize, RefreshCw, Crop, Sparkles, Eraser, Type, LogIn, LogOut, Crown, User, BookOpen, Tag, ChevronDown, Wrench, ZoomIn, FileText } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import { LoginModal } from './LoginModal';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

const navTools = [
  { key: 'compress', path: '/compress', icon: Minimize2 },
  { key: 'resize', path: '/resize', icon: Maximize },
  { key: 'convert', path: '/convert', icon: RefreshCw },
  { key: 'crop', path: '/crop', icon: Crop },
  { key: 'enhance', path: '/enhance', icon: Sparkles },
  { key: 'remove-background', path: '/remove-background', icon: Eraser },
  { key: 'alt-text', path: '/alt-text-generator', icon: Type },
  { key: 'image-upscaler', path: '/image-upscaler', icon: ZoomIn },
  { key: 'image-to-pdf', path: '/image-to-pdf', icon: FileText },
];

export function Header() {
  const { t } = useTranslation();
  const { currentLanguage, isRTL } = useLanguage();
  const { user, isPro, isLoading, isConfigured, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const homeLink = currentLanguage.code === 'en' ? '/' : `/${currentLanguage.code}`;
  
  const getLocalizedPath = (path: string) => {
    if (currentLanguage.code === 'en') return path;
    return `/${currentLanguage.code}${path}`;
  };

  const isActivePath = (path: string) => {
    const localizedPath = getLocalizedPath(path);
    return location.pathname === localizedPath || location.pathname === path;
  };

  const isAnyToolActive = navTools.some(tool => isActivePath(tool.path));

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className={`flex h-16 items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Link 
            to={homeLink}
            className={`flex items-center gap-2.5 font-semibold text-lg ${isRTL ? 'flex-row-reverse' : ''}`}
            data-testid="link-home"
          >
            <img 
              src="/brand/logo-mark.svg" 
              alt="CompressYourPhoto" 
              className="h-10 w-10 sm:hidden" 
            />
            <img 
              src="/brand/logo-horizontal.svg" 
              alt="CompressYourPhoto" 
              className="hidden sm:block h-10 dark:hidden" 
            />
            <img 
              src="/brand/logo-horizontal-dark.svg" 
              alt="CompressYourPhoto" 
              className="hidden dark:sm:block h-10" 
            />
          </Link>

          <nav className={`hidden md:flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Tools dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={isAnyToolActive ? 'secondary' : 'ghost'}
                  size="sm"
                  className={`gap-1.5 ${isAnyToolActive ? 'bg-primary/10' : ''}`}
                  data-testid="nav-dropdown-tools"
                >
                  <Wrench className="w-4 h-4" />
                  Tools
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {navTools.map((tool) => {
                  const Icon = tool.icon;
                  const isActive = isActivePath(tool.path);
                  return (
                    <Link key={tool.key} to={getLocalizedPath(tool.path)} data-testid={`nav-link-${tool.key}`}>
                      <DropdownMenuItem className={`gap-2 cursor-pointer ${isActive ? 'bg-primary/10 text-primary' : ''}`}>
                        <Icon className="w-4 h-4" />
                        {t(`tools.${tool.key}.navLabel`, tool.key.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))}
                      </DropdownMenuItem>
                    </Link>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/blog" data-testid="nav-link-blog">
              <Button
                variant={location.pathname.startsWith('/blog') ? 'secondary' : 'ghost'}
                size="sm"
                className={`gap-1.5 ${location.pathname.startsWith('/blog') ? 'bg-primary/10' : ''}`}
              >
                <BookOpen className="w-4 h-4" />
                Blog
              </Button>
            </Link>
            <Link to="/pricing" data-testid="nav-link-pricing">
              <Button
                variant={location.pathname === '/pricing' ? 'secondary' : 'ghost'}
                size="sm"
                className={`gap-1.5 ${location.pathname === '/pricing' ? 'bg-primary/10' : ''}`}
              >
                <Tag className="w-4 h-4" />
                Pricing
              </Button>
            </Link>
          </nav>

          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <LanguageSwitcher />
            
            {!isLoading && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-1.5" data-testid="button-user-menu">
                        {isPro && <Crown className="w-4 h-4 text-yellow-500" />}
                        <span className="hidden sm:inline max-w-[120px] truncate">{user.email}</span>
                        <User className="w-4 h-4 sm:hidden" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                        {user.email}
                      </DropdownMenuItem>
                      {isPro && (
                        <DropdownMenuItem disabled className="text-xs">
                          <Crown className="w-3 h-3 mr-1.5 text-yellow-500" />
                          {t('premium.proBadge', 'Pro Member')}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <Link to="/account">
                        <DropdownMenuItem data-testid="link-account">
                          <User className="w-4 h-4 mr-2" />
                          {t('account.title', 'My Account')}
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem onClick={signOut} data-testid="button-logout">
                        <LogOut className="w-4 h-4 mr-2" />
                        {t('auth.logout', 'Logout')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLoginModalOpen(true)}
                    className="gap-1.5"
                    disabled={!isConfigured}
                    data-testid="button-login"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('auth.login', 'Login')}</span>
                  </Button>
                )}
              </>
            )}
            
            <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
            
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

        {/* Mobile menu — full list */}
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
                    {t(`tools.${tool.key}.navLabel`, tool.key.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))}
                  </Button>
                </Link>
              );
            })}
            <Link
              to="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full"
              data-testid="mobile-nav-link-blog"
            >
              <Button
                variant={location.pathname.startsWith('/blog') ? 'secondary' : 'ghost'}
                size="sm"
                className={`w-full justify-start gap-2 ${location.pathname.startsWith('/blog') ? 'bg-primary/10' : ''}`}
              >
                <BookOpen className="w-4 h-4" />
                Blog
              </Button>
            </Link>
            <Link
              to="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full"
              data-testid="mobile-nav-link-pricing"
            >
              <Button
                variant={location.pathname === '/pricing' ? 'secondary' : 'ghost'}
                size="sm"
                className={`w-full justify-start gap-2 ${location.pathname === '/pricing' ? 'bg-primary/10' : ''}`}
              >
                <Tag className="w-4 h-4" />
                Pricing
              </Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
