import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';

interface AboutToolProps {
  tool: 'compress' | 'resize' | 'convert' | 'crop' | 'enhance';
}

export function AboutTool({ tool }: AboutToolProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <section className="py-12 px-4 md:px-8 bg-muted/30">
      <div className="max-w-3xl mx-auto">
        <h2 className={`text-xl font-semibold mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t(`tools.${tool}.aboutTitle`, `About This ${tool.charAt(0).toUpperCase() + tool.slice(1)} Tool`)}
        </h2>
        <div className={`prose prose-sm max-w-none text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
          <p data-testid={`text-about-${tool}`}>
            {t(`tools.${tool}.aboutContent`)}
          </p>
        </div>
      </div>
    </section>
  );
}
