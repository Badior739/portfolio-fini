import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AdminPanel } from "./AdminPanel";
import { RecruitForm } from "./RecruitForm";
import { useAdmin } from "@/context/AdminContext";

const navItems = [
  { id: "home", label: "Accueil" },
  { id: "about", label: "À propos" },
  { id: "skills", label: "Compétences" },
  { id: "projects", label: "Projets" },
  { id: "contact", label: "Contact" },
];

function NavIcon({ id }: { id: string }) {
  // ... (keeping SVG icons logic)
  return null;
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [recruitOpen, setRecruitOpen] = useState(false);
  const { adminOpen, setAdminOpen } = useAdmin();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  const handleScrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    const el = document.getElementById(id);
    const headerOffset = 72;

    if (el) {
      const rect = el.getBoundingClientRect();
      const offsetTop = rect.top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
      return;
    }

    if (location.pathname !== "/") {
      navigate(`/#${id}`);
    } else {
      window.location.hash = `#${id}`;
    }
  };

  return (
    <>
    <header className="fixed inset-x-0 top-0 z-[100] transition-all duration-500 pointer-events-none px-4 md:px-0">
      <div className="container mt-6 md:mt-8">
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
          className={cn(
            "relative mx-auto flex h-16 md:h-20 items-center justify-between rounded-[2rem] border border-border/50 px-6 md:px-10 transition-all duration-500 pointer-events-auto shadow-premium",
            scrolled 
              ? "bg-background/80 backdrop-blur-2xl border-border" 
              : "bg-background/20 backdrop-blur-lg border-border/40"
          )}
        >
          {/* Internal Luminous Tracer (Aesthetic) */}
          <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
             <div className="absolute top-0 left-0 w-40 h-[1.5px] bg-gradient-to-r from-transparent via-primary/50 to-transparent translate-x-[-200%] animate-scan-slow" />
             <div className="absolute bottom-0 right-0 w-40 h-[1.5px] bg-gradient-to-r from-transparent via-primary/50 to-transparent translate-x-[200%] animate-scan-slow" style={{ animationDirection: 'reverse' }} />
          </div>

          {/* Logo & Identity */}
          <div className="flex items-center gap-4 group cursor-pointer" onDoubleClick={() => setAdminOpen(!adminOpen)}>
            <div className="relative w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-glow overflow-hidden group-hover:scale-110 transition-transform">
               <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
               <span className="text-lg font-black text-white italic">B</span>
            </div>
            <div className="hidden lg:flex flex-col">
               <span className="text-sm font-black text-foreground uppercase tracking-widest">Badior</span>
               <span className="text-[10px] font-mono text-primary/60 uppercase tracking-[0.3em]">Ouattara_Nodes</span>
            </div>
          </div>

          {/* Main Navigation (Architectural) */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={`/#${item.id}`}
                onClick={handleScrollTo(item.id)}
                className="relative px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-all group"
              >
                <span className="relative z-10">{item.label}</span>
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-50 transition-transform origin-center" />
              </Link>
            ))}
          </nav>

          {/* Action Systems */}
          <div className="flex items-center gap-3">
             <Button 
               variant="default" 
               onClick={() => setRecruitOpen(true)} 
               className="h-10 md:h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-[10px] font-black uppercase tracking-widest shadow-glow"
             >
               Recrutement
             </Button>

             {/* Mobile Menu Trigger */}
             <button
               aria-label="Toggle Command"
               onClick={() => setOpen((v) => !v)}
               className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-secondary border border-border text-foreground"
             >
               <div className="flex flex-col gap-1 w-5">
                 <div className={cn("h-0.5 bg-foreground transition-all", open ? "rotate-45 translate-y-1.5" : "")} />
                 <div className={cn("h-0.5 bg-foreground transition-all", open ? "opacity-0" : "")} />
                 <div className={cn("h-0.5 bg-foreground transition-all", open ? "-rotate-45 -translate-y-1.5" : "")} />
               </div>
             </button>
          </div>
        </motion.div>

        {/* Mobile Navigation Interface (Floating) */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="mt-4 md:hidden rounded-[2rem] border border-border bg-background/80 backdrop-blur-3xl p-6 pointer-events-auto shadow-premium"
            >
              <div className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    to={`/#${item.id}`}
                    onClick={handleScrollTo(item.id)}
                    className="flex justify-between items-center rounded-xl px-4 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    {item.label}
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary" />
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
    {adminOpen && <AdminPanel onClose={() => setAdminOpen(false)} />}
    <RecruitForm open={recruitOpen} onClose={() => setRecruitOpen(false)} />
    </>
  );
}
