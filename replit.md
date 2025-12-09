# CompressYourPhoto

## Overview

CompressYourPhoto is a client-side image compression web application that allows users to compress photos directly in their browser without uploading files to any server. The application supports multiple image formats (JPG, PNG, WebP, HEIC, GIF) and provides compression controls including quality adjustment, resizing, and output format conversion. All processing happens locally for maximum privacy.

The project follows a monorepo structure with a React frontend and Express backend, though the core compression functionality is entirely client-side.

## User Preferences

Preferred communication style: Simple, everyday language.

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