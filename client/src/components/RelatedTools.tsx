import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { Minimize2, Maximize2, RefreshCw, Crop, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const tools = [
  { id: 'compress', icon: Minimize2 },
  { id: 'resize', icon: Maximize2 },
  { id: 'convert', icon: RefreshCw },
  { id: 'crop', icon: Crop },
  { id: 'enhance', icon: Sparkles },
] as const;

interface RelatedToolsProps {
  currentTool: 'compress' | 'resize' | 'convert' | 'crop' | 'enhance';
}

export function RelatedTools({ currentTool }: RelatedToolsProps) {
  const { t } = useTranslation();
  const { currentLanguage, isRTL } = useLanguage();
  
  const getToolPath = (toolId: string) => {
    const langPrefix = currentLanguage.code === 'en' ? '' : `/${currentLanguage.code}`;
    return `${langPrefix}/${toolId}`;
  };

  const relatedTools = tools.filter(tool => tool.id !== currentTool);

  return (
    <section className="py-12 px-4 md:px-8 border-t">
      <div className="max-w-4xl mx-auto">
        <h2 className={`text-xl font-semibold mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('relatedTools.title', 'Related Tools')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {relatedTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                to={getToolPath(tool.id)}
                data-testid={`link-related-${tool.id}`}
              >
                <Card className="hover-elevate h-full">
                  <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                    <Icon className="w-6 h-6 text-primary" />
                    <span className="text-sm font-medium">
                      {t(`tools.${tool.id}.cardTitle`)}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
