import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const allLangCodes = ['en', 'es', 'pt', 'fr', 'de', 'hi', 'zh-cn', 'ar', 'id'];

// Maps URL lang prefix → og:locale value
const ogLocaleMap: Record<string, string> = {
  en: 'en_US',
  es: 'es_ES',
  pt: 'pt_BR',
  fr: 'fr_FR',
  de: 'de_DE',
  hi: 'hi_IN',
  'zh-cn': 'zh_CN',
  ar: 'ar_AR',
  id: 'id_ID',
};

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
  const ogLocale = ogLocaleMap[langFromPath] ?? 'en_US';

  const getPath = (lang: string) => {
    const langPrefix = lang === 'en' ? '' : `/${lang}`;
    const toolPath = tool === 'home' ? '' : `/${tool}`;
    return `${langPrefix}${toolPath}`;
  };

  const canonicalUrl = `https://www.compressyourphoto.com${getPath(langFromPath)}`;

  const getHreflangUrl = (lang: string) =>
    `https://www.compressyourphoto.com${getPath(lang)}`;

  // All alternate locales (for og:locale:alternate)
  const alternateLocales = allLangCodes
    .filter(l => l !== langFromPath)
    .map(l => ogLocaleMap[l]);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph — locale + canonical URL so Google/social can identify language */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content={ogLocale} />
      {alternateLocales.map(locale => (
        <meta key={locale} property="og:locale:alternate" content={locale} />
      ))}

      {/* hreflang — signals language variants to Google */}
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
