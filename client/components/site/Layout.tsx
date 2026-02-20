import { PropsWithChildren, useEffect, useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CommandPalette } from "./CommandPalette";
import { MobileDock } from "./MobileDock";
import { RecruitForm } from "./RecruitForm";
import { useAdmin } from "@/context/AdminContext";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

export function Layout({ children }: PropsWithChildren) {
  const { adminOpen } = useAdmin();
  const [recruitOpen, setRecruitOpen] = useState(false);
  const location = useLocation();

  // Scroll to hash on initial load for deep links
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          const headerOffset = 72;
          const rect = el.getBoundingClientRect();
          const offsetTop = rect.top + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetTop, behavior: "smooth" });
        }
      }, 0);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <CommandPalette />
      
      {/* Warp Speed Transition Overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname + "-warp"}
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 0, scale: 1, transition: { duration: 0.1 } }}
          exit={{ 
            opacity: [0, 1, 0], 
            scale: [1, 2, 1],
            transition: { duration: 0.8, times: [0, 0.5, 1] } 
          }}
          className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center bg-black/80 backdrop-blur-[2px]"
        >
          {/* Star Streaks */}
           <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 4, opacity: [0, 1, 0] }}
            transition={{ duration: 0.6, ease: "easeIn" }}
            className="w-[200vw] h-[200vw] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,1)_0%,transparent_50%)]"
          />
        </motion.div>
      </AnimatePresence>
      
      {/* Background Premium Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse-glow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="grain opacity-[0.03]" />
      </div>
      
      <div className="relative z-10">
        <Header onOpenRecruit={() => setRecruitOpen(true)} />
        {!adminOpen && (
          <>
            <AnimatePresence mode="wait">
              <motion.main
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="pt-20 min-h-[calc(100vh-theme(spacing.16))]"
              >
                {children}
              </motion.main>
            </AnimatePresence>
            <MobileDock onOpenRecruit={() => setRecruitOpen(true)} />
            <Footer />
          </>
        )}
      </div>
      <RecruitForm open={recruitOpen} onClose={() => setRecruitOpen(false)} />
    </div>
  );
}
