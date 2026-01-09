import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, Share2, Crop, Image } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface PopularUseCasesProps {
  tool: 'compress' | 'resize' | 'convert' | 'crop' | 'enhance';
}

export function PopularUseCases({ tool }: PopularUseCasesProps) {
  const { t } = useTranslation();
  const { isRTL, currentLanguage } = useLanguage();

  const getLanguagePrefix = () => {
    if (currentLanguage.code === 'en') return '';
    return `/${currentLanguage.code}`;
  };

  const bullets = t(`tools.${tool}.popularUseCases.bullets`, { returnObjects: true }) as string[];

  const internalLinks = [
    {
      key: 'resizeSocial',
      icon: Image,
      href: `${getLanguagePrefix()}/resize-for-instagram`,
    },
    {
      key: 'compressShare',
      icon: Share2,
      href: `${getLanguagePrefix()}/compress-for-email`,
    },
    {
      key: 'cropThumbnails',
      icon: Crop,
      href: `${getLanguagePrefix()}/crop-circle`,
    },
  ];

  return (
    <section className="py-12 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className={`space-y-6 ${isRTL ? 'text-right' : ''}`}>
          <h2 className="text-2xl md:text-3xl font-bold">
            {t(`tools.${tool}.popularUseCases.title`)}
          </h2>
          
          <p className="text-muted-foreground leading-relaxed">
            {t(`tools.${tool}.popularUseCases.summary`)}
          </p>

          {Array.isArray(bullets) && bullets.length > 0 && (
            <ul className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${isRTL ? 'text-right' : ''}`}>
              {bullets.map((bullet, index) => (
                <li 
                  key={index} 
                  className={`flex items-start gap-2 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}
                  data-testid={`bullet-usecase-${index}`}
                >
                  <span className="text-primary mt-0.5">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          )}

          <div className={`flex flex-wrap gap-3 pt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {internalLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.key}
                  to={link.href}
                  className={`inline-flex items-center gap-2 text-sm text-primary hover:underline ${isRTL ? 'flex-row-reverse' : ''}`}
                  data-testid={`link-usecase-${link.key}`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{t(`tools.popularUseCases.links.${link.key}`)}</span>
                  <ArrowRight className={`h-3 w-3 ${isRTL ? 'rotate-180' : ''}`} />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
