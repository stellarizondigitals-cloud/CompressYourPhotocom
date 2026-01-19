import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Loader2, CheckCircle } from 'lucide-react';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const { t } = useTranslation();
  const { signInWithEmail, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !isConfigured) return;

    setIsLoading(true);
    setError(null);

    const result = await signInWithEmail(email);
    
    setIsLoading(false);
    
    if (result.error) {
      setError(result.error.message);
    } else {
      setEmailSent(true);
    }
  };

  const handleClose = () => {
    setEmail('');
    setEmailSent(false);
    setError(null);
    onOpenChange(false);
  };

  if (!isConfigured) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('auth.login', 'Login')}</DialogTitle>
            <DialogDescription>
              {t('auth.notConfigured', 'Authentication is currently unavailable. Please try again later.')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button variant="outline" onClick={handleClose} data-testid="button-close-login">
              {t('common.close', 'Close')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('auth.login', 'Login')}</DialogTitle>
          <DialogDescription>
            {t('auth.magicLinkDescription', 'Enter your email to receive a magic link for passwordless login.')}
          </DialogDescription>
        </DialogHeader>

        {emailSent ? (
          <div className="flex flex-col items-center gap-4 py-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
            <p className="text-center text-sm text-muted-foreground">
              {t('auth.checkEmail', 'Check your email for a login link. It may take a minute to arrive.')}
            </p>
            <Button variant="outline" onClick={handleClose} data-testid="button-done-login">
              {t('common.done', 'Done')}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email', 'Email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                data-testid="input-login-email"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive" data-testid="text-login-error">
                {error}
              </p>
            )}

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button type="submit" disabled={isLoading || !email} data-testid="button-send-magic-link">
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    {t('auth.sendMagicLink', 'Send Magic Link')}
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
