import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Crown, Zap, Archive, Infinity, Check, Loader2, Star, Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/hooks/useLanguage';
import { useGeoPrice } from '@/hooks/useGeoPrice';
import { LoginModal } from './LoginModal';

interface PremiumModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PremiumModal({ open, onOpenChange }: PremiumModalProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { user } = useAuth();
  const { prices, loading: geoLoading } = useGeoPrice();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const openLogin = () => {
    onOpenChange(false);
    setTimeout(() => setShowLoginModal(true), 150);
  };

  const handleCheckoutFixed = async (priceId: string, mode: 'subscription' | 'payment') => {
    if (!user) { openLogin(); return; }
    setErrorMsg(null);
    setLoadingPlan(priceId);
    const pending = window.self !== window.top ? window.open('', '_blank') : null;
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId, mode,
          userId: user.id,
          userEmail: user.email,
          successUrl: window.location.origin + '?checkout=success',
          cancelUrl: window.location.origin + '?checkout=cancelled',
        }),
      });
      const data = await response.json();
      if (data.url) {
        if (pending) { pending.location.href = data.url; }
        else { window.location.href = data.url; }
      } else {
        if (pending) pending.close();
        setErrorMsg(data.error || 'Could not start checkout. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      if (pending) pending.close();
      setErrorMsg('Network error. Please check your connection and try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleCheckoutGeo = async (planType: string, amount: number, productName: string, mode: 'payment' | 'subscription') => {
    if (!user) { openLogin(); return; }
    setErrorMsg(null);
    setLoadingPlan(planType);
    const pending = window.self !== window.top ? window.open('', '_blank') : null;
    try {
      const response = await fetch('/api/create-checkout-geo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planType, amount, productName, mode,
          userId: user.id,
          userEmail: user.email,
          successUrl: window.location.origin + '?checkout=success',
          cancelUrl: window.location.origin + '?checkout=cancelled',
        }),
      });
      const data = await response.json();
      if (data.url) {
        if (pending) { pending.location.href = data.url; }
        else { window.location.href = data.url; }
      } else {
        if (pending) pending.close();
        setErrorMsg(data.error || 'Could not start checkout. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      if (pending) pending.close();
      setErrorMsg('Network error. Please check your connection and try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  const features = [
    { icon: Infinity, label: t('premium.features.unlimited', 'Unlimited uses across all 9 tools') },
    { icon: Archive, label: t('premium.features.batchZip', 'Batch process up to 50 images at once') },
    { icon: Zap, label: t('premium.features.upscaler', 'Image Upscaler at 4× & 8× scale') },
    { icon: Zap, label: t('premium.features.pdf', 'Unlimited PDF pages & exports') },
    { icon: Shield, label: t('premium.features.privacy', '100% private — files never leave your device') },
  ];

  const isLoading = (key: string) => loadingPlan === key;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-center pb-0">
            <div className="flex justify-center mb-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Crown className="w-7 h-7 text-white" />
              </div>
            </div>
            <DialogTitle className="text-xl font-bold">
              {t('premium.title', 'Unlock Pro Access')}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {t('premium.description', 'Remove all limits. No watermarks. No ads.')}
            </DialogDescription>
          </DialogHeader>

          {prices.specialLabel && !geoLoading && (
            <div className="flex items-center justify-center gap-2 py-2 px-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-xs text-green-700 dark:text-green-400 font-medium">
              <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
              {prices.specialLabel}
            </div>
          )}

          <div className="space-y-2 py-1">
            {features.map((f, i) => (
              <div key={i} className={`flex items-start gap-2.5 text-sm ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                <div className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-muted-foreground leading-snug">{f.label}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2.5 pt-1">
            <button
              onClick={() => handleCheckoutGeo('week_pass', prices.weekPass.amount, '7-Day Pro Trial', 'subscription')}
              disabled={!!loadingPlan}
              className="w-full p-3.5 rounded-xl border-2 border-border hover:border-primary/40 bg-background hover:bg-muted/30 transition-all text-left disabled:opacity-60 disabled:cursor-not-allowed"
              data-testid="btn-week-pass"
            >
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div>
                  <p className="font-semibold text-sm">7-Day Trial</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Then £1.99/month · Cancel any time</p>
                </div>
                <div className={`${isRTL ? 'text-left' : 'text-right'} flex-shrink-0 ml-3`}>
                  {isLoading('week_pass') ? (
                    <Loader2 className="w-4 h-4 animate-spin ml-auto" />
                  ) : (
                    <>
                      <p className="text-xl font-bold">{prices.weekPass.display}</p>
                      <p className="text-xs text-muted-foreground">for 7 days</p>
                    </>
                  )}
                </div>
              </div>
            </button>

            {prices.monthly && (
              <button
                onClick={() => handleCheckoutFixed(prices.monthly!.priceId, 'subscription')}
                disabled={!!loadingPlan}
                className="w-full p-3.5 rounded-xl border-2 border-border hover:border-primary/40 bg-background hover:bg-muted/30 transition-all text-left disabled:opacity-60 disabled:cursor-not-allowed"
                data-testid="btn-monthly"
              >
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div>
                    <p className="font-semibold text-sm">Pro Monthly</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Cancel anytime</p>
                  </div>
                  <div className={`${isRTL ? 'text-left' : 'text-right'} flex-shrink-0 ml-3`}>
                    {isLoading(prices.monthly.priceId) ? (
                      <Loader2 className="w-4 h-4 animate-spin ml-auto" />
                    ) : (
                      <>
                        <p className="text-xl font-bold">{prices.monthly.display}</p>
                        <p className="text-xs text-muted-foreground">/month</p>
                      </>
                    )}
                  </div>
                </div>
              </button>
            )}

            <button
              onClick={() => {
                if (prices.tier === 1) {
                  handleCheckoutFixed(import.meta.env.VITE_STRIPE_LIFETIME_PRICE_ID || 'price_1THNNnA1YPAyGFWbJs3kmtST', 'payment');
                } else {
                  handleCheckoutGeo('lifetime_geo', prices.lifetime.amount, 'Lifetime Pro Access', 'payment');
                }
              }}
              disabled={!!loadingPlan}
              className="w-full p-3.5 rounded-xl border-2 border-primary/50 bg-primary/5 hover:bg-primary/10 hover:border-primary transition-all text-left relative disabled:opacity-60 disabled:cursor-not-allowed"
              data-testid="btn-lifetime"
            >
              <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-[10px] px-2.5 py-0.5">
                <Star className="w-2.5 h-2.5 mr-1 inline" />
                Best Value
              </Badge>
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div>
                  <p className="font-semibold text-sm">Pro Lifetime</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {prices.savingsVs12Months || 'Pay once, use forever'}
                  </p>
                </div>
                <div className={`${isRTL ? 'text-left' : 'text-right'} flex-shrink-0 ml-3`}>
                  {isLoading(import.meta.env.VITE_STRIPE_LIFETIME_PRICE_ID || 'price_1THNNnA1YPAyGFWbJs3kmtST') || isLoading('lifetime_geo') ? (
                    <Loader2 className="w-4 h-4 animate-spin ml-auto" />
                  ) : (
                    <>
                      {prices.tier === 1 && (
                        <p className="text-xs text-muted-foreground line-through">£47.88/yr</p>
                      )}
                      <p className="text-xl font-bold text-primary">{prices.lifetime.display}</p>
                      <p className="text-xs text-muted-foreground">one-time</p>
                    </>
                  )}
                </div>
              </div>
            </button>
          </div>

          {errorMsg && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-400" data-testid="checkout-error">
              <span className="flex-shrink-0">⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="text-center space-y-2 pt-1">
            <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Secure checkout</span>
              <span>·</span>
              <span>Powered by Stripe</span>
              <span>·</span>
              <span>Instant access</span>
            </div>
            {!user && (
              <p className="text-xs text-muted-foreground">
                Sign in required — we'll ask you to log in first
              </p>
            )}
          </div>

          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="w-full text-muted-foreground">
            {t('premium.maybeLater', 'Maybe later')}
          </Button>
        </DialogContent>
      </Dialog>

      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </>
  );
}
