import { PropsWithChildren, useEffect } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useAdmin } from "@/context/AdminContext";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

export function Layout({ children }: PropsWithChildren) {
  const { adminOpen } = useAdmin();
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
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      {!adminOpen && (
        <>
          <AnimatePresence mode="wait">
            <motion.main
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="pt-20 min-h-[calc(100vh-theme(spacing.16))]"
            >
              {children}
            </motion.main>
          </AnimatePresence>
          <Footer />
        </>
      )}
    </div>
  );
}
