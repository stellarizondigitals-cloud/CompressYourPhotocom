# CompressYourPhoto

## Overview

CompressYourPhoto is a client-side image compression web application that allows users to compress photos directly in their browser without uploading files to any server. The application supports multiple image formats (JPG, PNG, WebP, HEIC, GIF) and provides compression controls including quality adjustment, resizing, and output format conversion. All processing happens locally for maximum privacy.

The project follows a monorepo structure with a React frontend and Express backend, though the core compression functionality is entirely client-side.

## User Preferences

Preferred communication style: Simple, everyday language.

### Deployment Workflow
- **NEVER suggest Replit publish/deploy** - User deploys via Git + Vercel auto-deploy (free tier)
- Git commits auto-sync to repository → Vercel auto-deploys → Live at compressyourphoto.com
- **Maximize cost efficiency** - Be concise, batch operations, minimize back-and-forth

### Domain & Hosting
- **Domain Registrar**: IONOS (all domains purchased from IONOS)
- **Production Hosting**: Vercel (free tier)
- **Domain**: compressyourphoto.com (and www.compressyourphoto.com)
- **Company**: Stellarizon Digitals Ltd (Company No. 16748429, England and Wales)

## Key Features Added (April 2026)
- **Background Remover** (`/remove-background`) — AI-powered client-side background removal using @imgly/background-removal (WebAssembly). 3 free removals per session, unlimited for Pro. Transparent PNG output. Added to homepage, header nav ("Remove BG"), footer, sitemap. PremiumModal now uses correct `open`/`onOpenChange` props. Error state shows red banner + "Try Again" button; errors stored in `errorMsg` state separate from `statusMsg`.
- **Stripe Customer Portal** — `/api/create-portal-session` endpoint looks up customer by email and creates a Stripe Billing Portal session. "Manage Subscription / Cancel" button shown on Account page for monthly Pro subscribers.
- **AI Alt Text Generator** (`/alt-text-generator`) — Pro feature (1 free try per session). Gemini Vision API (tries `gemini-2.5-flash` with `thinkingBudget:0` first → `gemini-2.0-flash-lite` → `gemini-2.0-flash`) generates 3 SEO-optimised alt text variants + expert tips in ~2s. Client-side canvas resize to max 900px JPEG. Dev: Express `POST /api/generate-alt-text`. **Production: Vercel serverless function at `api/generate-alt-text.ts`** (requires `GEMINI_API_KEY` in Vercel env vars). 2 AdBanner slots.
- **Background Remover CDN fix** — `publicPath` corrected to `https://staticimgly.com/@imgly/background-removal-data/1.7.0/dist/` (was wrong jsDelivr URL). `vercel.json` CSP updated to allow `staticimgly.com` in `connect-src`, added `wasm-unsafe-eval` to `script-src`, `worker-src 'self' blob:`. SPA rewrite updated to `/((?!api/).*)` so Vercel API routes are not swallowed.
- **Image thumbnails in file lists** — Compress, Resize, Convert tools now show 48×48px thumbnail previews with status badge overlay in the Results list. `previewUrl` created via `URL.createObjectURL` on file add, revoked on file remove/clear.
- **Image Upscaler** (`/image-upscaler`) — Canvas-based upscaling + unsharp mask sharpening. Free: 3 session uses at 2× only. Pro: unlimited, 2×/4×/8×. Before/after comparison slider. 3 ad slots, full SEO + structured data. `sessionStorage` tracks `upscaler_used`.
- **Image to PDF** (`/image-to-pdf`) — Two-tab tool: Images→PDF (pdf-lib; free: 5 images, Pro: unlimited) and PDF→Images (pdfjs-dist CDN worker; free: 3 pages, Pro: unlimited). Page size selector, drag-reorder. 3 ad slots, full SEO.
- **Billing model updated** — week_pass = Stripe subscription with 7-day trial + £0.99 upfront invoice item; auto-bills £1.99/month after trial. Webhook handles `checkout.session.completed`, `customer.subscription.trial_will_end` (3-day reminder email via Resend), `customer.subscription.deleted` (revokes Pro).
- **Nav & Footer updated** — Image Upscaler and Image to PDF added to Header nav dropdown and mobile menu, Footer links, sitemap.xml. Header label fallback now properly capitalises hyphenated keys.
- **Homepage refreshed** — 9-tool grid (5 cols), updated hero subheadline, pricing copy updated ("9 tools", "7-day trial £0.99 → £1.99/month"), FAQ updated with upscaler/PDF/trial questions, 4 total AdBanner slots (after hero, after features, after pricing, after FAQ), updated Helmet meta + structured data.

## Key Features Added (April 2025)
- **Blog section** (`/blog`, `/blog/:slug`) — 8 full articles on compression, resizing, converting, cropping, enhancing, image formats, social media sizing, and SEO/performance. Linked from header nav and footer.
- **HowToUse component** — Step-by-step guides with Pro Tips added to all 5 tool pages (Compress, Resize, Convert, Crop, Enhance)
- **AdBanner component** — AdSense `<ins>` wrapper (ca-pub-1318056567034683) placed on all tool pages, ready to serve ads when approved
- **ads.txt** — Already correct at `client/public/ads.txt`
- **Sitemap** — Blog URLs added for all 8 articles + blog index

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: React Router DOM for client-side navigation with language-based routes (/, /es, /pt, /fr, /de, /hi, /zh-cn, /ar)
- **State Management**: TanStack React Query for server state, React hooks for local state
- **Styling**: Tailwind CSS with custom design tokens defined in CSS variables
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Internationalization**: i18next with browser language detection and 8 supported languages including RTL support for Arabic

### Client-Side Image Processing
- **Compression Library**: browser-image-compression for client-side image processing
- **ZIP Creation**: JSZip for bundling multiple compressed images
- **Supported Formats**: JPEG, PNG, WebP, HEIC, GIF
- **Features**: Quality slider (0.1-1.0), max width resizing, output format conversion

### Backend Architecture
- **Runtime**: Node.js with Express
- **Purpose**: Primarily serves static files; the compression logic runs entirely client-side
- **Build Tool**: Vite for development with HMR, esbuild for production bundling
- **Database ORM**: Drizzle ORM configured for PostgreSQL (minimal usage - user schema exists but compression is client-side)

### Project Structure
```
client/           # React frontend application
  src/
    components/   # UI components including ImageCompressor
    hooks/        # Custom React hooks (useLanguage, use-mobile)
    i18n/         # Internationalization config and locale files
    pages/        # Page components (Home, not-found)
    lib/          # Utilities and query client
server/           # Express backend
shared/           # Shared types and database schema
```

### Design Patterns
- **Component Architecture**: Functional components with hooks, composition via compound components
- **Styling Approach**: Utility-first CSS with Tailwind, CSS custom properties for theming
- **Type Safety**: Full TypeScript coverage across frontend and backend
- **Path Aliases**: @/ for client/src, @shared/ for shared directory

## External Dependencies

### Core Libraries
- **browser-image-compression**: Client-side image compression engine
- **jszip**: ZIP file creation for batch downloads
- **i18next + react-i18next**: Internationalization framework
- **@tanstack/react-query**: Data fetching and caching

### UI Framework
- **Radix UI**: Accessible component primitives (dialog, dropdown, select, slider, etc.)
- **shadcn/ui**: Pre-built component library using Radix
- **lucide-react**: Icon library
- **class-variance-authority + clsx + tailwind-merge**: Styling utilities

### Database (configured but minimally used)
- **drizzle-orm**: SQL ORM for PostgreSQL
- **drizzle-kit**: Database migration tooling
- **PostgreSQL**: Database (requires DATABASE_URL environment variable)

### Development Tools
- **Vite**: Frontend build tool and dev server
- **esbuild**: Production server bundling
- **TypeScript**: Type checking across the project

### Build Configuration
- Development: `npm run dev` runs tsx for server with Vite middleware
- Production: `npm run build` creates dist/public for frontend, dist/index.cjs for server
- Database: `npm run db:push` applies schema changes via Drizzle Kit