import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Mail, LogOut, Loader2 } from 'lucide-react';

export default function Account() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, profile, isPro, isLoading, isConfigured, signOut } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/', { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <main className="flex-1 flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const getSubscriptionLabel = () => {
    if (!isPro) {
      return t('account.free', 'Free');
    }
    if (profile?.subscription_type === 'lifetime') {
      return t('account.proLifetime', 'Pro (Lifetime)');
    }
    if (profile?.subscription_type === 'monthly') {
      return t('account.proMonthly', 'Pro (Monthly)');
    }
    return t('account.pro', 'Pro');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      <Helmet>
        <title>{t('account.title', 'My Account')} | CompressYourPhoto</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main className="flex-1 py-8 md:py-16">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-8" data-testid="text-account-title">
            {t('account.title', 'My Account')}
          </h1>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  {t('account.emailSection', 'Email')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg" data-testid="text-user-email">{user.email}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  {t('account.subscriptionSection', 'Subscription')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={isPro ? 'default' : 'secondary'}
                    className={isPro ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                    data-testid="badge-subscription-status"
                  >
                    {getSubscriptionLabel()}
                  </Badge>
                  {isPro && (
                    <span className="text-sm text-muted-foreground">
                      {t('account.proDescription', 'Unlimited compressions, batch processing up to 50 images, ad-free experience')}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="pt-4">
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="gap-2"
                data-testid="button-account-logout"
              >
                <LogOut className="w-4 h-4" />
                {t('auth.logout', 'Logout')}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
