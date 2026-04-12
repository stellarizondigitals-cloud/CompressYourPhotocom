import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const allLangCodes = ['en', 'es', 'pt', 'fr', 'de', 'hi', 'zh-cn', 'ar', 'id'];

interface ToolPageSEOProps {
  tool: 'compress' | 'resize' | 'convert' | 'crop' | 'enhance' | 'home';
  title: string;
  description: string;
}

export function ToolPageSEO({ tool, title, description }: ToolPageSEOProps) {
  const location = useLocation();

  // Derive language directly from the URL path to avoid i18n state race conditions.
  // Without this, the canonical on /fr/convert points to /convert (English),
  // causing Google to treat non-English pages as duplicates and not index them.
  const pathSegment = location.pathname.split('/')[1];
  const langFromPath = allLangCodes.find(l => l === pathSegment) || 'en';

  const getPath = (lang: string) => {
    const langPrefix = lang === 'en' ? '' : `/${lang}`;
    const toolPath = tool === 'home' ? '' : `/${tool}`;
    return `${langPrefix}${toolPath}`;
  };

  const canonicalUrl = `https://www.compressyourphoto.com${getPath(langFromPath)}`;

  const getHreflangUrl = (lang: string) =>
    `https://www.compressyourphoto.com${getPath(lang)}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {allLangCodes.map((lang) => (
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
