import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/hooks/useLanguage';

const allLanguages = ['en', 'es', 'pt', 'fr', 'de', 'hi', 'zh-cn', 'ar', 'id'];

interface ToolPageSEOProps {
  tool: 'compress' | 'resize' | 'convert' | 'crop' | 'enhance' | 'home';
  title: string;
  description: string;
}

export function ToolPageSEO({ tool, title, description }: ToolPageSEOProps) {
  const { currentLanguage } = useLanguage();
  
  const getPath = (lang: string) => {
    const langPrefix = lang === 'en' ? '' : `/${lang}`;
    const toolPath = tool === 'home' ? '' : `/${tool}`;
    return `${langPrefix}${toolPath}`;
  };

  const getCanonicalUrl = () => {
    return `https://www.compressyourphoto.com${getPath(currentLanguage.code)}`;
  };

  const getHreflangUrl = (lang: string) => {
    return `https://www.compressyourphoto.com${getPath(lang)}`;
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={getCanonicalUrl()} />
      
      {allLanguages.map((lang) => (
        <link
          key={lang}
          rel="alternate"
          hrefLang={lang === 'zh-cn' ? 'zh-CN' : lang}
          href={getHreflangUrl(lang)}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={getHreflangUrl('en')} />
    </Helmet>
  );
}
