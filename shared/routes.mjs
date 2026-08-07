// Single source of truth for the site's public routes.
//
// Used by BOTH:
//   - client/src/App.tsx        (renders a <Route> for every path listed here)
//   - scripts/generate-sitemap.mjs (writes client/public/sitemap.xml from the same lists)
//
// To add a new public page:
//   1. Add an entry to MULTILINGUAL_PAGES (tool/landing pages served under every
//      language prefix) or SINGLE_PAGES (English-only pages), or BLOG_POSTS.
//   2. Register its component in the pageComponents map in client/src/App.tsx
//      (multilingual/single pages only). App.tsx throws at startup if a path
//      here has no component, so a mismatch is caught immediately in dev.
// The sitemap is regenerated automatically on every build (npm prebuild step),
// so no manual sitemap step is needed.
//
// Plain .mjs (not .ts) so the sitemap script can run it with `node` directly.

export const BASE_URL = 'https://www.compressyourphoto.com';

// Language prefixes; '' / 'en' means the unprefixed English site.
export const LANGS = ['en', 'es', 'pt', 'fr', 'de', 'hi', 'zh-cn', 'ar', 'id'];

// Pages served under every language prefix.
// { path, lastmod, changefreq, enPriority, localizedPriority }
export const MULTILINGUAL_PAGES = [
  { path: '', lastmod: '2026-04-12', changefreq: 'weekly', enPriority: '1.0', localizedPriority: '0.9' }, // home
  { path: '/compress', lastmod: '2026-04-12', changefreq: 'weekly', enPriority: '0.9', localizedPriority: '0.8' },
  { path: '/resize', lastmod: '2026-04-12', changefreq: 'weekly', enPriority: '0.9', localizedPriority: '0.8' },
  { path: '/convert', lastmod: '2026-04-12', changefreq: 'weekly', enPriority: '0.9', localizedPriority: '0.8' },
  { path: '/crop', lastmod: '2026-04-12', changefreq: 'weekly', enPriority: '0.9', localizedPriority: '0.8' },
  { path: '/enhance', lastmod: '2026-04-12', changefreq: 'weekly', enPriority: '0.9', localizedPriority: '0.8' },
  { path: '/remove-background', lastmod: '2026-08-07', changefreq: 'weekly', enPriority: '0.9', localizedPriority: '0.8' },
  { path: '/image-upscaler', lastmod: '2026-08-07', changefreq: 'weekly', enPriority: '0.9', localizedPriority: '0.8' },
  { path: '/image-to-pdf', lastmod: '2026-08-07', changefreq: 'weekly', enPriority: '0.9', localizedPriority: '0.8' },
  { path: '/alt-text-generator', lastmod: '2026-08-07', changefreq: 'monthly', enPriority: '0.8', localizedPriority: '0.7' },
  { path: '/compress-jpg', lastmod: '2026-08-07', changefreq: 'monthly', enPriority: '0.7', localizedPriority: '0.6' },
  { path: '/compress-png', lastmod: '2026-08-07', changefreq: 'monthly', enPriority: '0.7', localizedPriority: '0.6' },
  { path: '/convert-heic-to-jpg', lastmod: '2026-08-07', changefreq: 'monthly', enPriority: '0.7', localizedPriority: '0.6' },
  { path: '/convert-webp-to-jpg', lastmod: '2026-08-07', changefreq: 'monthly', enPriority: '0.7', localizedPriority: '0.6' },
  { path: '/compress-for-email', lastmod: '2026-08-07', changefreq: 'monthly', enPriority: '0.7', localizedPriority: '0.6' },
  { path: '/crop-circle', lastmod: '2026-08-07', changefreq: 'monthly', enPriority: '0.7', localizedPriority: '0.6' },
  { path: '/resize-for-instagram', lastmod: '2026-08-07', changefreq: 'monthly', enPriority: '0.7', localizedPriority: '0.6' },
  { path: '/resize-for-facebook', lastmod: '2026-08-07', changefreq: 'monthly', enPriority: '0.7', localizedPriority: '0.6' },
  { path: '/resize-for-linkedin', lastmod: '2026-08-07', changefreq: 'monthly', enPriority: '0.7', localizedPriority: '0.6' },
  { path: '/enhance-photo-quality', lastmod: '2026-08-07', changefreq: 'monthly', enPriority: '0.7', localizedPriority: '0.6' },
];

// English-only public pages included in the sitemap.
// { path, lastmod, changefreq, priority }
export const SINGLE_PAGES = [
  { path: '/pricing', lastmod: null, changefreq: 'monthly', priority: '0.8' },
  { path: '/recommended-tools', lastmod: '2026-04-12', changefreq: 'monthly', priority: '0.6' },
  { path: '/languages', lastmod: '2026-08-07', changefreq: 'monthly', priority: '0.5' },
  { path: '/how-it-works', lastmod: '2026-01-06', changefreq: 'monthly', priority: '0.7' },
  { path: '/about', lastmod: '2026-01-06', changefreq: 'monthly', priority: '0.6' },
  { path: '/contact', lastmod: '2026-01-06', changefreq: 'monthly', priority: '0.6' },
  { path: '/privacy-policy', lastmod: '2026-01-06', changefreq: 'yearly', priority: '0.4' },
  { path: '/terms', lastmod: '2026-01-06', changefreq: 'yearly', priority: '0.4' },
  { path: '/cookie-policy', lastmod: '2026-01-06', changefreq: 'yearly', priority: '0.4' },
  { path: '/disclaimer', lastmod: '2026-01-06', changefreq: 'yearly', priority: '0.4' },
];

// Blog index + posts. Posts are routed via /blog/:slug in App.tsx, so only
// the sitemap uses the individual entries.
// { path, lastmod, changefreq, priority }
export const BLOG_PAGES = [
  { path: '/blog', lastmod: '2026-04-01', changefreq: 'weekly', priority: '0.8' },
  { path: '/blog/how-to-reduce-photo-file-size', lastmod: '2025-03-28' },
  { path: '/blog/jpg-vs-png-vs-webp-explained', lastmod: '2025-03-20' },
  { path: '/blog/resize-images-for-social-media', lastmod: '2025-03-15' },
  { path: '/blog/what-is-heic-convert-iphone-photos', lastmod: '2025-03-08' },
  { path: '/blog/compress-images-for-email', lastmod: '2025-02-28' },
  { path: '/blog/crop-photos-for-social-media', lastmod: '2025-02-20' },
  { path: '/blog/enhance-photo-quality-online', lastmod: '2025-02-10' },
  { path: '/blog/image-size-website-speed-seo', lastmod: '2026-04-01' },
  { path: '/blog/compress-images-for-whatsapp', lastmod: '2026-04-01' },
  { path: '/blog/convert-heic-to-jpg-windows-mac', lastmod: '2026-04-01' },
  { path: '/blog/resize-photo-for-passport-id', lastmod: '2026-04-01' },
  { path: '/blog/best-image-format-for-websites', lastmod: '2026-04-01' },
];
