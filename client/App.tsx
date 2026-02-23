import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
// import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminProvider } from "@/context/AdminContext";
import { SoundProvider } from "@/context/SoundContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Preloader } from "@/components/ui/Preloader";
import { ScrollSpy } from "@/components/ui/ScrollSpy";
import { SEOMetadata } from "@/components/site/SEOMetadata";
import Index from "./pages/Index";
import CaseStudy from "./pages/CaseStudy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AdminProvider>
          <LanguageProvider>
            <SoundProvider>
              <SEOMetadata />
              <Preloader />
              <CustomCursor />
              <ScrollSpy />
              <Toaster />
              {/* <Sonner /> */}
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/case-study" element={<CaseStudy />} />
                <Route path="/terms" element={<Terms />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SoundProvider>
          </LanguageProvider>
        </AdminProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Guard root creation to avoid calling createRoot multiple times during HMR
const container = document.getElementById("root")!;
const anyWindow = window as any;
if (!anyWindow.__APP_ROOT) {
  anyWindow.__APP_ROOT = createRoot(container);
}
anyWindow.__APP_ROOT.render(<App />);
