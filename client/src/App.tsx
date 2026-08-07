import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Home from "@/pages/Home";
import { initAnalytics, trackPageView } from "@/lib/analytics";
import { CookieConsent } from "@/components/CookieConsent";
// Single source of truth for public routes — also drives scripts/generate-sitemap.mjs,
// so adding a page there automatically lands it in the sitemap on the next build.
// @ts-ignore - plain .mjs data module shared with the sitemap script
import { MULTILINGUAL_PAGES, SINGLE_PAGES } from "@shared/routes.mjs";

// Route-level code splitting: each page loads its own JS chunk on demand,
// keeping the initial bundle small (faster first paint = better SEO + UX).
const Compress = lazy(() => import("@/pages/Compress"));
const Resize = lazy(() => import("@/pages/Resize"));
const Convert = lazy(() => import("@/pages/Convert"));
const CropPage = lazy(() => import("@/pages/Crop"));
const EnhancePage = lazy(() => import("@/pages/Enhance"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const HowItWorks = lazy(() => import("@/pages/HowItWorks"));
const Languages = lazy(() => import("@/pages/Languages"));
const Terms = lazy(() => import("@/pages/Terms"));
const CookiePolicy = lazy(() => import("@/pages/CookiePolicy"));
const Disclaimer = lazy(() => import("@/pages/Disclaimer"));
const Contact = lazy(() => import("@/pages/Contact"));
const About = lazy(() => import("@/pages/About"));
const NotFound = lazy(() => import("@/pages/not-found"));
const Account = lazy(() => import("@/pages/Account"));
const AuthCallback = lazy(() => import("@/pages/AuthCallback"));
const BlogIndex = lazy(() => import("@/pages/blog/BlogIndex"));
const BlogPost = lazy(() => import("@/pages/blog/BlogPost"));
const CompressJpg = lazy(() => import("@/pages/seo/CompressJpg"));
const CompressPng = lazy(() => import("@/pages/seo/CompressPng"));
const ConvertHeicToJpg = lazy(() => import("@/pages/seo/ConvertHeicToJpg"));
const ResizeForInstagram = lazy(() => import("@/pages/seo/ResizeForInstagram"));
const ResizeForFacebook = lazy(() => import("@/pages/seo/ResizeForFacebook"));
const CropCircle = lazy(() => import("@/pages/seo/CropCircle"));
const ConvertWebpToJpg = lazy(() => import("@/pages/seo/ConvertWebpToJpg"));
const ResizeForLinkedin = lazy(() => import("@/pages/seo/ResizeForLinkedin"));
const CompressForEmail = lazy(() => import("@/pages/seo/CompressForEmail"));
const EnhancePhotoQuality = lazy(() => import("@/pages/seo/EnhancePhotoQuality"));

const CompressForWhatsapp = lazy(() => import("@/pages/seo/CompressForWhatsapp"));
const ConvertPngToWebp = lazy(() => import("@/pages/seo/ConvertPngToWebp"));
const ConvertJpgToPng = lazy(() => import("@/pages/seo/ConvertJpgToPng"));
const ResizeForYoutube = lazy(() => import("@/pages/seo/ResizeForYoutube"));
const ResizeForTiktok = lazy(() => import("@/pages/seo/ResizeForTiktok"));
const ResizePassportPhoto = lazy(() => import("@/pages/seo/ResizePassportPhoto"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const RemoveBackground = lazy(() => import("@/pages/RemoveBackground"));
const AltTextGenerator = lazy(() => import("@/pages/AltTextGenerator"));
const RecommendedTools = lazy(() => import("@/pages/RecommendedTools"));
const ImageUpscaler = lazy(() => import("@/pages/ImageUpscaler"));
const ImageToPdf = lazy(() => import("@/pages/ImageToPdf"));

function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center py-24" aria-busy="true">
      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    initAnalytics(import.meta.env.VITE_GA_MEASUREMENT_ID);
  }, []);

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  return null;
}

const languages = ['', 'es', 'pt', 'fr', 'de', 'hi', 'zh-cn', 'ar', 'id'];

// Map each shared route path to its page component. When you add a page to
// shared/routes.mjs it MUST be registered here (the check below throws in dev
// if it's missing), and the sitemap picks it up automatically at build time.
const multilingualComponents: Record<string, React.ComponentType> = {
  '': Home,
  '/compress': Compress,
  '/resize': Resize,
  '/convert': Convert,
  '/crop': CropPage,
  '/enhance': EnhancePage,
  '/compress-jpg': CompressJpg,
  '/compress-png': CompressPng,
  '/convert-heic-to-jpg': ConvertHeicToJpg,
  '/resize-for-instagram': ResizeForInstagram,
  '/resize-for-facebook': ResizeForFacebook,
  '/crop-circle': CropCircle,
  '/convert-webp-to-jpg': ConvertWebpToJpg,
  '/resize-for-linkedin': ResizeForLinkedin,
  '/compress-for-email': CompressForEmail,
  '/enhance-photo-quality': EnhancePhotoQuality,
  '/compress-for-whatsapp': CompressForWhatsapp,
  '/convert-png-to-webp': ConvertPngToWebp,
  '/convert-jpg-to-png': ConvertJpgToPng,
  '/resize-for-youtube': ResizeForYoutube,
  '/resize-for-tiktok': ResizeForTiktok,
  '/resize-passport-photo': ResizePassportPhoto,
  '/remove-background': RemoveBackground,
  '/alt-text-generator': AltTextGenerator,
  '/image-upscaler': ImageUpscaler,
  '/image-to-pdf': ImageToPdf,
};

const singleComponents: Record<string, React.ComponentType> = {
  '/pricing': Pricing,
  '/recommended-tools': RecommendedTools,
  '/languages': Languages,
  '/how-it-works': HowItWorks,
  '/about': About,
  '/contact': Contact,
  '/privacy-policy': PrivacyPolicy,
  '/terms': Terms,
  '/cookie-policy': CookiePolicy,
  '/disclaimer': Disclaimer,
};

// Fail loudly (in dev console) if the shared route list and the component maps drift.
for (const { path } of MULTILINGUAL_PAGES as { path: string }[]) {
  if (!multilingualComponents[path]) {
    throw new Error(`shared/routes.mjs lists multilingual page "${path}" but App.tsx has no component for it`);
  }
}
for (const { path } of SINGLE_PAGES as { path: string }[]) {
  if (!singleComponents[path]) {
    throw new Error(`shared/routes.mjs lists single page "${path}" but App.tsx has no component for it`);
  }
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
    <Routes>
      {languages.map((lang) => {
        const prefix = lang ? `/${lang}` : '';
        return (MULTILINGUAL_PAGES as { path: string }[]).map(({ path }) => {
          const Page = multilingualComponents[path];
          const routePath = path === '' ? (prefix || '/') : `${prefix}${path}`;
          return (
            <Route
              key={`${lang}-${path || 'home'}`}
              path={routePath}
              element={<Layout><Page /></Layout>}
            />
          );
        });
      })}
      {(SINGLE_PAGES as { path: string }[]).map(({ path }) => {
        const Page = singleComponents[path];
        return <Route key={path} path={path} element={<Layout><Page /></Layout>} />;
      })}
      <Route path="/blog" element={<Layout><BlogIndex /></Layout>} />
      <Route path="/blog/:slug" element={<Layout><BlogPost /></Layout>} />
      <Route path="/terms-of-service" element={<Layout><Terms /></Layout>} />
      <Route path="/account" element={<Layout><Account /></Layout>} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <BrowserRouter>
              <AnalyticsTracker />
              <AppRoutes />
              <CookieConsent />
              <Toaster />
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
