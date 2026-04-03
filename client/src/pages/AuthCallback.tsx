import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your login...');

  useEffect(() => {
    const handleCallback = async () => {
      if (!isSupabaseConfigured || !supabase) {
        setStatus('error');
        setMessage('Authentication is not configured');
        return;
      }

      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        let session = null;
        let error = null;

        if (code) {
          const result = await supabase.auth.exchangeCodeForSession(code);
          session = result.data?.session;
          error = result.error;
        } else {
          const result = await supabase.auth.getSession();
          session = result.data?.session;
          error = result.error;
        }

        if (error) {
          console.error('[AuthCallback] Error:', error);
          setStatus('error');
          setMessage(error.message || 'Failed to verify login. Please try again.');
          return;
        }

        if (session) {
          console.log('[AuthCallback] Session verified');
          setStatus('success');
          setMessage('Login successful! Redirecting...');
          setTimeout(() => navigate('/'), 1500);
        } else {
          setStatus('error');
          setMessage('Login link expired or already used. Please request a new one.');
        }
      } catch (err: any) {
        console.error('[AuthCallback] Exception:', err);
        setStatus('error');
        setMessage(err?.message || 'An unexpected error occurred');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 max-w-sm px-4">
        {status === 'loading' && (
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
        )}
        {status === 'success' && (
          <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
        )}
        {status === 'error' && (
          <XCircle className="w-12 h-12 mx-auto text-destructive" />
        )}
        <p className="text-lg text-muted-foreground">{message}</p>
        {status === 'error' && (
          <button
            onClick={() => navigate('/')}
            className="text-primary hover:underline"
          >
            Return to homepage
          </button>
        )}
      </div>
    </div>
  );
}
