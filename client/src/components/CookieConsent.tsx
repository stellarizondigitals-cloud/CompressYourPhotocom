import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Cookie } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const CONSENT_KEY = 'cookie-consent';

export function CookieConsent() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4" data-testid="cookie-consent-banner">
      <Card className={`max-w-4xl mx-auto p-4 shadow-lg ${isRTL ? 'text-right' : ''}`}>
        <div className={`flex flex-col md:flex-row items-start md:items-center gap-4 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
          <div className={`flex items-start gap-3 flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Cookie className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">
                {t('cookieConsent.message')}{' '}
                <Link 
                  to="/cookie-policy" 
                  className="text-primary hover:underline"
                  data-testid="link-cookie-learn-more"
                >
                  {t('cookieConsent.learnMore')}
                </Link>
              </p>
            </div>
          </div>
          <div className={`flex gap-2 flex-shrink-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDecline}
              data-testid="button-cookie-decline"
            >
              {t('cookieConsent.decline')}
            </Button>
            <Button 
              size="sm" 
              onClick={handleAccept}
              data-testid="button-cookie-accept"
            >
              {t('cookieConsent.accept')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
