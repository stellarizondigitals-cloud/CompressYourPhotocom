import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical' | 'in-article';
  className?: string;
  fullWidth?: boolean;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export function AdBanner({ slot, format = 'auto', className = '', fullWidth = false }: AdBannerProps) {
  const { isPro } = useAuth();
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (isPro || pushed.current) return;
    try {
      if (typeof window !== 'undefined') {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        pushed.current = true;
      }
    } catch {}
  }, [isPro]);

  if (isPro) return null;

  const isInArticle = format === 'in-article';

  return (
    <div className={`ad-container ${className}`} data-testid={`ad-banner-${slot}`}>
      <p className="text-[10px] text-muted-foreground text-center mb-1 uppercase tracking-widest">Advertisement</p>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-client="ca-pub-1318056567034683"
        data-ad-slot={slot}
        data-ad-format={isInArticle ? 'fluid' : format}
        data-ad-layout={isInArticle ? 'in-article' : undefined}
        data-full-width-responsive={fullWidth ? 'true' : 'false'}
      />
    </div>
  );
}
