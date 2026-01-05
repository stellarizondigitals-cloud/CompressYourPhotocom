import { useTranslation } from 'react-i18next';
import { Cloud, ImageIcon, Code } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

const tools = [
  {
    id: 'backup',
    icon: Cloud,
    titleKey: 'recommendedTools.backup.title',
    descriptionKey: 'recommendedTools.backup.description',
    buttonKey: 'recommendedTools.backup.button',
    href: '#'
  },
  {
    id: 'editor',
    icon: ImageIcon,
    titleKey: 'recommendedTools.editor.title',
    descriptionKey: 'recommendedTools.editor.description',
    buttonKey: 'recommendedTools.editor.button',
    href: '#'
  },
  {
    id: 'developer',
    icon: Code,
    titleKey: 'recommendedTools.developer.title',
    descriptionKey: 'recommendedTools.developer.description',
    buttonKey: 'recommendedTools.developer.button',
    href: '#'
  }
];

export function RecommendedTools() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <section className="py-16 md:py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-10 ${isRTL ? 'text-right md:text-center' : ''}`}>
          <h2 className="text-2xl md:text-3xl font-bold mb-3" data-testid="heading-recommended-tools">
            {t('recommendedTools.title')}
          </h2>
          <div className="bg-muted/50 border rounded-md p-3 max-w-2xl mx-auto" data-testid="text-affiliate-disclosure">
            <p className="text-sm text-muted-foreground">
              {t('recommendedTools.subtitle')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Card key={tool.id} className="flex flex-col" data-testid={`card-tool-${tool.id}`}>
              <CardHeader className="flex-1">
                <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="p-2 rounded-md bg-primary/10">
                    <tool.icon className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{t(tool.titleKey)}</CardTitle>
                </div>
                <CardDescription>{t(tool.descriptionKey)}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  variant="outline"
                  asChild
                  className="w-full"
                  data-testid={`button-tool-${tool.id}`}
                >
                  <a href={tool.href} target="_blank" rel="noopener noreferrer">
                    {t(tool.buttonKey)}
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
