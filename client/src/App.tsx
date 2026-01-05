import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Home from "@/pages/Home";
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

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/es" element={<Layout><Home /></Layout>} />
      <Route path="/pt" element={<Layout><Home /></Layout>} />
      <Route path="/fr" element={<Layout><Home /></Layout>} />
      <Route path="/de" element={<Layout><Home /></Layout>} />
      <Route path="/hi" element={<Layout><Home /></Layout>} />
      <Route path="/zh-cn" element={<Layout><Home /></Layout>} />
      <Route path="/ar" element={<Layout><Home /></Layout>} />
      <Route path="/privacy-policy" element={<Layout><PrivacyPolicy /></Layout>} />
      <Route path="/how-it-works" element={<Layout><HowItWorks /></Layout>} />
      <Route path="/languages" element={<Layout><Languages /></Layout>} />
      <Route path="/terms" element={<Layout><Terms /></Layout>} />
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
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AnalyticsTracker />
          <AppRoutes />
          <CookieConsent />
          <Toaster />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
