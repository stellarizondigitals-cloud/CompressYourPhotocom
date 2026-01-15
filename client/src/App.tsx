import { useEffect } from "react";
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
import Compress from "@/pages/Compress";
import Resize from "@/pages/Resize";
import Convert from "@/pages/Convert";
import CropPage from "@/pages/Crop";
import EnhancePage from "@/pages/Enhance";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import HowItWorks from "@/pages/HowItWorks";
import Languages from "@/pages/Languages";
import Terms from "@/pages/Terms";
import CookiePolicy from "@/pages/CookiePolicy";
import Disclaimer from "@/pages/Disclaimer";
import Contact from "@/pages/Contact";
import About from "@/pages/About";
import NotFound from "@/pages/not-found";
import { initAnalytics, trackPageView } from "@/lib/analytics";
import { CookieConsent } from "@/components/CookieConsent";

import CompressJpg from "@/pages/seo/CompressJpg";
import CompressPng from "@/pages/seo/CompressPng";
import ConvertHeicToJpg from "@/pages/seo/ConvertHeicToJpg";
import ResizeForInstagram from "@/pages/seo/ResizeForInstagram";
import ResizeForFacebook from "@/pages/seo/ResizeForFacebook";
import CropCircle from "@/pages/seo/CropCircle";
import ConvertWebpToJpg from "@/pages/seo/ConvertWebpToJpg";
import ResizeForLinkedin from "@/pages/seo/ResizeForLinkedin";
import CompressForEmail from "@/pages/seo/CompressForEmail";
import EnhancePhotoQuality from "@/pages/seo/EnhancePhotoQuality";

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
        ];
      })}
      <Route path="/privacy-policy" element={<Layout><PrivacyPolicy /></Layout>} />
      <Route path="/how-it-works" element={<Layout><HowItWorks /></Layout>} />
      <Route path="/languages" element={<Layout><Languages /></Layout>} />
      <Route path="/terms" element={<Layout><Terms /></Layout>} />
      <Route path="/terms-of-service" element={<Layout><Terms /></Layout>} />
      <Route path="/cookie-policy" element={<Layout><CookiePolicy /></Layout>} />
      <Route path="/disclaimer" element={<Layout><Disclaimer /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
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
