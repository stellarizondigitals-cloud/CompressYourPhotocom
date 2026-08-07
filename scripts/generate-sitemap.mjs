// Regenerates client/public/sitemap.xml from the route list in client/src/App.tsx.
// Run: node scripts/generate-sitemap.mjs
import { writeFileSync } from 'node:fs';

const BASE = 'https://www.compressyourphoto.com';
const langs = ['en', 'es', 'pt', 'fr', 'de', 'hi', 'zh-cn', 'ar', 'id'];
const hreflangOf = (l) => (l === 'zh-cn' ? 'zh-CN' : l);
const urlOf = (lang, path) => `${BASE}${lang === 'en' ? '' : `/${lang}`}${path}`;

// Multilingual pages: [path, lastmod, changefreq, enPriority, localizedPriority]
const multilingual = [
  ['', '2026-04-12', 'weekly', '1.0', '0.9'], // home
  ['/compress', '2026-04-12', 'weekly', '0.9', '0.8'],
  ['/resize', '2026-04-12', 'weekly', '0.9', '0.8'],
  ['/convert', '2026-04-12', 'weekly', '0.9', '0.8'],
  ['/crop', '2026-04-12', 'weekly', '0.9', '0.8'],
  ['/enhance', '2026-04-12', 'weekly', '0.9', '0.8'],
  ['/remove-background', '2026-08-07', 'weekly', '0.9', '0.8'],
  ['/image-upscaler', '2026-08-07', 'weekly', '0.9', '0.8'],
  ['/image-to-pdf', '2026-08-07', 'weekly', '0.9', '0.8'],
  ['/alt-text-generator', '2026-08-07', 'monthly', '0.8', '0.7'],
  ['/compress-jpg', '2026-08-07', 'monthly', '0.7', '0.6'],
  ['/compress-png', '2026-08-07', 'monthly', '0.7', '0.6'],
  ['/convert-heic-to-jpg', '2026-08-07', 'monthly', '0.7', '0.6'],
  ['/convert-webp-to-jpg', '2026-08-07', 'monthly', '0.7', '0.6'],
  ['/compress-for-email', '2026-08-07', 'monthly', '0.7', '0.6'],
  ['/crop-circle', '2026-08-07', 'monthly', '0.7', '0.6'],
  ['/resize-for-instagram', '2026-08-07', 'monthly', '0.7', '0.6'],
  ['/resize-for-facebook', '2026-08-07', 'monthly', '0.7', '0.6'],
  ['/resize-for-linkedin', '2026-08-07', 'monthly', '0.7', '0.6'],
  ['/enhance-photo-quality', '2026-08-07', 'monthly', '0.7', '0.6'],
];

// Single-language (English-only) pages: [path, lastmod, changefreq, priority]
const single = [
  ['/pricing', null, 'monthly', '0.8'],
  ['/recommended-tools', '2026-04-12', 'monthly', '0.6'],
  ['/languages', '2026-08-07', 'monthly', '0.5'],
  ['/how-it-works', '2026-01-06', 'monthly', '0.7'],
  ['/about', '2026-01-06', 'monthly', '0.6'],
  ['/contact', '2026-01-06', 'monthly', '0.6'],
  ['/privacy-policy', '2026-01-06', 'yearly', '0.4'],
  ['/terms', '2026-01-06', 'yearly', '0.4'],
  ['/cookie-policy', '2026-01-06', 'yearly', '0.4'],
  ['/disclaimer', '2026-01-06', 'yearly', '0.4'],
];

const blog = [
  ['/blog', '2026-04-01', 'weekly', '0.8'],
  ['/blog/how-to-reduce-photo-file-size', '2025-03-28'],
  ['/blog/jpg-vs-png-vs-webp-explained', '2025-03-20'],
  ['/blog/resize-images-for-social-media', '2025-03-15'],
  ['/blog/what-is-heic-convert-iphone-photos', '2025-03-08'],
  ['/blog/compress-images-for-email', '2025-02-28'],
  ['/blog/crop-photos-for-social-media', '2025-02-20'],
  ['/blog/enhance-photo-quality-online', '2025-02-10'],
  ['/blog/image-size-website-speed-seo', '2026-04-01'],
  ['/blog/compress-images-for-whatsapp', '2026-04-01'],
  ['/blog/convert-heic-to-jpg-windows-mac', '2026-04-01'],
  ['/blog/resize-photo-for-passport-id', '2026-04-01'],
  ['/blog/best-image-format-for-websites', '2026-04-01'],
];

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
for (const [path, lastmod, cf, pr] of single) pushUrl(`${BASE}${path}`, lastmod, cf, pr);

lines.push('');
lines.push('  <!-- ===== BLOG ===== -->');
for (const [path, lastmod, cf = 'monthly', pr = '0.7'] of blog) pushUrl(`${BASE}${path}`, lastmod, cf, pr);

lines.push('');
lines.push('  <!-- ===== MULTILINGUAL PAGES (with hreflang alternates) ===== -->');
for (const [path, lastmod, cf, enPr, locPr] of multilingual) {
  lines.push('');
  lines.push(`  <!-- ${path === '' ? 'HOME' : path.slice(1).toUpperCase()} -->`);
  const alternates = [
    ...langs.map((l) => [hreflangOf(l), urlOf(l, path === '' && l === 'en' ? '/' : path)]),
    ['x-default', urlOf('en', path === '' ? '/' : path)],
  ];
  for (const lang of langs) {
    const loc = path === '' && lang === 'en' ? `${BASE}/` : urlOf(lang, path);
    pushUrl(loc, lastmod, cf, lang === 'en' ? enPr : locPr, alternates);
  }
}

lines.push('</urlset>');
lines.push('');
writeFileSync(new URL('../client/public/sitemap.xml', import.meta.url), lines.join('\n'));
console.log(`Wrote sitemap with ${(lines.join('\n').match(/<url>/g) || []).length} URLs`);
