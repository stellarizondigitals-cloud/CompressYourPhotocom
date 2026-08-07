// Regenerates client/public/sitemap.xml from the shared route list in shared/routes.mjs.
// Runs automatically before every build (npm "prebuild" script).
// Manual run: node scripts/generate-sitemap.mjs
import { writeFileSync } from 'node:fs';
import {
  BASE_URL as BASE,
  LANGS as langs,
  MULTILINGUAL_PAGES,
  SINGLE_PAGES,
  BLOG_PAGES,
} from '../shared/routes.mjs';

const hreflangOf = (l) => (l === 'zh-cn' ? 'zh-CN' : l);
const urlOf = (lang, path) => `${BASE}${lang === 'en' ? '' : `/${lang}`}${path}`;

const lines = [];
lines.push('<?xml version="1.0" encoding="UTF-8"?>');
lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
lines.push('        xmlns:xhtml="http://www.w3.org/1999/xhtml">');

function pushUrl(loc, lastmod, changefreq, priority, alternates) {
  lines.push('  <url>');
  lines.push(`    <loc>${loc}</loc>`);
  if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`);
  lines.push(`    <changefreq>${changefreq}</changefreq>`);
  lines.push(`    <priority>${priority}</priority>`);
  if (alternates) {
    for (const [hl, href] of alternates) {
      lines.push(`    <xhtml:link rel="alternate" hreflang="${hl}" href="${href}"/>`);
    }
  }
  lines.push('  </url>');
}

lines.push('');
lines.push('  <!-- ===== SINGLE-LANGUAGE PAGES ===== -->');
for (const { path, lastmod, changefreq, priority } of SINGLE_PAGES) {
  pushUrl(`${BASE}${path}`, lastmod, changefreq, priority);
}

lines.push('');
lines.push('  <!-- ===== BLOG ===== -->');
for (const { path, lastmod, changefreq = 'monthly', priority = '0.7' } of BLOG_PAGES) {
  pushUrl(`${BASE}${path}`, lastmod, changefreq, priority);
}

lines.push('');
lines.push('  <!-- ===== MULTILINGUAL PAGES (with hreflang alternates) ===== -->');
for (const { path, lastmod, changefreq, enPriority, localizedPriority } of MULTILINGUAL_PAGES) {
  lines.push('');
  lines.push(`  <!-- ${path === '' ? 'HOME' : path.slice(1).toUpperCase()} -->`);
  const alternates = [
    ...langs.map((l) => [hreflangOf(l), urlOf(l, path === '' && l === 'en' ? '/' : path)]),
    ['x-default', urlOf('en', path === '' ? '/' : path)],
  ];
  for (const lang of langs) {
    const loc = path === '' && lang === 'en' ? `${BASE}/` : urlOf(lang, path);
    pushUrl(loc, lastmod, changefreq, lang === 'en' ? enPriority : localizedPriority, alternates);
  }
}

lines.push('</urlset>');
lines.push('');
writeFileSync(new URL('../client/public/sitemap.xml', import.meta.url), lines.join('\n'));
console.log(`Wrote sitemap with ${(lines.join('\n').match(/<url>/g) || []).length} URLs`);
