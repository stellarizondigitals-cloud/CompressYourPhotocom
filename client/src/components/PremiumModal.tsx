import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { loadStripe } from '@stripe/stripe-js';
import { Crown, Zap, Archive, Ban, Infinity, Check, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/hooks/useLanguage';
import { LoginModal } from './LoginModal';

interface PremiumModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');
const MONTHLY_PRICE_ID = import.meta.env.VITE_STRIPE_MONTHLY_PRICE_ID || 'price_1SpnznA1YPAyGFWbKzbFWwJK';
const LIFETIME_PRICE_ID = import.meta.env.VITE_STRIPE_LIFETIME_PRICE_ID || 'price_1Spo0RA1YPAyGFWb0OcshWro';

export function PremiumModal({ open, onOpenChange }: PremiumModalProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { user } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleCheckout = async (priceId: string, mode: 'subscription' | 'payment') => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setLoadingPlan(priceId);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          mode,
          userId: user.id,
          userEmail: user.email,
          successUrl: window.location.origin + '?checkout=success',
          cancelUrl: window.location.origin + '?checkout=cancelled',
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Checkout error:', data.error);
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoadingPlan(null);
    }
  };

  const features = [
    { icon: Archive, label: t('premium.features.batchZip', 'Batch ZIP download (up to 50 images)') },
    { icon: Ban, label: t('premium.features.adFree', 'Ad-free experience') },
    { icon: Infinity, label: t('premium.features.unlimited', 'Unlimited compressions') },
    { icon: Zap, label: t('premium.features.priority', 'Priority processing') },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
          </div>
          <DialogTitle className="text-xl">
            {t('premium.title', 'Upgrade to Pro')}
          </DialogTitle>
          <DialogDescription>
            {t('premium.description', 'Unlock all features and compress without limits')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <div className="space-y-2">
            {features.map((feature, i) => (
              <div key={i} className={`flex items-center gap-3 text-sm ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>{feature.label}</span>
              </div>
            ))}
          </div>

          <div className="grid gap-3 pt-2">
            <Card 
              className="p-4 cursor-pointer border-2 hover:border-primary/50 transition-colors"
              onClick={() => handleCheckout(MONTHLY_PRICE_ID, 'subscription')}
            >
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={isRTL ? 'text-right' : ''}>
                  <p className="font-semibold">{t('premium.monthly.title', 'Pro Monthly')}</p>
                  <p className="text-sm text-muted-foreground">{t('premium.monthly.description', 'Cancel anytime')}</p>
                </div>
                <div className={`text-right ${isRTL ? 'text-left' : ''}`}>
                  <p className="text-2xl font-bold">£1.99</p>
                  <p className="text-xs text-muted-foreground">{t('premium.perMonth', '/month')}</p>
                </div>
              </div>
              {loadingPlan === MONTHLY_PRICE_ID && (
                <div className="flex justify-center mt-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              )}
            </Card>

            <Card 
              className="p-4 cursor-pointer border-2 border-primary/30 bg-primary/5 hover:border-primary transition-colors relative"
              onClick={() => handleCheckout(LIFETIME_PRICE_ID, 'payment')}
            >
              <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                {t('premium.bestValue', 'Best Value')}
              </Badge>
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={isRTL ? 'text-right' : ''}>
                  <p className="font-semibold">{t('premium.lifetime.title', 'Pro Lifetime')}</p>
                  <p className="text-sm text-muted-foreground">{t('premium.lifetime.description', 'One-time payment, forever')}</p>
                </div>
                <div className={`text-right ${isRTL ? 'text-left' : ''}`}>
                  <p className="text-2xl font-bold">£24.99</p>
                  <p className="text-xs text-muted-foreground">{t('premium.oneTime', 'one-time')}</p>
                </div>
              </div>
              {loadingPlan === LIFETIME_PRICE_ID && (
                <div className="flex justify-center mt-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              )}
            </Card>
          </div>

          {!user && (
            <p className="text-xs text-center text-muted-foreground">
              {t('premium.loginRequired', 'You will be asked to login before checkout')}
            </p>
          )}
        </div>

        <Button variant="ghost" onClick={() => onOpenChange(false)} className="w-full">
          {t('premium.maybeLater', 'Maybe later')}
        </Button>
      </DialogContent>

      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </Dialog>
  );
}
