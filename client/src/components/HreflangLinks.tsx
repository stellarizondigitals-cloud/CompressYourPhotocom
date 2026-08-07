import { Helmet } from 'react-helmet-async';

const allLangCodes = ['en', 'es', 'pt', 'fr', 'de', 'hi', 'zh-cn', 'ar', 'id'];

const BASE = 'https://www.compressyourphoto.com';

/**
 * Emits hreflang alternate <link> tags for a localized page.
 * `pagePath` is the language-neutral path, e.g. "/remove-background".
 * Mirrors the URL scheme used by ToolPageSEO and the sitemap.
 */
export function HreflangLinks({ pagePath }: { pagePath: string }) {
  const url = (lang: string) =>
    `${BASE}${lang === 'en' ? '' : `/${lang}`}${pagePath}`;

  return (
    <Helmet>
      {allLangCodes.map((lang) => (
        <link
          key={lang}
          rel="alternate"
          hrefLang={lang === 'zh-cn' ? 'zh-CN' : lang}
          href={url(lang)}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={url('en')} />
    </Helmet>
  );
}
