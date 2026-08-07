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

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
    <Routes>
      {languages.map((lang) => {
        const prefix = lang ? `/${lang}` : '';
        return [
          <Route key={`${lang}-home`} path={prefix || '/'} element={<Layout><Home /></Layout>} />,
          <Route key={`${lang}-compress`} path={`${prefix}/compress`} element={<Layout><Compress /></Layout>} />,
          <Route key={`${lang}-resize`} path={`${prefix}/resize`} element={<Layout><Resize /></Layout>} />,
          <Route key={`${lang}-convert`} path={`${prefix}/convert`} element={<Layout><Convert /></Layout>} />,
          <Route key={`${lang}-crop`} path={`${prefix}/crop`} element={<Layout><CropPage /></Layout>} />,
          <Route key={`${lang}-enhance`} path={`${prefix}/enhance`} element={<Layout><EnhancePage /></Layout>} />,
          <Route key={`${lang}-compress-jpg`} path={`${prefix}/compress-jpg`} element={<Layout><CompressJpg /></Layout>} />,
          <Route key={`${lang}-compress-png`} path={`${prefix}/compress-png`} element={<Layout><CompressPng /></Layout>} />,
          <Route key={`${lang}-convert-heic-to-jpg`} path={`${prefix}/convert-heic-to-jpg`} element={<Layout><ConvertHeicToJpg /></Layout>} />,
          <Route key={`${lang}-resize-for-instagram`} path={`${prefix}/resize-for-instagram`} element={<Layout><ResizeForInstagram /></Layout>} />,
          <Route key={`${lang}-resize-for-facebook`} path={`${prefix}/resize-for-facebook`} element={<Layout><ResizeForFacebook /></Layout>} />,
          <Route key={`${lang}-crop-circle`} path={`${prefix}/crop-circle`} element={<Layout><CropCircle /></Layout>} />,
          <Route key={`${lang}-convert-webp-to-jpg`} path={`${prefix}/convert-webp-to-jpg`} element={<Layout><ConvertWebpToJpg /></Layout>} />,
          <Route key={`${lang}-resize-for-linkedin`} path={`${prefix}/resize-for-linkedin`} element={<Layout><ResizeForLinkedin /></Layout>} />,
          <Route key={`${lang}-compress-for-email`} path={`${prefix}/compress-for-email`} element={<Layout><CompressForEmail /></Layout>} />,
          <Route key={`${lang}-enhance-photo-quality`} path={`${prefix}/enhance-photo-quality`} element={<Layout><EnhancePhotoQuality /></Layout>} />,
          <Route key={`${lang}-remove-background`} path={`${prefix}/remove-background`} element={<Layout><RemoveBackground /></Layout>} />,
          <Route key={`${lang}-alt-text-generator`} path={`${prefix}/alt-text-generator`} element={<Layout><AltTextGenerator /></Layout>} />,
          <Route key={`${lang}-image-upscaler`} path={`${prefix}/image-upscaler`} element={<Layout><ImageUpscaler /></Layout>} />,
          <Route key={`${lang}-image-to-pdf`} path={`${prefix}/image-to-pdf`} element={<Layout><ImageToPdf /></Layout>} />,
        ];
      })}
      <Route path="/blog" element={<Layout><BlogIndex /></Layout>} />
      <Route path="/blog/:slug" element={<Layout><BlogPost /></Layout>} />
      <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
      <Route path="/recommended-tools" element={<Layout><RecommendedTools /></Layout>} />
      <Route path="/privacy-policy" element={<Layout><PrivacyPolicy /></Layout>} />
      <Route path="/how-it-works" element={<Layout><HowItWorks /></Layout>} />
      <Route path="/languages" element={<Layout><Languages /></Layout>} />
      <Route path="/terms" element={<Layout><Terms /></Layout>} />
      <Route path="/terms-of-service" element={<Layout><Terms /></Layout>} />
      <Route path="/cookie-policy" element={<Layout><CookiePolicy /></Layout>} />
      <Route path="/disclaimer" element={<Layout><Disclaimer /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
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
