import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Check, Crown, Shield, Zap, Archive, Ban, Infinity, Star, HelpCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PremiumModal } from '@/components/PremiumModal';
import { useAuth } from '@/contexts/AuthContext';
import { LoginModal } from '@/components/LoginModal';

const freeFeatures = [
  'Compress, resize, convert, crop, enhance & remove backgrounds',
  'Supports JPG, PNG, WebP, HEIC, GIF',
  '100% private — files never leave your browser',
  'No account required',
  'Up to 5 images per session (3 background removals)',
];

const proFeatures = [
  'Everything in Free',
  'Batch process up to 50 images at once',
  'Completely ad-free experience',
  'Unlimited compressions — no session limits',
  'Priority processing speed',
  '100% private — files never leave your device',
];

export default function Pricing() {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user } = useAuth();

  const handleGetPro = () => {
    setShowPremiumModal(true);
  };

  return (
    <div className="flex-1">
      <Helmet>
        <title>Pricing — Free & Pro Plans | CompressYourPhoto</title>
        <meta name="description" content="CompressYourPhoto is free to use. Upgrade to Pro for unlimited batch processing, no ads, and priority speed. Plans from £0.99. Cancel anytime." />
        <link rel="canonical" href="https://www.compressyourphoto.com/pricing" />
      </Helmet>

      <section className="py-14 md:py-20 px-4 md:px-8">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <Badge variant="secondary" className="mb-4 text-xs">Simple, transparent pricing</Badge>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Free for everyone.<br className="hidden md:block" /> Pro for power users.
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            All 6 tools — Compress, Resize, Convert, Crop, Enhance & Remove Background — are free with no sign-up.
            Upgrade to Pro to remove limits and ads.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <Card className="p-7 flex flex-col">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-1">Free</h2>
              <p className="text-muted-foreground text-sm">No account needed. Always free.</p>
              <div className="mt-4">
                <span className="text-4xl font-bold">£0</span>
                <span className="text-muted-foreground ml-1">/ forever</span>
              </div>
            </div>
            <ul className="space-y-3 flex-1 mb-6">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link to="/compress">
              <Button variant="outline" className="w-full" data-testid="btn-start-free">
                Start for free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>

          <Card className="p-7 flex flex-col border-primary/40 bg-primary/[0.02] relative">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 px-3 py-1">
              <Star className="w-3 h-3 mr-1 inline" />
              Most Popular
            </Badge>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-bold">Pro</h2>
              </div>
              <p className="text-muted-foreground text-sm">Unlock unlimited power. Cancel anytime.</p>
              <div className="mt-4 space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm text-muted-foreground">From</span>
                  <span className="text-4xl font-bold text-primary">£0.99</span>
                  <span className="text-muted-foreground text-sm">/ 7 days</span>
                </div>
                <p className="text-xs text-muted-foreground">or £1.99/month · or £24.99 one-time (lifetime)</p>
                <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                  Lower prices available in some regions
                </p>
              </div>
            </div>
            <ul className="space-y-3 flex-1 mb-6">
              {proFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 text-primary" />
                  </div>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white border-0"
              onClick={handleGetPro}
              data-testid="btn-get-pro"
            >
              <Crown className="w-4 h-4 mr-2" />
              Get Pro Access
            </Button>
            {!user && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                You'll sign in with a magic link — no password needed. This ties your Pro access to your email so you can use it on any device.
              </p>
            )}
          </Card>
        </div>

        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-xl font-bold text-center mb-2">What's included at each plan</h2>
          <p className="text-sm text-muted-foreground text-center mb-8">Full comparison of Free vs Pro features</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 pr-4 font-medium text-muted-foreground">Feature</th>
                  <th className="text-center py-3 px-4 font-semibold">Free</th>
                  <th className="text-center py-3 px-4 font-semibold text-primary">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  ['Compress images', true, true],
                  ['Resize images', true, true],
                  ['Convert formats (WebP, PNG, JPG…)', true, true],
                  ['Crop images', true, true],
                  ['Enhance brightness, contrast, saturation', true, true],
                  ['Remove image background (AI)', true, true],
                  ['HEIC support (iPhone photos)', true, true],
                  ['Files stay on your device (100% private)', true, true],
                  ['No account required', true, false],
                  ['Images per session', '5', 'Unlimited'],
                  ['Background removals per session', '3', 'Unlimited'],
                  ['Batch ZIP download', false, true],
                  ['Ad-free experience', false, true],
                  ['Priority processing speed', false, true],
                ].map(([feature, free, pro], i) => (
                  <tr key={i} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 pr-4">{feature}</td>
                    <td className="text-center py-3 px-4">
                      {free === true ? (
                        <Check className="w-4 h-4 text-green-500 mx-auto" />
                      ) : free === false ? (
                        <span className="text-muted-foreground/40">—</span>
                      ) : (
                        <span className="text-muted-foreground text-xs">{free}</span>
                      )}
                    </td>
                    <td className="text-center py-3 px-4">
                      {pro === true ? (
                        <Check className="w-4 h-4 text-primary mx-auto" />
                      ) : pro === false ? (
                        <span className="text-muted-foreground/40">—</span>
                      ) : (
                        <span className="text-primary font-medium text-xs">{pro}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="max-w-3xl mx-auto mb-16">
          <div className="flex items-center gap-2 justify-center mb-8">
            <HelpCircle className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Billing & cancellation FAQ</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger data-testid="pricing-faq-q1">What are the Pro plans?</AccordionTrigger>
              <AccordionContent>
                Pro is available as a <strong>7-Day Pass (£0.99)</strong>, a <strong>Monthly subscription (£1.99/month)</strong>, or a <strong>Lifetime one-time payment (£24.99)</strong>. Prices shown in GBP — users in some regions (India, Brazil, Turkey, Indonesia) see lower local pricing.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger data-testid="pricing-faq-q2">How do I cancel my monthly subscription?</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p><strong>Fastest way (instant, self-service):</strong> Sign in → go to your <Link to="/account" className="text-primary underline">Account page</Link> → click "Manage Subscription". This opens the Stripe billing portal where you cancel in one click — no waiting, no emails, fully automatic.</p>
                  <p className="text-sm text-muted-foreground">Cancellation takes effect at the end of your current billing period. You keep full Pro access until then, and no further charges are made.</p>
                  <p className="text-sm text-muted-foreground">Alternatively, email <a href="mailto:contact@compressyourphoto.com" className="text-primary underline">contact@compressyourphoto.com</a> and we'll cancel it for you within 1 business day.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger data-testid="pricing-faq-q3">Is the Lifetime plan really forever?</AccordionTrigger>
              <AccordionContent>
                Yes. Pay once and you get Pro access for as long as the service runs. No renewals, no surprises.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger data-testid="pricing-faq-q4">What payment methods are accepted?</AccordionTrigger>
              <AccordionContent>
                We accept all major debit and credit cards (Visa, Mastercard, Amex) and many regional payment methods via Stripe. All transactions are secured by Stripe — we never store your card details.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger data-testid="pricing-faq-q5">Can I get a refund?</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <p>Yes — we offer a <strong>7-day money-back guarantee</strong>, no questions asked.</p>
                  <div>
                    <p className="font-medium mb-2">How to request a refund:</p>
                    <ol className="list-decimal list-inside space-y-1.5 text-sm">
                      <li>Email <a href="mailto:contact@compressyourphoto.com" className="text-primary underline">contact@compressyourphoto.com</a> from the address you used to purchase</li>
                      <li>Include the subject line: <strong>"Refund Request"</strong></li>
                      <li>Optionally include your Stripe receipt number (helps us find your order faster)</li>
                      <li>We'll process your refund in Stripe within 1 business day — the money typically appears on your card within <strong>5–10 business days</strong> (this is your bank's timeline, not ours)</li>
                    </ol>
                  </div>
                  <p className="text-sm text-muted-foreground">The refund returns to your original payment method. Monthly subscriptions cancelled after 7 days are not eligible for a partial refund but you keep access until the period ends. 7-Day Passes must be requested before expiry.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q6">
              <AccordionTrigger data-testid="pricing-faq-q6">How do I sign in? There's no password.</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>We use <strong>magic link</strong> sign-in — enter your email, click the link we send you, and you're in. No password to remember, no account setup form. It's secure and fast.</p>
                  <p className="text-sm text-muted-foreground">The link expires after 1 hour for security. Just request a new one if it expires.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q6b">
              <AccordionTrigger data-testid="pricing-faq-q6b">Why do I need to sign in for Pro?</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>Signing in with your email is the only thing we need to do three important things:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Verify your subscription</strong> — proves you're a paying customer, not someone else using your Pro access</li>
                    <li><strong>Work on any device</strong> — sign in on your phone, laptop, or tablet and your Pro access follows you</li>
                    <li><strong>Manage your plan</strong> — cancel, check status, or get a refund easily from your Account page</li>
                  </ul>
                  <p className="text-sm text-muted-foreground">We don't store any passwords, card numbers, or personal data beyond your email. See our <Link to="/privacy-policy" className="text-primary underline">Privacy Policy</Link> for full details.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q7">
              <AccordionTrigger data-testid="pricing-faq-q7">Who operates this service?</AccordionTrigger>
              <AccordionContent>
                CompressYourPhoto is operated by <strong>Stellarizon Digitals Ltd</strong>, a company registered in England and Wales (Company No. 16748429). See our <Link to="/terms" className="text-primary underline">Terms of Service</Link> and <Link to="/privacy-policy" className="text-primary underline">Privacy Policy</Link> for full details.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-6 flex-wrap text-sm text-muted-foreground mb-6">
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> Secure checkout via Stripe</span>
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4" /> Instant access after payment</span>
            <span className="flex items-center gap-1.5"><Archive className="w-4 h-4" /> Cancel anytime</span>
          </div>
          <p className="text-xs text-muted-foreground">
            By purchasing, you agree to our{' '}
            <Link to="/terms" className="underline hover:text-foreground">Terms of Service</Link>.
            {' '}Monthly subscriptions auto-renew until cancelled.
            {' '}Operated by Stellarizon Digitals Ltd (Co. No. 16748429).
          </p>
        </div>
      </section>

      <PremiumModal open={showPremiumModal} onOpenChange={setShowPremiumModal} />
      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </div>
  );
}
